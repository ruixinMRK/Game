/**
 * Created by tudouhu on 2017/2/23.
 */

import 'createjs';
import GameData from '../../../manager/GameData';
import NameSpr from '../../../common/NameSpr';
import Timer from '../../../common/Timer';
import PlaneGame from '../PlaneGame';
import UserData from '../../../manager/UserData'
import Router from '../../../common/socket/Router';
import MyEvent from '../../../common/MyEvent';
import SocketClient from '../../../common/socket/SocketClient';

/**
 * 飞机游戏选择界面
 */
class PlaneGameMI extends createjs.Container{

  /**
   * pvp游戏
   * @type {PlaneGame}
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
     * 匹配玩家用户名
     * @type {createjs.Text}
     */
    this.name2T=new createjs.Text('玩家：',"bold 18px Arial",'#000000');
    this.name2T.x=800;
    this.name2T.y=400;
    this.addChild(this.name2T);
    /**
     * 匹配提示
     * @type {createjs.Text}
     */
    this.matchT=new createjs.Text('点击开始匹配',"bold 36px Arial",'#000000');
    this.matchT.x=630;
    this.matchT.y=200;
    this.addChild(this.matchT);
    //属性
    /**
     * 倒计时
     * @type {number}
     */
    this.timer=-1;
    //事件
    this.addEventListener('click',this.onClick);
    //接受匹配数据
    Router.instance.reg(Router.KPI.matchPVP,this.socketMatchPVP);
    Router.instance.reg(Router.KPI.planProp,this.socketProp);
    MyEvent.addEvent(MyEvent.ME_MyEvent,this.MyEventF);

  }

  /**
   * 自定义事件返回界面 清除游戏
   * @param data
   */
  MyEventF=(data)=>{
    if(data=='back'){
      SocketClient.instance;
      this.timer=3;
      this.matchT.text='点击开始匹配';
      this.name2T.text='玩家:';
      this.startS.visible=true;
      this.game.remove();
      this.game=null;
    }
  }

  //接受服务器的socketProp数据 飞机道具
  socketProp = (data)=>{
    console.log('接收飞机道具数据：',data);
    GameData.propArr=data.value;
    Router.instance.unreg(Router.KPI.planProp);
  }

  //接受服务器的Router.KPI.matchPVP数据 匹配
  socketMatchPVP = (data)=>{
    console.log('接收匹配数据：',data);
    GameData.room=data.room;
    GameData.gameType='pvp';
    this.name2T.text='玩家：'+data.p;

    this.timer=3;
    this.matchT.text=this.timer;
    Timer.add((e)=>{
      if(this.timer!=-1){
        this.timer--;
        this.matchT.text=this.timer+'秒后进入游戏';
        if(this.timer==0){
          this.createGame();
          this.timer=-1;
        }
      }
    },1000,3);
  }

  /**
   * 点击事件
   * @param e {Event}
   */
  onClick=(e)=>{
    let targetS=e.target;
    if(targetS==this.startS){
      this.startS.visible=false;
      this.matchT.text='匹配中';
      SocketClient.instance.send({KPI:Router.KPI.joinPVP,name:UserData.Name});
    }
    else if(targetS==this.backS){
      MyEvent.dispatchEvent(MyEvent.ME_MyEvent,'pvpback');
    }

  }

  /**
   * 创建游戏
   */
  createGame=()=>{
    if(this.game==null){
      this.game=new PlaneGame();
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
    Router.instance.unreg(Router.KPI.matchPVP);
    Router.instance.unreg(Router.KPI.planProp);
  }
}
export default PlaneGameMI;
