/**
 * Created by tudouhu on 2017/2/18.
 */

import '../vendors/createjs';
import HeroPlaneNOR from './HeroPlaneNOR';
import EnemyPlaneNOR from './EnemyPlaneNOR';
import Router from '../common/socket/Router';
import SocketClient from '../common/socket/SocketClient';
import MyEvent from '../common/MyEvent';
import UserData from '../manager/UserData';
import GameData from '../manager/GameData';
import PSData from '../manager/PSData';
import GameNOROverIf from './interface/GameNOROverIf';
import AIPlaneNOR from './AIPlaneNOR';
import PlaneControlB from '../gameBase/PlaneControlB';

/**
 * 飞机管理
 */
class PlaneControlNOR extends PlaneControlB{

  /**
   * 结束界面
   * @type {GameNOROverIf}
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
    //飞机
    this.HeroPlane=new HeroPlaneNOR();
    this.HeroPlane.Name=UserData.Name;
    this.HeroPlane.x=100;
    this.HeroPlane.y=100;
    this.addChild(this.HeroPlane);

    //创建AI飞机
    let aiP=GameData.AIPlaneArr;
    for(let i=aiP.length-1;i>=0;i--){
      let obj=aiP[i];
      let p=new AIPlaneNOR();
      p.Name=obj.id;
      p.x=obj.x;
      p.y=obj.y;
      p.rotation=obj.r;
      p.life=obj.hp;
      this.addChild(p);
      this.AIP[obj.id]=p;
    }
    //事件
    Router.instance.reg(Router.KPI.planeDie,this.socketDie);
    Router.instance.reg(Router.KPI.NorTime,this.socketNorTime);
    MyEvent.addEvent(MyEvent.ME_MyEvent,this.MyEventF);
    //发送加入数据
    this.sendGoLiveData(true);

  }

  /**
   * 自定义事件移除 复活
   * @param data
   */
  MyEventF=(data)=>{
    if(data=='rebirth'){
      SocketClient.instance.send({KPI:Router.KPI.planeDie,name:UserData.Name,type:0,room:GameData.room});
      this.HeroPlane.rebirth();
    }
  }
  //接受服务器的goDie数据 死亡复活
  socketDie = (data)=>{
    console.log('接收死亡复活数据：',data);
    if(data.type==-1){//掉线
      this.enemyP[data.name].remove();
      delete this.enemyP[data.name];
      GameData.dataShow.hitText(data.name+'掉线了');
    }
    else if(data.type==0){//复活
      this.enemyP[data.name].visible=true;
      this.enemyP[data.name].rebirth();
      GameData.dataShow.hitText(data.name+'复活了');
    }
    else if(data.type==1){//击杀
      this.enemyP[data.name].visible=false;
      GameData.dataShow.hitText(data.epn+'击杀'+data.name);
      this.HeroPlane.setKillAssist(data.attacker);
    }
    else if(data.type==2){//相撞
      this.enemyP[data.name].visible=false;
    }
    else if(data.type==3){//坠机
      this.enemyP[data.name].visible=false;
      GameData.dataShow.hitText(data.name+'坠机了');
    }
  }
  //接受服务器的NorTime数据 游戏时间
  socketNorTime = (data)=>{
    // console.log('接收游戏时间数据：',data);
    GameData.dataShow.gameTimeTxt(data.time);
    if(data.time==0){
      if(this.gameOverIf==null){
        this.gameOverIf=new GameNOROverIf();
        GameData.stage.addChild(this.gameOverIf);
        this.gameOverIf.showOver(data.value);
      }
      else
        this.gameOverIf.showOver(data.value);
    }
  }


  /**
   *创建敌机
   * @param data
   */
  createEP(data){
    let obj=PSData.getObj(data);
    if(this.enemyP[obj.Name]!=null)return;
    this.enemyP[obj.Name]=new EnemyPlaneNOR();
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
    if(this.HeroPlane.visible&&(this.HeroPlane.gasoline<=0||this.HeroPlane.life<=0)){
      if(this.gameOverIf==null){
        this.gameOverIf=new GameNOROverIf();
        GameData.stage.addChild(this.gameOverIf);
        this.gameOverIf.show();
      }
      else if(this.gameOverIf.visible==false)
        this.gameOverIf.show();
      this.HeroPlane.visible=false;
      if(this.HeroPlane.gasoline<=0)
        SocketClient.instance.send({KPI:Router.KPI.planeDie,name:UserData.Name,type:3,room:GameData.room});
    }

    this.AIPDataDispose();
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
          //子弹
          let b=p.bulletFind(s);
          if(b!=null){
            if(ep.life>0){
              ep.life-=b.atk;
              if(this.HeroPlane.Name==obj.hitObj[s]){
                ep.setAttacker(p.Name);
                if(ep.life<=0){
                  let arr=ep.getAttacker(p.Name);
                  //发送死亡和击杀助攻
                  SocketClient.instance.send({KPI:Router.KPI.planeDie,name:UserData.Name,epn:obj.Name,type:1,
                    attacker:arr,room:GameData.room});
                }
              }
            }
            b.remove();
          }
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
    super.remove();
    MyEvent.removeEvent(MyEvent.ME_MyEvent,this.MyEventF);
    Router.instance.unreg(Router.KPI.planeDie);
    Router.instance.unreg(Router.KPI.planeLive);
  }


}
export default PlaneControlNOR;
