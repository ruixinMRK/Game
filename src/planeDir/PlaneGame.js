
/**
 * Created by tudouhu on 2017/2/7.
 */

import 'createjs';
import PlaneSpr from './PlaneSpr';

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
    // this.addChild(this.mapS);
    let b=PlaneSpr.getInstance().getSpr('bullet');
    let p=PlaneSpr.getInstance().getSpr('plane');
    console.log(p.currentFrame);
    this.addChild(p,b);
  }






}

export default PlaneGame;
