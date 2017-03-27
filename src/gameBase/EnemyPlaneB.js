/**
 * Created by tudouhu on 2017/3/14.
 */
import '../vendors/createjs';
import BasePlane from './BasePlane';
import Tools from '../common/Tools';
import GameData from '../manager/GameData';

/**
 * 飞机大战游戏敌人飞机基类
 */
class EnemyPlaneB extends BasePlane{

  /**
   * 敌机构造函数
   * @param sprName 飞机精灵名
   */
  constructor(sprName){
    super();
    /**
     * 攻击次数
     * @type {number}
     */
    this.attackNum=0;
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
     * 目标角度
     * @type {number}
     */
    this.targetRot=0;
    /**
     * 当前最大时间
     * @type {number}
     */
    this.currentTime=0;
    this.init(sprName);
  }

  /**
   * 数据处理
   * @param obj {PSData}
   */
  dataDispose=(obj)=> {
    if (obj.attack == 1) this.attackNum++;

    if (obj.time < this.currentTime) return;

    this.life=obj.life;

    this.targetX = obj.x;
    this.targetY = obj.y;

    this.targetRot = obj.rot;
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
    this.moveBullet();
    //移动
    // this.x=this.targetX;
    // this.y=this.targetY;
    if(this.rotation!=this.targetRot)
    {
      this.x += (this.targetX - this.x)　* 0.92;
      this.y += (this.targetY - this.y)　* 0.92;
    }
    else {
      let angle=Tools.getHD(this.rotation);
      let vx=Math.cos(angle)*this.speed;
      let vy=Math.sin(angle)*this.speed;
      this.move(vx,vy);
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

    //子弹碰撞检测移除，不做别的处理
    this.bulletHit(GameData.planeControl.AIP);
    this.bulletHit(GameData.planeControl.enemyP);
    this.bulletHit(GameData.planeControl.HeroPlane,false);

    // console.log('子弹',this.bulletArr.length);
  }




}


export default EnemyPlaneB;
