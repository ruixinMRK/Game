

import SocketClient from "./SocketClient";
import Pubsub from "common/Pubsub";
import Map from "common/Map";

class Router{
  constructor(){
    // parser -1:n- weigter - n:1- kpi
    this.routeTable=new Map();
  }

  static get instance(){
    if(!Router.__instance){
      Router.__instance=new Router();
    }
    return Router.__instance;
  }

  //注册id
  reg(widgetUID,dataBinder){

    var obj = {};
    obj.id = widgetUID;
    obj.dataBinder=dataBinder;
    this.routeTable.put(widgetUID,obj);
    //weidget 订阅数据方法更新
    SocketClient.instance;
    Pubsub.instance.subscribe(widgetUID, dataBinder);

  };

  //判断数据是否在注册中
  containKpiForOther(widgetUID){
    var arr = this.routeTable.keySet();
    for ( let i=0;i<arr.length;i++) {
      if (arr[i] === widgetUID) {
        return true;
      }
    }
    return false;
  };

  //取消注册
  unreg(widgetUID){

    this.routeTable.remove(widgterObj["id"]);
  }

  dispatcher(orgData){
    if (orgData == undefined ||  orgData.length <= 2) {
      return;
    }


    try{

      let orgJsonData = JSON.parse(orgData);

      //console.log(orgJsonData);

      var kpiName = orgJsonData['name'];
      //console.log(kpiName);
      if(typeof orgJsonData == "object"&&this.containKpiForOther(kpiName)){

          //异步处理 非阻塞
          (function(d,w){

            setTimeout(function () {
              //发消息
              Pubsub.instance.publish(w, d);
            }, 100);

          })(orgJsonData,kpiName);

      }
    }catch(ex){
      console.error("Router dispatcher error! orgData: ",orgData);
      console.error("Router dispatcher error!",ex);
    }
  }

}

Router.__instance = null;

export default Router;
