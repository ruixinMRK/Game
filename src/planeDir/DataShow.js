/**
 * Created by tudouhu on 2017/2/17.
 */


import 'createjs';
import GameData from '../manager/GameData';
import UserData from '../manager/UserData';
import Timer from '../common/Timer';
import Router from '../common/socket/Router';
import SocketClient from '../common/socket/SocketClient';

/**
 * 数据显示 FPS ping
 */
class DataShow extends createjs.Container{
  /**
   * 敌机
   * @type {EnemyPlane}
   */
  enemyPlane=null;

  constructor(){
    super();
    //击中文本
    this.hittxt=new createjs.Text('',"bold 46px Arial",'#000000');
    this.hittxt.x = 600;
    this.hittxt.y = 30;
    this.addChild(this.hittxt);
    this.hitText(UserData.id+'加入游戏');
    //ping文本
    this.pingTxt=new createjs.Text('',"bold 18px Arial",'#FFFFFF');
    this.pingTxt.x = 720;
    this.pingTxt.text='ping:';
    this.addChild(this.pingTxt);
    //FPS文本
    this.FPSTxt=new createjs.Text('',"bold 18px Arial",'#FFFFFF');
    this.FPSTxt.x = 650;
    this.FPSTxt.text='FPS:';
    this.addChild(this.FPSTxt);
    //人物信息
    this.lifeT=new createjs.Text('',"bold 18px Arial",'#FFFFFF');
    this.lifeT.x = 350;
    this.lifeT.y=240;
    this.lifeT.text='生命:';
    this.addChild(this.lifeT);
    this.gasolineT=new createjs.Text('',"bold 18px Arial",'#FFFFFF');
    this.gasolineT.x = 350;
    this.gasolineT.y=260
    this.gasolineT.text='汽油:';
    this.addChild(this.gasolineT);
    this.bulletNumT=new createjs.Text('',"bold 18px Arial",'#FFFFFF');
    this.bulletNumT.x = 350;
    this.bulletNumT.y=280;
    this.bulletNumT.text='子弹:';
    this.addChild(this.bulletNumT);
    //敌机信息
    this.ENameT=new createjs.Text('',"bold 18px Arial",'#FFFFFF');
    this.ENameT.text='飞机:';
    this.addChild(this.ENameT);
    this.ELifeT=new createjs.Text('',"bold 18px Arial",'#FFFFFF');
    this.ELifeT.y=20;
    this.ELifeT.text='生命:';
    this.addChild(this.ELifeT);
    //接受ping数据
    Router.instance.reg(Router.KPI.ping,this.socketPing);

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

    //fps
    var FPS = {};
    FPS.time = 0;
    FPS.FPS = 0;
    FPS.startFPS = function (stage){
      FPS.txt =new createjs.Text("", "18px Arial", "#ffffff");
      FPS.txt.x=580;
      stage.addChild(FPS.txt);
      createjs.Ticker.addEventListener("tick", FPS.TickerFPS);
    }
    FPS.TickerFPS = function (event)
    {
      FPS.date = new Date();
      FPS.currentTime = FPS.date.getTime();
      if(FPS.time!=0)
      {
        FPS.FPS = Math.ceil(1000/(FPS.currentTime -  FPS.time));
      }
      FPS.time = FPS.currentTime;
      FPS.txt.text = "cjs: "+FPS.FPS;
    }
    createjs.Ticker.framerate=60;
    FPS.startFPS(this);

    GameData.stage.addChild(this);
  }

  /**
   * 帧频函数
   * @param e
   */
  onFrame=(e)=>{
    this.sendPing();
    this.FPSTxt.text='FPS:'+Timer.FPS;
    if(this.enemyPlane!=null){
      this.ENameT.text='飞机:'+this.enemyPlane.Name;
      this.ELifeT.text='生命:'+this.enemyPlane.life;
    }
  }

  /**
   * 飞机信息显示
   * @param plane {HeroPlane} 飞机
   */
  planeTxt(plane){
    this.lifeT.text='生命:'+plane.life+'/'+plane.lifeSet;
    this.gasolineT.text='汽油:'+Math.round(plane.gasoline)+'/'+plane.gasolineSet;
    this.bulletNumT.text='子弹:'+plane.bulletNum+'/'+plane.bulletNumSet;
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


  /**
   * 移除
   */
  remove(){
    if(this.parent!=null)
      this.parent.removeChild(this);
    Router.instance.unreg(Router.KPI.ping);
  }

}

export default DataShow;
