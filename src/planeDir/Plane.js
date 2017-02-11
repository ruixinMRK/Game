/**
 * Created by tudouhu on 2017/2/7.
 */

import 'createjs';
import NameSpr from '../common/NameSpr';
import PlaneGame from './PlaneGame';
import Tools from '../common/Tools';
import Bullet from './Bullet';
import Timer from '../common/Timer';

/**
 * 飞机类
 */
class Plane extends createjs.Container{

  constructor(enemy=false){
    super();
    /**
     * 是否是敌机
     * @type {boolean}
     */
    this.enemyB=enemy;
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
     * 没有帧频链接次数 掉线
     * @type {number}
     */
    this.noLinkNum=0;
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


    //Timer.add(e=>{SocketClient.instance.send({name:'planWalk',d:12});},500,1);

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
   * 帧频函数
   * @param e
   */
  onFrame=(e)=>{
    this.frameHitB=false;
    //子弹移动
    for(let i=this.bulletArr.length-1;i>=0;i--){
      let bullet=this.bulletArr[i];
      if(bullet.mc==null){
        this.bulletArr.splice(i,1);
      }
      else{
        bullet.onFrame();
      }
    }
    //敌机结束不需要这些下面功能
    if(this.enemyB){
      // this.noLinkNum++;
      // if(this.noLinkNum>60){
      //   if(!this.parent)return ;
      //     this.parent.removeChild(this);
      //   this.mc=null;
      // }
      return;
    }
    //移动
    let angle=Tools.getHD(this.rotation);
    let vx=Math.cos(angle)*this.speed;
    let vy=Math.sin(angle)*this.speed;
    this.move(vx,vy);
    //子弹检测碰撞
    for(let i=this.bulletArr.length-1;i>=0;i--){
      let bullet=this.bulletArr[i];
      let r1=Plane.rectGlobal(bullet);
      for(let s in e.enemyP){
        if(e.enemyP[s].frameHitB) break;
        let r2=Plane.rectGlobal(e.enemyP[s]);
        if(r1.intersects(r2)){
          e.enemyP[s].frameHitB=true;
          e.psd.hitObj[bullet.bulletId]=s;
          bullet.remove();
          e.enemyP[s].remove();
          e.hitText(this.Name+'的子弹'+bullet.bulletId+'击中'+s);
        }
      }
    }
    // console.log('子弹',this.bulletArr.length);
  }


  /**
   * 攻击 发射子弹
   */
  attack(){
    let bullet=new Bullet(500,8,Tools.getHD(this.rotation));
    bullet.x=this.x;
    bullet.y=this.y;
    bullet.bulletId=this.bulletNumId;
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
    this.frameHitB=true;
  }

  /**
   * 获得对象父级坐标的矩形框 返回矩形框
   * @param spr 对象
   */
  static rectGlobal(spr){
    let rect=spr.getBounds();
    rect.x+=spr.x;
    rect.y+=spr.y;
    return rect;
  }

}

export default Plane;