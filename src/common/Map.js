
//存储注册的id和对应的方法
class Map{
  constructor(){
    this.count = 0;
    this.entrySet = {};
  }
  size() {
    return this.count;
  }

  isEmpty() {
    return this.count === 0;
  }

  containsKey(key) {
    if (this.isEmpty()) {
      return false;
    }

    for ( var prop in this.entrySet) {
      if (prop === key) {
        return true;
      }
    }

    return false;
  }

  containsValue(value) {
    if (this.isEmpty()) {
      return false;
    }

    for ( var key in this.entrySet) {
      if (this.entrySet[key] === value) {
        return true;
      }
    }

    return false;
  }

  get(key) {
    if (this.isEmpty()) {
      return null;
    }

    if (this.containsKey(key)) {
      return this.entrySet[key];
    }

    return null;
  }

  put(key, value) {
    this.entrySet[key] = value;
    this.count++;
  }

  remove(key) {
    if (this.containsKey(key)) {
      delete this.entrySet[key];
      this.count--;
    }
  }

  putAll(map) {
    if(!map instanceof Map){
      return;
    }

    for ( var key in map.entrySet) {
      this.put(key, map.entrySet[key]);
    }
  }

  clear() {
    for ( var key in this.entrySet) {
      this.remove(key);
    }
  }

  values() {
    var result = [];

    for ( var key in this.entrySet) {
      result.push(this.entrySet[key]);
    }

    return result;
  }

  keySet() {
    var result = [];

    for ( var key in this.entrySet) {
      result.push(key);
    }

    return result;
  }

  toString() {
    var result = [];
    for ( var key in this.entrySet) {
      result.push(key + ":" + this.entrySet[key]);
    }

    return "{" + result.join() + "}";
  }

  valueOf() {
    return this.toString();
  }
}

export default Map;
