/**
 * Created by tudouhu on 2017/2/20.
 */

import 'createjs';
import GameData from '../../manager/GameData';
import Prop from '../Prop';
import HeroPlane from './HeroPlane';
import NameSpr from '../../common/NameSpr';
import SocketClient from '../../common/socket/SocketClient';
import Router from '../../common/socket/Router';

/**
 * 飞机游戏地图
 */
class PlaneMap extends createjs.Container{

  /**
   * 地图
   * @type {createjs.Sprite}
   */
  mapS;
  /**
   * 道具数组
   * @type {Array}
   */
  propArr=[];
  /**
   * 道具类型
   * @type Array
   */
  propTypeArr=['p_bullet','p_gasoline','p_life'];

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
     * @type {createjs.Sprite}
     */
    this.mapS=NameSpr.getInstance().getSpr('gameBg','gameBg');
    this.addChild(this.mapS);
    //坐标
    for(let x1=0;x1<GameData.mapW/100;x1++){
      for(let y1=0;y1<GameData.mapH/100;y1++) {

        let txt = new createjs.Text(String(x1 * 100) + ',' + String(y1 * 100), "bold 14px Arial", '#ff0000');
        txt.x = x1 * 100;
        txt.y = y1 * 100;
        this.addChild(txt);
      }
    }
    //道具
    let pa=GameData.propArr;
    let length=pa.length;
    for(let i=0;i<length;i++){
      let p=pa[i];
      let prop=new Prop();
      prop.setMc(this.propTypeArr[p.type]);
      prop.x=p.x;
      prop.y=p.y;
      prop.id=p.id;
      this.addChild(prop);
      this.propArr.push(prop);
    }
    GameData.propArr=[];

    Router.instance.reg(Router.KPI.planProp,this.socketProp);
  }

  //接受服务器的socketProp数据 飞机道具
  socketProp = (data)=>{
        // console.log('接收飞机道具数据：',data);
        let idArr=data.value;
        let length=this.propArr.length;
        for(let i=0;i<length;i++){
          let prop=this.propArr[i];
          for(let d=0;d<idArr.length;d++){
            let p=idArr[d];
            if(prop.id==p.id){
              prop.x=p.x;
              prop.y=p.y;
              prop.visible=true;
            }
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
      if(this.propArr[i].visible==false) continue;
      let r2=NameSpr.rectGlobal(this.propArr[i]);
      if(r1.intersects(r2)){
        //碰撞了
        SocketClient.instance.send({KPI:Router.KPI.planProp,id:this.propArr[i].id,room:GameData.room});
        this.propArr[i].planeHit(plane);
        break;
      }
    }
  }

  /**
   * 移除
   */
  remove(){
    if(this.parent!=null)
      this.parent.removeChild(this);
  }


}
export default PlaneMap;
