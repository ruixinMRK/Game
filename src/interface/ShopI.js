/**
 * Created by tudouhu on 2017/3/26.
 */


import '../vendors/../vendors/createjs';
import GameData from '../manager/GameData';
import UserData from '../manager/UserData';
import NameSpr from '../common/NameSpr';
import MyEvent from '../common/MyEvent';
import PlaneGameMI from '../gamePVP/interface/PlaneGameMI';
import PlaneGameNORMI from '../gameNOR/interface/PlaneGameNORMI';
import GameNOROverIf from '../gameNOR/interface/GameNOROverIf';
import SocketClient from '../common/socket/SocketClient';
import Tools from '../common/Tools';

/**
 * 游戏商店
 */
class ShopI extends createjs.Container{

  /**
   * 飞机索引
   * @type {number}
   */
  planeIndex=0;

  constructor() {
    super();
    this.init();
  }

  /**
   * 初始化
   */
  init(){
    /**
     * 界面背景
     * @type {createjs.Sprite}
     */
    this.bgS=NameSpr.getNameSpr(this,'gameUI','shopIfBg');
    /**
     * 金币文本
     * @type {createjs.Text}
     */
    this.goldT=NameSpr.getText(this,'',"bold 24px Arial",'#000000',0,470);
    /**
     * 钻石文本
     * @type {createjs.Text}
     */
    this.diamondT=NameSpr.getText(this,'',"bold 24px Arial",'#000000',200,470);
    this.textUpdate();
    /**
     * 关闭按钮
     * @type {createjs.Sprite}
     */
    this.closeS=NameSpr.getNameSpr(this,'gameUI','close',950,-50);
    /**
     * 上一页
     * @type {createjs.Sprite}
     */
    this.upPageS=NameSpr.getNameSpr(this,'gameUI','pageTurning',50,230);
    this.upPageS.scaleX=-1;
    /**
     * 下一页
     * @type {createjs.Sprite}
     */
    this.nextS=NameSpr.getNameSpr(this,'gameUI','pageTurning',950,230);
    /**
     * 飞机界面数组
     * @type {Array}
     */
    this.planeIA=[];
    for(let i=0;i<4;i++){
      let p=new ShopPlaneI();
      p.x=i*(200+33)+50;
      p.y=80;
      this.addChild(p);
      this.planeIA.push(p);
    }


    //居中
    let bound=this.getBounds();
    this.x=(GameData.stageW-bound.width)/2;
    this.y=(GameData.stageH-bound.height)/2;
    //事件
    this.addEventListener('click',this.onClick);
    MyEvent.addEvent(MyEvent.ME_MyEvent,this.MyEventF);

    this.planeUpdate();
  }



  /**
   * 自定义事件返回界面 飞机更新
   * @param data
   */
  MyEventF=(data)=>{
    if(data=='planeUpdata'){
      this.planeUpdate();
      this.textUpdate();
    }
  }

  /**
   * 点击事件
   * @param e {Event}
   */
  onClick=(e)=>{
    let targetS=e.target;
    if(targetS==this.closeS){
      this.visible=false;
    }
    else if(targetS==this.upPageS){
      this.planeIndex-=4;
      if(this.planeIndex<0){
        this.planeIndex=0;
      }
      this.planeUpdate();
    }
    else if(targetS==this.nextS){
      this.planeIndex+=4;
      if(this.planeIndex>GameData.shopArr.length-4){
        this.planeIndex=GameData.shopArr.length-4;
      }
      this.planeUpdate();
    }
  }

  /**
   * 飞机显示更新
   */
  planeUpdate(){
    let sa=GameData.shopArr;
    for(let i=0;i<4;i++){
      let sp=this.planeIA[i];
      sp.setProp(sa[this.planeIndex+i]);
    }
  }

  /**
   * 文本更新
   */
  textUpdate(){
    this.goldT.text='金币：'+UserData.gold;
    this.diamondT.text='钻石：'+UserData.diamond;
  }

  /**
   * 移除
   */
  remove(){

  }
}
export default ShopI;



/**
 * 游戏商店飞机
 */
class ShopPlaneI extends createjs.Container{

  /**
   * 飞机数据
   * @type {{}}
   */
  planeDataO={};

  constructor() {
    super();
    this.init();
  }

  /**
   * 初始化
   */
  init(){
    /**
     * 界面背景
     * @type {createjs.Sprite}
     */
    this.bgS=NameSpr.getNameSpr(this,'gameUI','shopPlaneBg');
    /**
     * 飞机
     * @type {createjs.Sprite}
     */
    this.planeS=NameSpr.getNameSpr(this,'plane','plane0',50,20);
    /**
     * 购买按钮
     * @type {createjs.Sprite}
     */
    this.buyS=NameSpr.getNameSpr(this,'gameUI','buy',50,310);
    /**
     * 飞机名文本
     * @type {createjs.Text}
     */
    this.nameT=NameSpr.getText(this,'飞机名',"bold 24px Arial",'#000000',50,150);
    /**
     * 使用中文本
     * @type {createjs.Text}
     */
    this.useT=NameSpr.getText(this,'使用中',"bold 24px Arial",'#000000',50,180);

    //事件
    this.addEventListener('click',this.onClick);
  }

  /**
   * 飞机属性状态设置
   * @param planeData 飞机数据
   */
  setProp(planeData){
    this.planeDataO=planeData;
    this.nameT.text=planeData.nameCh;
    NameSpr.getInstance().gotoAndStop(this.planeS,GameData.planeNameO[planeData.nameEng]);
    if(planeData.have){
      this.useT.text='已拥有';
      this.buyS.visible=true;
      NameSpr.getInstance().gotoAndStop(this.buyS,'use');
    }
    else {
      this.buyS.visible=true;
      NameSpr.getInstance().gotoAndStop(this.buyS,'buy');
      this.useT.text='金币：'+planeData.price;
    }
    if(GameData.planeName==planeData.nameEng){
      this.useT.text='使用中';
      this.buyS.visible=false;
    }
  }

  /**
   * 点击事件
   * @param e {Event}
   */
  onClick=(e)=>{
    let targetS=e.target;
    if(targetS==this.buyS){
      if(this.buyS.sprName=='buy'){
        let d={buyName:this.planeDataO.nameEng};
        let pro=Tools.ajax({data:d,url:'http://60.205.222.103:8000/shop',mothed:'post',async:true,timeout:5000});
        pro.then(
          d=>{
            console.log(d);
            this.planeDataO.have=1;
            UserData.gold-=this.planeDataO.price;
            MyEvent.dispatchEvent(MyEvent.ME_MyEvent,'planeUpdata');
          }
        ).catch(e=>{alert(e)});
      }
      else if(this.buyS.sprName=='use'){
        let d={default:GameData.planeName};
        let pro=Tools.ajax({data:d,url:'http://60.205.222.103:8000/userinfo',mothed:'post',async:true,timeout:5000});
        pro.then(
          d=>{
            console.log(d);
            GameData.planeName=this.planeDataO.nameEng;
            MyEvent.dispatchEvent(MyEvent.ME_MyEvent,'planeUpdata');
          }
        ).catch(e=>{alert(e)});
      }
    }
  }

  /**
   * 移除
   */
  remove(){

  }
}
