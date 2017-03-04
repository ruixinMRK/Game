/**
 * Created by tudouhu on 2017/3/2.
 */

import 'createjs';
import BasePlane from '../../container/BasePlane';
import Tools from '../../common/Tools';

/**
 * AI飞机类
 */
class AIPlane extends BasePlane{

  constructor(){
    super();
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
    this.init();
  }

  /**
   * 数据处理
   * @param obj {{}}
   */
  dataDispose=(obj)=> {
    console.log(obj);
    if (obj.attack == 1) this.attackNum++;

    if (obj.t < this.currentTime) return;

    this.life=obj.hp;

    this.targetX = obj.x;
    this.targetY = obj.y;

    this.targetRot = obj.r;
  }

  /**
   * 帧频函数
   * @param e
   */
  onFrame=(e)=>{
    // console.log(this.Name,this.x, this.y, this.targetX,this.targetY);
    if(this.visible==false) return;
    if(this.life<=0)this.visible=false;
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
    this.x=this.targetX;
    this.y=this.targetY;
    this.rotation=this.targetRot;

    // console.log('子弹',this.bulletArr.length);
  }


}

export default AIPlane;
