/**
 * Created by tudouhu on 2017/2/22.
 */


import 'createjs';
import GameData from '../manager/GameData';
import NameSpr from '../common/NameSpr';
import PlaneGame from 'planeDir/PlaneGame';

/**
 * 飞机游戏开始界面
 */
class PlaneGameSI extends createjs.Container{



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
     * 背包图标
     * @type {createjs.Sprite}
     */
    this.packS=NameSpr.getInstance().getSpr('gameUI','pack');
    this.packS.x=200;
    this.packS.y=400;
    this.addChild(this.packS);

    /**
     * 战斗图标
     * @type {createjs.Sprite}
     */
    this.combatS=NameSpr.getInstance().getSpr('gameUI','combat');
    this.combatS.x=350;
    this.combatS.y=400;
    this.addChild(this.combatS);
    //事件
    this.addEventListener('click',this.onClick);
  }

  /**
   * 点击事件
   * @param e {Event}
   */
  onClick=(e)=>{
    let targetS=e.target;
    if(targetS==this.packS){

    }
    else if(targetS==this.combatS){
      var planeG=new PlaneGame();
      this.addChild(planeG);
    }

  }





  /**
   * 移除
   */
  remove(){

  }
}
export default PlaneGameSI;
