/**
 * Created by ruixin on 2016/9/20 0020.
 */
//对象池(仅适用于频繁创建与移除的地方,记住返回的东西需要自己重置)
import '../vendors/createjs.js';
import Tools from './Tools.js';
import Bullet from '../container/Bullet';

class ObjectPool {
    constructor() {
      throw new Error('不能实例化');
    }
    static objPool = {};
    static mapObj = {'Bullet':Bullet
    };

  /**
   * 从对象池获取对象
   * @param str 类名字符串 需要在对象池类添加过
   * @returns {*}
   */
    static getObj(str){

      let s = false;
      let mapO = ObjectPool.mapObj;
      let poolO = ObjectPool.objPool;
      for(let key in mapO){
        if(key === str) s = true;
      }
      if(!s) return null;

      if(!poolO[str]) poolO[str] = [];

      let tempArr = poolO[str];
      // console.log('数组中读取',tempArr.length);
      if(!!tempArr.length) return tempArr.shift();
      // console.log('创建');
      let tempObj = new mapO[str]();
      return tempObj;
    }

  /**
   * 对象添加到对象池
   * @param obj 对象 需要在对象池内添加过类名索引
   */
    static returnObj(obj){

      if(!obj) return;

      if(Tools.getType(obj) === 'Array'){
        let i = 0;
        for(;i<obj.length;i++){
          ObjectPool.Itor(obj[i]);
        }
      }
      else{
        ObjectPool.Itor(obj);
      }

    }

    static Itor(obj){

      if(!obj) return;
      let mapO = ObjectPool.mapObj;
      let poolO = ObjectPool.objPool;
      for(let key in mapO){
        if(obj instanceof mapO[key]){
          //发现类型数组,重新回收
          //数组不存在时
          if(!poolO[key]) poolO[key] = [];
          let l = poolO[key].length;
          poolO[key][l] = obj;
          //重置几个关键数据
          // obj.x = obj.y = obj.regX = obj.regY = 0;
          // obj.scaleX = obj.scaleY = obj.alpha = 1;
          // obj.mask = null;
          // if(obj instanceof createjs.Container) obj.removeAllChildren();
          // if(obj instanceof createjs.Shape) obj.graphics.clear();
          // obj&&obj.parent&&obj.parent.removeChild(obj);
          // console.log('已经回收',key,poolO[key].length);
        }
      }
    }

    //销毁
    static destroy(str){

      if(str&&ObjectPool.objPool[str]){
        ObjectPool.objPool[str] = [];
      }
      else{
        for(let key in ObjectPool.mapObj){
          if(ObjectPool.mapObj.hasOwnProperty(key)) ObjectPool.objPool[key] = [];
        }
      }

    }
}
export default ObjectPool;
