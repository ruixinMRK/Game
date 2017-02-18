/**
 * Created by tudouhu on 2017/2/7.
 */

import 'createjs';
import Tools from '../common/Tools';
import BasePlane from '../container/BasePlane';
import GameData from '../manager/GameData';
import DataShow from './DataShow';

/**
 * 飞机类
 */
class Plane extends BasePlane{

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
    if(GameData.key_A){
      this.planeRot(-this.rotationSpeed);
    }
    else if(GameData.key_D){
      this.planeRot(this.rotationSpeed);
    }
    if(GameData.key_J){
      this.attack();
      e.psd.attack=1;
      GameData.send=true;
    }

    this.bulletArr.length==0&&(this.bulletNumId=0);

    //子弹移动
    this.moveBullet();
    //移动
    let angle=Tools.getHD(this.rotation);
    let vx=Math.cos(angle)*this.speed;
    let vy=Math.sin(angle)*this.speed;
    this.move(vx,vy);
    //子弹检测碰撞
    for(let i=this.bulletArr.length-1;i>=0;i--){
      let bullet=this.bulletArr[i];
      let r1=this.rectGlobal(bullet);

      for(let s in e.enemyP){
        if(e.enemyP[s].frameHitB) break;
        let r2=this.rectGlobal(e.enemyP[s]);

        if(r1.intersects(r2)){
          //子弹击中了
          e.enemyP[s].frameHitB=true;
          e.psd.hitObj[bullet.bulletId]=s;
          bullet.remove();
          DataShow.getInstance().hitText(this.Name+'的子弹'+bullet.bulletId+'击中'+s);
        }
      }
    }
    // console.log('子弹',this.bulletArr.length);
  }

  /**
   * 获得对象父级坐标的矩形框 返回矩形框
   * @param spr 对象
   */
  rectGlobal(spr){
    let rect=spr.getBounds();
    rect.x+=spr.x;
    rect.y+=spr.y;
    return rect;
  }

}

export default Plane;
