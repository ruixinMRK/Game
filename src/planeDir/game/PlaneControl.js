/**
 * Created by tudouhu on 2017/2/18.
 */

import 'createjs';
import Timer from '../../common/Timer';
import HeroPlane from './HeroPlane';
import EnemyPlane from './EnemyPlane';
import AIPlane from './AIPlane';
import Router from '../../common/socket/Router';
import SocketClient from '../../common/socket/SocketClient';
import UserData from '../../manager/UserData';
import GameData from '../../manager/GameData';
import PSData from '../../manager/PSData';
import GameOverIf from './interface/GameOverIf';
import PlaneControlB from '../gameBase/PlaneControlB';

/**
 * 飞机管理
 */
class PlaneControl extends PlaneControlB{

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

    //飞机
    this.HeroPlane=new HeroPlane();
    this.HeroPlane.Name=UserData.Name;
    this.HeroPlane.x=100;
    this.HeroPlane.y=100;
    this.addChild(this.HeroPlane);
    //创建AI飞机
    let aiP=GameData.AIPlaneArr;
    for(let i=aiP.length-1;i>=0;i--){
      let obj=aiP[i];
      let p=new AIPlane();
      p.Name=obj.id;
      p.x=obj.x;
      p.y=obj.y;
      p.rotation=obj.r;
      p.life=obj.hp;
      this.addChild(p);
      this.AIP[obj.id]=p;
    }
    //事件
    Router.instance.reg(Router.KPI.resultPVP,this.socketResultPVP);
    //发送加入数据
    this.sendGoLiveData(true);
  }
  //接受服务器的resultPVP数据 结果
  socketResultPVP = (data)=>{
    console.log('接收游戏结果数据：',data);
    if(this.gameOverIf==null){
      this.gameOverIf=new GameOverIf();
      this.gameOverIf.setResultText(data.name);
      GameData.stage.addChild(this.gameOverIf);
    }
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
    if(this.HeroPlane.visible&&(this.HeroPlane.gasoline<=0||this.HeroPlane.life<=0)){
      SocketClient.instance.send({KPI:Router.KPI.resultPVP,name:UserData.Name,room:GameData.room});
      this.HeroPlane.visible=false;
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
    super.remove();
    Router.instance.unreg(Router.KPI.resultPVP);
  }



}
export default PlaneControl;
