/**
 * Created by tudouhu on 2017/2/2.
 */
import React from 'react';
import ReactDom from 'react-dom';
import Tools from '../common/Tools';
import style from './Login.css';
import SelectIcon from './SelectIcon.jsx';

/**
 * 登录组件 继承React.Component
 */
class Login extends React.Component{

  /**
   * 登录组件构造函数
   * @param props
   */
  constructor(p){
    super(p);
    this.state = {type:'login'};
    this.img = [];
    for(let j =0;j<=2;j++){
      for(let i =1;i<=6;i++){
        this.img.push('assets/icon/icon_'+i+'.png');
      }
    }


  }

  /**
   * 渲染完成执行
   */
  componentDidMount(){
    // console.log('is ok')
  }

  /**
   * 渲染
   */
  render(){
      return(
       <div className={style.bk}>

         <div ref='formDiv' className={style.bk}>
           <h1>用户{this.state.type}</h1>
           <div className={style.nameDiv}>
             名字<input type="text" ref='name'/>
           </div>
           <div className={style.passwordDiv}>
             密码<input type="text" ref='password'/>
           </div>
           <button ref='tijiao' onClick={this.toggle} className={style.btn} >
             {this.state.type}
           </button>
           <div  className={style.sign}>
             <u onClick={this.change}>用户注册</u>
           </div>
         </div>
         {this.state.type=='reg'?<SelectIcon  imgArr = {this.img}></SelectIcon>:null}
       </div>
      );
  }


  /**
   * 登录
   */
  toggle = e=>{


    if(this.refs.name.value==''||this.refs.password.value=='') {
      alert('请输入完整的账户和密码');
      return;
    }

    let d = {name:this.refs.name.value,password:this.refs.password.value,type:this.state.type};

    Tools.ajax({data:d,url:'http://60.205.222.103:8000/user',mothed:'get',async:true,timeout:5000,
      callback:(d)=>{

        //{"data":"0"}  //已存在
        //{"data":"1"}  // 注册成功
        //{'data':'err'} //数据库错误

        try{

          var str = JSON.parse(d).data;
          if(this.state.type == 'reg'){
            if(str=='0') alert('已存在');
            else if(str =='1') {
              alert('注册成功');
            }

          }
          else{
            if(str=='0') alert('用户名或者密码错误');
            else if(str =='1') {
              this.props.fn(this.refs.name.value);
            }
          }

        }
        catch(e){

        }
      },
      error:e=>{
        alert('服务器错误,请稍后重新尝试!!')
      }
  }
    )


  }

  /**
   * 注册登陆切换
   */
  change=(e)=>{
    if(this.state.type=='login'){
      e.target.innerHTML ='用户登陆';
      this.setState({type:'reg'});
    }
    else if(this.state.type=='reg') {
      e.target.innerHTML ='用户注册';
      this.setState({type:'login'});
    }

  }

}


export default Login;
