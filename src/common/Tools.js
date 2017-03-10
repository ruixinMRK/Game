/*
 *  16-11-30
 *  工具类
 */

import Timer from './Timer';

class Tools{

  constructor(){

  }

  /*
  *  15-264    操作DOM有关
  *
  */
  //获取节点(ex:Tools.getDOM('#xxx ccc')) 提供简单的获取dom节点操作
  static getDOM(args){

    let childElements = [];
    if (args.indexOf(' ') != -1) {
      let elements = args.split(' ');			//把节点拆开分别保存到数组里
      //存放临时节点对象的数组，解决被覆盖的问题
      let node = [];								//用来存放父节点用的
      for (let i = 0; i < elements.length; i ++) {
        if (node.length == 0) node.push(document);		//如果默认没有父节点，就把document放入

        switch (elements[i].charAt(0)) {
          case '#' :
            childElements = [];				//清理掉临时节点，以便父节点失效，子节点有效
            childElements.push(Tools.getID(elements[i].substring(1)));
            node = childElements;		//保存父节点，因为childElements要清理，所以需要创建node数组

            break;
          case '.' :
            childElements = [];
            for (let j = 0; j < node.length; j ++) {

              let temps = Tools.getClass(elements[i].substring(1), node[j]);

              for (let k = 0; k < temps.length; k ++) {
                childElements.push(temps[k]);
              }
            }

            node = childElements;
            break;
          default :
            childElements = [];
            for (let j = 0; j < node.length; j ++) {
              let temps = Tools.getTagName(elements[i], node[j]);
              for (let k = 0; k < temps.length; k ++) {
                childElements.push(temps[k]);
              }
            }
            node = childElements;
        }
      }
      this.elements = childElements;
    } else {

      switch (args.charAt(0)) {
        case '#' :
          childElements.push(Tools.getID(args.substring(1)));
          break;
        case '.' :
          childElements.push(Tools.getClass(args.substring(1)));
          break;
        default :
          childElements.push(Tools.getTagName(args));
      }
    }

    if(childElements.length>1) return childElements;
    else if(childElements.length == 1) return childElements[0];
    else throw new Error('no node is find');
  }
  //获取id
  static getID(id){
    return document.getElementById(id);
  }
  //根据节点名字获取dom节点
  static getTagName(tag, parentNode){
    let node = null;
    let temps = [];
    if (parentNode != undefined) {
      node = parentNode;
    } else {
      node = document;
    }
    let tags = node.getElementsByTagName(tag);
    for (let i = 0; i < tags.length; i ++) {
      temps.push(tags[i]);
    }
    return temps;
  }
  //通过class获取节点
  static getClass(className, parentNode){

    let node = null;
    let temps = [];
    if (parentNode != undefined) {
      node = parentNode;
    } else {
      node = document;
    }

    let all = node.getElementsByTagName('*');
    for (let i = 0; i < all.length; i ++) {
      // console.log(all[i].className);
      if ((new RegExp('(\\s|^)' +className +'(\\s|$)')).test(all[i].className)) {
        temps.push(all[i]);
      }
    }
    return temps;
  }
  //设置样式
  static setDivStyle(div,obj){
    for(let attr in obj){
      div.style[attr] = obj[attr];
    }
  }
  //给css增加一个规则
  static addRule(sheet, selectorText, cssText, position){

    if (sheet.insertRule) {
      sheet.insertRule(selectorText + "{" + cssText + "}", position);
    } else if (sheet.addRule) {
      sheet.addRule(selectorText, cssText, position);
    }

  }
  //获取div样式
  static getDivStyle(div,att){
    let style = null;
    //如果div中没有写样式，在非IE中会返回默认样式，在ie中返回auto字符串
    if (window.getComputedStyle) {
      style = window.getComputedStyle(div, null);    // 非IE
    } else {
      style = div.currentStyle;  // IE
    }
    return att?style[att]:style;
  }
  //是否有对应的class
  static hasClass(dom, className) {
    return dom.className.match(new RegExp('(\\s|^)' +className +'(\\s|$)'));
  }
  //增加class
  static addClassName(dom,str){
    if (!Tools.hasClass(dom, str)) {
      dom.className += ' ' + str;
    }
  }
  //移除class
  static removeClassName(dom,str){
    if (Tools.hasClass(dom, str)) {
      dom.className = dom.className.replace(new RegExp('(\\s|^)' +str +'(\\s|$)'), ' ');
    }
  }
  //获取视口大小
  static getInner() {
    if (typeof window.innerWidth != 'undefined') {
      return {
        width : window.innerWidth,
        height : window.innerHeight
      }
    } else {
      return {
        width : document.documentElement.clientWidth,
        height : document.documentElement.clientHeight
      }
    }
  }
  //获取dom节点的x,y,w,h
  //是否加上以滚动的高度
  static getDOMClient(div,deep){
    let rect = div.getBoundingClientRect();
    let top = document.documentElement.clientTop;
    let left= document.documentElement.clientLeft;
    let x = rect.left|0;
    let y = rect.top|0;
    let w = (rect.width||rect.right - x)|0;
    let h = (rect.height||rect.bottom - y)|0;
    if(deep) {
      x+= Tools.getScroll().left;
      y+= Tools.getScroll().top;
    }
    return {x:x - left,y:y - top,w:w,h:h};
  }
  //获取网页的总高度
  static getScrollHeight(){
    return Math.max(document.body.scrollHeight,document.documentElement.scrollHeight);
  }

  //跨浏览器获取滚动条位置
  static getScroll() {
    return {
      top : document.documentElement.scrollTop || document.body.scrollTop,
      left : document.documentElement.scrollLeft || document.body.scrollLeft
    }
  }

  //注册事件
  static addEvent(obj, type, fn) {

    let same = function(es, fn){
      for (let i in es) {
        if (es[i] == fn) return true;
      }
      return false;
    }

    //IE阻止默认行为
    let preventD = function () {
      this.returnValue = false;
    };

    //IE取消冒泡
    let stopProp = function () {
      this.cancelBubble = true;
    };

    //把IE常用的Event对象配对到W3C中去
    let fixEvent = function (event) {
      event.preventDefault = preventD;
      event.stopPropagation = stopProp;
      event.target = event.srcElement;
      return event;
    };

    let exec = function (event) {
      let e = event || fixEvent(window.event);
      let es = this.events[e.type];
      for (let i in es) {
        es[i].call(this, e);
      }
    };

    if (typeof obj.addEventListener != 'undefined') {
      obj.addEventListener(type, fn, false);
    } else {
      //创建一个存放事件的哈希表(散列表)
      if (!obj.events) obj.events = {};
      //第一次执行时执行
      if (!obj.events[type]) {
        //创建一个存放事件处理函数的数组
        obj.events[type] = [];
        //把第一次的事件处理函数先储存到第一个位置上
        if (obj['on' + type]) obj.events[type][0] = fn;
      } else {
        //同一个注册函数进行屏蔽，不添加到计数器中
        if (same(obj.events[type], fn)) return false;
      }
      //从第二次开始我们用事件计数器来存储
      obj.events[type][Tools.addEventId++] = fn;
      //执行事件处理函数
      obj['on' + type] = exec;
    }
  }
  //跨浏览器删除事件
  static removeEvent(obj, type, fn) {
    if (typeof obj.removeEventListener != 'undefined') {
      obj.removeEventListener(type, fn, false);
    } else {
      if (obj.events) {
        for (let i in obj.events[type]) {
          if (obj.events[type][i] == fn) {
            delete obj.events[type][i];
          }
        }
      }
    }
  }


  /*
   *  274-454    数学算法有关
   *
   */

  //贝塞尔算法
  static Bezier(){

    //  对外变量
    var p_start={x:0,y:0};// 起点
    var p_ctrl={x:0,y:0};// 贝塞尔点
    var p_over={x:0,y:0};// 终点
    var step;// 分割份数

    //  辅助变量
    var ax;
    var ay;
    var bx;
    var by;
    var A;
    var B;
    var C;
    var total_length;// 长度

    //  速度函数
    var s =  function(t) {
      return Math.sqrt(A * t * t + B * t + C);
    }

    //  长度函数
    var L = function(t) {
      var temp_ctrl = Math.sqrt(C + t * (B + A * t));
      var temp_over = (2 * A * t * temp_ctrl + B *(temp_ctrl - Math.sqrt(C)));
      var temp3 = Math.log(B + 2 * Math.sqrt(A) * Math.sqrt(C));
      var temp4 = Math.log(B + 2 * A * t + 2 * Math.sqrt(A) * temp_ctrl);
      var temp5=2*Math.sqrt(A)*temp_over;
      var temp6 = (B * B - 4 * A * C) * (temp3 - temp4);
      return (temp5 + temp6) / (8 * Math.pow(A, 1.5));
    }

    //  长度函数反函数，使用牛顿切线法求解
    var InvertL =  function(t, l){
      var t1=t;
      var t2;
      do {
        t2 = t1 - (L(t1) - l)/s(t1);
        if (Math.abs(t1-t2) < 0.000001) {
          break;
        }
        t1=t2;
      } while (true);
      return t2;
    }

    //  返回所需总步数 (前3个是point)
    var init =  function($p_start, $p_ctrl, $p_over, $speed) {
      p_start=$p_start;
      p_ctrl=$p_ctrl;
      p_over=$p_over;
      //step = 30;
      ax=p_start.x-2*p_ctrl.x+p_over.x;
      ay=p_start.y-2*p_ctrl.y+p_over.y;
      bx=2*p_ctrl.x-2*p_start.x;
      by=2*p_ctrl.y-2*p_start.y;
      A = 4*(ax * ax + ay * ay);
      B = 4*(ax * bx + ay * by);
      C=bx*bx+by*by;
      //  计算长度
      total_length=L(1);
      //  计算步数
      step = Math.floor(total_length / $speed);
      if (total_length % $speed > $speed / 2) {
        step++;
      }
      return step;
    }

    // 根据指定nIndex位置获取锚点：返回坐标和角度
    var getAnchorPoint = function (nIndex) {
      if (nIndex >= 0 && nIndex <= step) {
        var t=nIndex/step;
        //  如果按照线行增长，此时对应的曲线长度
        var l=t*total_length;
        //  根据L函数的反函数，求得l对应的t值
        t=InvertL(t,l);
        //  根据贝塞尔曲线函数，求得取得此时的x,y坐标
        var xx = (1 - t) * (1 - t) * p_start.x + 2 * (1 - t) * t * p_ctrl.x + t * t * p_over.x;
        var yy = (1 - t) * (1 - t) * p_start.y + 2 * (1 - t) * t * p_ctrl.y + t * t * p_over.y;
        //  获取切线
        var Q0 = {x:(1 - t) * p_start.x + t * p_ctrl.x, y:(1 - t) * p_start.y + t * p_ctrl.y};
        var Q1 = {x:(1 - t) * p_ctrl.x + t * p_over.x, y:(1 - t) * p_ctrl.y + t * p_over.y};
        //  计算角度
        var dx=Q1.x-Q0.x;
        var dy=Q1.y-Q0.y;
        var radians=Math.atan2(dy,dx);
        var degrees=radians*180/Math.PI;
        xx=parseInt(xx*10)/10
        yy=parseInt(yy*10)/10
        degrees=parseInt(degrees*10)/10
        return [xx, yy, degrees];
      } else {
        return [];
      }
    }

    return{
      getStep:init,
      getAnchorPoint:getAnchorPoint
    }

  }

  //角度转弧度
  static getHD(num){
    return num * Math.PI /180;
  }
  //弧度转角度
  static getJD(num){
    return num * 180 /Math.PI;
  }
  //获取坐标旋转固定角度之后的坐标
  //x,y,角度，是否为弧度
  static getXY(x1,y1,num,isHD){
    if(!isHD) num = Tools.getHD(num);
    let x = Math.cos(num)*x1 + Math.sin(num)*y1;
    let y = Math.cos(num)*y1 - Math.sin(num)*x1;
    return [x|0,y|0];
  }
  //贝塞尔曲线
  static drawArc(point1,point2,dis,bol){
    //这是一个比较复杂的几何问题，下面我们来解决一下,先声明四个点，p,p1,p2,p0,分别代表绘制曲线点，任意的两个点及p1,p2的中心点p0。
    var p,p1,p2,p0;
    //声明变量用以存储计算结果，分别是p1,p2的x坐标的差和y坐标的差及p,p0的x坐标差，y坐标差
    var dx,dy;
    //让我们来赋值一下，运用一下最基本的坐标计算
    dx = point2.x - point1.x;
    dy = point2.y - point1.y;
    //以下结果是通过线性方程计算而来。初中学过的哟。
    p0={x:0,y:0};
    p0.x =(point2.x+point1.x) * 0.5,p0.y = (point2.y+point1.y) * 0.5;
    //这个p点，就是我们要计算的结果，有了这个点，就能绘制这个弧线了。
    p={x:0,y:0};
    //我们来定义两个变量，分别代表p的x方向的坐标及y方向的坐标
    var px,py;
    //根据勾股定理(px-p0.x)*(px-p0.x)+(py-p0.y)*(py-p0.y)=dis*dis
    var k = dx / dy,bb = p0.x * k + p0.y;
    var a = 1 + k * k;
    var b = -2*(p0.x+k*bb-k*p0.y);
    var c = p0.x * p0.x + p0.y * p0.y + bb * bb - 2 * bb * p0.y - dis * dis;
    //上面的a,b,c是二次方程中的a,b,c常数项，就是我们常说的ax^2+bx+c=0;
    if (bol)
    {
      px=(-b+Math.sqrt(b*b-4*a*c))/(2*a);
      py =  -  k * px + bb;
    }
    else
    {
      px=(-b-Math.sqrt(b*b-4*a*c))/(2*a);
      py =  -  k * px + bb;
    }
    p.x = px,p.y = py;
    return p;
  }
  //获取一条线段上的所有点,相隔多少像素一个点
  static getLinePoint(arr,p){

    // AX+BY+C=0;
    // A = Y2 - Y1
    // B = X1 - X2
    // C = X2*Y1 - X1*Y2
    let a = arr[3] - arr[1];
    let b = arr[0] - arr[2];
    let c = arr[2]*arr[1] - arr[0]*arr[3];
    let returnArr = [];
    //x轴相等
    let j = 0;
    p = p||1;
    if(arr[0] == arr[2]){
      for(;j<Math.abs(arr[1]-arr[3]);j+=p){
        returnArr.push(arr[0],arr[1]+j);
      }
    }
    else if(arr[1] == arr[3]){
      for(;j<Math.abs(arr[2]-arr[0]);j+=p){
        returnArr.push(arr[0]+j,arr[1]);
      }
    }
    else{
      for(;j<Math.abs(arr[2]-arr[0]);j+=p){
        returnArr.push(arr[0]+j,(-c - a * (arr[0]+j)) /b);//x,y
      }
    }
    returnArr.push(arr[2],arr[3]);
    return returnArr;

  }
  //计算两点距离
  static getDis(p1,p2){
    let dx = p2.x - p1.x;
    let dy = p2.y - p1.y;
    let d = Math.sqrt(dx*dx + dy*dy);
    return d;
  }
  //计算两点弧度
  static getTwoPointRadian(p1,p2){
    let dx = p2.x - p1.x;
    let dy = p2.y - p1.y;
    let d = Math.atan2(dy,dx);
    return d;
  }
  /**
   * 计算角速度
   * @param radian 弧度
   * @param speed 速度
   * @returns {{}} obj.x=x速度 obj.y=y速度
   */
  static getAngleSpeed(radian,speed){
    let obj={};
    obj.x=Math.cos(radian)*speed;
    obj.y=Math.sin(radian)*speed;
    return obj;
  }
  //取两轴的数值
  static drawY(cormax,cormin,cornumber){
    let temp = 0;
    let extranumber = 0;
    let corstep = 0;
    let tmpstep = 0;
    let tmpnumber = 0;
    let tempCormin = false;
    if(cormin>=0) tempCormin = true;
    // console.log(cormax,cormin,cornumber,'---');
    if(cormax<=cormin)
      return null ;
    corstep=(cormax*1.1-cormin)/cornumber;
    if(Math.pow(10,parseInt(Math.log(corstep)/Math.log(10)))==corstep){
      temp = Math.pow(10,parseInt(Math.log(corstep)/Math.log(10)));
    }else{
      temp = Math.pow(10,(parseInt(Math.log(corstep)/Math.log(10))+1));
    }
    tmpstep = Number((corstep/temp).toFixed(6));
    //选取规范步长
    if(tmpstep>=0&&tmpstep<=0.1){
      tmpstep = 0.1;
    }else if(tmpstep>=0.100001&&tmpstep<=0.2){
      tmpstep = 0.2;
    }else if(tmpstep>=0.200001&&tmpstep<=0.25){
      tmpstep = 0.25;
    }else if(tmpstep>=0.250001&&tmpstep<=0.5){
      tmpstep = 0.5
    }else{
      tmpstep = 1;
    }
    tmpstep = tmpstep * temp;
    if(parseInt(cormin/tmpstep)!=(cormin/tmpstep)){
      if(cormin<0){
        cormin = (-1) * Math.ceil(Math.abs(cormin/tmpstep))*tmpstep;
      }else{
        cormin = parseInt(Math.abs(cormin/tmpstep))*tmpstep;
      }

    }
    if(parseInt(cormax/tmpstep)!=(cormax/tmpstep)){
      cormax = parseInt(cormax/tmpstep+1)*tmpstep;
    }
    tmpnumber = (cormax-cormin)/tmpstep;
    if(tmpnumber<cornumber){
      extranumber = cornumber - tmpnumber;
      tmpnumber = cornumber;
      if(extranumber%2 == 0){
        cormax = cormax + tmpstep*parseInt(extranumber/2);
      }else{
        cormax = cormax + tmpstep*parseInt(extranumber/2+1);
      }
      cormin = cormin - tmpstep*parseInt(extranumber/2);
    }
    cornumber = tmpnumber;

    let arrValue = [];
    let size = parseInt((cormax-cormin)/cornumber);

    console.log(cormin,cormax);
    if(cormax <5) arrValue = [0,1,2,3,4,5];
    else{

      tempCormin&&(cormin = 0);
      for(let i = 0;i<cornumber+1;i++){
        arrValue.push(cormin + i*size);
      }
    }

    return arrValue;
  }

  /*
   *  471-    工具有关
   *
   */
  //获取键
  static getKey(obj){
    let key = '';
    for(let str in obj){
      key = str;
    }
    return key;
  }
  //获取对象的值
  static getValue(obj){
    let value = '';
    for(let str in obj){
      value = obj[str];
    }
    return value;
  }
  //,'compositeOperation'
  static replaceArr = ['props','refs','componentWillUnmount','componentDidMount','componentWillUpdate','componentDidUpdate','_debugID','isMounted','enqueueCallback','enqueueCallbackInternal','enqueueForceUpdate','enqueueReplaceState','enqueueSetState','enqueueElementInternal','validateCallback'];
  static checkGL(a){

    for(let t = 0;t<Tools.replaceArr.length;t++){
      if(a.hasOwnProperty(Tools.replaceArr[t])) return true;
    }
    return false;
  }
  //*********此方法必须要在最后调用(清除属性)********/
  static clearProp(_this){
    let arr = Object.keys(_this);
    for(let i=0;i<arr.length;i++){
      let obj = _this[arr[i]];
      //||typeof obj === 'function'
      if(!obj||typeof obj === 'function'||(Tools.replaceArr.indexOf(arr[i])>-1)||Tools.checkGL(obj)||arr[i]==='poolArr') continue;
      if(obj.canvas&&obj.canvas.tagName =='CANVAS') {
        //使用createjs框架时,要把stage挂在this上

        obj.enableMouseOver(0);
        obj.enableDOMEvents(false);
        obj.removeAllEventListeners();
        obj.removeAllChildren();
        obj.clear();
        obj.canvas = null;

      }
      if(obj instanceof createjs.DisplayObject) continue;
      if(Array.isArray(obj)){
        obj.length = 0;
      }
      else if(typeof obj === 'object'){
        for(let str in obj){
          if(!obj.hasOwnProperty(str)) continue;
          if(Array.isArray(obj[str])){
            obj[str].length = 0;
          }
          //console.log(obj,str,Object.getOwnPropertyDescriptor(obj,str).configurable);
          if(Object.getOwnPropertyDescriptor(obj,str).configurable) delete obj[str];
        }
      }

      delete _this[arr[i]];
      _this[arr[i]] = null;
      obj = null;
    }
    arr.length = 0;
    arr = null;
  }

  //判断字符是否是对象的属性(包括原型链)
  static hasProperty(o,prop){
        return (prop in o);
      }
  //判断字符是否是存在于对象的原型链中
  static hasPropertyJustInPrototype(o,prop){
    return !o.hasOwnProperty(prop) && (prop in o);
  }
  //取canvas点击处的颜色
  static getColor(can,x,y,isHex){

    if(!can) return new Error('is not canvas');
    let ctx = can.getContext("2d");
    let imgData = ctx.getImageData(x,y,1,1).data.slice(0,4);

    if(isHex){
      let HexStr = '#';
      imgData.forEach(a=>{
        let str = a.toString(16);
        HexStr += str.length<2?'0'+str:str;
      });
      imgData = HexStr;
    }
    return imgData;
  }
  /*
   "Null","Boolean","Number","String"
   "Array","RegExp","Object","Function",'Undefined'
   */
  //获取类型
  static getType(o){
    var s = Object.prototype.toString.call(o);
    return s.substring(8,s.length-1);
  }
  //是否是引用类型
  static isRefType(o){
    var t = Tools.getType(o);
    return t!=="String" && t!=="Number" && t!== "Boolean" && t !== "Null";
  }
  //将srcObj的属性复制一份给toObj
  static addPropCover(toObj,srcObj){
    for(let k in srcObj){
      if(!Tools.isRefType(srcObj[k])){
        toObj[k] = srcObj[k];
      }else{
        let t = Tools.getType(srcObj[k]);
        if(t==="Object"){
          if(Tools.hasProperty(toObj,k)){
            Tools.addPropCover(toObj[k],srcObj[k]);
          }else{
            toObj[k] = {};
            Tools.addPropCover(toObj[k],srcObj[k]);
          }
        }else{
          toObj[k] = srcObj[k];
        }
      }
    }
  }

  //填充字符串(原字符,字符串总长,需要填充的字符,是否从左侧开始填充)
  static fillString(s,num,fillC,blLeft){
    var l = s.toString().length;
    var f = "";
    for(var i=0;i<num - l;i++){
      f += fillC;
    }
    if(blLeft){
      return f+s;
    }else{
      return s+f;
    }

  }


  //获取格式化时间 例子：dateFormat(new Date(), "yyyy-MM-dd hh:mm:ss")
  static dateFormat(oDate = new Date(), fmt = "yyyy-MM-dd hh:mm:ss") {

    if(typeof oDate === 'number') oDate = new Date(oDate);

    var o = {
      "M+": oDate.getMonth() + 1, //月份
      "d+": oDate.getDate(), //日
      "h+": oDate.getHours(), //小时
      "m+": oDate.getMinutes(), //分
      "s+": oDate.getSeconds(), //秒
      "q+": Math.floor((oDate.getMonth() + 3) / 3), //季度
      "S": oDate.getMilliseconds()//毫秒
    };
    if(/(y+)/.test(fmt)) {
      //首先替换年份的数据
      fmt = fmt.replace(RegExp.$1, (oDate.getFullYear() + "").substr(4 - RegExp.$1.length));
    }
    for (var k in o) {
      if(new RegExp("(" + k + ")").test(fmt)) {
        //依次判断对应的格式,RegExp.$1.length == 1如果是长度为1时,碰到数据小于10的时候，不进行不自动往数据前加0
        fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
      }
    }
    return fmt;
  };

  //获取url中参数 GetParamsString('id')
  static getParamsString(name){
    let reg = new RegExp("(^|&)"+ name +"=([^&]*)(&|$)");
    let r = window.location.search.substr(1).match(reg);
    if(r!=null)return  decodeURI(r[2]); return null;
  }

  //获取浏览器类型
  static getBrowser(){
    let agent = navigator.userAgent.toLowerCase() ;
    let regStr_ie = /msie [\d.]+;/gi ;
    let regStr_ff = /firefox\/[\d.]+/gi
    let regStr_chrome = /chrome\/[\d.]+/gi ;
    let regStr_saf = /safari\/[\d.]+/gi ;
    //IE
    if(agent.indexOf("msie") > 0) return agent.match(regStr_ie) ;
    //firefox
    if(agent.indexOf("firefox") > 0)  return agent.match(regStr_ff) ;
    //Chrome
    if(agent.indexOf("chrome") > 0) return agent.match(regStr_chrome) ;
    //Safari
    if(agent.indexOf("safari") > 0 && agent.indexOf("chrome") < 0) return agent.match(regStr_saf) ;
  }
  //判断时候是微信端
  static isWX(){
    let ua = navigator.userAgent.toLowerCase();
    if(ua.match(/MicroMessenger/i)=="micromessenger") {
      return true;
    } else {
      return false;
    }
  }
  //判断是否是手机端
  static isMobile() {
    return navigator.userAgent.match(/android|iphone|ipad|ipod|blackberry|meego|symbianos|windowsphone|ucbrowser/i)
  }
  //处理长字符串，将其过多的字符用其他字符替代，比如，字符过长，将多余的用...替代
  static doLongString(str,upCount,count,repStr){
    if(str && str.length>upCount)
    {
      let s = str.substr(0,upCount-count);
      return s+repStr;
    }
    return str;
  }
  //获取区间随机数 isI 为是否取整
  static getRandomNum(min,max,isI){
    if(min==null)min=0;
    if(max==null)max=100;
    isI = typeof isI != 'undefined'?isI:false;
    let n = Math.random()*(max - min) + min;
    n = isI?parseInt(n):n;
    return n;
  }
  //比较两个对象是否相等
  static equalObj(...args) {
    if (typeof args[0] != typeof args[1])
      return false;

    //数组
    if (args[0] instanceof Array)
    {
      if (args[0].length != args[1].length)
        return false;

      let allElementsEqual = true;
      for (let i = 0; i < args[0].length; ++i)
      {
        if (typeof args[0][i] != typeof args[1][i])
          return false;

        if (typeof args[0][i] == 'number' && typeof args[1][i] == 'number')
          allElementsEqual = (args[0][i] == args[1][i]);
        else
          allElementsEqual = args.callee(args[0][i], args[1][i]);            //递归判断对象是否相等
      }
      return allElementsEqual;
    }

    //对象
    if (args[0] instanceof Object && args[1] instanceof Object)
    {
      let result = true;
      let attributeLengthA = 0, attributeLengthB = 0;
      for (let o in args[0])
      {
        //判断两个对象的同名属性是否相同（数字或字符串）
        if (typeof args[0][o] == 'number' || typeof args[0][o] == 'string')
          result = args[0][o] === args[1][o];
        else {
          //如果对象的属性也是对象，则递归判断两个对象的同名属性
          //if (!args.callee(args[0][o], args[1][o]))
          if (Tools.equalObj(args[0][o],args[1][o]))
          {
            result = false;
            return result;
          }
        }
        ++attributeLengthA;
      }

      for (let o in args[1]) {
        ++attributeLengthB;
      }
      //如果两个对象的属性数目不等，则两个对象也不等
      if (attributeLengthA != attributeLengthB)
        result = false;
      return result;
    }
    return args[0] == args[1];
  }
  //删除左后空格
  static trim(str) {
    return str.replace(/(^\s*)|(\s*$)/g, '');
  }
  //去除数组中重复对象
  static unique(arr) {
    let result = [], hash = {};
    for (let i = 0, elem; (elem = arr[i]) != null; i++) {
      if (!hash[elem]) {
        result.push(elem);
        hash[elem] = true;
      }
    }
    return result;
  }
  /**
   * 忽略大小写判断字符串是否相同
   * @param str1
   * @param str2
   * @returns {Boolean}
   */
  static isEqualsIgnorecase(str1,str2){
      if(str1.toUpperCase() == str2.toUpperCase())
      {
        return true;
      }
      return false;
  }
  //保留中文
  static toCN(str) {
    var regEx = /[^\u4e00-\u9fa5\uf900-\ufa2d]/g;
    return str.replace(regEx, '');
  }
  //克隆对象
  static clone(obj){
    let o;
    switch(typeof obj){
      case 'undefined': break;
      case 'string'   : o = obj + '';break;
      case 'number'   : o = obj - 0;break;
      case 'boolean'  : o = obj;break;
      case 'object'   :
        if(obj === null){
          o = null;
        }else{
          if(obj instanceof Array){
            o = [];
            for(let i = 0, len = obj.length; i < len; i++){
              o.push(Tools.clone(obj[i]));
            }
          }else{
            o = {};
            for(let k in obj){
              o[k] = Tools.clone(obj[k]);
            }
          }
        }
        break;
      default:
        o = obj;break;
    }
    return o;
  }

  //生成随机字符串
  static getRandomStr(len) {
    let str = "";
    for( ; str.length < len; str  += Math.random().toString(36).substr(2));
    return  str.substr(0, len);
  }
  //生成随机颜色
  static randomColor(){
    let colorStr=Math.floor(Math.random()*0xFFFFFF).toString(16).toUpperCase();
    return "#"+"000000".substring(0,6-colorStr)+colorStr;
  }
  //将颜色加深 level为加深颜色的等级
  static getDarkColor(color, level) {
    let rgbc = Tools.HexToRgb(color);
    for (let i = 0; i < 3; i++) rgbc[i] = Math.floor(rgbc[i] * (1 - level));
    return Tools.RgbToHex(rgbc[0], rgbc[1], rgbc[2]);
  }
  //将Hex转换为rgb
  static HexToRgb(str) {
    str = str.replace("#", "");
    //match得到查询数组
    let hxs = str.match(/../g);
    for (let i = 0; i < 3; i++) hxs[i] = parseInt(hxs[i], 16);
    return hxs;
  }
  //将rgb颜色值为a,b,c转化成hex颜色值
  static RgbToHex(a, b, c) {
    let hexs = [a.toString(16), b.toString(16), c.toString(16)];
    for (let i = 0; i < 3; i++) if (hexs[i].length == 1) hexs[i] = "0" + hexs[i];
    return "#" + hexs.join("");
  }

  //操作cookie
  static cookie(key,value,time){
    let l = args.length;

    let getCookie = function(a){
      let arr,reg=new RegExp("(^| )"+a+"=([^;]*)(;|$)");
      if(arr=document.cookie.match(reg))
        return decodeURIComponent(arr[2]);
      else
        return null;
    }

    let setCookie = function(a,b,c){
      c = c||10;
      let d = new Date();   //初始化时间
      d.setTime(d.getTime() + c * 1000);   //时间
      document.cookie = a+"="+b+";expires="+d.toGMTString()+";path=/";

    }

    if(l == 1){
      return getCookie(key);
    }
    else{
      setCookie(key,value,time)
    }
  }

  //ajax请求
  //{data:{},url:'',upload:true,mothed:'post,get',callback:function(){},async:true,timeout:6000};
  static ajax(obj){

    var xhr = Tools.createAjax();

    let url = obj.url;
    let mothed = obj.mothed;
    let timeout = obj.timeout;
    var keyTimer = '';

    //解析参数
    if(mothed === 'get') url +=  '?' + Tools.paramsData(obj.data);
    if(url.indexOf('?')>0) url+='&r=' + Math.random();
    else url+='?r=' + Math.random();

    //判断是否完成
    if(obj.async){
      xhr.onreadystatechange = function(){
        if(xhr.readyState == 4){
          Timer.clear(keyTimer);
          Tools.ajaxCallBack(xhr,obj.callback,obj.error);
        }
      }
    }

    //到时间后取消请求
    if(timeout&&timeout>0){
      function ajaxTimeOut(){
        obj.error&&obj.error();
        xhr.abort();
      }
      keyTimer = Timer.add(ajaxTimeOut,timeout,1);
    }

    //发送请求
    xhr.open(mothed,url,obj.async);
    if(mothed === 'post'){
      if(!obj.upload) xhr.setRequestHeader('Content-Type','application/x-www-form-urlencoded');
      xhr.send(obj.upload?obj.data:Tools.paramsData(obj.data,obj.dataType));
    }
    else{
      xhr.send(null);
    }

    console.log('ajax url is:',url);
    //同步的话
    if(!obj.async)  Tools.ajaxCallBack(xhr,obj.callback,obj.error);
    // return xhr.abort;
  }

  //创建ajax
  static createAjax(){
    let i = 0;
    for(;i<Tools.cacheAjax.length;i++){
      if(Tools.cacheAjax[i].readyState == 0|| Tools.cacheAjax[i].readyState == 4){
        return Tools.cacheAjax[i];
      }
    }

    let xmlhttp = null;
    if (window.XMLHttpRequest)
    {// code for IE7+, Firefox, Chrome, Opera, Safari
      xmlhttp=new XMLHttpRequest();
    }
    else
    {// code for IE6, IE5
      xmlhttp=new ActiveXObject("Microsoft.XMLHTTP");
    }
    Tools.cacheAjax[Tools.cacheAjax.length] = xmlhttp;
    console.log(Tools.cacheAjax.length);
    return xmlhttp;

  }

  static paramsData(data,json){

    if(!data) return '';
    if(json) return JSON.stringify(json);
    let arr = [];
    for(let str in data){
      arr.push( encodeURIComponent(str) + '=' + encodeURIComponent(data[str]));
    }
    return arr.join('&');

  }

  static ajaxCallBack(xhr,success,error){

    if(xhr.status===0) {
      return;
    }
    if(xhr.status == 200){

      //let arr = xhr.responseText.split("#");
      //let i = 0;
      //let cacheData = [];
      //for(; i<arr.length;i++){
      //  let obj = null;
      //  try{
      //    obj = JSON.parse(arr[i]);
      //  }
      //  catch(e){
      //    console.log('解析数据错误');
      //  }
      //  if(obj) cacheData.push(obj);
      //}
      ////Router.instance.dispatcher(arr[i])
      //let returnObj = cacheData.length>1?cacheData:cacheData[0];
      success&&success(xhr.responseText);
      // Router.instance.dispatcher(returnObj);
    }
    else{
      error&&error();
    }

  }

  //容器自适应
  static getZoomByRate(_srcWidth,_srcHeight,_maxWidth,_maxHeight){

    // 变量声明
    let isZoom=false;//是否缩放
    let srcWidth=_srcWidth;//原始宽
    let maxWidth=_maxWidth;//限制宽
    let srcHeight=_srcHeight;//原始高
    let maxHeight=_maxHeight;//限制高
    let newWidth=0;//新宽
    let newHeight=0;//新高

    let conductimg = function(){
      if(isZoom){//如果高宽正常，开始计算
        if(srcWidth/srcHeight>=maxWidth/maxHeight){
          //比较高宽比例，确定以宽或者是高为基准进行计算。
          if(srcWidth>maxWidth){//以宽为基准开始计算，
            //当宽度大于限定宽度，开始缩放
            newWidth=maxWidth;
            newHeight=(srcHeight*maxWidth)/srcWidth
          }else{
            //当宽度小于限定宽度，直接返回原始数值。
            newWidth=srcWidth;
            newHeight=srcHeight;
          }
        }else{
          if(srcHeight>maxHeight){//以高为基准，进行计算
            //当高度大于限定高度，开始缩放。
            newHeight=maxHeight;
            newWidth=(srcWidth*maxHeight)/srcHeight
          }else{
            //当高度小于限定高度，直接返回原始数值。
            newWidth=srcWidth;
            newHeight=srcHeight;
          }
        }
      }else{//不正常，返回0
        newWidth=0;
        newHeight=0;
      }
    }

    let getWidth = function(){//���ش����Ŀ�ȣ���ȷ��2��С����
      let num = new Number(newWidth);
      return num.toFixed(2);
    }

    let getHeight = function(){//���ش����ĸ߶ȣ���ȷ��2��С����
      let num = new Number(newHeight);
      return num.toFixed(2);
    }


    if(srcWidth>0 && srcWidth>0){//检查图片高度是否正常
      isZoom=true;//高宽正常，执行缩放处理
    }else{
      isZoom=false;//不正常，返回0
    }
    conductimg();//执行缩放算法

    return{
      getWidth:getWidth,
      getHeight:getHeight
    }

  }

}
Tools.addEventId = 0;
Tools.t = 0;
Tools.cacheAjax = [];

export default Tools;
