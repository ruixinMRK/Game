/**
 * Created by tudouhu on 2017/1/21.
 */
import React from 'react';
import ReactDom from 'react-dom';
import '../vendors/createjs';
import Login from 'components/Login';
import Timer from 'common/Timer';
import PlaneGame from 'planeDir/PlaneGame';
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

  }


  /**
   * 渲染完成执行
   */
  componentDidMount(){

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












