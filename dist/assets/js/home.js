import { Projects, Project, Member, Role } from "./modules/projects.mjs"; 
import { authServiceUrl } from './modules/dependency-urls.mjs';
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

await build();

async function build() {
  const 
  user = await requireUser(), // Auth wall
  viewUserProfileButton = document.getElementById('view-user-profile-button'),
  allProjects = await Projects.read(),
  projects = allProjects.forUser(user.id),
  listUi   = document.getElementById('list');
  
  viewUserProfileButton.addEventListener('click', async (event) => {
    event.preventDefault();
    await Qworum.eval(
      Script(
        Sequence(
          // Sign in and store user info
          Call(['@', 'user'], `${authServiceUrl}view-profile/`),
  
          // Return to current URL
          Goto(),
        ),
      )
    );
  });

  document.querySelector('section.hide#user-profile').className = 'show';

  console.debug(`[home] projects:`, projects);
  if(projects.length > 0)document.querySelector('section.hide#projects').className = 'show';

  // List of projects
  for (const p of projects) {

  // <md-list-item
  //     type="link"
  //     href="https://google.com/search?q=buy+kiwis&tbm=shop"
  //     target="_blank">
  //   <div slot="headline">Shop for Kiwis</div>
  //   <div slot="supporting-text">This will link you out in a new tab</div>
  //   <md-icon slot="end">open_in_new</md-icon>
  // </md-list-item>

    const
    projectUi      = document.createElement('md-list-item'),
    headline       = document.createElement('div'),
    supportingText = document.createElement('div'),
    icon           = document.createElement('md-icon');

    headline.setAttribute('slot', 'headline');
    headline.appendChild(document.createTextNode(p.name));
    supportingText.setAttribute('slot', 'supporting-text');
    supportingText.appendChild(document.createTextNode(p.description));
    icon.setAttribute('slot', 'end');
    icon.appendChild(document.createTextNode('team_dashboard')); // alternative icon: checklist
    projectUi.appendChild(headline);
    projectUi.appendChild(supportingText);
    projectUi.appendChild(icon);
    // projectUi.setAttribute('type', 'link');

    // console.debug(`Json(p.id)`,Json(p.id));

    projectUi.addEventListener('click', async (event) => {
      event.preventDefault();
      // alert(`project: ${p.name}`);
      await Qworum.eval(
        Script(
          Sequence(
            Call('@', '../view-project/', {name: 'project id', value: Json(p.id)}),
    
            // Return to current URL
            Goto(),
          ),
        )
      );
    });

    listUi.appendChild(projectUi);

  }
}
