/**
 * Created by tudouhu on 2017/2/23.
 */

import 'createjs';
import GameData from '../../../manager/GameData';
import NameSpr from '../../../common/NameSpr';
import Timer from '../../../common/Timer';
import PlaneGame2 from '../PlaneGame2';
import UserData from '../../../manager/UserData'
import Router from '../../../common/socket/Router';
import MyEvent from '../../../common/MyEvent';
import SocketClient from '../../../common/socket/SocketClient';

/**
 * 飞机游戏选择界面
 */
class PlaneGame2MI extends createjs.Container{

  /**
   * 多人游戏
   * @type {PlaneGame2}
   */
  game=null;

  constructor() {
    super();
    this.init();
  }

  /**
   * 初始化
   */
  init(){
    SocketClient.instance;
    //背景
    this.mapS=new createjs.Shape();
    this.mapS.graphics.beginFill('#f0f0f0');
    this.mapS.graphics.drawRect(0,0,GameData.mapW,GameData.mapH);
    this.mapS.graphics.endFill();
    this.addChild(this.mapS);
    this.titleT=NameSpr.getText(this,'多人',"bold 24px Arial",'#000000',600,0);
    //图标
    /**
     * start图标
     * @type {createjs.Sprite}
     */
    this.startS=NameSpr.getInstance().getSpr('gameUI','start');
    this.startS.x=600;
    this.startS.y=600;
    this.addChild(this.startS);
    /**
     * 返回图标
     * @type {createjs.Sprite}
     */
    this.backS=NameSpr.getNameSpr(this,'gameUI','overIf_back')
    //文本
    /**
     * 当前玩家用户名
     * @type {createjs.Text}
     */
    this.name1T=new createjs.Text('玩家：'+UserData.Name,"bold 18px Arial",'#000000');
    this.name1T.x=400;
    this.name1T.y=400;
    this.addChild(this.name1T);
    /**
     * 匹配提示
     * @type {createjs.Text}
     */
    this.matchT=new createjs.Text('点击开始多人匹配',"bold 36px Arial",'#000000');
    this.matchT.x=530;
    this.matchT.y=200;
    this.addChild(this.matchT);
    //属性
    //事件
    this.addEventListener('click',this.onClick);
    //接受匹配数据
    Router.instance.reg(Router.KPI.matchNOR,this.socketMatchNOR);
    MyEvent.addEvent(MyEvent.ME_MyEvent,this.MyEventF);

  }

  //接受服务器的Router.KPI.matchNOR数据 匹配
  socketMatchNOR = (data)=>{
    console.log('接收多人匹配数据：',data);
    GameData.room=data.room;
    GameData.AIPlaneArr=data.ai;
    GameData.propArr=data.prop;
    this.createGame();
  }

  /**
   * 自定义事件返回界面 清除游戏
   * @param data
   */
  MyEventF=(data)=>{
    if(data=='back'){
      SocketClient.instance.closeClient();
      this.startS.visible=true;
      this.game.remove();
      this.game=null;
    }
  }


  /**
   * 点击事件
   * @param e {Event}
   */
  onClick=(e)=>{
    let targetS=e.target;
    if(targetS==this.startS){
      SocketClient.instance.send({KPI:Router.KPI.joinNOR,name:UserData.Name});
    }
    else if(targetS==this.backS){
      MyEvent.dispatchEvent(MyEvent.ME_MyEvent,'norback');
    }

  }

  /**
   * 创建游戏
   */
  createGame=()=>{
    if(this.game==null){
      this.game=new PlaneGame2();
      this.addChild(this.game);
    }
  }



  /**
   * 移除
   */
  remove(){
    if(this.parent!=null)
      this.parent.removeChild(this);
    this.removeEventListener('click',this.onClick);
  }
}
export default PlaneGame2MI;
