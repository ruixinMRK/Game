/**
 * Created by tudouhu on 2017/2/7.
 */

import 'createjs';
import Tools from '../../common/Tools';
import BasePlane from '../../container/BasePlane';
import UserData from '../../manager/UserData';
import GameData from '../../manager/GameData';
import NameSpr from '../../common/NameSpr';
import MyEvent from '../../common/MyEvent';
import Router from '../../common/socket/Router';
import SocketClient from '../../common/socket/SocketClient';
import DataShow from '../interface/DataShow';

/**
 * 飞机类
 */
class HeroPlane2 extends BasePlane{

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
  /**
   * 攻击者object 记录助攻
   * @type {{}}
   */
  attackerO={};


  constructor() {
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
    //助攻计算时间
    this.attackerTimeOF();
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
      this.gasoline-=this.speed/150;
      // this.gasoline-=this.speed;
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
        }
      }
    }


    //子弹检测碰撞AI飞机
    for(let i=this.bulletArr.length-1;i>=0;i--){
      let bullet=this.bulletArr[i];
      let r1=NameSpr.rectGlobal(bullet);

      for(let s in e.AIP){
        if(e.AIP[s].frameHitB) break;
        let r2=NameSpr.rectGlobal(e.AIP[s]);

        if(r1.intersects(r2)){
          //子弹击中了
          GameData.dataShow.enemyPlane=e.AIP[s];
          e.AIP[s].frameHitB=true;
          let hit={};
          hit[bullet.bulletId]=e.AIP[s].Name;
          SocketClient.instance.send({KPI:Router.KPI.AiHit,room:GameData.room,type:1,'name':this.Name,'hit':hit});
          break;
        }
      }
    }
    //飞机数据显示
    GameData.dataShow.planeTxt(this);
    // console.log('子弹',this.bulletArr.length);
  }

  /**
   * 设置攻击者
   * @param name 攻击者name
   */
  setAttacker=(name)=>{
    //10秒
    this.attackerO[name]=10000;
  }

  /**
   * 获得攻击者 数组第一个元素为击杀者剩下为助攻
   * @param name 击杀者name
   */
  getAttacker(name){
    delete this.attackerO[name];
    let arr=[name];
    for(let s in this.attackerO){
      arr.push(s);
    }
    this.attackerO={};
    return arr;
  }

  /**
   * 攻击者时间帧频
   */
  attackerTimeOF=()=>{
    for(let s in this.attackerO){
      this.attackerO[s]-=GameData.timeDiff;
      if(this.attackerO[s]<=0){
        delete this.attackerO[s];
      }
    }
  }

  /**
   * 设置击杀助攻
   * @param arr {Array} 击杀助攻数组
   */
  setKillAssist(arr){
    for(let i=0;i<arr.length;i++){
      if(arr[i]==this.Name){
        if(i==0)
          this.kill++;
        else
          this.assist++;
        break;
      }
    }
  }

  /**
   * 复活
   */
  rebirth(){
    super.rebirth();
    this.gasoline=this.gasolineSet;
    this.bulletNum=this.bulletNumSet;
    this.gameKill+=this.kill;
    this.gameAssist+=this.assist;
    this.kill=0;
    this.assist=0;
  }

  /**
   * 移除
   */
  remove(){
    super.remove();
  }


}

export default HeroPlane2;
