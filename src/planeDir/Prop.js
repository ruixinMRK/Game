/**
 * Created by tudouhu on 2017/2/20.
 */

import 'createjs';
import NameSpr from '../common/NameSpr';
import GameData from '../manager/GameData';

/**
 * 飞机游戏内道具
 */
class Prop extends createjs.Container{

  /**
   *
   * @type {createjs.Sprite}
   */
  mc=null;

  constructor() {
    super();
    this.init();
  }

  /**
   * 初始化
   */
  init() {
  }

  /**
   * 设置mc
   * @param sprName {String} sprite名称
   */
  setMc(sprName){
    this.mc = NameSpr.getInstance().getSpr('plane', sprName);
    let bound = this.mc.getBounds();
    this.mc.regX = bound.width / 2;
    this.mc.regY = bound.height / 2;
    this.addChild(this.mc);
    this.randomPos();
  }

  /**
   * 随机位置
   */
  randomPos(){
    let bound = this.mc.getBounds();
    this.x=bound.width/2+Math.random()*(GameData.mapW-bound.width);
    this.y=bound.height/2+Math.random()*(GameData.mapH-bound.height);
  }


  /**
   * 道具与飞机碰撞
   * @param plane {HeroPlane}
   */
  planeHit(plane){
    if(this.mc.sprName=='p_bullet'){
      plane.bulletNum=plane.bulletNumSet;
    }
    else if(this.mc.sprName=='p_gasoline'){
      plane.gasoline=plane.gasolineSet;
    }
    else if(this.mc.sprName=='p_life'){
      plane.life=plane.lifeSet;
    }
    this.randomPos();
  }


}
export default Prop;
