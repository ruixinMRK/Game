/**
 * Created by ruixin on 2017/2/16 0016.
 */

import '../vendors/createjs';
import NameSpr from '../common/NameSpr';
import Tools from '../common/Tools';
import GameData from '../manager/GameData';
import ObjectPool from '../common/ObjectPool';

class BasePlane extends createjs.Container{


  /**
   * 攻击力
   * @type {number}
   */
  atk=5;
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
  bulletDis=800;
  /**
   * 子弹移动速度
   * @type {number}
   */
  bulletSpeed=400/1000;
  /**
   * 速度设置
   * @type {number}
   */
  speedSet=100/1000;
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
  attackTimeSet=100;
  /**
   * 一局游戏击杀
   * @type {number}
   */
  gameKill=0;
  /**
   * 一局游戏助攻
   * @type {number}
   */
  gameAssist=0;
  /**
   * 击杀（一条命）
   * @type {number}
   */
  kill=0;
  /**
   * 助攻（一条命）
   * @type {number}
   */
  assist=0;


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
   * @param sprName 飞机精灵名
   */
  init(sprName) {
    this.mc = NameSpr.getInstance().getSpr('plane', sprName);
    this.addChild(this.mc);
    NameSpr.registerPointCenter(this);
    this.hitArr=NameSpr.setHitPoint(this);
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
   * 子弹碰撞移除，不做任何处理
   * @param obj 检测对象
   * @param objB 包含多个飞机的obj对象=true 飞机对象=false
   */
  bulletHit(obj,objB=true){
    let planeO={};
    if(objB)
      planeO=obj;
    else
      planeO[obj.Name]=obj;
    for(let i=0;i<this.bulletArr.length;i++){
      if(this.bulletArr[i].parent==null) continue;
      for(let s in planeO){
        if(planeO[s].Name==this.Name) continue;
        if(NameSpr.hitObj2(this.bulletArr[i],planeO[s])){
          this.bulletArr[i].remove();
        }
      }
    }
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
    bullet.setData(this.bulletDis,this.bulletSpeed,Tools.getHD(this.rotation),this.atk,this.bulletNumId);
    this.bulletNumId++;
    this.parent.addChild(bullet);
    this.bulletArr.push(bullet);
  }

  /**
   * 查找子弹
   * @param id 子弹id
   * @returns {null/Bullet} 返回子弹
   */
  bulletFind(id){
    let bullet=null;
    for(let i=0;i<this.bulletArr.length;i++){
      if(this.bulletArr[i].bulletId=id){
        bullet=this.bulletArr[i];
        break;
      }
    }
    return bullet;
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
    this.gasoline=this.gasolineSet;
    this.bulletNum=this.bulletNumSet;
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
