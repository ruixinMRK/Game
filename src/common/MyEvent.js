/**
 * Created by tudouhu on 2017/2/26.
 */

/**
 * 自定义事件
 */
class MyEvent{

  static ME_MyEvent='MyEvent';

  /**
   * 回调函数对象
   * @type {{}}
   */
  static callF={};

  constructor(){

  }

  /**
   * 添加事件
   * @param type {String} 类型
   * @param fn {function} 回调函数
   */
  static addEvent(type=null,fn=null){
    if(type==null||fn==null) return;
    if(MyEvent.callF[type]==null)
      MyEvent.callF[type]=[];
    MyEvent.callF[type].push(fn);
  }


  /**
   * 移除事件 只有类型没有函数清楚类型所有函数
   * @param type {String} 类型
   * @param fn {function} 回调函数
   */
  static removeEvent(type=null,fn=null){
    if(type==null||MyEvent.callF[type]==null) return;
    /**
     * @type {Array}
     */
    let callA=MyEvent.callF[type];
    if(fn==null){
      MyEvent.callF[type]=null;
    }
    else{
      for(let i=callA.length-1;i>=0;i--){
        if(fn==callA[i]){
          callA[i]=null;
          break;
        }
      }
    }
  }


  /**
   * 派发事件
   * @param type {String} 类型
   * @param data {*} 传输数据
   */
  static dispatchEvent(type=null,data=null){
    if(type==null||MyEvent.callF[type]==null) return;
    /**
     * @type {Array}
     */
    let callA=MyEvent.callF[type];
    for(let i=callA.length-1;i>=0;i--){
      if(MyEvent.callF[type]==null)
        break;
      if(callA[i]==null)
        callA.splice(i,1);
      else
        callA[i](data);
    }
  }





}

export default MyEvent;


