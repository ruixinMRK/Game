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
 * 飞机游戏退出飞机界面
 */
class Game2DRI extends createjs.Container{


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
    this.bgS=NameSpr.getInstance().getSpr('gameUI','overIf_bg');
    this.addChild(this.bgS);
    this.titleT=NameSpr.getText(this,'多人',"bold 24px Arial",'#000000',0,0);
    //按钮
    /**
     * 返回按钮
     * @type {createjs.Sprite}
     */
    this.backS=NameSpr.getInstance().getSpr('gameUI','overIf_back');
    this.backS.x=100;
    this.backS.y=150;
    this.addChild(this.backS);
    //文本
    /**
     * 返回提示
     * @type {createjs.Text}
     */
    this.timerT=new createjs.Text('',"bold 24px Arial",'#000000');
    this.timerT.x=80;
    this.timerT.y=100;
    this.addChild(this.timerT);
    //属性
    /**
     * 倒计时
     * @type {number}
     */
    this.timer=3;
    //事件
    this.addEventListener('mousedown',this.onClick);
    this.timerT.text=this.timer+'秒后自动返回';
    this.timerID=Timer.add((e)=>{
        this.timer--;
        this.timerT.text=this.timer+'秒后自动返回';
        if(this.timer==0){
          MyEvent.dispatchEvent(MyEvent.ME_MyEvent,'back');
          this.visible=false;
        }
    },1000,3);
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
      Timer.clear(this.timerID);
      this.visible=false;
      MyEvent.dispatchEvent(MyEvent.ME_MyEvent,'back');
    }

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
export default Game2DRI;
