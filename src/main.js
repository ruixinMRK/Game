
import React from 'react';
import ReactDOM from 'react-dom';
import Woody from 'components/Woody';
import 'createjs';
import Test from 'Test';
import Other from 'Other';
import Timer from 'common/Timer';
import Lib from 'res/Lib.js';
import Tools from 'common/Tools';

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

    // this.wood = new Woody();
    // this.wood.x = 100;
    // this.wood.y = 180;

    var flash = new Lib.Instance();
    flash.x = 200;
    flash.y = 100;

    // document.addEventListener('keydown',this.onKey);
    // document.addEventListener('keyup',this.onKey);
    document.addEventListener('mousemove',e=>{flash.txt.text = e.clientX+','+e.clientY});

    // Timer.add(this.getAjax,3000,1);

    //创建并实时刷新舞台
    var stage=new createjs.Stage(this.refs.myCan);
    Timer.add(e=>{stage.update()},30,0);

    this.refs.tijiao.addEventListener('click',e=>{

      // console.log(JSON.stringify({name:this.refs.name.value,password:this.refs.password.value,date:this.refs.date.value}));

      Tools.ajax({data:{name:this.refs.name.value,password:this.refs.password.value,date:this.refs.date.value},url:'http://60.205.222.103:8888',mothed:'get',async:true,timeout:5000,
        callback:(d)=>{
          // alert(d.data);
          console.log(JSON.parse(d).data);
          var str = JSON.parse(d).data;
          if(str == '1') alert('插入成功');
          else if(str == '0') alert('用户已经存在');


        }}
      )


    });

    stage.addChild(testS,txt,flash);
  }

  // getAjax = ()=>{
  //   Tools.ajax({url:'http://60.205.222.103:8888',mothed:'get',async:true,timeout:5000,
  //     callback:(data)=>{
  //       console.log('------我是nodejs');
  //       this.refs.ajaxDiv.innerHTML = data;
  //     }}
  //   )
  // }

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
          <div>
            名字<input type="text" ref = 'name'/>
            密码<input type="text" ref = 'password'/>
            日期<input type="text" ref = 'date'/>
            <button ref = 'tijiao'>点击注册</button>
          </div>
          <Test></Test>
          <h1>欢迎来到装逼世界</h1>
          <h1>w跳a左d右 j攻击 k技能</h1>
          <div ref='ajaxDiv'>即将获取来自nodejs的数据....</div>
          <canvas ref = 'myCan' width="1000px" height = '300px' ></canvas>
        </div>
    );
  }

}

ReactDOM.render(<Main></Main>, document.getElementById('app'));
