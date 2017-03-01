/**
 * Created by tudouhu on 2017/2/18.
 */

import 'createjs';
import Timer from '../../common/Timer';
import HeroPlane from '../HeroPlane';
import EnemyPlane from '../EnemyPlane';
import Router from '../../common/socket/Router';
import SocketClient from '../../common/socket/SocketClient';
import UserData from '../../manager/UserData';
import GameData from '../../manager/GameData';
import PSData from '../../manager/PSData';
import GameOverIf from './interface/GameOverIf';

/**
 * 飞机管理
 */
class PlaneControl extends createjs.Container{

  /**
   * 结束界面
   * @type {GameOverIf}
   */
  gameOverIf=null;

  constructor() {
    super();
    this.init();

  }

  /**
   * 初始化
   */
  init() {

    //接受移动数据
    Router.instance.reg(Router.KPI.planeWalk,this.socketPW);
    //接受玩家掉线数据
    Router.instance.reg(Router.KPI.planeDie,this.socketDie);
    //接受玩家加入数据
    Router.instance.reg(Router.KPI.planeLive,this.socketLive);
    //飞机
    this.HeroPlane=new HeroPlane();
    this.HeroPlane.Name=UserData.Name;
    this.HeroPlane.x=100;
    this.HeroPlane.y=100;
    this.addChild(this.HeroPlane);
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
     * 移动数据发送帧间隔 位置矫正
     * @type {number}
     */
    this.moveF=3;
    /**
     * 移动数据发送帧间隔设置 位置矫正
     * @type {number}
     */
    this.moveFSet=3;

    //进入游戏发送数据
    let od={};
    od.n=this.HeroPlane.Name;
    od.x=this.HeroPlane.x;
    od.y=this.HeroPlane.y;
    od.r=this.HeroPlane.rotation;

    SocketClient.instance.send({KPI:Router.KPI.planeLive,name:UserData.Name,data:od,room:GameData.room});
  }

  //接受服务器的planWalk数据 移动
  socketPW = (data)=>{
    // console.log('接收移动数据：',data);
    data=PSData.getObj(data);
    this.enemyPDataArr.unshift(data);
    // console.log('接收移动数据：',data,data.Name);
  }
  //接受服务器的goDie数据 退出
  socketDie = (data)=>{
    console.log('接收退出数据：',data);
    if(data.type==0){//复活
      this.enemyP[data.name].visible=true;
      this.enemyP[data.name].rebirth();
      GameData.dataShow.hitText(data.name+'复活了');
    }
    else if(data.type==1){//击杀
      this.enemyP[data.name].visible=false;
      GameData.dataShow.hitText(data.epn+'击杀'+data.name);
    }
    else if(data.type==2){//相撞
      this.enemyP[data.name].visible=false;
    }
    else if(data.type==3){//坠机
      this.enemyP[data.name].visible=false;
      GameData.dataShow.hitText(data.name+'坠机了');
    }
    // console.log('接收退出数据：',data,data.Name);
  }
  //接受服务器的goLive数据 加入
  socketLive = (data)=>{
    console.log('接收加入数据：',data);
    if(data.name!=null){
      let od={};
      od.n=this.HeroPlane.Name;
      od.x=this.HeroPlane.x;
      od.y=this.HeroPlane.y;
      od.r=this.HeroPlane.rotation;
      SocketClient.instance.send({KPI:Router.KPI.planeLive,data:od,room:GameData.room});
      this.createEP(data.data);
      GameData.dataShow.hitText(data.name+'加入了游戏');
    }
    else {
      this.createEP(data.data);
    }
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
   *创建敌机
   * @param data
   */
  createEP(data){
    let obj=PSData.getObj(data);
    if(this.enemyP[obj.Name]!=null)return;
    this.enemyP[obj.Name]=new EnemyPlane();
    this.enemyP[obj.Name].x=obj.x;
    this.enemyP[obj.Name].y=obj.y;
    this.enemyP[obj.Name].rotation=obj.rot;
    this.enemyP[obj.Name].Name=obj.Name;
    this.addChild(this.enemyP[obj.Name]);
  }


  /**
   * 帧频函数
   * @param e
   */
  onFrame=(e)=>{
    if(this.visible==false) return;
    if(this.HeroPlane.gasoline<=0||this.HeroPlane.life<=0){
      if(this.gameOverIf==null){
        this.gameOverIf=new GameOverIf();
        GameData.stage.addChild(this.gameOverIf);
      }
      else if(this.gameOverIf.visible==false)
        this.gameOverIf.visible=true;
      this.HeroPlane.visible=false;
      if(this.HeroPlane.gasoline<=0)
        SocketClient.instance.send({KPI:Router.KPI.planeDie,name:UserData.Name,type:3,room:GameData.room});
    }

    this.enemyPDataDispose();

    this.HeroPlane.onFrame(this);
    this.sendData();
    GameData.send=false;
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
          p.bulletArr.map((b)=>{
            if(b.bulletId==s){
              if(ep.life>0){
                ep.life-=b.atk;
                if(ep.life<=0&&this.HeroPlane.Name==obj.hitObj[s]){
                  SocketClient.instance.send({KPI:Router.KPI.planeDie,name:UserData.Name,epn:obj.Name,type:1,room:GameData.room});
                }
              }
              b.remove();
            }
          });

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
   * 移除
   */
  remove(){
    if(this.parent!=null)
      this.parent.removeChild(this);
    Router.instance.unreg(Router.KPI.planeWalk);
    Router.instance.unreg(Router.KPI.planeDie);
    Router.instance.unreg(Router.KPI.planeLive);
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
export default PlaneControl;