/**
 * Created by tudouhu on 2017/1/21.
 */
import React from 'react';
import ReactDom from 'react-dom';
import '../vendors/createjs';
import Login from 'components/Login';
import Timer from 'common/Timer';
import Tools from './common/Tools';
import PlaneGameSI from './planeDir/interface/PlaneGameSI';
import UserData from 'manager/UserData';
import GameData from './manager/GameData';

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
    GameData.stage=this.stage;
    //createjs创建的舞台刷新才能显示，下面通过计时器设置为30毫秒刷新一次的帧频
    Timer.add(e=>{this.stage.update();},30,0);

    let oi=Tools.getInner();
    let oc=Tools.getZoomByRate(GameData.stageW,GameData.stageH,oi.width,oi.height);
    let newW = oc.getWidth();
    let newH = oc.getHeight();
    console.log(newW,newH)
    let styleObj = `width:${newW}px;height:${newH};position:absolute;top:${(oi.height - oc.getHeight())/2}px;left:${(oi.width - oc.getWidth())/2}px`
    this.refs.myCan.style.cssText = styleObj;
    //开始界面
    this.planeGameSI=new PlaneGameSI();
    this.stage.addChild(this.planeGameSI);
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
        {this.state.loginState==1?
          <canvas ref='myCan' width='1366px' height='768px'/>:
          <Login fn={this.loginSuccess}/>
        }
      </div>
    );
  }

}
//创建Main标签添加html中id=‘app'Div中
ReactDom.render(<Main></Main>,document.getElementById('app'));












