/**
 * Created by tudouhu on 2017/2/2.
 */
import React from 'react';
import ReactDom from 'react-dom';
import Tools from '../common/Tools';
import style from './Login.css';

/**
 * 组件 继承React.Component
 */
class SelectIcon extends React.Component{

  /**
   * 构造函数
   * @param props
   */
  constructor(props){
    super(props);
  }

  /**
   *  组件即将渲染,在render之前
   */
  componentWillMount(){

    this.imgA = this.props.imgArr.map((item,i)=>{
      return <img src = {item} key ={'img_'+i} ></img>
    })

  }

  /**
   * 渲染完成执行
   */
  componentDidMount(){
    //this.refs.iconDiv.addEventListener("scroll", e=>{console.log(e.target.scrollTop)});
    //e.target.value//上传文件的路径.隔开
    // e.target.files//上传文件
    this.refs.fileUp.addEventListener('change',e=>{

      //将文件以Data URL形式读入页面  必须要支持H5
      //需要兼容ie6-id8 查看 http://www.2cto.com/kf/201402/281430.html
      //this.result 加载的结果
      var reader = new FileReader();
      reader.readAsDataURL(e.target.files[0]);
      reader.onload = (e)=>{
        this.refs.heroIcon.src=e.target.result;
      }

      //上传图片中...
      let fd = new FormData();
      fd.append('iconImg',e.target.files[0]);


      Tools.ajax({data:fd,upload:true,url:'http://60.205.222.103:8000/upload',mothed:'post',async:true,timeout:0,
        callback:(d)=>{
            console.log(d);
        }}
      )



    });
  }

  /**
   * 头像点击
   * @param e
   */
  toggle=(e)=>{
    let dis = this.refs.iconDiv;
    let comDis = dis.style.display||window.getComputedStyle(dis).display;
    comDis=='none'?dis.style.display = 'block':(this.icon.style['outline-style']='none',this.refs.iconDiv.firstChild.style['outline-style']='solid',dis.scrollTop=0,dis.style.display = 'none');
  }

  /**
   * 头像选择点击
   * @param e
   */
  onCilckIcon=(e)=>{

    if(e.target.nodeName !== 'IMG') return;
    this.icon&&(this.icon.style['outline-style']='none');
    this.refs.iconDiv.firstChild.style['outline-style']='none';
    (e.target.style['outline-style']='solid')&&(this.refs.heroIcon.src=e.target.src)&&(this.icon=e.target);

  }

  /**
   * 渲染
   */
  render(){
    return(
      <div className={style.selectIconDiv}>
        <img ref='heroIcon' src="assets/img/icon.png" className={style.heroIcon} onClick={this.toggle}/>
        <div ref='iconDiv' className={style.iconDiv} onClick={this.onCilckIcon}>
              {this.imgA}
              <label className={style.ui_button} htmlFor="xFile">上传文件</label>
              <input ref = 'fileUp' className = {style.fileUp} type="file" id ='xFile' accept="image/*"/>
        </div>

      </div>
    );
  }

}


export default SelectIcon;
