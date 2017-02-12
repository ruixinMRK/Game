/**
 * Created by ruixin on 2016/9/20 0020.
 */
//对象池(仅适用于频繁创建与移除的地方,记住返回的东西需要自己重置)
import 'createjs.js';
import Tools from 'common/Tools.js';

class ObjectPool {
    constructor() {
      throw new Error('不能实例化');
    }
    static objPool = {};
    static mapObj = {'txt':'Text',
      'shape':'Shape',
      'con':'Container',
      'p':'Plane'
    };
    //static mapObj = 'txt shape con'.split(' ');
    //获取对象
    //txt 文本 shape绘图 con容器
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
      let tempObj = new createjs[mapO[str]]();
      return tempObj;
    }

    //返回对象
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
        if(obj instanceof createjs[mapO[key]]){
          //发现类型数组,重新回收
          //数组不存在时
          if(!poolO[key]) poolO[key] = [];
          let l = poolO[key].length;
          poolO[key][l] = obj;
          //重置几个关键数据
          obj.x = obj.y = obj.regX = obj.regY = 0;
          obj.scaleX = obj.scaleY = obj.alpha = 1;
          obj.mask = null;
          if(obj instanceof createjs.Container) obj.removeAllChildren();
          if(obj instanceof createjs.Shape) obj.graphics.clear();
          obj&&obj.parent&&obj.parent.removeChild(obj);
          // console.log('已经回收',key);
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
