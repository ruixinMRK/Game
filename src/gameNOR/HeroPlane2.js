/**
 * Created by tudouhu on 2017/2/7.
 */

import '../vendors/createjs';
import HeroPlaneB from '../gameBase/HeroPlaneB';
import GameData from '../manager/GameData';

/**
 * 飞机类
 */
class HeroPlane2 extends HeroPlaneB{


  /**
   * 攻击者object 记录助攻
   * @type {{}}
   */
  attackerO={};


  constructor() {
    super();
  }




  /**
   * 帧频函数
   * @param e
   */
  onFrame(e){
    super.onFrame(e);
    //助攻计算时间
    this.attackerTimeOF();
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
    this.gameKill+=this.kill;
    this.gameAssist+=this.assist;
    this.kill=0;
    this.assist=0;
  }



}

export default HeroPlane2;
