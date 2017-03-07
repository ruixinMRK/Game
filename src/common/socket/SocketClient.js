
import Router from "./Router";
import UserData from 'manager/UserData';

class SocketClient{

  constructor() {
    this.socketsExist = false;
    this.socket = null;
    this.len = 0;
    this.respone = "";
    this._data = "";
    this.prevSendStr = '';
    this.sendDataArr=[];
  }

  static get instance(){
    if(!SocketClient.__instance){
     SocketClient.__instance=new SocketClient();
     SocketClient.__instance.init(SocketClient.__url);
    }
    return SocketClient.__instance;
  }

  init(url){

    this.socket = new WebSocket(url);
    this.socket.addEventListener('open',this.open);
    this.socket.addEventListener('message',this.message);
    this.socket.addEventListener('close',this.close);
    this.socket.addEventListener('error',this.error);

  }

  send=(data)=>{
    if(this.socketsExist==false){
      this.sendDataArr.push(data);
      return ;
    }

    data = JSON.stringify(data);
    // console.log('发送数据',data);
    if (this.prevSendStr!=data&&this.socketsExist) {
      let str = 'start' + data + 'end';
      this.socket.send(str);
      this.prevSendStr = data;
    }

  }

  /**
   * 关闭websocket
   */
  closeClient(){
    this.socket.close();
  }

  Log(Text, MessageType){
    let color = MessageType == "OK"?'green':'red';
    console.log('%c ' + Text,'color:'+color);
  }


  open=()=>{
    this.Log("WebSocket连接已经建立。","OK");
    this.socketsExist=true;
    if(this.sendDataArr.length>0){
      for(let i=0;i<this.sendDataArr.length;i++){
        this.send(this.sendDataArr[i]);
      }
      this.sendDataArr=[];
    }
  }

  message=(event)=>{
    // this.Log(event.data,"OK");
    // console.log('接收的数据：',event.data);
    if (!event.data) return;
    this.respone += event.data;

    //判断下bytes的长度，类型等
    if( this.len==0 &&  this.respone.indexOf("start") !=-1){
      this.len = parseInt( this.respone.substr(0, this.respone.indexOf("start")));
      this.len = 0;
    }
    if (this.respone.length>= this.len &&  this.respone.lastIndexOf("end")!=-1) {
      this.parseData();
    }
  }

  close=()=> {
    this.Log("WebSocket连接关闭！","ERROR");
    this.destory();
  }

  error=()=> {
    this.Log("WebSocket异常","ERROR");
    this.socket.close();
    this.destory();
  }

  //释放资源
  destory(){
    this.socket.removeEventListener('open',this.open);
    this.socket.removeEventListener('message',this.message);
    this.socket.removeEventListener('close',this.close);
    this.socket.removeEventListener('error',this.error);
    this.socket=null;
    this.socketsExist=false;
    SocketClient.__instance = null;
  }

  parseData(){
    var start = this.respone.indexOf("start")+5;
    var end =  this.respone.indexOf("end");
    var imageData = this.respone.substring(start, end);

    if(this.respone.indexOf("start") != -1 && this.respone.indexOf("end") != -1){
      if(start > end) return;
      this.respone = this.respone.replace("start" + imageData + "end","");
      this._data = imageData;

      //console.log(this._data);
      var arr = this._data.split("#");
      for(var i = 0 ; i<arr.length;i++){
        Router.instance.dispatcher(arr[i]);
      }

      this.parseData();
      if(this.respone.length <=0){
        this.len = 0;
      }

    }
  }
}

SocketClient.__instance = null;
SocketClient.__host = "60.205.222.103";//"localhost";
SocketClient.__url = "ws://" + SocketClient.__host + ":8080";

export default SocketClient;
