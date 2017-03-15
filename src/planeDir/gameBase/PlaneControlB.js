/**
 * Created by tudouhu on 2017/3/14.
 */
import 'createjs';
import Timer from '../../common/Timer';
import Router from '../../common/socket/Router';
import SocketClient from '../../common/socket/SocketClient';
import UserData from '../../manager/UserData';
import GameData from '../../manager/GameData';
import PSData from '../../manager/PSData';

/**
 * 飞机大战游戏飞机管理基类
 */
class PlaneControlB extends createjs.Container{

  /**
   * 飞机
   * @type {HeroPlane}
   */
  HeroPlane=null;

  constructor() {
    super();


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
     * AI飞机
     * @type {{}}
     */
    this.AIP={};
    /**
     * AI飞机数据数组
     * @type {Array}
     */
    this.AIPDataArr=[];
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

    //事件
    Router.instance.reg(Router.KPI.planeWalk,this.socketPW);
    Router.instance.reg(Router.KPI.planeLive,this.socketLive);
    Router.instance.reg(Router.KPI.AI,this.socketAI);
    Router.instance.reg(Router.KPI.AiHit,this.socketAiHit);


  }

  //接受服务器的planWalk数据 移动
  socketPW = (data)=>{
    // console.log('接收移动数据：',data);
    data=PSData.getObj(data);
    this.enemyPDataArr.unshift(data);
  }


  //接受服务器的goLive数据 加入
  socketLive = (data)=>{
    console.log('接收加入数据：',data);
    //接收数据存在name表示有新用户加入游戏（发送不带name数据人新用户创建飞机），不带name表示已经存在游戏中
    if(data.name!=null){
      //发送存在游戏中加入数据
      this.sendGoLiveData();
      this.createEP(data.data);
      GameData.dataShow.hitText(data.name+'加入了游戏');
    }
    else {
      this.createEP(data.data);
    }
  }

  //接受服务器的AI数据 AI
  socketAI = (data)=>{
    // console.log('接收AI数据：',data);
    this.AIPDataArr=this.AIPDataArr.concat(data.value);
  }

  //接受服务器的AiHit数据 AiHit
  socketAiHit = (data)=>{
    // console.log('接收AI碰撞数据：',data);
    if(data.type===0){
      //AI攻击玩家
      let p=this.AIP[data.name];
      let ep;
      for(let s in data.hit){
        GameData.dataShow.hitText('AI'+data.name+'击中玩家'+data.hit[s]);
        if(data.hit[s]==UserData.Name)
          ep=this.HeroPlane;
        else
          ep=this.enemyP[data.hit[s]];
        //子弹
        let b=p.bulletFind(s);
        if(b!=null){
          ep.life-=b.atk;
          // if(ep.life<=0&&this.HeroPlane.Name==obj.hitObj[s]){
          // }
          b.remove();
        }
      }
    }
    else if(data.type===1){
      //玩家攻击AI
      let p;
      if(data.name==UserData.Name)
        p=this.HeroPlane;
      else
        p=this.enemyP[data.name];
      let ep;
      for(let s in data.hit){
        ep=this.AIP[data.hit[s]];
        GameData.dataShow.hitText('玩家'+data.name+'击中AI'+data.hit[s]);
        //子弹
        let b=p.bulletFind(s);
        if(b!=null){
          if(ep.life>0){
            ep.life-=b.atk;
            GameData.send=true;
            this.psd.AI[ep.Name]=ep.life;
          }
          b.remove();
        }
      }
    }
  }

  /**
   * 加入游戏发送数据
   * @param live 默认false true=第一次加入游戏 false=已经在游戏中把数据发送给新加入的用户
   */
  sendGoLiveData(live=false){
    let od={};
    od.n=this.HeroPlane.Name;
    od.x=this.HeroPlane.x;
    od.y=this.HeroPlane.y;
    od.r=this.HeroPlane.rotation;
    if(live)
      SocketClient.instance.send({KPI:Router.KPI.planeLive,name:UserData.Name,data:od,room:GameData.room});
    else
      SocketClient.instance.send({KPI:Router.KPI.planeLive,data:od,room:GameData.room});
  }

  /**
   * 发送状态数据
   */
  sendData=()=>{
    this.moveF--;
    if(this.moveF<=0){
      this.moveF=this.moveFSet;
      GameData.send=true;
    }
    if(GameData.send==false||this.HeroPlane.visible==false) return;
    this.psd.Name=this.HeroPlane.Name;
    this.psd.room=GameData.room;
    this.psd.life=this.HeroPlane.life;
    this.psd.x=this.HeroPlane.x;
    this.psd.y=this.HeroPlane.y;
    this.psd.rot=this.HeroPlane.rotation;
    this.psd.time=new Date().getTime();

    SocketClient.instance.send(PSData.getObj(this.psd));
    this.psd.init();
  }



  /**
   * AI飞机数据处理
   */
  AIPDataDispose=()=>{
    //AI飞机数据赋值
    for(let i=this.AIPDataArr.length-1;i>=0;i--){
      let obj=this.AIPDataArr[i];
      if(this.AIP[obj.id]!=null){
        let p=this.AIP[obj.id];
        p.dataDispose(obj);
      }
    }
    this.AIPDataArr=[];
    //AI飞机帧频
    for(let s in this.AIP){
      if(this.AIP[s].mc==null){
        delete this.AIP[s];
      }
      else {
        this.AIP[s].onFrame();
      }
    }
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
        //碰撞数据处理
        for(let s in obj.hitObj){
          let ep;
          if(this.HeroPlane.Name==obj.hitObj[s]){
            ep=this.HeroPlane;
            GameData.send=true;
          }
          else{
            ep=this.enemyP[obj.hitObj[s]];
          }
          //子弹
          let b=p.bulletFind(s);
          if(b!=null){
            ep.life-=b.atk;
            // if(ep.life<=0&&this.HeroPlane.Name==obj.hitObj[s]){
            // }
            b.remove();
          }

        }
      }
    }
    this.enemyPDataArr=[];
    // //敌机帧频
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
   * 移除
   */
  remove(){
    if(this.parent!=null)
      this.parent.removeChild(this);
    Router.instance.unreg(Router.KPI.planeWalk);
    Router.instance.unreg(Router.KPI.planeLive);
    Router.instance.unreg(Router.KPI.AI);
    Router.instance.unreg(Router.KPI.AiHit);
    if(this.gameOverIf){
      this.gameOverIf.remove();
      this.gameOverIf=null;
    }
    this.HeroPlane.remove();
    for(let s in this.enemyP) {
      this.enemyP[s].remove();
    }
    this.enemyP=null;
  }



}


export default PlaneControlB;