/**
 * Created by tudouhu on 2017/2/7.
 */

import '../vendors/createjs';
import GameData from '../manager/GameData';
import NameSpr from '../common/NameSpr';
import PlaneGame from '../gamePVP/PlaneGame';

/**
 * 子弹类
 */
class Bullet extends createjs.Container{

  /**
   * 攻击力
   * @type {number}
   */
  atk=5;

  /**
   * 子弹构造函数
   */
  constructor(){
    super();
    /**
     * 距离
     */
    this.dis=500;
    /**
     * 角速度
     */
    this.speed=8;
    /**
     * x速度
     * @type {number}
     */
    this.vx=0;
    /**
     * y速度
     * @type {number}
     */
    this.vy=0;
    /**
     * 子弹id
     * @type {number}
     */
    this.bulletId=0;

    this.init();
  }

  /**
   * 初始化
   */
  init(){
    this.mc=NameSpr.getInstance().getSpr('plane','bullet');
    let bound=this.mc.getBounds();
    this.mc.x=-bound.width/2;
    this.mc.y=-bound.height/2;
    this.addChild(this.mc);
  }


  /**
   * 设置数据
   * @param dis 距离
   * @param speed 速度
   * @param angle 弧度
   * @param id  子弹id
   */
  setData(dis=500,speed=8,angle=0,id=0) {
    this.dis = dis;
    this.speed = speed;
    this.vx = Math.cos(angle) * speed;
    this.vy = Math.sin(angle) * speed;
    this.bulletId = id;
  }

    /**
   * 移动
   * @param x x速度
   * @param y y速度
   */
  move(x,y){
    this.x+=x;
    this.y+=y;
    this.dis-=this.speed
    if(this.dis<0||this.x<0||this.x>PlaneGame.mapW||this.y<0||this.y>PlaneGame.mapH)
      this.remove();
  }

  /**
   * 帧频函数
   * @param e
   */
  onFrame=(e)=>{
    this.move(this.vx,this.vy);
    if(this.rectSpr==null){
      this.rectSpr=new createjs.Shape();
      GameData.stage.addChild(this.rectSpr);
    }
    let r=NameSpr.rectGlobal(this);
    this.rectSpr.graphics.clear();
    this.rectSpr.graphics.beginFill('#D0D0D0');
    this.rectSpr.graphics.drawRect(r.x,r.y,r.width,r.height);
    this.rectSpr.graphics.endFill();
  }


  /**
   * 移除
   */
  remove(){
    if(!this.parent)return ;
      this.parent.removeChild(this);
    // this.mc=null;
  }

}

export default Bullet;
