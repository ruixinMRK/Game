

import SocketClient from "./SocketClient";
import Pubsub from "../Pubsub";
import Map from "../Map";

class Router{
  constructor(){
    // parser -1:n- weigter - n:1- kpi
    this.routeTable=new Map();
  }

  /**
   * 实例
   * @returns {null|Router}
   */
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
    this.routeTable.remove(widgetUID);
  }

  dispatcher(orgData){
    if (orgData == undefined ||  orgData.length <= 2) {
      return;
    }


    try{

      let orgJsonData = JSON.parse(orgData);

      //console.log(orgJsonData);

      var kpiName = orgJsonData['KPI'];
      //console.log(kpiName);
      if(typeof orgJsonData == "object"&&this.containKpiForOther(kpiName)){

        //异步处理 非阻塞
        //(function(d,w){
        //
        //  setTimeout(function () {
        //    //发消息
        //    Pubsub.instance.publish(w, d);
        //  }, 100);
        //
        //})(orgJsonData,kpiName);
        Pubsub.instance.publish(kpiName, orgJsonData);


      }
    }catch(ex){
      console.error("Router dispatcher error! orgData: ",orgData);
      console.error("Router dispatcher error!",ex);
    }
  }

}
Router.__instance = null;
Router.KPI={plane:'plane',planeWalk:'planWalk',planeDie:'goDie',planeLive:'goLive',ping:'ping',planHit:'planHit',planProp:'planProp',
  joinPVP:'joinPVP',matchPVP:'matchPVP',destroyPvpRoom:'destroyPvpRoom',planProp:'planProp',joinNOR:'joinNOR',
  matchNOR:'matchNOR',resultPVP:'resultPVP',AiHit:'AiHit',NorTime:'NorTime',PVPTime:'PVPTime'
};

export default Router;
