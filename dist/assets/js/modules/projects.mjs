import { User } from "./user.mjs";

const 
filePath        = '/data/projects.json',
localStorageKey = 'projects';

class Role {
  /**
   * @param {string} role
   */
  constructor(role) {
    this.role = role;
  }
  isSupervisor(){
    return this.role === 'supervisor';
  }
  toString(){
    return this.role;
  }
  toJSON(){
    return this.role;
  }
}

class Member {
  /**
   * @param {User} user
   * @param {Role} role
   */
  constructor(user, role) {
    this.user = user;
    this.role = role;
  }
  toJSON(){
    return ({user: this.user.toJSON(), role: this.role.toJSON()});
  }
}

class Project {
  /**
   * @param {string} id
   * @param {string} name
   * @param {string} description
   * @param {Member[]} members
   */
  constructor(id, name, description, members) {
    this.id          = id;
    this.name        = name;
    this.description = description;
    this.members     = members || [];
  }

  /**
   * @param {User[]} users
   * @param {Role} role
   * @returns {boolean}
   */
  addMembers(users, role){
    let changed = false;
    for (const user of users) {
      // duplicate?
      if(this.members.find(u => u.id === user.id))continue;

      this.members.push(new Member(user, role));
      changed = true;
    }
    return changed;
  }

  /**
   * @returns {User[]}
   */
  findSupervisors(){
    return this.members.filter(m => m.role.isSupervisor()).map(m => m.user);
  }

  toString(){
    const members = this.members.map(m => m.user.id).join(', ');
    return `Project(id: ${this.id}, name: ${this.name}, members: [${members}])`;
  }
  toJSON(){
    return {
      id         : this.id,
      name       : this.name,
      description: this.description,
      members    : this.members.map(m => m.toJSON())
    };
  }
}

class Projects {
  /**
   * @type {Project[]}
   */
  projects = [];


  /**
   * @param {string} userId
   * @returns {Project[]}
   */
  forUser(userId){
    // console.debug(`[forUser] userId:`, userId);
    // console.debug(`[forUser] all:`, allProjects);
    const userProjects = this.projects.filter(p => p.members.find(m => m.user.id === userId));
    // console.debug(`[forUser] userproj:`, userProjects);
    return userProjects;
  }

  /**
   * @return {Projects}
   * @static
   * @async
   */
  static async read() {
    // console.debug(`reading localStorage`);
    // try localStorage
    let data = localStorage.getItem(localStorageKey);
    if (data) {
      data = JSON.parse(data);
      return new Projects(data);
    }

    // fetch the file
    // console.debug(`reading file`);
    const response = await fetch(filePath);
    data = await response.json();

    return new Projects(data);
  }

  constructor(data) {
    if(!data) data = [];
    for (const d of data)
    this.projects.push(
      new Project(
        d.id, 
        d.name, 
        d.description, 
        d.members.map(m => new Member(new User(m.user.id, m.user.name), new Role(m.role)))
      )
    );
  }
  find(projectId){
    return this.projects.find(p => p.id === projectId);
  }
  save(){
    localStorage.setItem(localStorageKey, JSON.stringify(this));
  }
  toString(){
    return `Projects([${this.projects.map(p => p.toString()).join(', ')}])`;
  }
  toJSON(){
    return this.projects.map(p => p.toJSON());
  }
}

export {Project, Projects, Member, Role};
