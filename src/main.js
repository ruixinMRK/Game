
import React from 'react';
import ReactDOM from 'react-dom';
import Woody from 'components/Woody';
import 'createjs';
import Test from 'Test';
import Other from 'Other';
import Timer from 'common/Timer';
import Lib from 'res/Lib.js';

class Main extends React.Component {

  constructor(props) {
    super(props);
  }

  componentWillUnmount(){

    alert('页面即将卸载')

  }

  componentDidMount(){


    var testS = new createjs.Shape();
    testS.graphics.beginFill('#00ff00');
    testS.graphics.drawRect(0,0,100,50);
    testS.graphics.endFill();

    var txt = new Other();
    txt.y = 50;

    this.wood = new Woody();
    this.wood.x = 100;
    this.wood.y = 180;

    var flash = new Lib.Instance();
    flash.x = 200;
    flash.y = 100;

    document.addEventListener('keydown',this.onKey);
    document.addEventListener('keyup',this.onKey);
    document.addEventListener('mousemove',e=>{flash.txt.text = e.clientX+','+e.clientY});

    //创建并实时刷新舞台
    var stage=new createjs.Stage(this.refs.myCan);
    Timer.add(e=>{stage.update()},30,0);

    stage.addChild(testS,txt,this.wood,flash);
  }

  onKey = (e)=>{

    var type = e.type =='keydown'?true:e.type=='keyup'?false:'';
    var keyCode = e.keyCode;
    switch(keyCode){

      case 87:
        type?this.wood.jump():'';
        break;
      case 65:
        type?this.wood.startWalk(-2,0):e.type=='keyup'?this.wood.stopWalk():'';
        break;
      case 83:
        break;
      case 68:
        type?this.wood.startWalk(2,0):e.type=='keyup'?this.wood.stopWalk():'';
        break;
      case 74:
        //j
        this.wood.startAttack(3);
        break;
      case 75:
        //k
        this.wood.startguiqizhan();
        break;
      case 76:
        //l
        break;
      case 32:
        this.wood.startDecelerate();
        break;
      default:
        break;
    }

  }

  render() {
    return (
        <div>
          <Test></Test>
          <h1>欢迎来到装逼世界</h1>
          <h1>w跳a左d右 j攻击 k技能</h1>
          <canvas ref = 'myCan' width="1000px" height = '300px' ></canvas>
        </div>
    );
  }

}

ReactDOM.render(<Main></Main>, document.getElementById('app'));
