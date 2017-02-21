/**
 * Created by tudouhu on 2017/2/20.
 */

import 'createjs';
import Prop from './Prop';
import HeroPlane from './HeroPlane';
import NameSpr from '../common/NameSpr';

/**
 * 飞机游戏地图
 */
class PlaneMap extends createjs.Container{

  /**
   * 地图
   * @type {createjs.Shape}
   */
  mapS;
  /**
   * 道具数组
   * @type {Array}
   */
  propArr=[];

  constructor() {
    super();
    this.init();
  }

  /**
   * 初始化
   */
  init() {
    /**
     * 地图
     */
    this.mapS=new createjs.Shape();
    this.mapS.graphics.beginFill('#D0D0D0');
    this.mapS.graphics.drawRect(0,0,1000,1000);
    this.mapS.graphics.endFill();
    this.addChild(this.mapS);
    //坐标
    for(let x1=0;x1<10;x1++){
      for(let y1=0;y1<10;y1++){

        let txt=new createjs.Text(String(x1*100)+','+String(y1*100),"bold 14px Arial",'#ff0000');
        txt.x=x1*100;
        txt.y=y1*100;
        this.addChild(txt);
      }
    }
    //创建道具
    let sprNameArr=['p_bullet','p_gasoline','p_life'];
    for(let i=sprNameArr.length-1;i>=0;i--){
      let sn=sprNameArr[i];
      for(let n=0;n<2;n++){
        let prop=new Prop();
        prop.setMc(sn);
        this.addChild(prop);
        this.propArr.push(prop);
      }
    }
  }


  /**
   * 帧频函数
   * @param e
   */
  onFrame=(e)=>{

  }

  /**
   * 道具与飞机碰撞检测
   * @param plane {HeroPlane}
   */
  propHit(plane){
    let r1=NameSpr.rectGlobal(plane);
    for(let i=this.propArr.length-1;i>=0;i--){
      let r2=NameSpr.rectGlobal(this.propArr[i]);
      if(r1.intersects(r2)){
        //碰撞了
        this.propArr[i].planeHit(plane);
      }
    }
  }

}
export default PlaneMap;
