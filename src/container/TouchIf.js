/**
 * Created by tudouhu on 2017/3/10.
 */

import '../vendors/createjs';
import GameData from '../manager/GameData';
import NameSpr from '../common/NameSpr';
import Tools from '../common/Tools';

/**
 * 触屏操作界面
 */
class TouchIf extends createjs.Container{

  constructor() {
    super();
    this.init();
  }

  /**
   * 初始化
   */
  init(){
    // 属性
    /**
     * 摇杆属性 x,y中心点 radius半径
     * @type {{x: number, y: number, radius: number}}
     */
    this.rocker={x:200,y:550,radius:150}
    //按钮
    /**
     *摇杆底
     * @type {createjs.Sprite}
     */
    this.rockerBg=NameSpr.getNameSpr(this,'gameUI','rockerBg',this.rocker.x-150,this.rocker.y-150);
    /**
     *摇杆按钮
     * @type {createjs.Sprite}
     */
    this.rockerBtn=NameSpr.getNameSpr(this,'gameUI','rockerBtn',this.rocker.x-50,this.rocker.y-50);
    /**
     *攻击按钮
     * @type {createjs.Sprite}
     */
    this.attack=NameSpr.getNameSpr(this,'gameUI','attack',1200,600);
    //事件
    createjs.Touch.enable(GameData.stage);
    this.addEventListener('mousedown',this.onMouseDown);
    this.rockerBtn.addEventListener('pressmove',this.onPressMove);
    this.addEventListener('pressup',this.onPressUP);
  }

  /**
   * 鼠标按下
   * @param e {Event}
   */
  onMouseDown=(e)=>{
    let targetS=e.target;
    // console.log('onMouseDown:'+targetS.sprName)
    if(targetS==this.attack){
      GameData.key_J=true;
    }
  }

  /**
   * 鼠标按下移动
   * @param e {Event}
   */
  onPressMove=(e)=>{
    //按钮移动
    let dis=Tools.getDis({x:this.rocker.x,y:this.rocker.y},{x:e.stageX,y:e.stageY});
    let radian=Tools.getTwoPointRadian({x:this.rocker.x,y:this.rocker.y},{x:e.stageX,y:e.stageY});
    let rot=Tools.getJD(radian);
    if(dis<this.rocker.radius){
      this.rockerBtn.x=e.stageX-50;
      this.rockerBtn.y=e.stageY-50;
    }
    else{
      let as=Tools.getAngleSpeed(radian,this.rocker.radius);
      this.rockerBtn.x=this.rocker.x+as.x-50;
      this.rockerBtn.y=this.rocker.y+as.y-50;
    }
    //按键清除
    GameData.key_A=false;
    GameData.key_D=false;
    GameData.key_S=false;
    GameData.key_W=false;
    //方向判断
    let dir=this.getDir(rot,8);
    if(dir=='right'){
      GameData.key_D = true;
    }
    else if(dir=='rightDown'){
      GameData.key_D = true;
      GameData.key_S = true;
    }
    else if(dir=='down'){
      GameData.key_S = true;
    }
    else if(dir=='leftDown'){
      GameData.key_S = true;
      GameData.key_A = true;
    }
    else if(dir=='left'){
      GameData.key_A = true;
    }
    else if(dir=='leftUp'){
      GameData.key_A = true;
      GameData.key_W = true;
    }
    else if(dir=='up'){
      GameData.key_W = true;
    }
    else if(dir=='rightUp'){
      GameData.key_W = true;
      GameData.key_D = true;
    }


  }

  /**
   * 鼠标按下释放
   * @param e {Event}
   */
  onPressUP=(e)=>{
    let targetS=e.target;
    // console.log('onPressUP:'+targetS.sprName);
    if(targetS==this.attack){
      GameData.key_J=false;
    }
    else if(targetS==this.rockerBtn){
      GameData.key_A=false;
      GameData.key_D=false;
      GameData.key_S=false;
      GameData.key_W=false;
      this.rockerBtn.x=this.rocker.x-50;
      this.rockerBtn.y=this.rocker.y-50;
    }
  }

  /**
   * 获得摇杆方向
   * @param rot 角度 0到180 0到-180
   * @param dirNum 8=8方向 4=4方向 默认为8
   * @returns {string}
   */
  getDir=(rot,dirNum=8)=>{
    let dir='';
    if(dirNum==4){
      if(rot>=-45&&rot<45){
        dir+='right';
      }
      else if(rot>=45&&rot<135){
        dir+='down';
      }
      else if(rot>=135||rot<-135){
        dir+='left';
      }
      else if(rot>=-135&&rot<-45){
        dir+='up';
      }
    }
    else if(dirNum==8){
      if(rot>=-22.5&&rot<22.5){
        dir+='right';
      }
      else if(rot>=22.5&&rot<67.5){
        dir+='rightDown';
      }
      else if(rot>=67.5&&rot<112.5){
        dir+='down';
      }
      else if(rot>=112.5&&rot<157.5){
        dir+='leftDown';
      }
      else if(rot>=157.5||rot<-157.5){
        dir+='left';
      }
      else if(rot>=-157.5&&rot<-112.5){
        dir+='leftUp';
      }
      else if(rot>=-112.5&&rot<-67.5){
        dir+='up';
      }
      else if(rot>=-67.5&&rot<-22.5){
        dir+='rightUp';
      }
    }
    return dir;
  }


  /**
   * 移除
   */
  remove(){

  }
}
export default TouchIf;
