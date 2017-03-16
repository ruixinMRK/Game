/**
 * Created by tudouhu on 2017/1/21.
 */
import React from 'react';
import ReactDom from 'react-dom';
import './vendors/../vendors/createjs';
import Login from 'interface/Login';
import Timer from 'common/Timer';
import Tools from './common/Tools';
import PlaneGameSI from './interface/PlaneGameSI';
import LoadI from './interface/LoadI';
import UserData from 'manager/UserData';
import GameData from './manager/GameData';
import MyEvent from 'common/MyEvent';

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
    this.renderStage();
    window.addEventListener("resize", e=> {this.renderStage();}, false);
  }


  renderStage=e=>{
    let oi=Tools.getInner();
    let oc=Tools.getZoomByRate(GameData.stageW,GameData.stageH,oi.width,oi.height);
    let newW = oc.getWidth();
    let newH = oc.getHeight();
    let styleObj = `width:${newW}px;height:${newH}px;position:absolute;top:${(oi.height - oc.getHeight())/2}px;left:${(oi.width - oc.getWidth())/2}px;max-width:1366px;max-height:768px`
    let img = this.refs.imgBG;
    if(img.style.display === 'block')  img.style.display = 'none';

    this.refs.myCan&&(this.refs.myCan.style.cssText = styleObj);


    //移动端
    if(oi.height>oi.width){

      // oc=Tools.getZoomByRate(GameData.stageW,GameData.stageH,oi.height,oi.width);
      // newW = oc.getWidth();
      // newH = oc.getHeight();
      // styleObj = `transform:matrix(0, 1, -1, 0, ${-(newW-newH)/2},${(newW-newH)/2});width:${newW}px;height:${newH}px;position:absolute;top:0px;left:${(oi.width - newH)/2}px;max-width:1366px;max-height:768px`

      img.style.display = 'block';
      img.setAttribute('width',oi.width);
      img.setAttribute('height',oi.height);

    }



  }


  //state 更新后
  componentDidUpdate(){
    this.stage=new createjs.Stage(this.refs.myCan);
    GameData.stage=this.stage;
    //createjs创建的舞台刷新才能显示，下面通过计时器设置为30毫秒刷新一次的帧频
    Timer.add(e=>{this.stage.update();},30,0);

    this.renderStage();
    window.addEventListener("resize", e=> {this.renderStage();}, false);

    MyEvent.addEvent(MyEvent.ME_MyEvent,this.MyEventF);

    this.loadI=new LoadI();
    this.stage.addChild(this.loadI);

  }

  /**
   * 自定义事件
   * @param data
   */
  MyEventF=(data)=>{
    if(data=='start'){
      this.loadI.remove();
      this.loadI=null;
      MyEvent.removeEvent(MyEvent.ME_MyEvent,this.MyEventF);
      //开始界面
      this.planeGameSI=new PlaneGameSI();
      this.stage.addChild(this.planeGameSI);
    }
  }

  //登陆成功时
  loginSuccess = (name) =>{
    UserData.Name = name;
    this.setState({loginState:1});
  }


  /**
   * 渲染
   */
  render(){

    return(
      <div>

        {
          this.state.loginState==1?
            <canvas ref='myCan' width='1366px' height='768px'/>:
            <Login fn={this.loginSuccess}/>
        }
        <img ref = 'imgBG' src = './assets/img/test.gif' style = {{display:"none",position:'absolute',left:0,top:0}}/>
      </div>
    );
  }

}
//创建Main标签添加html中id=‘app'Div中
ReactDom.render(<Main></Main>,document.getElementById('app'));












