/**
 * 技能鬼气斩
 */

import 'createjs';
import BaseSkill from 'container/BaseSkill';

class Guiqizhan extends BaseSkill {

  constructor(){
    super();
  }

  setSpriteData() {
    if (this.animation) {
      if (this.animation.parent) {
        this.animation.parent.removeChild(this.animation);
      }
    }
    this.data = {
      images: ["assets/img/guiqizhan.png"],
      frames: {width: 82, height: 83, regX: 41, regY: 41.5},
      animations: {
        run: [0, 3, "run", 0.3],
        hit: [4, 7, "", 0.3],
        run2: [8, 11, "run2", 0.3]
      }
    };
    this.spriteSheet = new createjs.SpriteSheet(this.data);
    this.animation = new createjs.Sprite(this.spriteSheet, "run");
    this.addChild(this.animation);
  }
  run2(sx,sy){
    this.animation.gotoAndPlay("run2");
    this.sx = sx;
    this.sy = sy;
    var _this = this;
    this.addEventListener("tick",this._runing = function (){_this.runing()})
  }


}
export default Guiqizhan;
