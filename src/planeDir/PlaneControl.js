/**
 * Created by tudouhu on 2017/2/18.
 */

import 'createjs';
import Timer from '../common/Timer';
import HeroPlane from './HeroPlane';
import EnemyPlane from './EnemyPlane';
import Router from '../common/socket/Router';
import SocketClient from '../common/socket/SocketClient';
import UserData from '../manager/UserData';
import GameData from '../manager/GameData';
import PSData from '../manager/PSData';
import DataShow from './DataShow';

/**
 * 飞机管理
 */
class PlaneControl extends createjs.Container{
  constructor() {
    super();
    this.init();

  }

  /**
   * 初始化
   */
  init() {

    //飞机
    this.HeroPlane=new HeroPlane();
    this.HeroPlane.Name=UserData.id;
    this.HeroPlane.x=100;
    this.HeroPlane.y=100;
    this.addChild(this.HeroPlane);
    /**
     * 飞机传输数据
     * @type {PSData}
     */
    this.psd=new PSData();
    /**
     * 敌机
     * @type {{}}
     */
    this.enemyP={};
    /**
     * 敌机数据数组
     * @type {Array}
     */
    this.enemyPDataArr=[];
    //进入游戏发送数据
    this.psd.Name=this.HeroPlane.Name;
    this.psd.x=this.HeroPlane.x;
    this.psd.y=this.HeroPlane.y;
    this.psd.rot=this.HeroPlane.rotation;
    UserData.planInfo = PSData.getObj(this.psd);
  }


  /**
   * 帧频函数
   * @param e
   */
  onFrame=(e)=>{
    this.enemyPDataDispose();

    this.HeroPlane.onFrame(this);
  }

  /**
   * 敌机数据处理
   */
  enemyPDataDispose=()=>{
    //敌机数据赋值
    for(let i=this.enemyPDataArr.length-1;i>=0;i--){
      let obj=this.enemyPDataArr[i];
      if(this.enemyP[obj.Name]!=null){
        let p=this.enemyP[obj.Name];
        p.dataDispose(obj);
        //碰撞数据处理
        for(let s in obj.hitObj){

          DataShow.getInstance().hitText(obj.Name+'的子弹'+s+'击中'+obj.hitObj[s]);
          let ep;
          if(this.HeroPlane.Name==obj.hitObj[s]){
            ep=this.HeroPlane;
            GameData.send=true;
          }
          else{
            ep=this.enemyP[obj.hitObj[s]];
          }
          ep.remove();
          ep.bulletArr.forEach((b)=>{
            if(b.bulletId==s){
              b.remove();
            }
          });

        }
      }
    }
    this.enemyPDataArr=[];
    //敌机帧频
    for(let s in this.enemyP){
      if(this.enemyP[s].mc==null){
        delete this.enemyP[s];
      }
      else {
        this.enemyP[s].onFrame();
      }

    }

  }

}
export default PlaneControl;
