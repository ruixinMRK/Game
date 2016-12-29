
import React from 'react';
import ReactDOM from 'react-dom';
import Woody from 'components/Woody';

class Main extends React.Component {

  constructor(props) {
    super(props);
  }

  componentWillUnmount(){

    alert('页面即将卸载')

  }

  componentDidMount(){



  }

  render() {
    return (
        <h1>欢迎来到装逼世界</h1>
    );
  }

}

ReactDOM.render(<Main></Main>, document.getElementById('app'));
