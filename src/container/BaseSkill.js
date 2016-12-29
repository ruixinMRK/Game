/**
 * 弹道技能基类 所有弹道技能均继承与此类
 */

import 'createjs';
class BaseSkill extends createjs.Container {

  constructor() {
    super();
    this.arrow = "right";
    this.setSpriteData();
  }

  move(x,y){
    this.x +=x;
    this.y +=y;
  }

  setSpriteData(){

  }

  startRun(sx,sy){
    this.animation.gotoAndPlay("run");
    this.sx = sx;
    this.sy = sy;
    var _this = this;
    this.addEventListener("tick",this._runing = function (){_this.runing()})
  }
  runing(){
    this.move(this.sx,this.sy);
    if(this.x > 500||this.x < 0||this.y < 0||this.y > 300)
    {
      this.stopRun()
    }
  }

  stopRun (){
    this.removeEventListener("tick",this._runing)
    if(this.parent)
    {
      this.parent.removeChild(this);
    }
  }

  startHit  (){
    this.changeStop();
    this.animation.gotoAndPlay("hit");
    var _this = this;
    this.addEventListener("tick",this._hitting = function (){_this.hitting()})
  }

  hitting  (){
    var list = this.data.animations.hit.frames;
    if( this.animation.currentFrame == list[list.length - 1] )
    {
      this.stopHit();
    }
  }
  stopHit (){
    this.removeEventListener("tick",this._hitting);
    if(this.parent)
    {
      this.parent.removeChild(this);
    }
  }

  changeStop (){//因需要切换动作而停止当前的动作侦听
    this.removeEventListener("tick",this._runing);
    this.removeEventListener("tick",this._hitting)
  }

}

export default BaseSkill;
