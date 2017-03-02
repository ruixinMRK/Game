/**
 * Created by tudouhu on 2017/2/25.
 */


import 'createjs';
import GameData from '../../../manager/GameData';
import NameSpr from '../../../common/NameSpr';
import MyEvent from '../../../common/MyEvent';
import Timer from '../../../common/Timer';
import PlaneGame from '../PlaneGame';
import UserData from '../../../manager/UserData'
import Router from '../../../common/socket/Router';
import SocketClient from '../../../common/socket/SocketClient';

/**
 * 飞机游戏结束界面
 */
class GameOverIf extends createjs.Container{


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
    this.titleT=NameSpr.getText(this,'',"bold 24px Arial",'#000000',80,80);
    //属性
    //事件
    this.addEventListener('click',this.onClick);
    //居中
    let bound=this.getBounds();
    this.x=(GameData.stageW-bound.width)/2;
    this.y=(GameData.stageH-bound.height)/2;
  }

  /**
   * 设置设置显示
   * @param name 死亡用户名
   */
  setResultText=(name)=>{
    if(name==UserData.Name){
      this.titleT.text='失败';
    }
    else{
      this.titleT.text='胜利';
    }
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
export default GameOverIf;
