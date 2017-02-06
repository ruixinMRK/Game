/**
 * Created by tudouhu on 2017/1/21.
 */
import React from 'react';


/**
 * Test继承React.Component,React库组件支持html5标签写法
 */
class Test extends React.Component{

  /**
   * Test构造函数
   * @param props
   */
  constructor(props){
    super(props);
  }

  /**
   * 渲染
   * @returns {XML}
   */
  render(){
    return(
      <div>我是Test继承React.Component创建的</div>
    );
  }

}
//导出默认模块Test
export default Test;
