
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
    /**
     * 飞机管理
     * @type {PlaneControl}
     */
    this.planeControl=new PlaneControl();
    this.addChild(this.planeControl);
    GameData.planeControl=this.planeControl;
    /**
     * FPS ping显示
     * @type {DataShow}
     */
    this.dataShow=new DataShow();
    GameData.dataShow=this.dataShow;
    //添加键盘事件
    document.addEventListener('keydown',this.onKeyDown);
    document.addEventListener('keyup',this.onKeyUp);

    //帧频
    Timer.add(this.onFrame,30,0);

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

  }

  /**
   * 帧频函数
   * @param e
   */
  onFrame=(e)=>{
    this.planeControl.onFrame(e);
    this.dataShow.onFrame(e);

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



}


export default PlaneGame;
