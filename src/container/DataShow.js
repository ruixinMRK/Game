/**
 * Created by tudouhu on 2017/2/17.
 */


import '../vendors/createjs';
import GameData from '../manager/GameData';
import UserData from '../manager/UserData';
import Timer from '../common/Timer';
import Router from '../common/socket/Router';
import SocketClient from '../common/socket/SocketClient';
import Tools from '../common/Tools';
import TouchIf from './TouchIf';
import RadarScan from './RadarScan';
import NameSpr from '../common/NameSpr';

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
    this.hittxt=NameSpr.getText(this,'',"bold 46px Arial",'#000000',600,30);
    this.hitText(UserData.Name+'加入游戏');
    //FPS文本
    this.FPSTxt=NameSpr.getText(this,'FPS:',"bold 18px Arial",'#FFFFFF',950);
    //ping文本
    this.pingTxt=NameSpr.getText(this,'ping:',"bold 18px Arial",'#FFFFFF',1020);
    //游戏时间文本
    this.gameTimeT=NameSpr.getText(this,'',"bold 18px Arial",'#FFFFFF',1100);
    //人物信息
    this.lifeT=NameSpr.getText(this,'生命:',"bold 18px Arial",'#FFFFFF',650,690);
    this.gasolineT=NameSpr.getText(this,'汽油:',"bold 18px Arial",'#FFFFFF',650,710);
    this.bulletNumT=NameSpr.getText(this,'子弹:',"bold 18px Arial",'#FFFFFF',650,730);
    //敌机信息
    this.ENameT=NameSpr.getText(this,'飞机:',"bold 18px Arial",'#FFFFFF');
    this.ELifeT=NameSpr.getText(this,'生命:',"bold 18px Arial",'#FFFFFF',0,20);
    //接受ping数据
    Router.instance.reg(Router.KPI.ping,this.socketPing);

    /**
     * ping数据发送帧间隔设置
     * @type {number}
     */
    this.pingFSet=150;
    /**
     * ping数据发送帧间隔
     * @type {number}
     */
    this.pingF=this.pingFSet;
    /**
     * 当前ping时间
     * @type {number}
     */
    this.currentPingTime = 0;

    //fps
    this.FPS = {};
    this.FPS.time = 0;
    this.FPS.FPS = 0;
    this.FPS.startFPS = (stage)=>{
      this.FPS.txt =new createjs.Text("", "18px Arial", "#ffffff");
      this.FPS.txt.x=880;
      stage.addChild(this.FPS.txt);
      createjs.Ticker.addEventListener("tick", this.FPS.TickerFPS);
    }
    this.FPS.TickerFPS = (event)=>
    {
      this.FPS.date = new Date();
      this.FPS.currentTime = this.FPS.date.getTime();
      if(this.FPS.time!=0)
      {
        this.FPS.FPS = Math.ceil(1000/(this.FPS.currentTime -  this.FPS.time));
      }
      this.FPS.time = this.FPS.currentTime;
      this.FPS.txt.text = "cjs: "+this.FPS.FPS;
    }
    createjs.Ticker.framerate=60;
    this.FPS.startFPS(this);

    //触屏操作界面
    if(Tools.isMobile()!=null){
      this.touchIf=new TouchIf();
      this.addChild(this.touchIf);
    }

    /**
     * 雷达
     * @type {RadarScan}
     */
    this.radar=new RadarScan();
    this.radar.x=GameData.stageW-this.radar.bgRadius;
    this.radar.y=this.radar.bgRadius;
    this.addChild(this.radar);

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
    this.radar.onFrame(e);
  }

  /**
   * 游戏时间显示
   * @param time 时间
   */
  gameTimeTxt=(time)=>{
    this.gameTimeT.text='时间:'+time;
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
    // if(t<100){
    //   this.pingFSet=3;
    // }
    // else{
    //   this.pingFSet=1;
    // }
    this.pingTxt.text='ping:'+t;
    this.currentPingTime = data.t;

  }

  /**
   * 发送ping数据
   */
  sendPing=()=>{
    this.pingF--;
    if(this.pingF<0){
      this.pingF=this.pingFSet;
      let obj={};
      obj.KPI='ping';
      obj.t=new Date().getTime();
      SocketClient.instance.send(obj);
    }

  }


  /**
   * 显示击中文本
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
    createjs.Ticker.removeEventListener("tick", this.FPS.TickerFPS);
  }

}

export default DataShow;
