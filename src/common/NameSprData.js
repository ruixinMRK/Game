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
    //   frameA:[帧数据数组]
    // }
    // :{srcA:[''],
    //   frameA:[]
    // }
    plane:{srcA:['assets/img/plane.png'],
      frameA:[["plane",0,0,48,58],
        ["p_bullet",48,0,40,40],
        ["p_gasoline",88,0,40,40],
        ["p_life",128,0,40,40],
        ["bullet",168,0,20,20]
      ]
    },
    gameUI:{srcA:['assets/img/gameUI.png'],
      frameA:[["overIf2_bg",0,0,400,400],
        ["rockerBg",400,0,300,300],
        ["overIf_bg",0,400,300,250],
        ["people",300,400,150,150],
        ["pvp",450,400,150,150],
        ["warehouse",400,300,100,100],
        ["attack",500,300,100,100],
        ["shop",600,300,100,100],
        ["rockerBtn",600,400,100,100],
        ["overIf_back",300,550,100,80],
        ["overIf_rebirth",400,550,100,80],
        ["start",500,550,100,80]
      ]
    },
    gameBg:{srcA:['assets/img/gameBg.png'],
      frameA:[["gameBg",0,0,2000,2000]]
    }
  }
};
