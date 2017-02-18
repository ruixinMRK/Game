/**
 * Created by tudouhu on 2017/2/18.
 */

import GameData from '../manager/GameData';
import UserData from '../manager/UserData';
import Router from '../common/socket/Router';
import SocketClient from '../common/socket/SocketClient';
import DataShow from './DataShow';
import PSData from '../manager/PSData';
import EnemyPlane from './EnemyPlane';

/**
 * 数据传输
 */
class DataTransmit{

  constructor(){

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
     * 移动数据发送帧间隔 位置矫正
     * @type {number}
     */
    this.moveF=3;
    /**
     * 移动数据发送帧间隔设置 位置矫正
     * @type {number}
     */
    this.moveFSet=3;
    /**
     * 当前ping时间
     * @type {number}
     */
    this.currentPingTime = 0;
    /**
     * 飞机管理
     * @type {PlaneControl}
     */
    this.planeC=GameData.planeControl;


    //接受移动数据
    Router.instance.reg('planWalk',this.socketPW);
    //接受玩家掉线数据
    Router.instance.reg('goDie',this.socketDie);
    //接受玩家加入数据
    Router.instance.reg('goLive',this.socketLive);
    //接受ping数据
    Router.instance.reg('ping',this.socketPing);
  }

  /**
   * 帧频函数
   * @param e
   */
  onFrame=(e)=>{
    this.sendData();
    this.sendPing();
    GameData.send=false;
  }

//接受服务器的planWalk数据 移动
  socketPW = (data)=>{
    // console.log('接收移动数据：',data);
    data=PSData.shiftObj(data);
    this.planeC.enemyPDataArr.unshift(data);
    // console.log('接收移动数据：',data,data.Name);
  }
  //接受服务器的goDie数据 退出
  socketDie = (data)=>{
    // console.log('接收退出数据：',data.name);
    this.planeC.removeChild(this.planeC.enemyP[data.name]);
    delete this.planeC.enemyP[data.name];
    DataShow.getInstance().hitText(data.name+'退出了游戏');
    // console.log('接收退出数据：',data,data.Name);
  }
  //接受服务器的goLive数据 加入
  socketLive = (data)=>{
    // console.log('接收加入数据：',data);
    if(data.name!=null){
      this.planeC.psd.Name=this.planeC.HeroPlane.Name;
      this.planeC.psd.x=this.planeC.HeroPlane.x;
      this.planeC.psd.y=this.planeC.HeroPlane.y;
      this.planeC.psd.rot=this.planeC.HeroPlane.rotation;
      UserData.planInfo = PSData.getObj(this.planeC.psd);
      SocketClient.instance.send({KPI:'goLive',data:UserData.planInfo});
      this.createEP(data.data);
      DataShow.getInstance().hitText(data.name+'加入了游戏');
    }
    else {
      this.createEP(data.data);
    }
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
    DataShow.getInstance().pingTxt.text='ping:'+t;
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
   * 发送状态数据
   */
  sendData=()=>{
    this.moveF--;
    if(this.moveF<=0){
      this.moveF=this.moveFSet;
      GameData.send=true;
    }
    if(GameData.send==false) return;
    this.planeC.psd.Name=this.planeC.HeroPlane.Name;
    this.planeC.psd.x=this.planeC.HeroPlane.x;
    this.planeC.psd.y=this.planeC.HeroPlane.y;
    this.planeC.psd.rot=this.planeC.HeroPlane.rotation;
    this.planeC.psd.time=new Date().getTime();

    SocketClient.instance.send(PSData.getObj(this.planeC.psd));
    this.planeC.psd.init();
  }

  /**
   *创建敌机
   * @param data
   */
  createEP(data){
    let obj=PSData.shiftObj(data);
    if(this.planeC.enemyP[obj.Name]!=null)return;
    this.planeC.enemyP[obj.Name]=new EnemyPlane();
    this.planeC.enemyP[obj.Name].x=obj.x;
    this.planeC.enemyP[obj.Name].y=obj.y;
    this.planeC.enemyP[obj.Name].rotation=obj.rot;
    this.planeC.enemyP[obj.Name].Name=obj.Name;
    this.planeC.addChild(this.planeC.enemyP[obj.Name]);
  }






  /**
   * 获得实例
   * @returns {DataTransmit}
   */
  static getInstance() {
    if (!DataTransmit.instance) {
      DataTransmit.instance = new DataTransmit();
    }
    return DataTransmit.instance;
  }




}

export default DataTransmit;
