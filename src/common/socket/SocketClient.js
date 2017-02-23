
import Router from "./Router";
import UserData from 'manager/UserData';

class SocketClient{

  constructor() {
    this.socketsExist = false;
    //var host=window.location.protocol.indexOf("http")!=-1?window.location.hostname:"localhost";
    //var host="localhost";

    this.socket = null;

    this.len = 0;
    this.respone = "";
    this._data = "";
    this.prevSendStr = '';

    SocketClient.__instance = null;

  }

  static get instance(){
    if(!SocketClient.__instance){
     SocketClient.__instance=new SocketClient();
     SocketClient.__instance.init(SocketClient.__url);
    }
    return SocketClient.__instance;
  }

  init(url){
    var ws;
    try {
      if ("WebSocket" in window) {
        ws = new WebSocket(url);
      } else if ("MozWebSocket" in window) {
        ws = new MozWebSocket(url);
      }
      this.socket = ws;
    } catch (ex) {
      console.error(ex);
      return;
    }
    ws.onopen = this.WSonOpen;
    ws.onmessage = this.WSonMessage;
    ws.onclose = this.WSonClose;
    ws.onerror = this.WSonError;
    ws.parent = this;
  }
  send(data) {
    // console.log('socketsExist',this.socketsExist);

    //与上次相同的数据不再发送

    data = JSON.stringify(data);
    console.log('发送数据',data);
    if (this.prevSendStr!=data&&this.socketsExist) {
      let str = 'start' + data + 'end';
      this.socket.send(str);
      this.prevSendStr = data;
    }

  }
  close(){
    this.socket.close();
    this.socket=null;
    this.socketsExist=false;
  }
  Log(Text, MessageType){

    let color = MessageType == "OK"?'green':'red';
    console.log('%c ' + Text,'color:'+color);

  }
  //** 事件 this went**/
  WSonOpen=()=>{
    this.Log("WebSocket连接已经建立。","OK");
    this.socketsExist=true;
    // this.send({KPI:'goLive',name:UserData.id,data:UserData.planInfo});
    // SocketClient.instance.send({KPI:Router.KPI.joinPVP,name:UserData.id});
    // Router.instance.regAll();
  };

  WSonMessage=(event)=>{
    //大数据量 需多次 message

    // this.Log(event.data,"OK");
    console.log('接收的数据：',event.data);

    var orgJsonData;
    if (!event.data) return;
    this.respone += event.data;
    //console.log(len);
    //判断下bytes的长度，类型等
    if( this.len==0 &&  this.respone.indexOf("start") !=-1){
      this.len = parseInt( this.respone.substr(0, this.respone.indexOf("start")));
      this.len = 0;
    }
    if (this.respone.length>= this.len &&  this.respone.lastIndexOf("end")!=-1) {
      this.parseData();
    }
    //Router.instance.dispatcher(orgJsonData);
  };

  WSonClose=()=> {
    this.Log("WebSocket连接关闭！","ERROR");
    this.socketsExist = false;
    // Router.instance.regAll();
    //this.init(SocketClient.__url);
  };

  WSonError=()=> {
    this.Log("WebSocket连接中断。","ERROR");
    this.socketsExist = false;
  };

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
