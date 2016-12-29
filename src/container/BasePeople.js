/**
 * Created by ruixin on 2016/12/29 0029.
 */
import 'createjs';
import Timer from 'common/Timer';

class BasePeople extends createjs.Container {
    constructor() {
      super();

      this.walkSpeedX = 2;
      this.walkSpeedY = 0.5;
      this.runSpeedX = 5;
      this.runSpeedY = 0.5;
      this.jumpHeight = 30;
      this.runJumpHeight = 35;
      this.arrow = "right";
      this.currentAction = [];
      this.setSpriteData();

      this.walkP = false;
      this.runP =  false;
      this.attacking = false;
      this.jumpP = false;

      Timer.add(this.animate,30,0);
    }

    //子类重写(影片剪辑数据)
    setSpriteData(){

    }

    //执行动作
    animate = ()=>{

      //走路
      this.walkP?this.move(this.sx,this.sy):'';
      //跑步
      this.runP?this.move(this.sx,this.sy):'';
      //跳
      // this.jumpP?(this.jumpNum -=3,this.move(0,-this.jumpNum),this.y >= this.jumpY?(this.y = this.jumpY,this.stopJump()))?'';
      if(this.jumpP){
        this.jumpNum -=3;
        console.log(this.jumpNum);
        this.move(0,-this.jumpNum);
        this.y >= this.jumpY?(this.y = this.jumpY,this.stopJump()):'';
      }

    }


    //播放指定帧
    gotoAndPlay(str = 'stand'){
      this.animation.gotoAndPlay(str);
    }
    //站立
    stand (){
      this.gotoAndPlay("stand");
    }

    move  (x,y){
      this.x +=x;
      this.y +=y;
    }
    startWalk (sx,sy){
      if(this.walkP) return;
      this.walkP = true;
      this.gotoAndPlay("walk");
      let dir = sx>0?'right':'left';
      if(this.arrow != dir) this.changeArrow(dir);
      this.sx = sx;
      this.sy = sy;
    }
    stopWalk (){
      this.walkP = false;
      this.stand();
    }
    startRun (sx,sy) {
      this.runP = true;
      this.gotoAndPlay("run");
      let dir = sx > 0 ? 'right' : 'left';
      if (this.arrow != dir) this.changeArrow(dir);
      this.sx = sx;
      this.sy = sy;
    }
    stopRun (){
      this.runP = false;
      this.stand();
    }

    //翻跟头
    startDecelerate(){
      this.gotoAndPlay("somersault");
    }

    //攻击动作 1 2 是左勾拳和右勾拳随机出现 3是最后的浮空攻击
    startAttack(){

      let rand = Math.random();
      var flag = 'attack3';
      if(rand<0.5){
        flag = 'attack3';
      }
      else if(rand<0.8){
        flag = 'attack2';
      }
      else if(rand<1){
        flag = 'attack1';
      }
      this.gotoAndPlay(flag);

      // type == 3?this.gotoAndPlay('attack3'):Math.random() > 0.5?this.gotoAndPlay('attack2'):this.gotoAndPlay('attack3');
    }

    //转换方向
    changeArrow(arrow){
      this.arrow = arrow;
      arrow == 'left'?this.animation.scaleX = -1:this.animation.scaleX = 1;
    }

    //跳
    jump(){
      if(this.jumpP) return;
      this.gotoAndPlay('jump');
      this.jumpNum = this.jumpHeight;
      this.jumpY = this.y;
      this.jumpP = true;
    }
    stopJump(){
      this.jumpP = false
      this.gotoAndPlay("crouch");
    }

    runJump(){
      this.animation.gotoAndPlay("runJump");
      this.jumpNum = this.runJumpHeight;
      this.jumpY = this.y;
      var _this = this;
      this.addEventListener("tick",this._runJumping = function (){_this.runJumping()})
    }

    runJumping(){
      this.jumpNum -=4;
      this.move(this.sx,-this.jumpNum);
      var list = this.data.animations.runJump.frames;

      if( this.animation.currentFrame == list[list.length - 1] && this.jumpNum < 20)//之后会改成有踢腿标识时开始踢
      {
        this.animation.gotoAndPlay("runJumpAttack");
      }
      if(this.y >= this.jumpY)
      {
        this.y = this.jumpY;
        this.stopRunJump();
      }
    }

    stopRunJump(){
      this.removeEventListener("tick",this._runJumping);
      this.changeStop();
      this.animation.gotoAndPlay("crouch");
    }
    changeStop(){//因需要切换动作而停止当前的动作侦听
      this.removeEventListener("tick",this._walking);
      this.removeEventListener("tick",this._runing);
      this.removeEventListener("tick",this._decelerateing);
    }

}
export default BasePeople;
