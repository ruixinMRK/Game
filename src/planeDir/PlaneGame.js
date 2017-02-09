
/**
 * Created by tudouhu on 2017/2/7.
 */

import 'createjs';
import Timer from '../common/Timer';
import Plane from './Plane';
import Tools from '../common/Tools';

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
    Timer.add(this.onFrame,30,0);

    this.key_A=false;
    this.key_D=false;


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
  }

  /**
   * 帧频函数
   * @param e
   */
  onFrame=(e)=>{
    if(this.key_A){
      this.plane.rotation-=5;
    }
    else if(this.key_D){
      this.plane.rotation+=5;
    }
    //移动
    let speed=3;
    let angle=Tools.getHD(this.plane.rotation);
    let vx=Math.cos(angle)*speed;
    let vy=Math.sin(angle)*speed;
    this.plane.move(vx,vy);

    //滚屏
    let spx=this.x+this.plane.x;
    let spy=this.y+this.plane.y;
    let rect={t:100,b:200,l:100,r:700};

    if(spx>rect.r){
      this.x-=spx-rect.r;
      if(this.x<-200)this.x=-200;
    }
    else if(spx<rect.l){
      this.x+=rect.l-spx;
      if(this.x>0)this.x=0;
    }

    if(spy>rect.b){
      this.y-=spy-rect.b;
      if(this.y<-700)this.y=-700;
    }
    else if(spy<rect.t){
      this.y+=rect.t-spy;
      if(this.y>0)this.y=0;
    }
  }




}

export default PlaneGame;
