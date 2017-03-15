
/**
 * Created by tudouhu on 2017/2/7.
 */

import 'createjs';
import Timer from '../../common/Timer';
import HeroPlane from './HeroPlane';
import EnemyPlane from './EnemyPlane';
import Router from '../../common/socket/Router';
import SocketClient from '../../common/socket/SocketClient';
import UserData from '../../manager/UserData';
import GameData from '../../manager/GameData';
import PSData from '../../manager/PSData';
import PlaneControl from './PlaneControl';
import DataShow from '../interface/DataShow';
import PlaneMap from './PlaneMap';
import MyEvent from '../../common/MyEvent';
import GameDRI from './interface/GameDRI';
import PlaneGameB from '../gameBase/PlaneGameB';

/**
 * 飞机大战游戏PVP模式
 */
class PlaneGame extends PlaneGameB{

  /**
   * 飞机地图
   * @type {PlaneMap}
   */
  map=null;
  /**
   * FPS ping显示
   * @type {DataShow}
   */
  dataShow=null;
  /**
  * 飞机管理
  * @type {PlaneControl}
  */
  planeControl=null;
  /**
   * 退出房间界面
   * @type {GameDRI}
   */
  gameDRI=null;

  constructor(){
    super();
    this.init();
  }

  /**
   * 初始化
   */
  init(){
    //地图
    this.map=new PlaneMap();
    this.addChild(this.map);
    GameData.planeMap=this.map;
    //飞机管理
    this.planeControl=new PlaneControl();
    this.addChild(this.planeControl);
    GameData.planeControl=this.planeControl;
    //数据显示
    this.dataShow=new DataShow();
    GameData.dataShow=this.dataShow;
    Router.instance.reg(Router.KPI.destroyPvpRoom,this.socketDestroyPR);
    Router.instance.reg(Router.KPI.PVPTime,this.socketPVPTime);
  }

  //接受服务器的destroyPvpRoom数据 退出房间
  socketDestroyPR = (data)=>{
    console.log('接收退出房间数据：',data);
    if(this.gameDRI==null){
      this.gameDRI=new GameDRI();
      GameData.stage.addChild(this.gameDRI);
    }
  }


  //接受服务器的PVPTime数据 游戏时间
  socketPVPTime = (data)=>{
    // console.log('接收游戏时间数据：',data);
    GameData.dataShow.gameTimeTxt(data.time);
    if(data.time==0){
       if(this.gameDRI==null){
         this.gameDRI=new GameDRI();
         GameData.stage.addChild(this.gameDRI);
       }
     }
  }
  /**
   * 移除
   */
  remove(){
    super.remove();
    if(this.gameDRI){
      this.gameDRI.remove();
      this.gameDRI=null;
    }
  }

}


export default PlaneGame;
