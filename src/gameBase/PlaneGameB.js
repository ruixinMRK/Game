/**
 * Created by tudouhu on 2017/3/14.
 */
import '../vendors/createjs';
import Timer from '../common/Timer';
import Router from '../common/socket/Router';
import GameData from '../manager/GameData';

/**
 * 飞机大战游戏飞机游戏基类
 */
class PlaneGameB extends createjs.Container{
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
    //添加键盘事件
    document.addEventListener('keydown',this.onKeyDown);
    document.addEventListener('keyup',this.onKeyUp);
    //帧频
    this.timeId=Timer.add(this.onFrame,30,0);
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
    let rect={t:200,b:500,l:400,r:900};

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
    this.map.remove();
    this.map=null;
    GameData.planeMap=null;
    this.dataShow.remove();
    this.dataShow=null;
    GameData.dataShow=null;
    this.planeControl.remove();
    this.planeControl=null;
    GameData.planeControl=null;
    Router.instance.unreg(Router.KPI.destroyPvpRoom);
    Timer.clear(this.timeId);
  }




}


export default PlaneGameB;
