/**
 * Created by Administrator on 2017/2/16.
 */

import Router from '../common/socket/Router';

/**
 * 飞机传输数据类
 */

class PSData{

  constructor(){

    if(PSData.ObjIndex==null){
      PSData.ObjIndex={};
      for(let s in PSData.PSDataIndex){
        PSData.ObjIndex[PSData.PSDataIndex[s]]=s;
      }
    }

    this.init();
  }

  init(){
    /**
     * 用户名
     * @type {string}
     */
    this.Name='';
    /**
     * 房间名
     * @type {string}
     */
    this.room='';
    //数据名
    this.KPI=Router.KPI.planeWalk;
    /**
     * 生命值
     * @type {number}
     */
    this.life=0;
    /**
     * x位置
     * @type {number}
     */
    this.x=0;
    /**
     * y位置
     * @type {number}
     */
    this.y=0;
    /**
     * 角度
     * @type {number}
     */
    this.rot=0;
    /**
     * 时间毫秒
     * @type {number}
     */
    this.time=0;
    /**
     * 攻击 1-攻击 0-未攻击
     * @type {number}
     */
    this.attack=0;
    /**
     * 碰撞对象 Obj.子弹id=飞机name
     * @type {{}}
     */
    this.hitObj={};
    /**
     * 碰撞对象 Obj.AI飞机名=生命
     * @type {{}}
     */
    this.AI={};


    //按键
    this.key_A=null;
    this.key_D=null;
    this.key_W=null;
    this.key_S=null;
    this.key_J=null;


  }

  /**
   * PSData数据 更简洁PSData的obj 互转
   * @param psdata {PSData} psdata数据
   * @returns {{}}
   */
  static getObj=(psdata)=>{
    let obj={};
    if(psdata.Name!=null){
      obj[PSData.PSDataIndex['Name']]=psdata.Name;
      obj[PSData.PSDataIndex['room']]=psdata.room;

      obj[PSData.PSDataIndex['KPI']]=psdata.KPI;
      obj[PSData.PSDataIndex['life']]=psdata.life;
      obj[PSData.PSDataIndex['x']]=Math.round(psdata.x);
      obj[PSData.PSDataIndex['y']]=Math.round(psdata.y);
      obj[PSData.PSDataIndex['rot']]=Math.round(psdata.rot);
      obj[PSData.PSDataIndex['time']]=psdata.time;
      if(psdata.attack==1)
        obj[PSData.PSDataIndex['attack']]=Math.round(psdata.attack);
      if(JSON.stringify(psdata.hitObj).length>2)
        obj[PSData.PSDataIndex['hitObj']]=psdata.hitObj;
      if(JSON.stringify(psdata.AI).length>2)
        obj[PSData.PSDataIndex['AI']]=psdata.AI;
      if(psdata.key_A!=null)
        obj[PSData.PSDataIndex['key_A']]=psdata.key_A;
      if(psdata.key_D!=null)
        obj[PSData.PSDataIndex['key_D']]=psdata.key_D;
      if(psdata.key_W!=null)
        obj[PSData.PSDataIndex['key_W']]=psdata.key_W;
      if(psdata.key_S!=null)
        obj[PSData.PSDataIndex['key_S']]=psdata.key_S;
      if(psdata.key_J!=null)
        obj[PSData.PSDataIndex['key_J']]=psdata.key_J;
      return obj;
    }
    else {
      obj=psdata;
      let pd=new PSData();
      for(let s in obj){
        pd[PSData.ObjIndex[s]]=obj[s];
      }
      return pd;
    }

  }





}
/**
 *上传数据索引  obj.上传数据属性名=PSData属性名
 * @type {{}}
 */
PSData.ObjIndex=null;
/**
 * PSData索引，obj.PSData属性名=上传数据属性名
 * @type {{}}
 */
PSData.PSDataIndex={Name:'n',room:'room',KPI:'KPI',life:'l',x:'x',y:'y',rot:'r',time:'t',attack:'a',hitObj:'h',
AI:'AI',key_A:'ka',key_D:'kd',key_W:'kw',key_S:'ks',key_J:'kj',
};

export default PSData;
