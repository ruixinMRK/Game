
/**
 * Created by tudouhu on 2017/2/7.
 */

import '../vendors/createjs';
import GameData from '../manager/GameData';
import PlaneControl2 from './PlaneControlNOR';
import DataShow from '../interface/DataShow';
import PlaneMap2 from './PlaneMapNOR';
import PlaneGameB from '../gameBase/PlaneGameB';

/**
 * 飞机大战游戏多人模式
 */
class PlaneGameNOR extends PlaneGameB{

  /**
   * 飞机地图
   * @type {PlaneMap2}
   */
  map=null;
  /**
   * FPS ping显示
   * @type {DataShow}
   */
  dataShow=null;
  /**
   * 飞机管理
   * @type {PlaneControl2}
   */
  planeControl=null;

  constructor(){
    super();
    this.init();
  }

  /**
   * 初始化
   */
  init(){
    //地图
    this.map=new PlaneMap2();
    this.addChild(this.map);
    GameData.planeMap=this.map;
    //飞机管理
    this.planeControl=new PlaneControl2();
    this.addChild(this.planeControl);
    GameData.planeControl=this.planeControl;
    //数据显示
    this.dataShow=new DataShow();
    GameData.dataShow=this.dataShow;
  }





  /**
   * 移除
   */
  remove(){
    super.remove();
  }

}


export default PlaneGameNOR;
