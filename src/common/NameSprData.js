/**
 * Created by tudouhu on 2017/3/11.
 */
/**
 * nameSpr数据类
 */
export  default {

  /**
   * 精灵图数据
   * @type {{}}
   */
  sprData:{
    // 精灵图名:{srcA:['路径'],
    //   frameA:[name,x,y,w,h]
    // }
    // :{srcA:[''],
    //   frameA:[]
    // }
    plane:{srcA:['assets/img/plane.png'],
      frameA:[["plane1",0,0,63,98],
        ["plane3",63,0,63,87],
        ["AIPlane0",126,0,56,77],
        ["plane0",182,0,48,58],
        ["plane4",230,0,40,55],
        ["plane2",270,0,39,54],
        ["plane5",309,0,41,53],
        ["p_life",350,0,40,40],
        ["p_gasoline",390,0,40,40],
        ["p_bullet",430,0,40,40],
        ["bullet",470,0,20,20]
      ]
    },
    gameUI:{srcA:['assets/img/gameUI.png'],
      frameA:[["shopIfBg",0,0,1000,501],
        ["overIf2_bg",0,501,400,400],
        ["shopPlaneBg",1000,0,200,300],
        ["rockerBg",400,501,300,300],
        ["overIf_bg",700,501,300,250],
        ["people",1000,300,150,150],
        ["pvp",1000,501,150,150],
        ["attack",1000,651,100,100],
        ["warehouse",1100,651,100,100],
        ["rockerBtn",400,801,100,100],
        ["shop",500,801,100,100],
        ["close",600,801,95,95],
        ["overIf_rebirth",695,801,100,80],
        ["start",795,801,100,80],
        ["overIf_back",895,801,100,80],
        ["buy",995,801,100,80],
        ["use",1095,801,100,80],
        ["pageTurning",1150,300,40,71]
      ]
    },
    gameBg:{srcA:['assets/img/gameBg.jpg'],
      frameA:[["gameBg",0,0,2000,2000]]
    }
  }
};
