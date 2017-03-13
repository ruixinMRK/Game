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
    this.startS=NameSpr.getNameSpr(this,'gameUI','start',600,600);
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
    this.name1T=NameSpr.getText(this,'玩家：'+UserData.Name,"bold 18px Arial",'#000000',400,400);
    /**
     * 匹配玩家用户名
     * @type {createjs.Text}
     */
    this.name2T=NameSpr.getText(this,'玩家：',"bold 18px Arial",'#000000',800,400);
    /**
     * 匹配提示
     * @type {createjs.Text}
     */
    this.matchT=NameSpr.getText(this,'点击开始匹配',"bold 36px Arial",'#000000',630,200);
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
    MyEvent.addEvent(MyEvent.ME_MyEvent,this.MyEventF);

  }
  /**
   * 自定义事件返回界面 清除游戏
   * @param data
   */
  MyEventF=(data)=>{
    if(data=='back'){
      SocketClient.instance.closeClient();
      this.timer=3;
      this.matchT.text='点击开始匹配';
      this.name2T.text='玩家:';
      this.startS.visible=true;
      if(this.game){
        this.game.remove();
        this.game=null;
      }
    }
  }


  //接受服务器的Router.KPI.matchPVP数据 匹配
  socketMatchPVP = (data)=>{
    console.log('接收匹配数据：',data);
    GameData.room=data.room;
    GameData.AIPlaneArr=data.ai;
    GameData.propArr=data.prop;
    this.name2T.text='玩家：'+data.p;

    this.timer=3;
    this.matchT.text=this.timer+'秒后进入游戏';
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
    MyEvent.removeEvent(MyEvent.ME_MyEvent,this.MyEventF);
  }
}
export default PlaneGameMI;
