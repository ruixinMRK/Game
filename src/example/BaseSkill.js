/**
 * Created by tudouhu on 2017/1/28.
 */

import 'createjs';

/**
 * 弹道技能基类
 */
class BaseSkill extends createjs.Container{

  /**
   *构造函数
   */
  constructor(){
    super();
    this.arrow="right";
    this.setSpriteData();
  }

  /**
   * 移动
   * @param x
   * @param y
   */
  move(x,y){
    this.x+=x;
    this.y+=y;
  }


  setSpriteData(){

  }

  /**
   * 开始移动
   * @param sx
   * @param sy
   */
  startRun(sx,sy){
    this.animation.gotoAndPlay("run");
    this.sx = sx;
    this.sy = sy;
    var _this=this;
    this.addEventListener("tick",this._runing=function () {_this.runing()});
  }

  /**
   * 移动帧频
   */
  runing(){
    this.move(this.sx,this.sy);
    if(this.x>500||this.x<0||this.y<0||this.y>300)
    {
      this.stopRun();
    }
  }

  /**
   * 停止移动
   */
  stopRun(){
    this.removeEventListener("tick",this._runing);
    if(this.parent)
    {
      this.parent.removeChild(this);
    }
  }

  /**
   * 开始检测
   */
  startHit(){
    this.changeStop();
    this.animation.gotoAndPlay("hit");
    var _this=this;
    this.addEventListener("tick",this._hitting=function(){_this.hitting()});
  }

  /**
   * 检测
   */
  hitting(){
    var list=this.data.animations.hit.frames;
    if(this.animation.currentFrame==list[list.length-1])
    {
      this.stopHit();
    }
  }


  /**
   * 暂停检测
   */
  stopHit(){
    this.removeEventListener("tick",this._hitting);
    if(this.parent)
    {

    }
  }


  /**
   * 切换暂停
   */
  changeStop(){
    this.removeEventListener("tick",this._runing);
    this.removeEventListener("tick",this._hitting);
  }



}

export default BaseSkill;
