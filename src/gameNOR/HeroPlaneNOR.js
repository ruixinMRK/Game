/**
 * Created by tudouhu on 2017/2/7.
 */

import '../vendors/createjs';
import HeroPlaneB from '../gameBase/HeroPlaneB';
import GameData from '../manager/GameData';
import NameSpr from '../common/NameSpr';
import Router from '../common/socket/Router';
import SocketClient from '../common/socket/SocketClient';


/**
 * 飞机类
 */
class HeroPlaneNOR extends HeroPlaneB{


  /**
   * 攻击者object 记录助攻
   * @type {{}}
   */
  attackerO={};
  /**
   * 无敌时间设置
   * @type {number}
   */
  invincibleSet=3000;
  /**
   * 无敌时间
   * @type {number}
   */
  invincible=this.invincibleSet;


  constructor() {
    super();
  }




  /**
   * 帧频函数
   * @param e
   */
  onFrame(e){
    super.onFrame(e);
    //无敌时间计算
    this.invincible-=GameData.timeDiff;
    //助攻计算时间
    this.attackerTimeOF();

    if(this.visible==false||this.invincible>0) return;
    //飞机相撞检测
    for(let s in e.enemyP){
      if(e.enemyP[s].visible==false) continue;
      if(NameSpr.hitObj2(this,e.enemyP[s])){
        this.life=0;
        e.enemyP[s].visible=false;
        SocketClient.instance.send({KPI:Router.KPI.planeDie,name:this.Name,type:2,room:GameData.room,en:e.enemyP[s].Name});
        break;
      }
    }
    for(let s in e.AIP){
      if(e.AIP[s].visible==false) continue;
      if(NameSpr.hitObj2(this,e.AIP[s])){
        this.life=0;
        e.AIP[s].life=0;
        GameData.send=true;
        e.psd.AI[e.AIP[s].Name]=e.AIP[s].life;
        e.AIP[s].visible=false;
        SocketClient.instance.send({KPI:Router.KPI.planeDie,name:this.Name,type:2,room:GameData.room,an:e.AIP[s].Name});
        break;
      }
    }

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
    this.invincible=this.invincibleSet;
    this.gameKill+=this.kill;
    this.gameAssist+=this.assist;
    this.kill=0;
    this.assist=0;
  }



}

export default HeroPlaneNOR;
