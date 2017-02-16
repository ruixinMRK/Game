
/**
 * Created by tudouhu on 2017/2/7.
 */

import 'createjs';
import Timer from '../common/Timer';
import HeroPlane from './HeroPlane';
import EnemyPlane from './EnemyPlane';
import Router from '../common/socket/Router';
import SocketClient from '../common/socket/SocketClient';
import UserData from '../manager/UserData';
import GameData from '../manager/GameData';
import PSData from '../manager/PSData';

/**
 * 飞机大战游戏主类
 */
class PlaneGame extends createjs.Container{


  constructor(){
    super();
    this.init();
  }

  /**
   * 初始化
   */
  init(){
    /**
     * 地图
     */
    this.mapS=new createjs.Shape();
    this.mapS.graphics.beginFill('#D0D0D0');
    this.mapS.graphics.drawRect(0,0,1000,1000);
    this.mapS.graphics.endFill();
    this.addChild(this.mapS);
    //坐标
    for(let x1=0;x1<10;x1++){
      for(let y1=0;y1<10;y1++){

        let txt=new createjs.Text(String(x1*100)+','+String(y1*100),"bold 14px Arial",'#ff0000');
        txt.x=x1*100;
        txt.y=y1*100;
        this.addChild(txt);
      }
    }
    //飞机
    this.HeroPlane=new HeroPlane();
    this.HeroPlane.Name=UserData.id;
    this.HeroPlane.x=100;
    this.HeroPlane.y=100;
    this.addChild(this.HeroPlane);
    //击中文本
    this.hittxt=new createjs.Text('',"bold 30px Arial",'#000000');
    this.hittxt.x = 100;
    this.hittxt.y = 30;
    this.hittxt.visible=false;
    this.hitText(UserData.id+'加入游戏');
    //ping文本
    this.pingTxt=new createjs.Text('',"bold 18px Arial",'#FFFFFF');
    this.pingTxt.x = 720;
    this.pingTxt.text='ping:';
    //添加键盘事件
    document.addEventListener('keydown',this.onKeyDown);
    document.addEventListener('keyup',this.onKeyUp);
    //添加到舞台
    this.addEventListener('added',this.addInit);

    //接受移动数据
    Router.instance.reg('planWalk',this.socketPW);
    //接受玩家掉线数据
    Router.instance.reg('goDie',this.socketDie);
    //接受玩家加入数据
    Router.instance.reg('goLive',this.socketLive);
    //接受ping数据
    Router.instance.reg('ping',this.socketPing);

    this.key_A=false;
    this.key_D=false;
    this.key_J=false;

    /**
     * 飞机传输数据
     * @type {PSData}
     */
    this.psd=new PSData();
    /**
     * 敌机
     * @type {{}}
     */
    this.enemyP={};
    /**
     * 敌机数据数组
     * @type {Array}
     */
    this.enemyPDataArr=[];
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

    this.currentPingTime = 0;

    //进入游戏发送数据
    this.psd.Name=this.HeroPlane.Name;
    this.psd.x=this.HeroPlane.x;
    this.psd.y=this.HeroPlane.y;
    this.psd.rot=this.HeroPlane.rotation;
    UserData.planInfo = PSData.getObj(this.psd);

    //帧频
    Timer.add(this.onFrame,30,0);
  }

  /**
   * 添加到舞台
   */
  addInit=()=>{
    this.parent.addChild(this.hittxt);
    this.parent.addChild(this.pingTxt);
  }

  //接受服务器的planWalk数据 移动
  socketPW = (data)=>{
    // console.log('接收移动数据：',data);
    data=PSData.shiftObj(data);
    this.enemyPDataArr.unshift(data);
    // console.log('接收移动数据：',data,data.Name);
  }
  //接受服务器的goDie数据 退出
  socketDie = (data)=>{
    console.log(data.name);
    this.removeChild(this.enemyP[data.name]);
    delete this.enemyP[data.name];
    this.hitText(data.name+'退出了游戏');
    // console.log('接收退出数据：',data,data.Name);
  }
  //接受服务器的goLive数据 加入
  socketLive = (data)=>{
    this.sendData();
    this.hitText(data.name+'加入了游戏');
    // console.log('接收加入数据：',data,data.Name);
  }
  //接受服务器的ping数据 延迟
  socketPing = (data)=>{

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
   * 按键按下
   * @param e
   */
  onKeyDown=(e)=>{
    let keyCode=e.keyCode;
    if(keyCode==65){//A
      this.key_A=true;
    }
    else if(keyCode==68){//D
      this.key_D=true;
    }
    else if(keyCode==74){//J
      this.key_J=true;
    }
  }

  /**
   * 按键释放
   * @param e
   */
  onKeyUp=(e)=>{
    let keyCode=e.keyCode;
    if(keyCode==65){//A
      this.key_A=false;
    }
    else if(keyCode==68){//D
      this.key_D=false;
    }
    else if(keyCode==74){//J
      this.key_J=false;
    }

  }

  /**
   * 帧频函数
   * @param e
   */
  onFrame=(e)=>{
    this.enemyPDataDispose();

    if(this.key_A){
      this.HeroPlane.planeRot(-this.HeroPlane.rotationSpeed);
    }
    else if(this.key_D){
      this.HeroPlane.planeRot(this.HeroPlane.rotationSpeed);
    }
    if(this.key_J){
      this.HeroPlane.attack();
      this.psd.attack=1;
      GameData.send=true;
    }
    this.HeroPlane.onFrame(this);

    this.planeScroll();

    this.sendData();
    this.sendPing();
    GameData.send=false;
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
    this.psd.Name=this.HeroPlane.Name;
    this.psd.x=this.HeroPlane.x;
    this.psd.y=this.HeroPlane.y;
    this.psd.rot=this.HeroPlane.rotation;
    this.psd.time=new Date().getTime();

    SocketClient.instance.send(PSData.getObj(this.psd));
    this.psd.init();
  }

  /**
   * 敌机数据处理
   */
  enemyPDataDispose=()=>{
    //敌机数据赋值
    for(let i=this.enemyPDataArr.length-1;i>=0;i--){
      let obj=this.enemyPDataArr[i];
      if(this.enemyP[obj.Name]==null){
        this.enemyP[obj.Name]=new EnemyPlane();
        this.enemyP[obj.Name].x=obj.x;
        this.enemyP[obj.Name].y=obj.y;
        this.enemyP[obj.Name].rotation=obj.rot;
        this.enemyP[obj.Name].Name=obj.Name;
        this.addChild(this.enemyP[obj.Name]);
      }
      else {
        let p=this.enemyP[obj.Name];
        p.dataDispose(obj);
        // p.x=obj.x;
        // p.y=obj.y;
        // p.rotation=obj.rot;
        // if(obj.attack==1){
        //   p.attack();
        // }
        //碰撞数据处理
        for(let s in obj.hitObj){
          this.hitText(obj.Name+'的子弹'+s+'击中'+obj.hitObj[s]);
          if(this.HeroPlane.Name==obj.hitObj[s]){
            this.HeroPlane.remove();
            GameData.send=true;
          }
          else
            this.enemyP[obj.hitObj[s]].remove();
          p.bulletArr.map((b)=>{
            if(b.bulletId==s){
              b.remove();
            }
          })
        }
      }
    }
    this.enemyPDataArr=[];
    //敌机帧频
    for(let s in this.enemyP){
      if(this.enemyP[s].mc==null){
        delete this.enemyP[s];
      }
      else {
        this.enemyP[s].onFrame();
      }

    }
  }



  /**
   * 飞机滚屏
   */
  planeScroll=()=>{
    let spx=this.x+this.HeroPlane.x;
    let spy=this.y+this.HeroPlane.y;
    let rect={t:100,b:200,l:100,r:700};

    if(spx>rect.r){
      this.x-=spx-rect.r;
      if(this.x<-(GameData.mapW-GameData.stageW)) this.x=-(GameData.mapW-GameData.stageW);
    }
    else if(spx<rect.l){
      this.x+=rect.l-spx;
      if(this.x>0)this.x=0;
    }

    if(spy>rect.b){
      this.y-=spy-rect.b;
      if(this.y<-(GameData.mapH-GameData.stageH)) this.y=-(GameData.mapH-GameData.stageH);
    }
    else if(spy<rect.t){
      this.y+=rect.t-spy;
      if(this.y>0)this.y=0;
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


export default PlaneGame;














