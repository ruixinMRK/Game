/**
 * Created by tudouhu on 2017/3/9.
 */

import '../vendors/../vendors/createjs';
import GameData from '../manager/GameData';
import UserData from '../manager/UserData';
import NameSpr from '../common/NameSpr';
import MyEvent from '../common/MyEvent';
import LoadIData from './LoadIData';
import Tools from '../common/Tools';

/**
 * 游戏加载界面
 */
class LoadI extends createjs.Container{


  constructor() {
    super();
    this.init();
  }

  /**
   * 初始化
   */
  init(){
    //背景
    this.mapS=new createjs.Shape();
    this.mapS.graphics.beginFill('#D0D0D0');
    this.mapS.graphics.drawRect(0,0,GameData.mapW,GameData.mapH);
    this.mapS.graphics.endFill();
    this.addChild(this.mapS);

    //文本
    /**
     * 加载文本
     * @type {createjs.Text}
     */
    this.loadT=NameSpr.getText(this,'正在加载资源0%',"bold 48px Arial",'#000000',450,600);

    //属性
    /**
     * 加载完成的队列文件大小
     * @type {number}
     */
    this.loadingSize=0;
    /**
     * 队列所有文件大小
     * @type {number}
     */
    this.allFileSize=0;
    /**
     * 记录队列每个文件大小
     * @type {{}}
     */
    this.fileSizeO={};
    /**
     * 加载中的文件进度大小
     * @type {{}}
     */
    this.loadingFileO={};

    Tools.ajax({data:{},url:'http://60.205.222.103:8000/shop',mothed:'post',async:true,timeout:5000,
        callback:(d)=>{
          d=JSON.parse(d);
          GameData.shopArr=d.value;
        }
      }
    ).then((data)=>{
      return Tools.ajax({data:{},url:'http://60.205.222.103:8000/userinfo',mothed:'post',async:true,timeout:5000,
          callback:(d)=>{
            d=JSON.parse(d);
            UserData.exp=d.exp;
            UserData.gold=d.money;
            GameData.planeName=d.lastuse;
          }
        }
      );
    }).then((data)=>{
      this.queue= new createjs.LoadQueue(true);
      this.queue.installPlugin(createjs.Sound);
      this.queue.on('complete',this.onLoadComplete);
      this.queue.on('error',this.onLoadError);
      this.queue.on('fileload',this.onLoadFileload);
      this.queue.on('fileprogress',this.onLoadFileProgress);
      // this.queue.on('progress',this.onLoadProgress);
      this.loadFile(LoadIData.loadData);
    });


  }

  /**
   * 加载数组中文件
   * @param fileA {Array} 加载文件数组
   */
  loadFile(fileA){
    this.loadingSize=0;
    this.allFileSize=0;
    this.fileSizeO={};
    this.loadingFileO={};

    fileA=fileA.concat();
    for(let i=0;i<fileA.length;i++){
      let obj=fileA[i];
      this.fileSizeO[obj.src]=obj.size;
      this.allFileSize+=obj.size;
      delete obj.size;
    }
    this.queue.loadManifest(fileA);
  }


  /**
   * 加载文本更新设置
   * @param fileSize 完成加载文件大小
   */
  loadTTxt=(fileSize=0)=>{
    this.loadingSize+=fileSize;
    let size=this.loadingSize;
    for(let s in this.loadingFileO){
      size+=this.loadingFileO[s];
    }
    this.loadT.text='正在加载资源'+Math.round(size/this.allFileSize*100)+'%';
  }


  /**
   *队列所有文件加载完成
   * @param event
   */
  onLoadComplete=(event)=>{
    // console.log('队列所有文件加载完成',event);
    MyEvent.dispatchEvent(MyEvent.ME_MyEvent,'start');
  }

  /**
   *加载错误
   * @param event
   */
  onLoadError=(event)=>{
    console.log('加载错误',event);
  }

  /**
   *队列进度改变
   * @param event
   */
  onLoadProgress=(event)=>{
    // console.log('队列进度改变',event);
  }

  /**
   *文件加载完成
   * @param event
   */
  onLoadFileload=(event)=>{
    // console.log('文件加载完成',event);
    // console.log('文件加载完成',event.item.src);
    let src=event.item.src;
    delete this.loadingFileO[src];
    this.loadTTxt(this.fileSizeO[src]);
  }

  /**
   *单个文件进度改变
   * @param event
   */
  onLoadFileProgress=(event)=>{
    // console.log('单个文件进度改变',event);
    // console.log('单个文件进度改变',event.item.src,event.loaed,event.progress,event.total);
    let src=event.item.src;
    this.loadingFileO[src]=event.progress*this.fileSizeO[src];
    this.loadTTxt();
  }



  /**
   * 移除
   */
  remove(){
    if(this.parent!=null)
      this.parent.removeChild(this);
  }
}
export default LoadI;
