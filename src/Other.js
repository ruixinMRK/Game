/**
 * Created by Administrator on 2016/12/27.
 */

class Other extends createjs.Container{

  constructor(){
    super();
    this.init();
  }

  init(){

    var txt = new createjs.Text('我是1Other',"20px 'Microsoft Yahei'",'#f00');
    this.addChild(txt);

  }


}

export default Other;
