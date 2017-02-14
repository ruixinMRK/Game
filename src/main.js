/**
 * Created by tudouhu on 2017/1/21.
 */
import React from 'react';
import ReactDom from 'react-dom';
import '../vendors/createjs';
import Other from 'Other';
import Test from 'Test';
import Login from 'components/Login';
import Timer from 'common/Timer';
import Lib from 'res/Lib';
import Woody from 'components/Woody';
import PlaneGame from 'planeDir/PlaneGame';
import SocketClient from 'common/socket/SocketClient';
import UserData from 'manager/UserData';

/**
 * 继承React.Component类 React组件类继承可以写成html写法  1366x768
 */
class Main extends React.Component{


  /**
   * Main类构造函数
   * @param props
   */
  constructor(props){
    super(props);
    this.state = {loginState:0};
    //0为未登录成功  1为登陆成功
  }


  /**
   * 页面卸载移除
   */
  componentWillUnMount(){
    alert("页面卸载移除");
  }


  /**
   * 渲染完成执行
   */
  componentDidMount(){



    //显示帧频 默认createjs刷新20
    // createjs.Ticker.framerate = 60;
    // var FPS = {};
    // FPS.time = 0;
    // FPS.FPS = 0;
    // FPS.startFPS = function (stage){
    //   FPS.shape = new createjs.Shape();
    //   FPS.shape.graphics.beginFill("#000000").drawRect(0, 0, 200, 50);
    //   stage.addChild(FPS.shape);
    //   FPS.txt =new createjs.Text("", "40px Arial", "#ffffff");
    //   stage.addChild(FPS.txt);
    //   createjs.Ticker.addEventListener("tick", FPS.TickerFPS);
    // }
    // FPS.TickerFPS = function (event)
    // {
    //   FPS.date = new Date();
    //   FPS.currentTime = FPS.date.getTime();
    //   if(FPS.time!=0)
    //   {
    //     FPS.FPS = Math.ceil(1000/(FPS.currentTime -  FPS.time));
    //   }
    //   FPS.time = FPS.currentTime;
    //   FPS.txt.text = "FPS: "+FPS.FPS;
    // }
    // FPS.startFPS(stage);
  }

  //state 更新后
  componentDidUpdate(){
    this.stage=new createjs.Stage(this.refs.myCan);
    //createjs创建的舞台刷新才能显示，下面通过计时器设置为30毫秒刷新一次的帧频
    Timer.add(e=>{this.stage.update();},30,0);

    var planeG=new PlaneGame();
    this.stage.addChild(planeG);
  }

  //登陆成功时
  loginSuccess = (name) =>{
    UserData.id = name;
    this.setState({loginState:1});
  }

  /**
   * 渲染
   */
  render(){
    return(
      <div>
        <h1>A左 D右 J攻击</h1>
        <p ref='ping'></p>
        {this.state.loginState==1?
          <canvas ref='myCan' width='800px' height='300px'/>:
          <Login fn={this.loginSuccess}/>
        }
      </div>
    );
  }

}
//创建Main标签添加html中id=‘app'Div中
ReactDom.render(<Main></Main>,document.getElementById('app'));












