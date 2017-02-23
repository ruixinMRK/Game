/**
 * Created by tudouhu on 2017/2/23.
 */

import 'createjs';
import GameData from '../../manager/GameData';
import NameSpr from '../../common/NameSpr';
import PlaneGame from 'planeDir/PlaneGame';
import UserData from '../../manager/UserData'
import Router from '../../common/socket/Router';
import SocketClient from '../../common/socket/SocketClient';

/**
 * 飞机游戏选择界面
 */
class PlaneGameMI extends createjs.Container{



  constructor() {
    super();
    this.init();
  }

  /**
   * 初始化
   */
  init(){
    //背景
    this.mapS=new createjs.Shape();
    this.mapS.graphics.beginFill('#f0f0f0');
    this.mapS.graphics.drawRect(0,0,GameData.mapW,GameData.mapH);
    this.mapS.graphics.endFill();
    this.addChild(this.mapS);
    //图标
    /**
     * start图标
     * @type {createjs.Sprite}
     */
    this.startS=NameSpr.getInstance().getSpr('gameUI','start');
    this.startS.x=600;
    this.startS.y=600;
    this.addChild(this.startS);
    //文本
    /**
     * 当前玩家用户名
     * @type {createjs.Text}
     */
    this.name1T=new createjs.Text(UserData.id,"bold 18px Arial",'#000000');
    this.name1T.x=400;
    this.name1T.y=400;
    this.addChild(this.name1T);
    /**
     * 匹配玩家用户名
     * @type {createjs.Text}
     */
    this.name2T=new createjs.Text('匹配中',"bold 18px Arial",'#000000');
    this.name2T.x=800;
    this.name2T.y=400;
    this.addChild(this.name2T);
    //事件
    this.addEventListener('click',this.onClick);
    //接受匹配数据
    Router.instance.reg(Router.KPI.matchPVP,this.socketMatchPVP);

    SocketClient.instance.send({KPI:Router.KPI.joinPVP,name:UserData.id});
  }

  //接受服务器的Router.KPI.matchPVP数据 匹配
  socketMatchPVP = (data)=>{
    console.log('接收匹配数据：',data);
    this.name2T.text=data;
  }

  /**
   * 点击事件
   * @param e {Event}
   */
  onClick=(e)=>{
    let targetS=e.target;
    if(targetS==this.startS){

    }

  }





  /**
   * 移除
   */
  remove(){

  }
}
export default PlaneGameMI;
