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
     * 弧度
     * @type {number}
     */
    this.angle=0;
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
    this.addChild(this.mc);
    NameSpr.registerPointCenter(this);
    this.hitArr=NameSpr.setHitPoint(this);
  }


  /**
   * 设置数据
   * @param dis 距离
   * @param speed 速度
   * @param angle 弧度
   * @param atk 子弹攻击力
   * @param id  子弹id
   */
  setData(dis=500,speed=8,angle=0,atk=5,id=0) {
    this.dis = dis;
    this.speed = speed;
    this.angle=angle;
    this.atk=atk;
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
    this.dis-=this.speed*GameData.timeDiff;
    if(this.dis<0||this.x<0||this.x>PlaneGame.mapW||this.y<0||this.y>PlaneGame.mapH)
      this.remove();
  }

  /**
   * 帧频函数
   * @param e
   */
  onFrame=(e)=>{
    this.vx = Math.cos(this.angle) * this.speed*GameData.timeDiff;
    this.vy = Math.sin(this.angle) * this.speed*GameData.timeDiff;
    this.move(this.vx,this.vy);
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
