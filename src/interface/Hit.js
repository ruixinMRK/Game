/**
 * Created by tudouhu on 2017/3/28.
 */

import '../vendors/../vendors/createjs';
import HeroPlaneNOR from '../gameNOR/HeroPlaneNOR';
import Bullet from '../container/Bullet';
import GameData from '../manager/GameData';
import UserData from '../manager/UserData';
import NameSpr from '../common/NameSpr';
import MyEvent from '../common/MyEvent';
import PlaneGameMI from '../gamePVP/interface/PlaneGameMI';
import PlaneGameNORMI from '../gameNOR/interface/PlaneGameNORMI';
import GameNOROverIf from '../gameNOR/interface/GameNOROverIf';
import SocketClient from '../common/socket/SocketClient';
import ShopI from './ShopI';

/**
 * 飞机游戏开始界面
 */
class Hit extends createjs.Container{


  constructor() {
    super();
    this.init();
  }

  /**
   * 初始化
   */
  init(){
    //添加键盘事件
    document.addEventListener('keyup',this.onKeyUp);
    document.addEventListener('keydown',this.onKeyUp);
    this.s1=new HeroPlaneNOR();
    this.s1.x=100;
    this.s1.y=100;
    this.addChild(this.s1);
    this.s2=new HeroPlaneNOR();
    this.addChild(this.s2);

  }

  /**
   * 按键释放
   * @param e
   */
  onKeyUp=(e)=>{

    let keyCode=e.keyCode;

    if(e.type=='keyup'&&e.key==' '){
      console.log(NameSpr.hitObj2(this.s1,this.s2,false));
      return ;
    }

    if(keyCode==65){//A
      this.s1.x-=5;
    }
    else if(keyCode==68){//D
      this.s1.x+=5;
    }
    else if(keyCode==87){//W
      this.s1.y-=5;
    }
    else if(keyCode==83){//S
      this.s1.y+=5;
    }
    else if(keyCode==81){//Q
      this.s1.rotation-=5;
    }
    else if(keyCode==69){//E
      this.s1.rotation+=5;
    }
    else if(keyCode==37){//left
      this.s2.x-=5;
    }
    else if(keyCode==38){//up
      this.s2.x+=5;
    }
    else if(keyCode==39){//right
      this.s2.y-=5;
    }
    else if(keyCode==40){//down
      this.s2.y+=5;
    }
    else if(keyCode==90){//Z
      this.s2.rotation-=5;
    }
    else if(keyCode==88){//X
      this.s2.rotation+=5;
    }

  }

  /**
   * 移除
   */
  remove(){

  }
}
export default Hit;
