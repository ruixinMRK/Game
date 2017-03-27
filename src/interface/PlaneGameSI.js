/**
 * Created by tudouhu on 2017/2/22.
 */


import '../vendors/../vendors/createjs';
import GameData from '../manager/GameData';
import UserData from '../manager/UserData';
import NameSpr from '../common/NameSpr';
import MyEvent from '../common/MyEvent';
import PlaneGameMI from '../gamePVP/interface/PlaneGameMI';
import PlaneGameNORMI from '../gameNOR/interface/PlaneGameNORMI';
import GameNOROverIf from '../gameNOR/interface/GameNOROverIf';
import SocketClient from '../common/socket/SocketClient';
import ShopI from './ShopI';

/**
 * 飞机游戏开始界面
 */
class PlaneGameSI extends createjs.Container{

  /**
   * pvp选择界面
   * @type {PlaneGameMI}
   */
  planeGameMI=null;
  /**
   * 多人选择界面
   * @type {PlaneGameNORMI}
   */
  planeGame2MI=null;

  constructor() {
    super();
    this.init();
  }

  /**
   * 初始化
   */
  init(){
    //BGM
    // createjs.Sound.play('s_gameBGM','none',0,0,-1);
    //背景
    this.mapS=new createjs.Shape();
    this.mapS.graphics.beginFill('#D0D0D0');
    this.mapS.graphics.drawRect(0,0,GameData.mapW,GameData.mapH);
    this.mapS.graphics.endFill();
    this.addChild(this.mapS);
    //图标
    /**
     * 仓库图标
     * @type {createjs.Sprite}
     */
    this.warehouseS=NameSpr.getNameSpr(this,'gameUI','warehouse',540,668);
    /**
     * 商店图标
     * @type {createjs.Sprite}
     */
    this.shopS=NameSpr.getNameSpr(this,'gameUI','shop',650,668);
    /**
     * 多人图标
     * @type {createjs.Sprite}
     */
    this.peopleS=NameSpr.getNameSpr(this,'gameUI','people',480,200);
    /**
     * pvp图标
     * @type {createjs.Sprite}
     */
    this.pvpS=NameSpr.getNameSpr(this,'gameUI','pvp',650,200);

    //文本
    /**
     * 用户名文本
     * @type {createjs.Text}
     */
    this.nameT=NameSpr.getText(this,'',"bold 24px Arial",'#000000',0,0);
    /**
     * 等级文本
     * @type {createjs.Text}
     */
    this.leveT=NameSpr.getText(this,'',"bold 24px Arial",'#000000',0,30);
    /**
     * 经验文本
     * @type {createjs.Text}
     */
    this.expT=NameSpr.getText(this,'',"bold 24px Arial",'#000000',0,60);
    /**
     * 金币文本
     * @type {createjs.Text}
     */
    this.goldT=NameSpr.getText(this,'',"bold 24px Arial",'#000000',1000,0);
    /**
     * 钻石文本
     * @type {createjs.Text}
     */
    this.diamondT=NameSpr.getText(this,'',"bold 24px Arial",'#000000',1200,0);
    this.textUpdate();
    //事件
    this.addEventListener('click',this.onClick);
    MyEvent.addEvent(MyEvent.ME_MyEvent,this.MyEventF);


  }

  /**
   * 自定义事件返回界面 清除游戏
   * @param data
   */
  MyEventF=(data)=>{
    if(data=='pvpback'){
      SocketClient.instance.closeClient();
      this.planeGameMI.remove();
      this.planeGameMI=null;
    }
    else if(data=='norback'){
      SocketClient.instance.closeClient();
      this.planeGame2MI.remove();
      this.planeGame2MI=null;
    }
  }

  /**
   * 点击事件
   * @param e {Event}
   */
  onClick=(e)=>{
    let targetS=e.target;
    if(targetS==this.warehouseS){
      if(this.Game2OI==null){
        this.Game2OI=new GameNOROverIf();
        this.addChild(this.Game2OI);
      }

    }
    else if(targetS==this.shopS){
      if(this.shopI==null){
        this.shopI=new ShopI();
        this.addChild(this.shopI);
      }
      this.shopI.visible=true;
    }
    else if(targetS==this.peopleS){
      if(this.planeGame2MI==null){
        this.planeGame2MI=new PlaneGameNORMI();
        this.addChild(this.planeGame2MI);
      }

    }
    else if(targetS==this.pvpS){
      if(this.planeGameMI==null){
        this.planeGameMI=new PlaneGameMI();
        this.addChild(this.planeGameMI);
      }
    }

  }

  /**
   * 文本更新
   */
  textUpdate(){
    this.nameT.text='用户：'+UserData.Name;
    this.leveT.text='等级：'+UserData.level;
    this.expT.text='经验：'+UserData.exp;
    this.goldT.text='金币：'+UserData.gold;
    this.diamondT.text='钻石：'+UserData.diamond;
  }


  /**
   * 移除
   */
  remove(){

  }
}
export default PlaneGameSI;
