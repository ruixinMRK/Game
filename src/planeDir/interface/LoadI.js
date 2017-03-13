/**
 * Created by tudouhu on 2017/3/9.
 */

import 'createjs';
import GameData from '../../manager/GameData';
import LoadIData from './LoadIData';
import UserData from '../../manager/UserData';
import NameSpr from '../../common/NameSpr';
import MyEvent from '../../common/MyEvent';
import PlaneGameMI from '../game/interface/PlaneGameMI';
import PlaneGame2MI from '../game2/interface/PlaneGame2MI';
import Game2OverIf from '../game2/interface/Game2OverIf';
import SocketClient from '../../common/socket/SocketClient';

/**
 * 游戏加载界面
 */
class LoadI extends createjs.Container{


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

    //文本
    /**
     * 加载文本
     * @type {createjs.Text}
     */
    this.loadT=NameSpr.getText(this,'',"bold 48px Arial",'#000000',450,600);

    //属性
    /**
     * 加载完成文件数量
     * @type {number}
     */
    this.loadNum=0;

    this.queue= new createjs.LoadQueue(true);
    this.queue.installPlugin(createjs.Sound);
    this.queue.on('complete',this.onLoadComplete);
    this.queue.on('error',this.onLoadError);
    this.queue.on('fileload',this.onLoadFileload);
    // this.queue.on('progress',this.onLoadProgress);
    // this.queue.on('fileprogress',this.onLoadFileProgress);
    this.queue.loadManifest(LoadIData.loadData);
  }

  /**
   * 加载文本更新设置
   * @param fileNum 加载文件总数量
   */
  loadTTxt=(fileNum)=>{
    this.loadNum++;
    this.loadT.text='正在加载资源'+Math.round(this.loadNum/fileNum*100)+'%';
  }


  /**
   *队列所有文件加载完成
   * @param event
   */
  onLoadComplete=(event)=>{
    // console.log('队列所有文件加载完成',event);
    MyEvent.dispatchEvent(MyEvent.ME_MyEvent,'start');
  }

  /**
   *加载错误
   * @param event
   */
  onLoadError=(event)=>{
    console.log('加载错误',event);
  }

  /**
   *队列进度改变
   * @param event
   */
  onLoadProgress=(event)=>{
    // console.log('队列进度改变',event);
  }

  /**
   *文件加载完成
   * @param event
   */
  onLoadFileload=(event)=>{
    // console.log('文件加载完成',event);
    this.loadTTxt(event.currentTarget._numItems);
  }

  /**
   *单个文件进度改变
   * @param event
   */
  onLoadFileProgress=(event)=>{
    // console.log('单个文件进度改变',event);
  }



  /**
   * 移除
   */
  remove(){
    if(this.parent!=null)
      this.parent.removeChild(this);
  }
}
export default LoadI;
