
/**
 * Created by tudouhu on 2017/2/15.
 */

import '../vendors/createjs';
import EnemyPlaneB from '../gameBase/EnemyPlaneB';

/**
 * 敌机类
 */
class EnemyPlaneNOR extends EnemyPlaneB{

  /**
   * 敌机构造函数
   * @param sprName 飞机精灵名
   */
  constructor(sprName){
    super(sprName);
  }

}

export default EnemyPlaneNOR;
