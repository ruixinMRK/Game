/**
 * Created by tudouhu on 2017/2/7.
 */

import 'createjs';
import NameSpr from '../common/NameSpr';

/**
 * 飞机类
 */
class Plane extends createjs.Container{

  constructor(){
    super();
    this.init();
  }

  /**
   * 初始化
   */
  init(){
    this.mc=NameSpr.getInstance().getSpr('plane','plane');
    let bound=this.mc.getBounds();
    this.mc.x=-bound.width/2;
    this.mc.y=-bound.height/2;
    this.addChild(this.mc);
  }

  /**
   * 移动
   * @param x x速度
   * @param y y速度
   */
  move(x,y){
    this.x+=x;
    this.y+=y;
    //飞机限制
    if(this.x<0)this.x=0;
    else if(this.x>1000)this.x=1000;
    if(this.y<0)this.y=0;
    else if(this.y>1000)this.y=1000;
  }


}

export default Plane;
