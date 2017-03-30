/**
 * Created by tudouhu on 2017/3/14.
 */
import '../vendors/createjs';
import Tools from '../common/Tools';
import BasePlane from './BasePlane';
import GameData from '../manager/GameData';
import NameSpr from '../common/NameSpr';
import Router from '../common/socket/Router';
import SocketClient from '../common/socket/SocketClient';

/**
 * 飞机大战游戏飞机基类
 */
class HeroPlaneB extends BasePlane{
  /**
   * 上一帧的按键记录对象
   * @type {{}}
   */
  keyFrameO={};

  constructor() {
    super();
    this.init(GameData.planeNameO[GameData.planeName]);

    this.keyLog();
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
   * @param e {PlaneControl}
   */
  onFrame(e){
    //按键判断处理
    for(let s in this.keyFrameO){
      if(this.keyFrameO[s]!=GameData[s]){
        e.psd[s]=GameData[s];
        GameData.send=true;
      }
    }
    this.keyLog();
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
    if(this.visible&&GameData.key_J&&this.bulletNum>0&&this.attackTime<=0){
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
      this.gasoline-=this.speed/150;
      // this.gasoline-=this.speed;
      let angle=Tools.getHD(this.rotation);
      let vx=Math.cos(angle)*this.speed*GameData.timeDiff;
      let vy=Math.sin(angle)*this.speed*GameData.timeDiff;
      this.move(vx,vy);
    }
    //子弹检测碰撞敌机
    for(let i=this.bulletArr.length-1;i>=0;i--){
      let bullet=this.bulletArr[i];
      for(let s in e.enemyP){
        if(e.enemyP[s].frameHitB) continue;
        if(NameSpr.hitObj2(bullet,e.enemyP[s])){
          //子弹击中了
          GameData.dataShow.enemyPlane=e.enemyP[s];
          e.enemyP[s].frameHitB=true;
          e.psd.hitObj[bullet.bulletId]=s;
          bullet.remove();
          break;
        }
      }
    }
    //子弹检测碰撞AI飞机
    for(let i=this.bulletArr.length-1;i>=0;i--){
      /**
       * @type {Bullet}
       */
      let bullet=this.bulletArr[i];
      for(let s in e.AIP){
        if(e.AIP[s].frameHitB) continue;
        if(NameSpr.hitObj2(bullet,e.AIP[s])){
          //子弹击中了
          GameData.dataShow.enemyPlane=e.AIP[s];
          e.AIP[s].frameHitB=true;

          e.AIP[s].life-=bullet.atk;
          GameData.send=true;
          e.psd.AI[e.AIP[s].Name]=e.AIP[s].life;
          let hit={};
          hit[bullet.bulletId]=e.AIP[s].Name;
          SocketClient.instance.send({KPI:Router.KPI.AiHit,room:GameData.room,type:1,'name':this.Name,'hit':hit});
          bullet.remove();
          break;
        }
      }
    }
    //飞机数据显示
    GameData.dataShow.planeTxt(this);
    // console.log('子弹',this.bulletArr.length);
  }

  /**
   * 按键记录
   */
  keyLog(){
    this.keyFrameO.key_A=GameData.key_A;
    this.keyFrameO.key_D=GameData.key_D;
    this.keyFrameO.key_W=GameData.key_W;
    this.keyFrameO.key_S=GameData.key_S;
    this.keyFrameO.key_J=GameData.key_J;
  }

  /**
   * 复活
   */
  rebirth(){
    super.rebirth();
  }

  /**
   * 移除
   */
  remove(){
    super.remove();
  }

}


export default HeroPlaneB;
