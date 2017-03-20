
/**
 * Created by tudouhu on 2017/3/20.
 */

import '../vendors/createjs';
import GameData from '../manager/GameData';
import NameSpr from '../common/NameSpr';
import Tools from '../common/Tools';

/**
 * 雷达扫描
 */
class RadarScan extends createjs.Container{

  /**
   * 雷达背景半径
   * @type {number}
   */
  bgRadius=100;
  /**
   * 雷达扫描半径
   * @type {number}
   */
  scanRadius=1000;
  /**
   * 扫描敌机数量
   * @type {number}
   */
  scanEPNum=0;
  /**
   * 敌机圆点数组
   * @type {Array}
   */
  enemyPCA=[];
  /**
   * 扫描帧频间隔设置
   * @type {number}
   */
  scanFSet=3;
  /**
   * 扫描帧频间隔
   * @type {number}
   */
  scanF=this.scanFSet;



  constructor() {
    super();
    this.init();
  }

  /**
   * 初始化
   */
  init(){
    /**
     * 雷达背景
     * @type {createjs.Shape}
     */
    this.bg=new createjs.Shape();
    this.bg.graphics.beginFill('#02A504');
    this.bg.graphics.drawCircle(0,0,this.bgRadius);
    this.bg.graphics.endFill();
    this.bg.alpha=0.5;
    this.addChild(this.bg);
  }

  /**
   * 帧频函数
   * @param e
   */
  onFrame=(e)=>{
    this.scanF--;
    if(this.scanF>=0) return;
    this.scanF=this.scanFSet;
    this.scanEPNum=0;

    this.radarSacnEnemy(GameData.planeControl.enemyP);
    this.radarSacnEnemy(GameData.planeControl.AIP);

    this.scanEPNum++;
    for(let i=this.scanEPNum-1;i<this.enemyPCA.length;i++){
      this.enemyPCA[i].visible=false;
    }
  }

  /**
   * 雷达扫描敌机
   * @param enemyO 敌机对象
   */
  radarSacnEnemy(enemyO){
    let hp=GameData.planeControl.HeroPlane;
    for(let s in enemyO){
      let ep=enemyO[s];
      let dis=Tools.getDis({x:hp.x,y:hp.y},{x:ep.x,y:ep.y});

      if(dis>this.scanRadius) continue;
      this.scanEPNum++;
      dis=dis/this.scanRadius*this.bgRadius;
      let radian=Tools.getTwoPointRadian({x:hp.x,y:hp.y},{x:ep.x,y:ep.y});
      let point=Tools.getAngleSpeed(radian,dis);
      let circle;
      if(this.scanEPNum>this.enemyPCA.length){
        circle=this.getCircle();
        this.enemyPCA.push(circle);
      }
      else {
        circle=this.enemyPCA[this.scanEPNum-1];
        circle.visible=true;
      }
      circle.x=point.x;
      circle.y=point.y;
    }

  }

  /**
   * 获得圆点
   * @returns {*}
   */
  getCircle(){
    let circle=new createjs.Shape();
    circle.graphics.beginFill('#000000');
    circle.graphics.drawCircle(0,0,2);
    circle.graphics.endFill();
    this.addChild(circle);
    return circle;
  }

  /**
   * 移除
   */
  remove(){

  }
}
export default RadarScan;
