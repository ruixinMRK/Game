/**
 * Created by tudouhu on 2017/2/7.
 */

import 'createjs';
import NameSpr from '../common/NameSpr';
import PlaneGame from './PlaneGame';
import Tools from '../common/Tools';
import Bullet from './Bullet';
import Router from 'common/socket/Router';
import Timer from 'common/Timer';
import SocketClient from 'common/socket/SocketClient';

/**
 * 飞机类
 */
class Plane extends createjs.Container{

  constructor(){
    super();
    /**
     * 速度
     * @type {number}
     */
    this.speed=3;
    /**
     * 旋转速度
     * @type {number}
     */
    this.rotationSpeed=3;
    /**
     * 子弹数组
     * @type {Array}
     */
    this.bulletArr=[];

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

    Router.instance.reg('planWalk',this.socketD);

    console.log('2');
    Timer.add(e=>{SocketClient.instance.send('this is clinet');},500,1)
  }

  //服务器接受的数据
  socketD = (data)=>{

    console.log(data);

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
    else if(this.x>PlaneGame.mapW)this.x=PlaneGame.mapW;
    if(this.y<0)this.y=0;
    else if(this.y>PlaneGame.mapH)this.y=PlaneGame.mapH;
  }


  /**
   * 帧频函数
   * @param e
   */
  onFrame=(e)=>{
    //移动
    let angle=Tools.getHD(this.rotation);
    let vx=Math.cos(angle)*this.speed;
    let vy=Math.sin(angle)*this.speed;
    this.move(vx,vy);
    //子弹移动
    for(let i=this.bulletArr.length-1;i>=0;i--){
      let bullet=this.bulletArr[i];
      if(bullet.mc==null){
        this.bulletArr.splice(i,1);
      }
      else{
        bullet.onFrame();
      }
    }
    // console.log(this.bulletArr.length);
  }


  /**
   * 攻击 发射子弹
   */
  attack(){
    let bullet=new Bullet(500,8,Tools.getHD(this.rotation));
    bullet.x=this.x;
    bullet.y=this.y;
    this.parent.addChild(bullet);
    this.bulletArr.push(bullet);
  }


}

export default Plane;
