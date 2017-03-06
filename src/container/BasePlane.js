/**
 * Created by ruixin on 2017/2/16 0016.
 */

import 'createjs';
import NameSpr from '../common/NameSpr';
import Tools from '../common/Tools';
import GameData from '../manager/GameData';
import ObjectPool from '../common/ObjectPool';

class BasePlane extends createjs.Container{

  /**
   * 生命值
   * @type {number}
   */
  life=100;
  /**
   * 设置生命值
   * @type {number}
   */
  lifeSet=100;
  /**
   * 汽油值
   * @type {number}
   */
  gasoline=100;
  /**
   * 子弹值 数量
   * @type {number}
   */
  bulletNum=100;
  /**
   * 子弹移动距离
   * @type {number}
   */
  bulletDis=1000;
  /**
   * 子弹移动速度
   * @type {number}
   */
  bulletSpeed=10;



  constructor() {
    super();
    /**
     * 帧频被子弹击中
     * @type {boolean}
     */
    this.frameHitB=false;
    /**
     * 速度
     */
    this.speed=3;
    /**
     * 旋转速度
     */
    this.rotationSpeed=3;
    /**
     * 子弹数组
     */
    this.bulletArr=[];
    /**
     * 用户名
     */
    this.Name='';
    /**
     * 子弹数量id
     */
    this.bulletNumId=0;
  }

  /**
   * 初始化
   */
  init() {


    this.mc = NameSpr.getInstance().getSpr('plane', 'plane');
    let bound = this.mc.getBounds();
    this.mc.regX = bound.width / 2;
    this.mc.regY = bound.height / 2;
    this.addChild(this.mc);
  }

  /**
   * 移动
   * @param vx x速度
   * @param vy y速度
   */
  move(vx,vy){

    this.x+=vx;
    this.y+=vy;
    //飞机限制
    if(this.x<0)this.x=0;
    else if(this.x>GameData.mapW)this.x=GameData.mapW;
    if(this.y<0)this.y=0;
    else if(this.y>GameData.mapH)this.y=GameData.mapH;

  }

  /**
   * 帧频函数
   * @param e
   */
  onFrame=(e)=>{

  }

  /**
   * 操作子弹
   */
  moveBullet(){
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
  }

  /**
   * 攻击 发射子弹
   */
  attack=()=>{
    let bullet=ObjectPool.getObj('Bullet');
    bullet.x=this.x;
    bullet.y=this.y;
    bullet.setData(this.bulletDis,this.bulletSpeed,Tools.getHD(this.rotation),this.bulletNumId);
    this.bulletNumId++;
    this.parent.addChild(bullet);
    this.bulletArr.push(bullet);
  }


  /**
   * 复活
   */
  rebirth(){
    this.visible=true;
    this.x = 100;
    this.y = 100;
    this.rotation=0;
    this.life=this.lifeSet;
  }

  /**
   * 移除
   */
  remove(){
    if(this.parent!=null)
      this.parent.removeChild(this);
  }
}
export default BasePlane;
