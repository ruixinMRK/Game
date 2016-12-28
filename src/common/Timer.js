/**
 * Created by ruixin on 2016/8/24 0024.
 */
import Tools from './Tools';
class Timer {

    constructor() {
      throw new Error('error');
    }

    static init(ms=15){
      if(Timer.isStart) return;
      Timer.isStart = true;
      Timer.t = ms;
      Timer.lastTime = new Date().getTime();
      Timer.getAnimation();
      //setInterval(Timer.progress,ms);

      Timer.ID = window.requestAnimationFrame(Timer.progress);
    }

    //方法 间隔(ms) 次数 完成时回调
    //返回6位字符串标识
    static add(fn=null,time=500,num=0,isG=false,callBack=null,_this=null){
      if(!Timer.isStart) {Timer.init()};
      if(_this) fn = fn.bind(_this);
      let str = Tools.getRandomStr(8);

      let obj = {};
      obj.fn = fn;//回调
      obj.time = time;//间隔
      obj.num = num;//总运行次数
      obj.cb = callBack;//完成时的回调
      obj.id = str;//计时器id
      obj.currentNum = 0;//记录已经执行的次数
      obj.f = new Date().getTime();//记录加入时的时间(执行时的时间戳)

      if(isG){
        obj.currentNum++;
        obj.fn();
      }
      Timer.timerArr.push(obj);
      // console.log(Timer.timerArr.length);
      //console.log(obj.f,'---add');
      return str;
    }

    static progress(){

      Timer.currentTime = new Date().getTime();
      Timer.t = Timer.currentTime - Timer.lastTime;
      Timer.FPS = 1000/Timer.t|0;
      Timer.timerArr.forEach(a=>{

        if((Timer.currentTime - a.f<a.time&&Timer.currentTime - a.f + Timer.t > a.time)||(Timer.currentTime - a.f>a.time)){
          if(a.fn){
            a.fn();
            //console.log(new Date().getTime()-a.f,'---done');
            a.f = new Date().getTime();
          }
          a.currentNum++;
          if(a.currentNum === a.num){
            if(a.cb) a.cb();
            //console.log(a.f,'---over');
            Timer.clear(a.id);
          }
        }

      });
      Timer.lastTime = Timer.currentTime;
      Timer.ID = window.requestAnimationFrame(Timer.progress)
    }

    static clear(str){

      let v = -1;
      for(let i =0;i<Timer.timerArr.length;i++){
        let obj = Timer.timerArr[i];
        if(obj.id === str) v = i;
      }

      // if(Array.prototype.findIndex){
      //   v = Timer.timerArr.findIndex(a=>{
      //     return a.id === str;
      //   })
      // }
      // else{
      //   for(let i =0;i<Timer.timerArr.length;i++){
      //     let obj = Timer.timerArr[i];
      //     if(obj.id === str) v = i;
      //   }
      // }

      if(v>-1){
        let obj = Timer.timerArr[v];
        for(let o in obj){
          if(obj.hasOwnProperty(o)){
            delete obj[o];
          }
        }
        Timer.timerArr.splice(v,1);
      }
      if(Timer.timerArr.length ==0 ){
        Timer.isStart = false;
        window.cancelAnimationFrame(Timer.ID);
      }

    }

    static clearAll(){
      Timer.timerArr.length=0;
    }

    static getAnimation(){

      let lastTime = 0;
      let vendors = ['ms', 'moz', 'webkit', 'o'];

      for (let x = 0; x < vendors.length && !window.requestAnimationFrame; ++x) {
        window.requestAnimationFrame = window[vendors[x] + 'RequestAnimationFrame'];
        window.cancelAnimationFrame = window[vendors[x] + 'CancelAnimationFrame'] || window[vendors[x] + 'CancelRequestAnimationFrame'];
      }
      if (!window.requestAnimationFrame) window.requestAnimationFrame = function(callback) {
        let currTime = new Date().getTime();
        let timeToCall = Math.max(0, 16 - (currTime - lastTime));
        var id = window.setTimeout(function() {
          callback(currTime + timeToCall);
        }, timeToCall);
        lastTime = currTime + timeToCall;
        return id;
      };
      if (!window.cancelAnimationFrame) window.cancelAnimationFrame = function(id) {
        clearTimeout(id);
      };
    }
}
Timer.timerArr = [];
Timer.isStart = false;
Timer.t = 0;//时间间隔
Timer.currentTime  = 0;
Timer.lastTime = 0;
Timer.TIME = 0;
Timer.FPS = 0;
Timer.ID = 0;
export default Timer;
