import { Projects, Project, Member, Role } from "./modules/projects.mjs"; 
import { hcmServiceUrl } from './modules/dependency-urls.mjs';
import { User } from './modules/user.mjs';
import { requireUser } from "./modules/require-user.mjs";
import { QworumScript, Qworum } from './deps.mjs';

const
// Data values
Json         = QworumScript.Json.build,
SemanticData = QworumScript.SemanticData.build,
// Instructions
Data     = QworumScript.Data.build,
Return   = QworumScript.Return.build,
Sequence = QworumScript.Sequence.build,
Goto     = QworumScript.Goto.build,
Call     = QworumScript.Call.build,
Fault    = QworumScript.Fault.build,
Try      = QworumScript.Try.build,
// Script
Script = QworumScript.Script.build;

build();

async function build() {
  console.debug('view-project');

  const
  user             = await requireUser(),                                   // Auth wall
  allProjects     = await Projects.read(),
  userProjects     = allProjects.forUser(user.id),
  team             = await Qworum.getData('team'),
  projectId        = await Qworum.getData('project id'),
  project          = userProjects.find(p => p.id === projectId.value),
  userIsSupervisor = project.findSupervisors().find(u => u.equals(user)),
  returnButton     = document.getElementById('return-button'),
  addMembersButton = document.querySelector('#add-member'),
  projectList      = document.getElementById('project-list'),
  teamList         = document.getElementById('team-list');

  if(userIsSupervisor)addMembersButton.className = 'show';

  console.debug(`project id`, projectId);
  console.debug(`project`, project);
  console.debug(`project members`, await Qworum.getData('team'));
  if (team) {
    const 
    users   = team.value.map(userData => new User(userData.id, userData.name)),
    role    = new Role('worker'),
    changed = project.addMembers(users, role);

    if (changed) {
      allProjects.save();
    }
  }
  
  addMembersButton.addEventListener('click', async (event) => {
    event.preventDefault();
    await Qworum.eval(Script(
      Sequence(
        Data('team', Call(['@', 'hcm'], `${hcmServiceUrl}pick-team/`)),
        Goto(),
      ),
    ));
  });
  
  returnButton.addEventListener('click', async (event) => {
    event.preventDefault();
    await Qworum.eval(Script(
      Return(Json(projectId))
    ));
  });

  // <md-list-item
  //     type="link"
  //     href="https://google.com/search?q=buy+kiwis&tbm=shop"
  //     target="_blank">
  //   <div slot="headline">Shop for Kiwis</div>
  //   <div slot="supporting-text">This will link you out in a new tab</div>
  //   <md-icon slot="end">open_in_new</md-icon>
  // </md-list-item>

  // Project details
  const
  projectUi = {
    all           : document.createElement('md-list-item'),
    headline      : document.createElement('div'),
    supportingText: document.createElement('div'),
    icon          : document.createElement('md-icon'),
  };

  projectUi.headline.setAttribute('slot', 'headline');
  projectUi.headline.appendChild(document.createTextNode(project.name));
  projectUi.supportingText.setAttribute('slot', 'supporting-text');
  projectUi.supportingText.appendChild(document.createTextNode(project.description));
  projectUi.icon.setAttribute('slot', 'end');
  projectUi.icon.appendChild(document.createTextNode('team_dashboard')); // alternative icon: checklist
  projectUi.all.appendChild(projectUi.headline);
  projectUi.all.appendChild(projectUi.supportingText);
  projectUi.all.appendChild(projectUi.icon);

  projectList.appendChild(projectUi.all);


  // Member details
  for (const member of project.members) {
    const
    memberUi = {
      all           : document.createElement('md-list-item'),
      headline      : document.createElement('div'),
      supportingText: document.createElement('div'),
      icon          : document.createElement('md-icon'),
    },
    iconName = member.role.isSupervisor() ? 'supervisor_account' : 'person';
  
    memberUi.headline.setAttribute('slot', 'headline');
    memberUi.headline.appendChild(document.createTextNode(member.user.name));
    memberUi.supportingText.setAttribute('slot', 'supporting-text');
    memberUi.supportingText.appendChild(document.createTextNode(`${member.role}`));
    memberUi.icon.setAttribute('slot', 'end');
    memberUi.icon.appendChild(document.createTextNode(iconName));
    memberUi.all.appendChild(memberUi.headline);
    memberUi.all.appendChild(memberUi.supportingText);
    memberUi.all.appendChild(memberUi.icon);
    teamList.appendChild(memberUi.all);
  }

}

