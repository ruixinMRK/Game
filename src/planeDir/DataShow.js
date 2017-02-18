/**
 * Created by tudouhu on 2017/2/17.
 */


import GameData from '../manager/GameData';
import UserData from '../manager/UserData';
import Timer from '../common/Timer';

/**
 * 数据显示 FPS ping
 */
class DataShow{

  constructor(){
    //击中文本
    this.hittxt=new createjs.Text('',"bold 30px Arial",'#000000');
    this.hittxt.x = 100;
    this.hittxt.y = 30;
    GameData.stage.addChild(this.hittxt);
    this.hitText(UserData.id+'加入游戏');
    //ping文本
    this.pingTxt=new createjs.Text('',"bold 18px Arial",'#FFFFFF');
    this.pingTxt.x = 720;
    this.pingTxt.text='ping:';
    GameData.stage.addChild(this.pingTxt);
    //FPS文本
    this.FPSTxt=new createjs.Text('',"bold 18px Arial",'#FFFFFF');
    this.FPSTxt.x = 650;
    this.FPSTxt.text='FPS:';
    GameData.stage.addChild(this.FPSTxt);
  }

  /**
   * 帧频函数
   * @param e
   */
  onFrame=(e)=>{
    this.FPSTxt.text='FPS:'+Timer.FPS;
  }




  /**
   * 显示击中
   * @param str
   */
  hitText(str){
    this.hittxt.visible=true;
    this.hittxt.text=str;
    Timer.add(()=>{
      if(str==this.hittxt.text)
        this.hittxt.visible=false;
    },3000,1);
  }


  /**
   * 获得实例
   * @returns {DataShow}
   */
  static getInstance() {
    if (!DataShow.instance) {
      DataShow.instance = new DataShow();
    }
    return DataShow.instance;
  }




}

export default DataShow;
