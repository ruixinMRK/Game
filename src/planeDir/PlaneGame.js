
/**
 * Created by tudouhu on 2017/2/7.
 */

import 'createjs';
import NameSpr from '../common/NameSpr';

/**
 * 飞机大战游戏主类
 */
class PlaneGame extends createjs.Container{

  constructor(){
    super();
    this.init();
  }

  /**
   * 初始化
   */
  init(){
    /**
     * 地图
     */
    this.mapS=new createjs.Shape();
    this.mapS.graphics.beginFill('#D0D0D0');
    this.mapS.graphics.drawRect(0,0,1000,1000);
    this.mapS.graphics.endFill();
    this.addChild(this.mapS);
    let b=NameSpr.getInstance().getSpr('plane','bullet');
    let p=NameSpr.getInstance().getSpr('plane','plane');
    this.addChild(p,b);
  }






}

export default PlaneGame;
