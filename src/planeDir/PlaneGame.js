
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
import PlaneControl from './PlaneControl';
import DataShow from './DataShow';
import PlaneMap from './PlaneMap';
import MyEvent from '../common/MyEvent';

/**
 * 飞机大战游戏PVP模式
 */
class PlaneGame extends createjs.Container{

  /**
   * 飞机地图
   * @type {PlaneMap}
   */
  map=null;
  /**
   * FPS ping显示
   * @type {DataShow}
   */
  dataShow=null;
  /**
  * 飞机管理
  * @type {PlaneControl}
  */
  planeControl=null;


  constructor(){
    super();
    this.init();
  }

  /**
   * 初始化
   */
  init(){
    //地图
    this.map=new PlaneMap();
    this.addChild(this.map);
    GameData.planeMap=this.map;
    //飞机管理
    this.planeControl=new PlaneControl();
    this.addChild(this.planeControl);
    GameData.planeControl=this.planeControl;
    //数据显示
    this.dataShow=new DataShow();
    GameData.dataShow=this.dataShow;
    //添加键盘事件
    document.addEventListener('keydown',this.onKeyDown);
    document.addEventListener('keyup',this.onKeyUp);
    //帧频
    this.timeId=Timer.add(this.onFrame,30,0);
    Router.instance.reg(Router.KPI.destroyPvpRoom,this.socketDestroyPR);
  }

  //接受服务器的destroyPvpRoom数据 退出房间
  socketDestroyPR = (data)=>{
    console.log('接收退出房间数据：',data);
    MyEvent.dispatchEvent(MyEvent.ME_MyEvent,'back');
  }

  /**
   * 按键按下
   * @param e
   */
  onKeyDown=(e)=>{
    let keyCode=e.keyCode;
    if(keyCode==65){//A
      GameData.key_A=true;
    }
    else if(keyCode==68){//D
      GameData.key_D=true;
    }
    else if(keyCode==74){//J
      GameData.key_J=true;
    }
    else if(keyCode==87){//W
      GameData.key_W=true;
    }
    else if(keyCode==83){//S
      GameData.key_S=true;
    }
  }

  /**
   * 按键释放
   * @param e
   */
  onKeyUp=(e)=>{
    let keyCode=e.keyCode;
    if(keyCode==65){//A
      GameData.key_A=false;
    }
    else if(keyCode==68){//D
      GameData.key_D=false;
    }
    else if(keyCode==74){//J
      GameData.key_J=false;
    }
    else if(keyCode==87){//W
      GameData.key_W=false;
    }
    else if(keyCode==83){//S
      GameData.key_S=false;
    }

  }

  /**
   * 帧频函数
   * @param e
   */
  onFrame=(e)=>{
    //帧频时间计算
    if(GameData.lastTime==0){
      GameData.lastTime=new Date().getTime();
      return;
    }
    GameData.timeDiff=new Date().getTime()-GameData.lastTime;
    GameData.lastTime+=GameData.timeDiff;
    //游戏内容帧频
    this.planeControl.onFrame(e);
    this.dataShow.onFrame(e);
    this.map.onFrame(e);
    this.planeScroll(this.planeControl.HeroPlane);
  }


  /**
   * 飞机滚屏
   * @param plane 飞机
   */
  planeScroll=(plane)=>{
    let spx=this.x+plane.x;
    let spy=this.y+plane.y;
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
   * 移除
   */
  remove(){
    if(this.parent!=null)
      this.parent.removeChild(this);
    document.removeEventListener('keydown',this.onKeyDown);
    document.removeEventListener('keyup',this.onKeyUp);
    Timer.clear(this.timeId);
    this.map.remove();
    this.map=null;
    GameData.planeMap=null;
    this.dataShow.remove();
    this.dataShow=null;
    GameData.dataShow=null;
    this.planeControl.remove();
    this.planeControl=null;
    GameData.planeControl=null;
  }

}


export default PlaneGame;
