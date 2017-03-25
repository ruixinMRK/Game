/**
 * Created by tudouhu on 2017/2/25.
 */


import '../../vendors/createjs';
import GameData from '../../manager/GameData';
import NameSpr from '../../common/NameSpr';
import MyEvent from '../../common/MyEvent';
import Timer from '../../common/Timer';

/**
 * 飞机游戏结束界面
 */
class GameNOROverIf extends createjs.Container{


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
    this.bgS=NameSpr.getNameSpr(this,'gameUI','overIf2_bg');
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
    this.addEventListener('click',this.onClick);
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
      MyEvent.dispatchEvent(MyEvent.ME_MyEvent,'back');
      this.visible=false;
    }
    else if(targetS==this.rebirthS){
      Timer.clear(this.timerID);
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
   * @param arr 信息数组
   */
  showOver=(arr)=>{
    this.rebirthS.visible=false;
    this.timerT.visible=false;
    this.backS.x=150;
    this.visible=true;

    let th=60;
    NameSpr.getText(this,'用户',"bold 18px Arial",'#000000',0,th);
    NameSpr.getText(this,'击杀',"bold 18px Arial",'#000000',80,th);
    NameSpr.getText(this,'死亡',"bold 18px Arial",'#000000',160,th);
    NameSpr.getText(this,'助攻',"bold 18px Arial",'#000000',240,th);
    NameSpr.getText(this,'得分',"bold 18px Arial",'#000000',320,th);
    th = 80
    for(let i=0;i<arr.length;i++){
      let ad=arr[i];
      NameSpr.getText(this,ad.name,"bold 18px Arial",'#000000',0,th);
      NameSpr.getText(this,ad.kill,"bold 18px Arial",'#000000',80,th);
      NameSpr.getText(this,ad.die,"bold 18px Arial",'#000000',160,th);
      NameSpr.getText(this,ad.holdAtt,"bold 18px Arial",'#000000',240,th);
      NameSpr.getText(this,ad.score,"bold 18px Arial",'#000000',320,th);
      th+=20;
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
export default GameNOROverIf;
