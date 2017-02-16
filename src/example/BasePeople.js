/**
 * Created by tudouhu on 2017/1/28.
 */

import 'createjs';
import Timer from 'common/Timer';

/**
 * 人物基类
 */
class BasePeople extends createjs.Container{

  /**
   * 构造函数
   */
  constructor(){
    super();
    /**
     * x行走速度
     * @type {number}
     */
    this.walkSpeedX=2;
    /**
     * y行走速度
     * @type {number}
     */
    this.walkSpeedY=0.5;
    /**
     * x跑速度
     * @type {number}
     */
    this.runSpeedX=5;
    /**
     * y跑速度
     * @type {number}
     */
    this.runSpeedY=0.5;
    /**
     * 跳跃高度
     * @type {number}
     */
    this.jumpHeight = 30;
    /**
     *跑跳跃高度
     * @type {number}
     */
    this.runJumpHeight = 35;
    /**
     * 方向
     * @type {string}
     */
    this.arrow="right";

    this.currentAction = [];
    this.setSpriteData();


    this.walkP = false;
    this.runP = false;
    this.jumpP = false;
    this.attacking = false;


    Timer.add(this.animate,30,0);

  }

  /**
   *  影片剪辑数据
   */
  setSpriteData(){

  }

  /**
   * 执行动作
   */
  animate=()=>{
    //走路
    this.walkP?this.move(this.sx,this.sy):"";
    //跑
    this.runP?this.move(this.sx,this.sy):"";
    //跳
    if(this.jumpP)
    {
      this.jumpNum-=3;
      //console.log(this.jumpNum);
      this.move(0,-this.jumpNum);
      this.y>this.jumpY?(this.y=this.jumpY,this.stopJump()):'';
    }
  }

  /**
   * 播放帧
   * @param str
   */
  gotoAndPlay(str="stand"){
    this.animation.gotoAndPlay(str);
  }

  /**
   * 站立
   */
  stand(){
    this.gotoAndPlay("stand");
  }

  /**
   * 移动
   * @param x x速度
   * @param y y速度
   */
  move(x,y){
    this.x+=x;
    this.y+=y;
  }

  /**
   * 开始行走
   * @param sx 设置x
   * @param sy 设置y
   */
  startWalk(sx,sy){
    if(this.walkP) return;
    this.walkP=true;
    this.gotoAndPlay("walk");
    let dir=sx>0?"right":"left";
    if(this.arrow!=dir) this.changeArrow(dir);
    this.sx=sx;
    this.sy=sy;
  }

  /**
   * 暂停行走
   */
  stopWalk(){
    this.walkP=false;
    this.stand();
  }

  /**
   * 开始跑
   * @param sx 设置x
   * @param sy 设置y
   */
  startRun(sx,sy){
    this.runP=true;
    this.gotoAndPlay('run');
    let dir=sx>0?'right':'left';
    if(this.arrow!=dir) this.changeArrow(dir);
    this.sx=sx;
    this.sy=sy;
  }

  /**
   * 暂停跑
   */
  stopRun(){
    this.runP=false;
    this.stand();
  }

  /**
   * 翻跟头
   */
  startDecelerate(){
    this.gotoAndPlay('somersault');
  }

  /**
   * 开始攻击 1 2 是左勾拳和右勾拳随机出现 3是最后的浮空攻击
   */
  startAttack(){
    let rand=Math.random();
    let flag='attack3';
    if(rand<0.5){
      flag='attack3';
    }
    else if(rand<0.8){
      flag='attack2';
    }
    else if(rand<1){
      flag='attack1';
    }
    this.gotoAndPlay(flag);
  }

  /**
   * 转换方向
   * @param arrow 方向
   */
  changeArrow(arrow){
    this.arrow=arrow;
    arrow=='left'?this.animation.scaleX=-1:this.animation.scaleX=1;
  }

  /**
   * 跳
   */
  jump(){
    if(this.jumpP) return;
    this.jumpP=true;
    this.gotoAndPlay('jump');
    this.jumpY=this.y;
    this.jumpNum=this.jumpHeight;
  }

  /**
   * 暂停跳
   */
  stopJump(){
    this.jumpP=false;
    this.gotoAndPlay('crouch');
  }

  /**
   * 跑跳
   */
  runJump(){
    this.gotoAndPlay('runJump');
    this.jumpNum=this.runJumpHeight;
    this.jumpY = this.y;
    this.addEventListener('tick',this._runJumping=()=>{this.runJumping();});
  }

  /**
   * 跑跳执行函数
   */
  runJumping(){
    this.jumpNum-=4;
    this.move(this.sx,-this.jumpNum);
    let list=this.data.animations.runJump.frames;

    if(this.animation.currentFrame==list[list.length-1]&&this.jumpNum<20){
      this.animation.gotoAndPlay('runJumpAttack');
    }
    if(this.y>=this.jumpY){
      this.y = this.jumpY;
      this.stopRunJump();
    }
  }

  /**
   * 暂停跑跳
   */
  stopRunJump(){
    this.removeEventListener('tick',this._runJumping);
    this.changeStop();
    this.animation.gotoAndPlay('crouch');
  }

  /**
   * 切换动作移除事件
   */
  changeStop(){
    this.removeEventListener("tick",this._walking);
    this.removeEventListener("tick",this._runing);
    this.removeEventListener("tick",this._decelerateing);
  }

}


export default BasePeople;






