define(function(require,exports,module) {

  var easeljs = require('createjs.js');

  var fl, images, createjs, ss, AdobeAn;

  (function (lib, img, cjs, ss, an) {

    var p; // shortcut to reference prototypes
    lib.webFontTxtInst = {};
    var loadedTypekitCount = 0;
    var loadedGoogleCount = 0;
    var gFontsUpdateCacheList = [];
    var tFontsUpdateCacheList = [];
    lib.ssMetadata = [];


    lib.updateListCache = function (cacheList) {
      for (var i = 0; i < cacheList.length; i++) {
        if (cacheList[i].cacheCanvas)
          cacheList[i].updateCache();
      }
    };

    lib.addElementsToCache = function (textInst, cacheList) {
      var cur = textInst;
      while (cur != exportRoot) {
        if (cacheList.indexOf(cur) != -1)
          break;
        cur = cur.parent;
      }
      if (cur != exportRoot) {
        var cur2 = textInst;
        var index = cacheList.indexOf(cur);
        while (cur2 != cur) {
          cacheList.splice(index, 0, cur2);
          cur2 = cur2.parent;
          index++;
        }
      }
      else {
        cur = textInst;
        while (cur != exportRoot) {
          cacheList.push(cur);
          cur = cur.parent;
        }
      }
    };

    lib.gfontAvailable = function (family, totalGoogleCount) {
      lib.properties.webfonts[family] = true;
      var txtInst = lib.webFontTxtInst && lib.webFontTxtInst[family] || [];
      for (var f = 0; f < txtInst.length; ++f)
        lib.addElementsToCache(txtInst[f], gFontsUpdateCacheList);

      loadedGoogleCount++;
      if (loadedGoogleCount == totalGoogleCount) {
        lib.updateListCache(gFontsUpdateCacheList);
      }
    };

    lib.tfontAvailable = function (family, totalTypekitCount) {
      lib.properties.webfonts[family] = true;
      var txtInst = lib.webFontTxtInst && lib.webFontTxtInst[family] || [];
      for (var f = 0; f < txtInst.length; ++f)
        lib.addElementsToCache(txtInst[f], tFontsUpdateCacheList);

      loadedTypekitCount++;
      if (loadedTypekitCount == totalTypekitCount) {
        lib.updateListCache(tFontsUpdateCacheList);
      }
    };
// symbols:
// helper functions:

    function mc_symbol_clone() {
      var clone = this._cloneProps(new this.constructor(this.mode, this.startPosition, this.loop));
      clone.gotoAndStop(this.currentFrame);
      clone.paused = this.paused;
      clone.framerate = this.framerate;
      return clone;
    }

    function getMCSymbolPrototype(symbol, nominalBounds, frameBounds) {
      var prototype = cjs.extend(symbol, cjs.MovieClip);
      prototype.clone = mc_symbol_clone;
      prototype.nominalBounds = nominalBounds;
      prototype.frameBounds = frameBounds;
      return prototype;
    }


    (lib.Instance = function (mode, startPosition, loop) {
      this.initialize(mode, startPosition, loop, {});

      // 图层 1
      this.txt = new cjs.Text("可以更改", "20px 'Microsoft YaHei'", "#33FF00");
      this.txt.name = "txt";
      this.txt.lineHeight = 28;
      this.txt.lineWidth = 139;
      this.txt.parent = this;
      this.txt.setTransform(-32.2, 2);

      this.shape = new cjs.Shape();
      this.shape.graphics.f("#33FF00").s().p("AgjAyIAAgUQAOALAQAAQAWAAAAgPQAAgGgFgEQgFgEgOgFQgRgHgGgHQgGgHABgKQAAgOAMgJQAMgIAQAAQAOgBAMAFIAAASQgMgHgPAAQgIAAgGAEQgGAEAAAGQAAAHAEADQAFAEAMAGQATAGAGAHQAGAHABALQgBAOgLAJQgNAJgSgBQgRABgMgHg");
      this.shape.setTransform(76.4, -10.7);

      this.shape_1 = new cjs.Shape();
      this.shape_1.graphics.f("#33FF00").s().p("AgcBlIAAgRQAHAEAHAAQAWABgBglIAAhpIATAAIAABmQAAAagKAPQgLAOgTAAQgIABgGgEgAAJhTQgEgDABgGQgBgFAEgDQADgDAFgBQAFABAEADQADADAAAFQAAAGgDADQgEADgFAAQgFAAgDgDg");
      this.shape_1.setTransform(67.2, -10.7);

      this.shape_2 = new cjs.Shape();
      this.shape_2.graphics.f("#33FF00").s().p("AghAqQgNgPgBgbQAAgYAPgPQAOgRAVABQAVAAALANQANANAAAZIAAAJIhLAAQABARAIAKQAKAJAOAAQASAAAQgMIAAARQgOAKgYAAQgWAAgNgOgAgRggQgIAJgCAOIA4AAQgBgPgGgIQgHgIgMAAQgLAAgJAIg");
      this.shape_2.setTransform(60.7, -10.7);

      this.shape_3 = new cjs.Shape();
      this.shape_3.graphics.f("#33FF00").s().p("AgNAnIAAg9IgSAAIAAgQIASAAIAAgaIASgGIAAAgIAbAAIAAAQIgbAAIAAA6QAAAKAEAFQAEAEAIAAQAGAAAFgDIAAAQQgGADgLAAQgcAAAAggg");
      this.shape_3.setTransform(51.3, -12.2);

      this.shape_4 = new cjs.Shape();
      this.shape_4.graphics.f("#33FF00").s().p("AghAwQgKgJAAgOQAAgdAkgFIAggFQAAgagXAAQgSAAgQANIAAgSQAQgLAUABQAngBABApIAABFIgTAAIAAgRIgBAAQgMAUgUgBQgQABgJgJgAAAADQgNACgFAFQgFAEAAAKQAAAHAGAFQAFAFAIAAQAMAAAJgJQAHgJABgNIAAgKg");
      this.shape_4.setTransform(41.8, -10.7);

      this.shape_5 = new cjs.Shape();
      this.shape_5.graphics.f("#33FF00").s().p("AghAqQgNgPgBgbQAAgYAPgPQAOgRAVABQAVAAALANQANANAAAZIAAAJIhLAAQABARAIAKQAKAJAOAAQASAAAQgMIAAARQgOAKgYAAQgXAAgMgOgAgRggQgIAJgCAOIA4AAQgBgPgGgIQgIgIgLAAQgLAAgJAIg");
      this.shape_5.setTransform(31, -10.7);

      this.shape_6 = new cjs.Shape();
      this.shape_6.graphics.f("#33FF00").s().p("AgcA3IAAhrIATAAIAAAWIABAAQAIgYATAAQAGAAAEABIAAAUQgFgEgIABQgMAAgFAKQgIALAAAPIAAA3g");
      this.shape_6.setTransform(22.5, -10.8);

      this.shape_7 = new cjs.Shape();
      this.shape_7.graphics.f("#33FF00").s().p("AgaAqQgOgPAAgZQAAgZAPgQQAQgQAZAAQAPAAAKAEIAAATQgLgHgOAAQgQAAgKALQgLALAAASQAAASAKALQAKALAPAAQAOgBAMgIIAAARQgMAIgRgBQgXAAgOgOg");
      this.shape_7.setTransform(12.9, -10.7);

      this.shape_8 = new cjs.Shape();
      this.shape_8.graphics.f("#33FF00").s().p("AhhBQQAfgVALgqIAPAEIgHAUQAPAYAdAEIAAg6IhZAAIAAgNIC7AAIAAANIhTAAIAAATIBFAAIAAANIhFAAIAAAcQAlAAAxgBIgFAPIhYAAQgpgBgSgeQgNAYgVAPIgJgNgAA0gLIAAgIIhmAAIAAAIIgPAAIAAhRICEAAIAABRgAgyggIBmAAIAAgRIhmAAgAgyg+IBmAAIAAgRIhmAAg");
      this.shape_8.setTransform(-2.2, -11.9);

      this.shape_9 = new cjs.Shape();
      this.shape_9.graphics.f("#33FF00").s().p("AAnBLQgGgJgFgLQgWAQgXALQgGgHgEgFQAbgNAWgRQgIgagDgkIgyAAIAAAfIAogHIAAAPIgoAIIAAAuQABAWgWABIgagBIgDgQQAOABAMAAQAIAAABgJIAAgpIgnAIIgEgRIArgHIAAgiIgrAAIAAgPIArAAIAAgdIgiAEIgEgPQAwgFAjgIIAEAQIgiAGIAAAfIAxAAIgCg5IAQAAIACA5IBIAAIAAAPIhHAAQACAdAGAWQAWgUAQgVIANAJQgUAagaAWQAFANAJAKQAKAMAHgBQAEAAABgGQAEgKACgXIAQAFQgEAWgEAMQgFAQgOABQgRgBgPgUgAAnhNIALgLIAjAeIgMAMQgQgRgSgOg");
      this.shape_9.setTransform(-22.2, -12.3);

      this.shape_10 = new cjs.Shape();
      this.shape_10.graphics.f("#000000").s().p("ArZEdIAAo5IWzAAIAAI5g");
      this.shape_10.setTransform(35.8, 0);

      this.timeline.addTween(cjs.Tween.get({}).to({state: [{t: this.shape_10}, {t: this.shape_9}, {t: this.shape_8}, {t: this.shape_7}, {t: this.shape_6}, {t: this.shape_5}, {t: this.shape_4}, {t: this.shape_3}, {t: this.shape_2}, {t: this.shape_1}, {t: this.shape}, {t: this.txt}]}).wait(1));

    }).prototype = getMCSymbolPrototype(lib.Instance, new cjs.Rectangle(-37.2, -28.5, 146, 58.9), null);


// stage content:
    (lib.无标题1 = function (mode, startPosition, loop) {
      this.initialize(mode, startPosition, loop, {});

      // 图层 1
      this.rect = new lib.Instance();
      this.rect.parent = this;
      this.rect.setTransform(248, 117.6);

      this.timeline.addTween(cjs.Tween.get(this.rect).wait(1));

    }).prototype = p = new cjs.MovieClip();
    p.nominalBounds = new cjs.Rectangle(485.8, 289.1, 146, 58.9);
// library properties:
    lib.properties = {
      width: 550,
      height: 400,
      fps: 24,
      color: "#FFFFFF",
      opacity: 1.00,
      webfonts: {},
      manifest: [],
      preloads: []
    };


  })(fl = fl || {}, images = images || {}, createjs = window.createjs || {}, ss = ss || {}, AdobeAn = AdobeAn || {});

  module.exports = fl;

})
