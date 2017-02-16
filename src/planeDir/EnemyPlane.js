
/**
 * Created by tudouhu on 2017/2/15.
 */

import 'createjs';
import NameSpr from '../common/NameSpr';
import PlaneGame from './PlaneGame';
import Tools from '../common/Tools';
import Bullet from './Bullet';
import Timer from '../common/Timer';
import ObjectPool from '../common/ObjectPool';

/**
 * 敌机类
 */
class EnemyPlane extends createjs.Container{

  constructor(){
    super();
    /**
     * 速度
     * @type {number}
     */
    this.speed=3;
    /**
     * 旋转速度
     * @type {number}
     */
    this.rotationSpeed=3;
    /**
     * 目标角度
     * @type {number}
     */
    this.targetRot=0;
    /**
     * 子弹数组
     * @type {Array}
     */
    this.bulletArr=[];
    /**
     * 用户名
     * @type {string}
     */
    this.Name='';
    /**
     * 子弹数量id
     * @type {number}
     */
    this.bulletNumId=0;
    /**
     * 帧频被子弹击中
     * @type {boolean}
     */
    this.frameHitB=false;
    /**
     * 攻击次数
     * @type {number}
     */
    this.attackNum=0;
    /**
     * 移动x加值
     * @type {number}
     */
    this.mx=0;
    /**
     * 移动y加值
     * @type {number}
     */
    this.my=0;
    /**
     * 目标x
     * @type {number}
     */
    this.targetX=0;
    /**
     * 目标y
     * @type {number}
     */
    this.targetY=0;
    /**
     * 移动次数
     * @type {number}
     */
    this.moveNum=-1;
    /**
     * 当前最大时间
     * @type {number}
     */
    this.currentTime=0;
    this.init();
  }

  /**
   * 初始化
   */
  init() {
    this.mc = NameSpr.getInstance().getSpr('plane', 'plane');
    let bound = this.mc.getBounds();
    this.mc.x = -bound.width / 2;
    this.mc.y = -bound.height / 2;
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
    //飞机限制
    if(this.x<0)this.x=0;
    else if(this.x>PlaneGame.mapW)this.x=PlaneGame.mapW;
    if(this.y<0)this.y=0;
    else if(this.y>PlaneGame.mapH)this.y=PlaneGame.mapH;
  }
  /**
   * 数据处理
   * @param data
   */
  dataDispose=(obj)=> {
    if (obj.attack == 1) this.attackNum++;

    if (obj.time < this.currentTime) return;

    this.targetX = obj.x;
    this.targetY = obj.y;
    let dx = obj.x - this.x;
    let dy = obj.y - this.y;
    let dis = Math.sqrt(dx * dx + dy * dy);
    if (dis > 3 && dis <= 30) {
      let angle = Math.atan2(dy, dx);
      this.moveNum = Math.floor(dis / this.speed);
      this.mx = Math.cos(angle) * this.speed;
      this.my = Math.sin(angle) * this.speed;
    }
    else if (dis > 30) {
      this.x = obj.x;
      this.y = obj.y;
    }

    //为了防止本地角度360 服务器传来为0，导致计算出现问题，每次计算角度
    this.targetRot = obj.rot
    if (Math.abs(this.targetRot - this.rotation) > 30)
      this.rotation = obj.rot;
  }

  /**
   * 帧频函数
   * @param e
   */
  onFrame=(e)=>{
    this.frameHitB=false;
    if(this.bulletArr.length==0)
      this.bulletNumId=0;
    //攻击
    if(this.attackNum>0){
      this.attackNum--;
      this.attack();
    }
    //子弹移动
    for(let i=this.bulletArr.length-1;i>=0;i--){
      let bullet=this.bulletArr[i];
      if(bullet.parent==null){
        this.bulletArr.splice(i,1);
        ObjectPool.returnObj(bullet);
      }
      else{
        bullet.onFrame();
      }
    }
    //旋转  本地和服务器角度大于旋转速度按旋转速度旋转，小于直接赋值
    if(this.rotation!=this.targetRot){
      if(Math.abs(this.targetRot-this.rotation)>this.rotationSpeed){
        if(this.targetRot>this.rotation)
          this.rotation+=this.rotationSpeed;
        else
          this.rotation-=this.rotationSpeed;
      }
      else
        this.rotation=this.targetRot;
    }
    //移动
    // this.rotation=this.targetRot;
    if(this.moveNum>=0){
      this.moveNum--;
      this.move(this.mx, this.my);
      if(this.moveNum==0){
        this.x=this.targetX;
        this.y=this.targetY;
      }

    }
    else {
      let angle=Tools.getHD(this.rotation);
      let vx=Math.cos(angle)*this.speed;
      let vy=Math.sin(angle)*this.speed;
      this.move(vx,vy);
    }
    // console.log('子弹',this.bulletArr.length);
  }


    /**
     * 攻击 发射子弹
     */
    attack(){
      let bullet=ObjectPool.getObj('Bullet');
      bullet.x=this.x;
      bullet.y=this.y;
      bullet.setData(500,8,Tools.getHD(this.rotation),this.bulletNumId);
      this.bulletNumId++;
      this.parent.addChild(bullet);
      this.bulletArr.push(bullet);
    }


    /**
     * 移除
     */
    remove(){
      this.x = 100;
      this.y = 100;
      this.rotation=0;
    }


}

export default EnemyPlane;








