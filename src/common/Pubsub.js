/**
 * Created by liukai on 15/12/9.
 */
class Pubsub{
  constructor(){
    this.topics = {};
    this.subUid = -1;
    //取消订阅就不写了，遍历topics，然后通过保存前面返回token，删除指定元素
  }
  static get instance(){
    if(!Pubsub.__instance){
      Pubsub.__instance=new Pubsub();
    }
    return Pubsub.__instance;
  }
  publish(topic, args) {
    if(!this.topics[topic]) {return;}
    var subs = this.topics[topic],len = subs.length;
    while(len--) {
      subs[len].func(args);
      return ;
    }
  }
  //订阅事件
  subscribe(topic, func) {
    var topics=this.topics;
    topics[topic] = topics[topic] ? topics[topic] : [];
    var token = (++this.subUid).toString();
    topics[topic].push({
      token : token,
      func : func
    });
    return token;
  }
}

Pubsub.__instance=null;

export default Pubsub;
