/**
 * Created by tudouhu on 2017/2/25.
 */


import 'createjs';
import GameData from '../../../manager/GameData';
import NameSpr from '../../../common/NameSpr';
import MyEvent from '../../../common/MyEvent';
import Timer from '../../../common/Timer';
import PlaneGame2 from '../PlaneGame2';
import UserData from '../../../manager/UserData'
import Router from '../../../common/socket/Router';
import SocketClient from '../../../common/socket/SocketClient';

/**
 * 飞机游戏结束界面
 */
class Game2OverIf extends createjs.Container{


  constructor() {
    super();
    this.init();
  }

  /**
   * 初始化
   */
  init(){
    //背景
    /**
     * 界面背景
     * @type {createjs.Sprite}
     */
    this.bgS=NameSpr.getInstance().getSpr('gameUI','overIf2_bg');
    this.addChild(this.bgS);
    this.titleT=NameSpr.getText(this,'多人',"bold 24px Arial",'#000000',0,0);
    //按钮
    /**
     * 返回按钮
     * @type {createjs.Sprite}
     */
    this.backS=NameSpr.getNameSpr(this,'gameUI','overIf_back',50,320);
    /**
     * 重生按钮
     * @type {createjs.Sprite}
     */
    this.rebirthS=NameSpr.getNameSpr(this,'gameUI','overIf_rebirth',250,320);
    //文本
    /**
     * 返回提示
     * @type {createjs.Text}
     */
    this.timerT=NameSpr.getText(this,'',"bold 24px Arial",'#000000',120,70);
    /**
     * 结果文本
     * @type {createjs.Text}
     */
    this.resultT=NameSpr.getText(this,'',"bold 24px Arial",'#000000',120,100);
    //属性
    /**
     * 倒计时
     * @type {number}
     */
    this.timer=10;
    //事件
    this.addEventListener('mousedown',this.onClick);
    //居中
    let bound=this.getBounds();
    this.x=(GameData.stageW-bound.width)/2;
    this.y=(GameData.stageH-bound.height)/2;

  }


  /**
   * 点击事件
   * @param e {Event}
   */
  onClick=(e)=>{
    let targetS=e.target;
    if(targetS==this.backS){
      MyEvent.dispatchEvent(MyEvent.ME_MyEvent,'back');
      this.visible=false;
    }
    else if(targetS==this.rebirthS){
      MyEvent.dispatchEvent(MyEvent.ME_MyEvent,'rebirth');
      this.visible=false;
    }

  }

  /**
   * 显示界面
   */
  show=()=>{
    this.visible=true;
    this.resultT.text='击杀：'+GameData.planeControl.HeroPlane.kill+'\n助攻：'+GameData.planeControl.HeroPlane.assist;

    this.timer=10;
    this.timerT.text=this.timer+'秒后自动复活';
    this.timerID=Timer.add((e)=>{
      this.timer--;
      this.timerT.text=this.timer+'秒后自动复活';
      if(this.timer==0){
        MyEvent.dispatchEvent(MyEvent.ME_MyEvent,'rebirth');
        this.visible=false;
      }
    },1000,this.timer);
  }

  /**
   * 显示游戏结束界面
   */
  showOver=()=>{
    this.visible=true;
    this.rebirthS.visible=false;
    this.timerT.visible=false;
    this.backS.x=150;
    this.resultT.text='总击杀：'+GameData.planeControl.HeroPlane.gameKill
      +'\n总助攻：'+GameData.planeControl.HeroPlane.gameAssist;
  }


  /**
   * 移除
   */
  remove(){
    if(this.parent!=null)
      this.parent.removeChild(this);
    this.removeEventListener('mousedown',this.onClick);
  }
}
export default Game2OverIf;
