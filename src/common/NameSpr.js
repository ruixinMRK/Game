/**
 * Created by tudouhu on 2017/2/8.
 */
import 'createjs';

/**
 * 根据名称在精灵图获得sprite 单例类
 */
class NameSpr extends createjs.Container{

  constructor(){
    super();
    this.init();
  }

  /**
   * 初始化
   */
  init(){
    let planeArr=[["plane",0,0,48,58],
      ["p_bullet",48,0,40,40],
      ["p_gasoline",88,0,40,40],
      ["p_life",128,0,40,40],
      ["bullet",168,0,20,20]
    ];
    this.setSheet('plane',['assets/img/plane.png'],planeArr);

    let gameUIArr=[["overIf_bg",0,0,300,250],
      ["people",300,0,150,150],
      ["pvp",450,0,150,150],
      ["shop",300,150,100,100],
      ["warehouse",400,150,100,100],
      ["overIf_rebirth",500,150,100,80],
      ["start",0,250,100,80],
      ["overIf_back",100,250,100,80],
    ];
    this.setSheet('gameUI',['assets/img/gameUI.png'],gameUIArr);

    let gameBgArr=[["gameBg",0,0,2000,2000]];
    this.setSheet('gameBg',['assets/img/gameBg.png'],gameBgArr);
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
    if(this[fileName+'index']==null)return null;

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


}

export default NameSpr;
