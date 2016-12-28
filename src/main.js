
import React from 'react';
import ReactDOM from 'react-dom';
import 'createjs';
import Test from 'Test';
import Other from 'Other';

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
    //创建并实时刷新舞台
    var stage=new createjs.Stage(this.refs.myCan);
    createjs.Ticker.addEventListener("tick", e=>{stage.update()});

    stage.addChild(testS,txt);
  }

  render() {
    return (
        <div>
          <Test></Test>
          <h1>欢迎来到装逼世界</h1>
          <canvas ref = 'myCan' width="200px" height = '200px' ></canvas>
        </div>
    );
  }

}

ReactDOM.render(<Main></Main>, document.getElementById('app'));
