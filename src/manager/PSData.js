/**
 * Created by Administrator on 2017/2/16.
 */
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
    this.KPI='planWalk';
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
PSData.PSDataIndex={Name:'n',room:'room',KPI:'KPI',life:'l',x:'x',y:'y',rot:'r',time:'t',attack:'a',hitObj:'h'};

export default PSData;
