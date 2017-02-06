/**
 * Created by tudouhu on 2017/2/2.
 */
import React from 'react';
import ReactDom from 'react-dom';
import Tools from '../common/Tools';
import style from './Login.css';

/**
 * 登录组件 继承React.Component
 */
class Login extends React.Component{

  /**
   * 登录组件构造函数
   * @param props
   */
  constructor(props){
    super(props);
    this.state = {type:'登陆'};
  }

  /**
   * 渲染完成执行
   */
  componentDidMount(){
    //给姓名输入框添加输入事件
    this.refs.name.addEventListener("input",e=>{console.log(e.target.value)});

    //循环插入图片
    for(let i=1;i<=6;i++){
      let str='<img src="assets/icon/icon_'+i+'.png" />';
      // this.refs.iconDiv.appendChild(<img src={str}/>);
      this.refs.iconDiv.innerHTML+=str;
    }

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
         <img ref='heroIcon' src="assets/img/icon.png" className={style.heroIcon} onClick={this.onCilckImg}/>
         <div ref='iconDivP' className={style.iconDiv}>
           <div ref='iconDiv' onClick={this.onCilckIcon}>

           </div>
         </div>
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

    Tools.ajax({data:d,url:'http://60.205.222.103:8000',mothed:'get',async:true,timeout:10000,
      callback:(d)=>{

        //{"data":"0"}  //已存在
        //{"data":"1"}  // 注册成功
        //{'data':'err'} //数据库错误
        console.log(d);

        try{

          var str = JSON.parse(d).data;
          if(this.state.type == '注册'){
            if(str=='0') alert('已存在');
            else if(str =='1') {
              alert('注册成功');
              this.setState({type:'登陆'});
            }

          }
          else{
            if(str=='0') alert('用户名或者密码错误');
            else if(str =='1') {
              alert('登陆成功');
              this.refs.formDiv.innerHTML = '欢迎你'+this.refs.name.value;
              this.refs.tijiao.style.display = 'none';
            }
          }

        }
        catch(e){

        }
      }}
    )


  }

  /**
   * 注册登陆切换
   */
  change=(e)=>{
    if(this.state.type=='登陆'){
      e.target.innerHTML ='用户'+this.state.type;
      this.setState({type:'注册'});
      this.refs.heroIcon.style.cursor='pointer';
    }
    else if(this.state.type=='注册') {
      e.target.innerHTML ='用户'+this.state.type;
      this.setState({type:'登陆'});
      this.refs.heroIcon.style.cursor='default';
    }

  }

  /**
   * 头像点击
   * @param e
   */
  onCilckImg=(e)=>{
    if(this.state.type=='注册'){
      if(this.icon)
        this.icon.style['outline-style']='';
      if(this.refs.iconDivP.style.display=='')
        this.refs.iconDivP.style.display='block';
      else
        this.refs.iconDivP.style.display='';
    }
  }

  /**
   * 头像选择点击
   * @param e
   */
  onCilckIcon=(e)=>{
    e.target.style['outline-style']='solid';
    if(this.icon){
      this.icon.style['outline-style']='';
    }
    this.icon=e.target;
    this.refs.heroIcon.src=e.target.src;
  }




}


export default Login;
