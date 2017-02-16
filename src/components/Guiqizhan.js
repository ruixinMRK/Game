/**
 * Created by tudouhu on 2017/1/30.
 */

import 'createjs';
import BaseSkill from '../example/BaseSkill';

/**
 * 鬼气斩技能继承弹道技能基类
 */
class Guiqizhan extends BaseSkill{

  /**
   * 鬼气斩构造函数
   */
  constructor(){
    super();
  }


  setSpriteData(){
    if(this.animation){
      if(this.animation.parent){
        this.animation.parent.removeChild(this.animation);
      }
    }

    this.data={
      images:['assets/img/guiqizhan.png'],
      frames:{width:82,height:83,regX:41,regY:41.5},
      animations:{
        run:[0,3,'run',0.3],
        hit:[4,7,'',0.3],
        run2:[8,11,'run2',0.3]
      }
    };
    this.spriteSheet=new createjs.SpriteSheet(this.data);
    this.animation=new createjs.Sprite(this.spriteSheet,'run');
    this.addChild(this.animation);
  }

  /**
   * 跑2
   * @param sx 设置x
   * @param sy 设置y
   */
  run2(sx,sy){
    this.animation.gotoAndPlay('run2');
    this.sx=sx;
    this.sy=sy;
    this.addEventListener('tick',this._runing=()=>{this.runing();})
  }







}


export default Guiqizhan;
