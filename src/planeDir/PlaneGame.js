
/**
 * Created by tudouhu on 2017/2/7.
 */

import 'createjs';
import Timer from '../common/Timer';
import Plane from './Plane';
import EnemyPlane from './EnemyPlane';
import Router from '../common/socket/Router';
import SocketClient from '../common/socket/SocketClient';
import UserData from '../manager/UserData';
/**
 * 飞机大战游戏主类
 */
class PlaneGame extends createjs.Container{


  constructor(){
    super();
    this.init();
  }

  /**
   * 初始化
   */
  init(){
    /**
     * 地图
     */
    this.mapS=new createjs.Shape();
    this.mapS.graphics.beginFill('#D0D0D0');
    this.mapS.graphics.drawRect(0,0,1000,1000);
    this.mapS.graphics.endFill();
    this.addChild(this.mapS);
    //坐标
    for(let x1=0;x1<10;x1++){
      for(let y1=0;y1<10;y1++){

        let txt=new createjs.Text(String(x1*100)+','+String(y1*100),"bold 14px Arial",'#ff0000');
        txt.x=x1*100;
        txt.y=y1*100;
        this.addChild(txt);
      }
    }
    //飞机
    this.plane=new Plane();
    this.plane.Name=UserData.id;
    this.plane.x=100;
    this.plane.y=100;
    this.addChild(this.plane);
    //击中文本
    this.hittxt=new createjs.Text('',"bold 30px Arial",'#000000');
    this.hittxt.x = 100;
    this.hittxt.y = 30;
    this.hittxt.visible=false;
    this.hitText(UserData.id+'加入游戏');
    //ping文本
    this.pingTxt=new createjs.Text('',"bold 18px Arial",'#FFFFFF');
    this.pingTxt.x = 720;
    this.pingTxt.text='ping:';
    //添加键盘事件
    document.addEventListener('keydown',this.onKeyDown);
    document.addEventListener('keyup',this.onKeyUp);
    //添加到舞台
    this.addEventListener('added',this.addInit);
    //帧频
    Timer.add(this.onFrame,30,0);
    //接受移动数据
    Router.instance.reg('planWalk',this.socketPW);
    //接受玩家掉线数据
    Router.instance.reg('goDie',this.socketDie);
    //接受玩家加入数据
    Router.instance.reg('goLive',this.socketLive);
    //接受ping数据
    Router.instance.reg('ping',this.socketPing);

    this.key_A=false;
    this.key_D=false;
    this.key_J=false;

    /**
     * 飞机传输数据
     * @type {PSData}
     */
    this.psd=new PSData();
    /**
     * 敌机
     * @type {{}}
     */
    this.enemyP={};
    /**
     * 敌机数据数组
     * @type {Array}
     */
    this.enemyPDataArr=[];
    /**
     * ping数据发送帧间隔
     * @type {number}
     */
    this.pingF=3;
    /**
     * ping数据发送帧间隔设置
     * @type {number}
     */
    this.pingFSet=3;
    /**
     * 移动数据发送帧间隔 位置矫正
     * @type {number}
     */
    this.moveF=3;
    /**
     * 移动数据发送帧间隔设置 位置矫正
     * @type {number}
     */
    this.moveFSet=3;

    this.currentPingTime = 0;

    //进入游戏发送数据
    this.psd.Name=this.plane.Name;
    this.psd.x=this.plane.x;
    this.psd.y=this.plane.y;
    this.psd.rot=this.plane.rotation;
    UserData.planInfo = PSData.getObj(this.psd);
  }

  /**
   * 添加到舞台
   */
  addInit=()=>{
    this.parent.addChild(this.hittxt);
    this.parent.addChild(this.pingTxt);
  }

  //接受服务器的planWalk数据 移动
  socketPW = (data)=>{
    // console.log('接收移动数据：',data);
    data=PSData.shiftObj(data);
    this.enemyPDataArr.unshift(data);
    // console.log('接收移动数据：',data,data.Name);
  }
  //接受服务器的goDie数据 退出
  socketDie = (data)=>{
    console.log(data.name);
    this.removeChild(this.enemyP[data.name]);
    delete this.enemyP[data.name];
    this.hitText(data.name+'退出了游戏');
    // console.log('接收退出数据：',data,data.Name);
  }
  //接受服务器的goLive数据 加入
  socketLive = (data)=>{
    console.log('接收加入数据：',data);
    if(data.name!=null){
      this.psd.Name=this.plane.Name;
      this.psd.x=this.plane.x;
      this.psd.y=this.plane.y;
      this.psd.rot=this.plane.rotation;
      UserData.planInfo = PSData.getObj(this.psd);
      SocketClient.instance.send({KPI:'goLive',data:UserData.planInfo});
      //创建飞机
      let obj=PSData.shiftObj(data.data);
      this.enemyP[obj.Name]=new EnemyPlane();
      this.enemyP[obj.Name].x=obj.x;
      this.enemyP[obj.Name].y=obj.y;
      this.enemyP[obj.Name].rotation=obj.rot;
      this.enemyP[obj.Name].Name=obj.Name;
      this.addChild(this.enemyP[obj.Name]);
      this.hitText(data.name+'加入了游戏');
    }
    else {
      //创建飞机
      let obj=PSData.shiftObj(data.data);
      if(this.enemyP[obj.Name]!=null)return;
      this.enemyP[obj.Name]=new EnemyPlane();
      this.enemyP[obj.Name].x=obj.x;
      this.enemyP[obj.Name].y=obj.y;
      this.enemyP[obj.Name].rotation=obj.rot;
      this.enemyP[obj.Name].Name=obj.Name;
      this.addChild(this.enemyP[obj.Name]);
    }
  }
  //接受服务器的ping数据 延迟
  socketPing = (data)=>{
    // console.log('接收延迟数据：',data);

    if(data.t < this.currentPingTime) return;

    let t=new Date().getTime()-data.t;
    if(t<0) return;
    if(t<100){
      this.pingFSet=3;
    }
    else{
      this.pingFSet=1;
    }
    this.pingTxt.text='ping:'+t;
    this.currentPingTime = data.t;

  }


  /**
   * 按键按下
   * @param e
   */
  onKeyDown=(e)=>{
    let keyCode=e.keyCode;
    if(keyCode==65){//A
      this.key_A=true;
    }
    else if(keyCode==68){//D
      this.key_D=true;
    }
    else if(keyCode==74){//J
      this.key_J=true;
    }
  }

  /**
   * 按键释放
   * @param e
   */
  onKeyUp=(e)=>{
    let keyCode=e.keyCode;
    if(keyCode==65){//A
      this.key_A=false;
    }
    else if(keyCode==68){//D
      this.key_D=false;
    }
    else if(keyCode==74){//J
      this.key_J=false;
    }

  }

  /**
   * 帧频函数
   * @param e
   */
  onFrame=(e)=>{
    this.enemyPDataDispose();

    if(this.key_A){
      this.plane.planeRot(-this.plane.rotationSpeed);
    }
    else if(this.key_D){
      this.plane.planeRot(this.plane.rotationSpeed);
    }
    if(this.key_J){
      this.plane.attack();
      this.psd.attack=1;
      PlaneGame.send=true;
    }
    this.plane.onFrame(this);

    this.planeScroll();

    this.sendData();
    this.sendPing();
    PlaneGame.send=false;
  }

  /**
   * 发送ping数据
   */
  sendPing=()=>{
    this.pingF--;
    if(this.pingF<=0){
      this.pingF=this.pingFSet;
      let obj={};
      obj.KPI='ping';
      obj.t=new Date().getTime();//获取10秒的毫秒
      SocketClient.instance.send(obj);
    }

  }

  /**
   * 发送状态数据
   */
  sendData=()=>{
    this.moveF--;
    if(this.moveF<=0){
      this.moveF=this.moveFSet;
      PlaneGame.send=true;
    }
    if(PlaneGame.send==false) return;
    this.psd.Name=this.plane.Name;
    this.psd.x=this.plane.x;
    this.psd.y=this.plane.y;
    this.psd.rot=this.plane.rotation;
    this.psd.time=new Date().getTime();

    SocketClient.instance.send(PSData.getObj(this.psd));
    this.psd.init();
  }

  /**
   * 敌机数据处理
   */
  enemyPDataDispose=()=>{
    //敌机数据赋值
    for(let i=this.enemyPDataArr.length-1;i>=0;i--){
      let obj=this.enemyPDataArr[i];
      if(this.enemyP[obj.Name]!=null){
        let p=this.enemyP[obj.Name];
        p.dataDispose(obj);
        // p.x=obj.x;
        // p.y=obj.y;
        // p.rotation=obj.rot;
        // if(obj.attack==1){
        //   p.attack();
        // }
        //碰撞数据处理
        for(let s in obj.hitObj){
          this.hitText(obj.Name+'的子弹'+s+'击中'+obj.hitObj[s]);
          if(this.plane.Name==obj.hitObj[s]){
            this.plane.remove();
            PlaneGame.send=true;
          }
          else
            this.enemyP[obj.hitObj[s]].remove();
          p.bulletArr.map((b)=>{
            if(b.bulletId==s){
              b.remove();
            }
          })
        }
      }
    }
    this.enemyPDataArr=[];
    //敌机帧频
    for(let s in this.enemyP){
      if(this.enemyP[s].mc==null){
        delete this.enemyP[s];
      }
      else {
        this.enemyP[s].onFrame();
      }

    }
  }



  /**
   * 飞机滚屏
   */
  planeScroll=()=>{
    let spx=this.x+this.plane.x;
    let spy=this.y+this.plane.y;
    let rect={t:100,b:200,l:100,r:700};

    if(spx>rect.r){
      this.x-=spx-rect.r;
      if(this.x<-(PlaneGame.mapW-PlaneGame.stageW))this.x=-(PlaneGame.mapW-PlaneGame.stageW);
    }
    else if(spx<rect.l){
      this.x+=rect.l-spx;
      if(this.x>0)this.x=0;
    }

    if(spy>rect.b){
      this.y-=spy-rect.b;
      if(this.y<-(PlaneGame.mapH-PlaneGame.stageH))this.y=-(PlaneGame.mapH-PlaneGame.stageH);
    }
    else if(spy<rect.t){
      this.y+=rect.t-spy;
      if(this.y>0)this.y=0;
    }
  }

  /**
   * 显示击中
   * @param str
   */
  hitText(str){
    this.hittxt.visible=true;
    this.hittxt.text=str;
    Timer.add(()=>{
      if(str==this.hittxt.text)
        this.hittxt.visible=false;
    },3000,1);
  }





}
/**
 * 是否需要发送数据
 * @type {boolean}
 */
PlaneGame.send=false;
/**
 * 舞台宽
 * @type {number}
 */
PlaneGame.stageW=800;
/**
 * 舞台高
 * @type {number}
 */
PlaneGame.stageH=300;
/**
 * 地图宽
 * @type {number}
 */
PlaneGame.mapW=1000;
/**
 * 地图高
 * @type {number}
 */
PlaneGame.mapH=1000;

export default PlaneGame;

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
    //数据名
    this.KPI='planWalk';
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
   * 获得将PSData解析字符串最少的obj
   * @param psdata psdata数据
   * @returns {{}}
   */
  static getObj=(psdata)=>{
    let obj={};
    obj[PSData.PSDataIndex['Name']]=psdata.Name;
    obj[PSData.PSDataIndex['KPI']]=psdata.KPI;
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

  /**
   * 将一个obj转换成PSData
   * @param obj
   */
  static shiftObj(obj){
    let pd=new PSData();
    for(let s in obj){
      pd[PSData.ObjIndex[s]]=obj[s];
    }
    return pd;
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
PSData.PSDataIndex={};
PSData.PSDataIndex.Name='n';
PSData.PSDataIndex.KPI='KPI';
PSData.PSDataIndex.x='x';
PSData.PSDataIndex.y='y';
PSData.PSDataIndex.rot='r';
PSData.PSDataIndex.time='t';
PSData.PSDataIndex.attack='a';
PSData.PSDataIndex.hitObj='h';












