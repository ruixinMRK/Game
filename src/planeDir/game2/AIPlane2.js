/**
 * Created by tudouhu on 2017/3/2.
 */

import 'createjs';
import Tools from '../../common/Tools';
import BasePlane from '../../container/BasePlane';
import UserData from '../../manager/UserData';
import GameData from '../../manager/GameData';
import NameSpr from '../../common/NameSpr';
import MyEvent from '../../common/MyEvent';
import Game2OverIf from './interface/Game2OverIf';
import Router from '../../common/socket/Router';
import SocketClient from '../../common/socket/SocketClient';
import DataShow from '../interface/DataShow';

/**
 * AI飞机类
 */
class AIPlane2 extends BasePlane{

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
    // console.log(this.Name,obj.hp,this.life);
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
    //移动
    this.x=this.targetX;
    this.y=this.targetY;
    this.rotation=this.targetRot;
    //状态初始化
    this.frameHitB=false;
    if(this.bulletArr.length==0)
      this.bulletNumId=0;
    //攻击
    if(this.attackNum>0){
      this.attackNum--;
      this.attack();
    }
    this.moveBullet();
    //子弹检测碰撞
    for(let i=this.bulletArr.length-1;i>=0;i--){
      let bullet=this.bulletArr[i];
      let r1=NameSpr.rectGlobal(bullet);
        let r2=NameSpr.rectGlobal(GameData.planeControl.HeroPlane);

        if(r1.intersects(r2)){
          //子弹击中了
          let hit={};
          hit[bullet.bulletId]=UserData.Name;
          SocketClient.instance.send({KPI:Router.KPI.AiHit,room:GameData.room,type:0,'name':this.Name,'hit':hit});
        }
    }

    // console.log('子弹',this.bulletArr.length);
  }


}

export default AIPlane2;
