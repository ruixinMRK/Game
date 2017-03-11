/**
 * Created by tudouhu on 2017/2/8.
 */
import 'createjs';
import NameSprData from './NameSprData';

/**
 * 根据名称在精灵图获得sprite 单例类
 */
class NameSpr extends createjs.Container{

  constructor(){
    super();
    //预加载精灵图加载到内存
    this.getSpr('gameUI');
    this.getSpr('plane');
    this.getSpr('gameBg');
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
    //判断是否有精灵图索引存在，不存在读取NameSprData数据创建精灵图索引，NameSprData也没有对应数据则返回null
    if(this[fileName+'index']==null){
      if(NameSprData.sprData[fileName]!=null){
        let obj=NameSprData.sprData[fileName];
        this.setSheet(fileName,obj.srcA,obj.frameA);
      }
      if(this[fileName+'index']==null)return null;
    }
    if(sprName==null)return null;

    //获得创建一个sprite
    let spr=new createjs.Sprite(this[fileName+'sheet']);
    spr.fileName=fileName;
    spr.sprName=sprName;
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


  /**
   * 获得对象父级坐标的矩形框 返回矩形框
   * @param spr 对象
   */
  static rectGlobal(spr){
    let rect=spr.getBounds();
    rect.x+=spr.x;
    rect.y+=spr.y;
    return rect;
  }

  /**
   * 获得一个文本
   * @param parent 文本显示父级
   * @param strText 文本内容
   * @param font 字体
   * @param color 颜色
   * @param sx x
   * @param sy y
   * @returns {*} 文本
   */
  static getText(parent,strText='',font="bold 24px Arial",color='#000000',sx=0,sy=0){
    let text=new createjs.Text(strText,font,color);
    text.x=sx;
    text.y=sy;
    parent.addChild(text);
    return text;
  }


  /**
   * 获得一个sprite 快捷创建
   * @param parent 父级
   * @param fileName 文件名
   * @param sprName sprite名
   * @param sx x
   * @param sy y
   * @returns {*} sprite
   */
  static getNameSpr(parent,fileName,sprName,sx=0,sy=0){
    let spr=NameSpr.getInstance().getSpr(fileName,sprName);
    spr.x=sx;
    spr.y=sy;
    parent.addChild(spr);
    return spr
  }

}

export default NameSpr;
