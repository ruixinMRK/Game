
import React from 'react';
import ReactDOM from 'react-dom';

class Main extends React.Component {

  constructor(props) {
    super(props);
  }

  componentWillUnmount(){

    alert('页面即将卸载')

  }

  componentDidMount(){

    alert('渲染完成,我是土豆虎12');

  }

  render() {
    return (
        <h1>欢迎来到装逼世界</h1>
    );
  }

}

ReactDOM.render(<Main></Main>, document.getElementById('app'));
