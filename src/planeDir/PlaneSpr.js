/**
 * Created by tudouhu on 2017/2/8.
 */


import 'createjs';

/**
 * 飞机精灵图 单例类
 */
class PlaneSpr extends createjs.Container{

  constructor(){
    super();
    this.init();
  }

  /**
   * 初始化
   */
  init(){
    let arr=[["plane",0,0,58,48],["bullet",58,0,20,20]];
    let frame=new Array();
    this.index=new Object();
    for(let i=arr.length-1;i>=0;i--){
      let a=arr[i];
      this.index[a[0]]=i;
      frame.unshift(a.slice(1));
    }
    let data={
      images:['assets/img/plane.png'],
      frames:frame
    }
    this.sheet=new createjs.SpriteSheet(data);
  }

  /**
   * 获得一个sprite
   * @param name sprite名称
   * @returns {*} sprite
   */
  getSpr(name){
    let spr=new createjs.Sprite(this.sheet);
    spr.gotoAndStop(this.index[name]);
    return spr;
  }

  /**
   * 获得实例
   * @returns {PlaneSpr}
   */
  static getInstance() {
    if (!PlaneSpr.instance) {
      PlaneSpr.instance = new PlaneSpr();
    }
    return PlaneSpr.instance;
  }




}

export default PlaneSpr;
