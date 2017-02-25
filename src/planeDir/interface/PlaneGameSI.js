/**
 * Created by tudouhu on 2017/2/22.
 */


import 'createjs';
import GameData from '../../manager/GameData';
import NameSpr from '../../common/NameSpr';
import PlaneGame from 'planeDir/PlaneGame';
import PlaneGameMI from './PlaneGameMI';
import GameOverIf from './GameOverIf';
import SocketClient from '../../common/socket/SocketClient';

/**
 * 飞机游戏开始界面
 */
class PlaneGameSI extends createjs.Container{



  constructor() {
    SocketClient.instance;
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
    //事件
    this.addEventListener('click',this.onClick);
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
      // var planeG=new PlaneGame();
      // this.addChild(planeG);
    }
    else if(targetS==this.peopleS){
    }
    else if(targetS==this.pvpS){
      let pgmi=new PlaneGameMI();
      this.addChild(pgmi);
    }

  }





  /**
   * 移除
   */
  remove(){

  }
}
export default PlaneGameSI;
