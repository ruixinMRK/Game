/**
 * Created by tudouhu on 2017/2/22.
 */


import 'createjs';
import GameData from '../../manager/GameData';
import UserData from '../../manager/UserData';
import NameSpr from '../../common/NameSpr';
import MyEvent from '../../common/MyEvent';
import PlaneGameMI from '../game/interface/PlaneGameMI';
import PlaneGame2MI from '../game2/interface/PlaneGame2MI';
import GameOverIf from '../game/interface/GameOverIf';
import SocketClient from '../../common/socket/SocketClient';

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
   * @type {PlaneGame2MI}
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
    this.warehouseS=NameSpr.getInstance().getSpr('gameUI','warehouse');
    this.warehouseS.x=540;
    this.warehouseS.y=668;
    this.addChild(this.warehouseS);

    /**
     * 商店图标
     * @type {createjs.Sprite}
     */
    this.shopS=NameSpr.getInstance().getSpr('gameUI','shop');
    this.shopS.x=650;
    this.shopS.y=668;
    this.addChild(this.shopS);

    /**
     * 多人图标
     * @type {createjs.Sprite}
     */
    this.peopleS=NameSpr.getInstance().getSpr('gameUI','people');
    this.peopleS.x=480;
    this.peopleS.y=200;
    this.addChild(this.peopleS);

    /**
     * pvp图标
     * @type {createjs.Sprite}
     */
    this.pvpS=NameSpr.getInstance().getSpr('gameUI','pvp');
    this.pvpS.x=650;
    this.pvpS.y=200;
    this.addChild(this.pvpS);
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

    }
    else if(targetS==this.shopS){
    }
    else if(targetS==this.peopleS){
      if(this.planeGame2MI==null){
        this.planeGame2MI=new PlaneGame2MI();
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
