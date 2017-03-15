/**
 * Created by tudouhu on 2017/2/7.
 */

import 'createjs';
import HeroPlaneB from '../gameBase/HeroPlaneB';
import Tools from '../../common/Tools';
import BasePlane from '../../container/BasePlane';
import UserData from '../../manager/UserData';
import GameData from '../../manager/GameData';
import NameSpr from '../../common/NameSpr';
import MyEvent from '../../common/MyEvent';
import GameOverIf from './interface/GameOverIf';
import Router from '../../common/socket/Router';
import SocketClient from '../../common/socket/SocketClient';
import DataShow from '../interface/DataShow';

/**
 * 飞机类
 */
class HeroPlane extends HeroPlaneB{




  constructor() {
    super();
  }


}

export default HeroPlane;
