
/**
 * Created by tudouhu on 2017/2/7.
 */

import 'createjs';
import Timer from '../common/Timer';
import Plane from './Plane';
import Router from '../common/socket/Router';
import SocketClient from '../common/socket/SocketClient';

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
    this.plane=new Plane();
    this.plane.x=100;
    this.plane.y=100;
    this.addChild(this.plane);
    //添加键盘事件
    document.addEventListener('keydown',this.onKeyDown);
    document.addEventListener('keyup',this.onKeyUp);
    //帧频
    Timer.add(this.onFrame,30,0);
    //接受数据
    Router.instance.reg('planWalk',this.socketD);

    this.key_A=false;
    this.key_D=false;
    this.key_J=false;
    /**
     * 飞机传输数据
     * @type {PSData}
     */
    this.psd=new PSData();
    this.psd.type='create';
    this.psd.name=this.plane.Name;
    this.psd.x=this.plane.x;
    this.psd.y=this.plane.y;
    this.psd.rot=this.plane.rotation;


    //发送飞机信息-创建
    SocketClient.instance.send(this.psd);
    this.psd.init();
  }

  //接受服务器的数据
  socketD = (data)=>{

    console.log('接收的数据：',data);

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
    if(this.key_A){
      this.plane.rotation-=this.plane.rotationSpeed;
    }
    else if(this.key_D){
      this.plane.rotation+=this.plane.rotationSpeed;
    }
    if(this.key_J){
      this.plane.attack();
      this.psd.attack=true;
    }
    this.plane.onFrame();

    this.planeScroll();


    this.psd.name=this.plane.Name;
    this.psd.x=this.plane.x;
    this.psd.y=this.plane.y;
    this.psd.rot=this.plane.rotation;
    //发送飞机信息-移动
    SocketClient.instance.send(this.psd);
    this.psd.init();
  }


  /**
   * 飞机滚屏
   */
  planeScroll=()=>{
    let spx=this.x+this.plane.x;
    let spy=this.y+this.plane.y;
    let rect={t:100,b:200,l:100,r:700};

    if(spx>rect.r){
      this.x-=spx-rect.r;
      if(this.x<-(PlaneGame.mapW-PlaneGame.stageW))this.x=-(PlaneGame.mapW-PlaneGame.stageW);
    }
    else if(spx<rect.l){
      this.x+=rect.l-spx;
      if(this.x>0)this.x=0;
    }

    if(spy>rect.b){
      this.y-=spy-rect.b;
      if(this.y<-(PlaneGame.mapH-PlaneGame.stageH))this.y=-(PlaneGame.mapH-PlaneGame.stageH);
    }
    else if(spy<rect.t){
      this.y+=rect.t-spy;
      if(this.y>0)this.y=0;
    }
  }




}
/**
 * 舞台宽
 * @type {number}
 */
PlaneGame.stageW=800;
/**
 * 舞台高
 * @type {number}
 */
PlaneGame.stageH=300;
/**
 * 地图宽
 * @type {number}
 */
PlaneGame.mapW=1000;
/**
 * 地图高
 * @type {number}
 */
PlaneGame.mapH=1000;

PlaneGame.Name='';
export default PlaneGame;

/**
 * 飞机传输数据类
 */
class PSData{

  constructor(){

  }

  init(){

    /**
     * 类型 move-帧频移动 create-创建
     * @type {string}
     */
    this.type="move";
    /**
     * 用户名
     * @type {string}
     */
    this.name='';
    /**
     * x位置
     * @type {number}
     */
    this.x=0;
    /**
     * y位置
     * @type {number}
     */
    this.y=0;
    /**
     * 角度
     * @type {number}
     */
    this.rot=0;
    /**
     * 攻击
     * @type {boolean}
     */
    this.attack=false;
    /**
     * 子弹数组
     * @type {Array}
     */
    this.bulletArr=[];
    /**
     * 飞机数组
     * @type {Array}
     */
    this.planeArr=[];
  }
}
