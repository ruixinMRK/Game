/**
 * Created by tudouhu on 2017/2/17.
 */


import GameData from '../manager/GameData';
import UserData from '../manager/UserData';
import Timer from '../common/Timer';
import Router from '../common/socket/Router';
import SocketClient from '../common/socket/SocketClient';

/**
 * 数据显示 FPS ping
 */
class DataShow{

  constructor(){
    //击中文本
    this.hittxt=new createjs.Text('',"bold 30px Arial",'#000000');
    this.hittxt.x = 100;
    this.hittxt.y = 30;
    GameData.stage.addChild(this.hittxt);
    this.hitText(UserData.id+'加入游戏');
    //ping文本
    this.pingTxt=new createjs.Text('',"bold 18px Arial",'#FFFFFF');
    this.pingTxt.x = 720;
    this.pingTxt.text='ping:';
    GameData.stage.addChild(this.pingTxt);
    //FPS文本
    this.FPSTxt=new createjs.Text('',"bold 18px Arial",'#FFFFFF');
    this.FPSTxt.x = 650;
    this.FPSTxt.text='FPS:';
    GameData.stage.addChild(this.FPSTxt);
    //接受ping数据
    Router.instance.reg('ping',this.socketPing);

    /**
     * ping数据发送帧间隔
     * @type {number}
     */
    this.pingF=3;
    /**
     * ping数据发送帧间隔设置
     * @type {number}
     */
    this.pingFSet=3;
    /**
     * 当前ping时间
     * @type {number}
     */
    this.currentPingTime = 0;
  }

  /**
   * 帧频函数
   * @param e
   */
  onFrame=(e)=>{
    this.sendPing();
    this.FPSTxt.text='FPS:'+Timer.FPS;
  }

//接受服务器的ping数据 延迟
  socketPing = (data)=>{
    // console.log('接收延迟数据：',data);

    if(data.t < this.currentPingTime) return;
    let t=new Date().getTime()-data.t;
    if(t<0) return;
    if(t<100){
      this.pingFSet=3;
    }
    else{
      this.pingFSet=1;
    }
    this.pingTxt.text='ping:'+t;
    this.currentPingTime = data.t;

  }

  /**
   * 发送ping数据
   */
  sendPing=()=>{
    this.pingF--;
    if(this.pingF<=0){
      this.pingF=this.pingFSet;
      let obj={};
      obj.KPI='ping';
      obj.t=new Date().getTime();//获取10秒的毫秒
      SocketClient.instance.send(obj);
    }

  }


  /**
   * 显示击中
   * @param str
   */
  hitText(str){
    this.hittxt.visible=true;
    this.hittxt.text=str;
    Timer.add(()=>{
      if(str==this.hittxt.text)
        this.hittxt.visible=false;
    },3000,1);
  }


}

export default DataShow;
