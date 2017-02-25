/**
 * Created by tudouhu on 2017/2/7.
 */

import 'createjs';
import Tools from '../common/Tools';
import BasePlane from '../container/BasePlane';
import GameData from '../manager/GameData';
import NameSpr from '../common/NameSpr';
import DataShow from './DataShow';

/**
 * 飞机类
 */
class HeroPlane extends BasePlane{

  /**
   * 速度设置
   * @type {number}
   */
  speedSet=3;
  /**
   * 设置汽油值
   * @type {number}
   */
  gasolineSet=100;
  /**
   * 设置子弹值 数量
   * @type {number}
   */
  bulletNumSet=100;
  /**
   * 攻击时间
   * @type {number}
   */
  attackTime=0;
  /**
   * 设置攻击时间
   * @type {number}
   */
  attackTimeSet=300;


  constructor(){
    super();
    this.init();
  }

  /**
   * 飞机旋转
   * @param r 增加的角度
   */
  planeRot=(r)=>{
    this.rotation+=r;
    GameData.send=true;
  }


  /**
   * 帧频函数
   * @param e
   */
  onFrame=(e)=>{
    //帧频开始状态初始化
    this.bulletArr.length==0&&(this.bulletNumId=0);
    this.speed=this.speedSet;
    this.attackTime-=GameData.timeDiff;
    //道具检测
    GameData.planeMap.propHit(this);
    //按键判断
    if(GameData.key_A){
      this.planeRot(-this.rotationSpeed);
    }
    else if(GameData.key_D){
      this.planeRot(this.rotationSpeed);
    }
    if(GameData.key_J&&this.bulletNum>0&&this.attackTime<=0){
      this.attack();
      this.bulletNum--;
      this.attackTime=this.attackTimeSet;
      e.psd.attack=1;
      GameData.send=true;
    }
    if(GameData.key_W){
      this.speed*=2;
    }
    else if(GameData.key_S){
      this.speed/=2;
    }
    //子弹移动
    this.moveBullet();
    //移动
    if(this.gasoline>0){
      // this.gasoline-=this.speed/100;
      this.gasoline-=this.speed;
      let angle=Tools.getHD(this.rotation);
      let vx=Math.cos(angle)*this.speed;
      let vy=Math.sin(angle)*this.speed;
      this.move(vx,vy);
    }
    //子弹检测碰撞

    for(let i=this.bulletArr.length-1;i>=0;i--){
      let bullet=this.bulletArr[i];
      let r1=NameSpr.rectGlobal(bullet);

      for(let s in e.enemyP){
        if(e.enemyP[s].frameHitB) break;
        let r2=NameSpr.rectGlobal(e.enemyP[s]);

        if(r1.intersects(r2)){
          //子弹击中了
          GameData.dataShow.enemyPlane=e.enemyP[s];
          e.enemyP[s].frameHitB=true;
          e.psd.hitObj[bullet.bulletId]=s;
          bullet.remove();
          GameData.dataShow.hitText(this.Name+'的子弹'+bullet.bulletId+'击中'+s);
        }
      }
    }
    //飞机数据显示
    GameData.dataShow.planeTxt(this);
    // console.log('子弹',this.bulletArr.length);
  }


}

export default HeroPlane;
