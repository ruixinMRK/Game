/**
 * Created by tudouhu on 2017/2/8.
 */
import '../vendors/createjs';
import NameSprData from './NameSprData';
import Tools from './Tools';

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
   * @param urlArr 路径
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
   * @param sprName sprite名称
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
   * 跳转帧并暂停
   * @param spr 精灵
   * @param sprName sprite名称
   */
  gotoAndStop(spr,sprName){
    spr.gotoAndStop(this[spr.fileName+'index'][sprName]);
    spr.sprName=sprName;
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
   * 对象碰撞检测 s1检测s2
   * @param s1 对象1
   * @param s2 对象2
   * @param grid 网格碰撞检测 默认true
   * @returns {boolean}
   */
  static hitObj1(s1,s2,grid=true){
    if(grid){
      if(Math.floor(s1.x/NameSpr.gridW)!=Math.floor(s2.x/NameSpr.gridW)||Math.floor(s1.y/NameSpr.gridH)!=Math.floor(s2.y/NameSpr.gridH))
        return false;
    }

    let ha=s1.hitArr.concat();
    let i;
    let pa;
    for(i=0;i<ha.length;i++){
      pa=ha[i];
      if(s1.rotation%360!=0)
        pa=Tools.getXY(pa[0],pa[1],s1.rotation,false);
      pa=s1.localToLocal(pa[0],pa[1],s2);
      if(s2.hitTest(pa.x,pa.y))
        return true;
    }
    return false;
  }

  /**
   * 对象碰撞检测 s1,s2相互检测
   * @param s1 对象1
   * @param s2 对象2
   * @param grid 网格碰撞检测 默认true
   * @returns {boolean}
   */
  static hitObj2(s1,s2,grid=true){
    if(grid){
      if(Math.floor(s1.x/NameSpr.gridW)!=Math.floor(s2.x/NameSpr.gridW))
        return false;
      if(Math.floor(s1.y/NameSpr.gridH)!=Math.floor(s2.y/NameSpr.gridH))
        return false;
    }

    if(NameSpr.hitObj1(s1,s2,false))
      return true;
    return NameSpr.hitObj1(s2,s1,false);
  }

  /**
   * 获得对象在舞台全局坐标的矩形框
   * 注册点不为0，矩形x,y和对象x,y转全局不同 返回矩形框
   * @param spr 对象
   */
  static rectGlobal(spr){
    let rect=spr.getBounds();
    let p=spr.localToGlobal(0,0);
    rect.x=p.x;
    rect.y=p.y;
    return rect;
  }


  /**
   * 对象注册点居中
   * @param spr 对象
   */
  static registerPointCenter(spr){
    let bound = spr.getBounds();
    spr.regX = bound.width / 2;
    spr.regY = bound.height / 2;
  }

  /**
   * 设置对象碰撞点(4个顶点)
   * @param spr 对象
   * @param spr
   * @returns {[*,*,*,*]} 碰撞点坐标
   */
  static setHitPoint(spr){
    let bound = spr.getBounds();
    let hitArr=[[bound.x,bound.y],[bound.x,bound.y+bound.height],
      [bound.x+bound.width,bound.y],[bound.x+bound.width,bound.y+bound.height],
      [bound.x+bound.width/2,bound.y+bound.height/2]];
    return hitArr;
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

/**
 * 网格高
 * @type {number}
 */
NameSpr.gridW=200;

/**
 * 网格宽
 * @type {number}
 */
NameSpr.gridH=200;


export default NameSpr;
