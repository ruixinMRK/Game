/**
 * Created by ruixin on 2017/2/16 0016.
 */

export default {

  /**
   * 舞台
   */
  stage:null,
  /**
   * 舞台宽
   */
  stageW:1366,
  /**
   * 舞台宽
   */
  stageH:768,
  /**
   * 地图宽
   */
  mapW:2000,
  /**
   * 地图宽
   */
  mapH:2000,

  /**
   * 是否需要发送数据
   */
  send:false,
  /**
   * 房间名
   */
  room:'',
  /**
   * 游戏类型
   */
  gameType:'',
  /**
   * 上帧时间
   */
  lastTime:0,
  /**
   * 帧频时间差
   */
  timeDiff:0,

  /**
   * 飞机管理实例
   *  @type {PlaneControl}
   */
  planeControl:null,
  /**
   * 飞机地图实例
   *  @type {PlaneMap}
   */
  planeMap:null,
  /**
   * FPS ping显示
   * @type {DataShow}
   */
  dataShow:null,

  //按键
  key_A:false,
  key_D:false,
  key_W:false,
  key_S:false,
  key_J:false



};
