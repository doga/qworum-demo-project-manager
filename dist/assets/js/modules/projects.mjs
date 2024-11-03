const 
filePath        = '/data/projects.json',
localStorageKey = 'projects';

class Role {
  constructor(role) {
    this.role = role;
  }
  toJSON(){
    return this.role;
  }
}

class Member {
  /**
   * @param {string} id
   * @param {string} name
   * @param {Role} role
   */
  constructor(id, name, role) {
    this.id   = id;
    this.name = name;
    this.role = this.role;
  }
  toJSON(){
    return ({id: this.id, name: this.name, role: this.role.toJSON()});
  }
}

class Project {
  /**
   * @param {string} name
   * @param {string} description
   * @param {Member[]} members
   */
  constructor(name, description, members) {
    this.name        = name;
    this.description = description;
    this.members     = members || [];
  }
  toJSON(){
    return {
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
   * @return {Projects}
   * @async
   */
  static async read() {
    console.debug(`reading localStorage`);
    // try localStorage
    let data = localStorage.getItem(localStorageKey);
    if (data) {
      data = JSON.parse(data);
      return new Projects(data);
    }

    // fetch the file
    console.debug(`reading file`);
    const response = await fetch(filePath);
    data = await response.json();

    return new Projects(data);
  }

  constructor(data) {
    if(!data) data = [];
    for (const d of data)
    this.projects.push(
      new Project(
        d.name, 
        d.description, 
        d.members.map(m => new Member(m.id, m.name))
      )
    );
  }
  write(){
    localStorage.setItem(localStorageKey, JSON.stringify(this));
  }
  toJSON(){
    return this.projects.map(p => p.toJSON());
  }
}

export {Project, Projects, Member, Role};
