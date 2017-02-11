/**
 * Created by tudouhu on 2017/2/7.
 */

import 'createjs';
import NameSpr from '../common/NameSpr';
import PlaneGame from './PlaneGame';

/**
 * 子弹类
 */
class Bullet extends createjs.Container{

  /**
   * 子弹构造函数
   * @param dis 距离
   * @param speed 速度
   * @param angle 弧度
   */
  constructor(dis,speed,angle){
    super();
    /**
     * 距离
     */
    this.dis=dis;
    /**
     * 角速度
     */
    this.speed=speed;
    /**
     * x速度
     * @type {number}
     */
    this.vx=Math.cos(angle)*speed;
    /**
     * y速度
     * @type {number}
     */
    this.vy=Math.sin(angle)*speed;
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
  }


  /**
   * 移除
   */
  remove(){
    if(!this.parent)return ;
    this.parent.removeChild(this);
    this.mc=null;
  }

}

export default Bullet;
