/**
 * Created by tudouhu on 2017/1/21.
 */

import '../vendors/createjs';

/**
 * Other继承createjs.Container只有继承Container才能添加子元件
 */
class Other extends createjs.Container{

  /**
   * Other构造函数
   */
  constructor(){
    super();
    this.init();
  }

  /**
   * 初始化函数
   */
  init(){

    //创建文本 1显示的字符串 2字体（样式-大小-字体名） 3字体颜色
    var txt=new createjs.Text("我是Createjs创建的文本","bold 48px Arial",'#ff0000');
    this.addChild(txt);
  }

}

//导出Other模块
export default Other;













