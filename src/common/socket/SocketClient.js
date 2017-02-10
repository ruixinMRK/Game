
import Router from "./Router";

class SocketClient{
  constructor() {
    this.socketsExist = false;
    //var host=window.location.protocol.indexOf("http")!=-1?window.location.hostname:"localhost";
    //var host="localhost";

    this.socket = null;

    this.len = 0;
    this.respone = "";
    this._data = "";

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
    if (this.socketsExist&&typeof data =='object') {

      let str = 'start' + JSON.stringify(data) + 'end';
      // console.log('发送数据',str);
      this.socket.send(str);
    }
  }
  close(){
    this.socket.close();
    this.socket=null;
    this.socketsExist=false;
  }
  Log(Text, MessageType){
    if (MessageType == "OK") Text = "<span style='color: green;'>" + Text + "</span>";
    if (MessageType == "ERROR") Text = "<span style='color: red;'>" + Text + "</span>";
    console.info(Text);
  }
  //** 事件 this went**/
  WSonOpen=()=>{
    this.Log("WebSocket连接已经建立。","OK");
    this.socketsExist=true;
    // Router.instance.regAll();
  };

  WSonMessage=(event)=>{
    //大数据量 需多次 message
    // this.Log(eval("'"+event.data+"'"));
    // this.Log(JSON.stringify(event.data));

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
    this.Log("WebSocket连接关闭！");
    // Router.instance.regAll();
    this.init(SocketClient.__url);
  };

  WSonError=()=> {
    this.Log("WebSocket连接中断。","ERROR");
  };

  parseData(){
    var start = this.respone.indexOf("start")+5;
    var end =  this.respone.indexOf("end");
    var imageData = this.respone.substring(start, end);

    if(this.respone.indexOf("start") != -1 && this.respone.indexOf("end") != -1){
      if(start > end) return;
      this.respone = this.respone.replace("start" + imageData + "end","");
      this._data = imageData;

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
