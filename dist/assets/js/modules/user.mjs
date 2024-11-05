
class User {
  /**
   * @param {string} id
   * @param {string} name
   */
  constructor(id, name) {
    // console.debug(`new User`,id,name);
    this.id   = id;
    this.name = name;
  }
  equals(other){
    try {
      return other.id === this.id;
    } catch (_) {
      return false;
    }
  }
  toString(){
    return `User(id: ${this.id}, name: ${this.name})`;
  }
  toJSON(){
    return ({id: this.id, name: this.name});
  }
}

export {User};
