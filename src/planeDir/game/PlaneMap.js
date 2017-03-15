/**
 * Created by tudouhu on 2017/2/20.
 */

import 'createjs';
import GameData from '../../manager/GameData';
import Prop from '../Prop';
import HeroPlane from './HeroPlane';
import NameSpr from '../../common/NameSpr';
import SocketClient from '../../common/socket/SocketClient';
import Router from '../../common/socket/Router';
import PlaneMapB from '../gameBase/PlaneMapB';

/**
 * 飞机游戏地图
 */
class PlaneMap extends PlaneMapB{


  constructor() {
    super();
  }

}
export default PlaneMap;
