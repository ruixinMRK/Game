/**
 * Created by tudouhu on 2017/2/8.
 */
import 'createjs';

/**
 * 根据名称在精灵图获得sprite 单例类
 */
class NameSpr extends createjs.Container{

  constructor(){
    super();
    this.init();
  }

  /**
   * 初始化
   */
  init(){
    let planeArr=[["plane",0,0,48,58],["bullet",48,0,20,20]];
    this.setSheet('plane',['assets/img/plane.png'],planeArr);
  }

  /**
   * 设置spriteSheet
   * @param fileName 文件名
   * @param url 路径
   * @param frameArr 帧信息
   */
  setSheet(fileName,urlArr,frameArr){
    if(this[fileName+'index'])return ;

    let frame=new Array();
    this[fileName+'index']=new Object();
    for(let i=frameArr.length-1;i>=0;i--){
      let a=frameArr[i];
      this[fileName+'index'][a[0]]=i;
      frame.unshift(a.slice(1));
    }
    let data={
      images:urlArr,
      frames:frame
    }
    this[fileName+'sheet']=new createjs.SpriteSheet(data);
  }



  /**
   * 获得一个sprite
   *  @param fileName 文件名
   * @param name sprite名称
   * @returns {*} sprite
   */
  getSpr(fileName,sprName){
    if(this[fileName+'index']==null)return null;

    let spr=new createjs.Sprite(this[fileName+'sheet']);
    spr.gotoAndStop(this[fileName+'index'][sprName]);
    return spr;
  }

  /**
   * 获得实例
   * @returns {NameSpr}
   */
  static getInstance() {
    if (!NameSpr.instance) {
      NameSpr.instance = new NameSpr();
    }
    return NameSpr.instance;
  }




}

export default NameSpr;
