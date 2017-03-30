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
    /**
     * 按键对象
     * @type {{*}}
     */
    this.keyO={
      key_A:false,
      key_D:false,
      key_W:false,
      key_S:false,
      key_J:false,
    };

    this.init(sprName);
  }

  /**
   * 数据处理
   * @param obj {PSData}
   */
  dataDispose=(obj)=> {

    for(let s in this.keyO){
      if(obj[s]!=null)
        this.keyO[s]=obj[s];
    }

    if (obj.time < this.currentTime) return;


    this.life=obj.life;

    // this.x = obj.x;
    // this.y = obj.y;
    //
    // this.rotation = obj.rot;
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
    this.frameHitB=false;

    //按键判断
    if(this.keyO.key_A){
      this.rotation-=this.rotationSpeed;
    }
    else if(this.keyO.key_D){
      this.rotation+=this.rotationSpeed;
    }

    if(this.visible&&this.keyO.key_J&&this.bulletNum>0&&this.attackTime<=0){
      this.attack();
      this.bulletNum--;
      this.attackTime=this.attackTimeSet;
    }
    if(this.keyO.key_W){
      this.speed*=2;
    }
    else if(this.keyO.key_S){
      this.speed/=2;
    }
    //子弹移动
    this.moveBullet();
    //移动
    if(this.gasoline>0){
      this.gasoline-=this.speed/150;
      let angle=Tools.getHD(this.rotation);
      let vx=Math.cos(angle)*this.speed*GameData.timeDiff;
      let vy=Math.sin(angle)*this.speed*GameData.timeDiff;
      this.move(vx,vy);
    }

    //子弹碰撞检测移除，不做别的处理
    this.bulletHit(GameData.planeControl.AIP);
    this.bulletHit(GameData.planeControl.enemyP);
    this.bulletHit(GameData.planeControl.HeroPlane,false);

    // console.log('子弹',this.bulletArr.length);
  }


  /**
   * 复活
   */
  rebirth(){
    super.rebirth();
    this.keyO={
      key_A:false,
      key_D:false,
      key_W:false,
      key_S:false,
      key_J:false,
    };
  }



}


export default EnemyPlaneB;
