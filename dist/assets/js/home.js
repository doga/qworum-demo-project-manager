import { Projects, Project, Member, Role } from "./modules/projects.mjs"; 
import { authServiceUrl } from './modules/dependency-urls.mjs';
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
  console.debug('home');

  const viewUserProfileButton = document.getElementById('view-user-profile-button');

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

  // user has signed in?
  const user = await Qworum.getData(['@', 'user', 'profile']);
  // alert(`user: ${user}`, !!user);
  if (!user?.value?.username) {
    // user hasn't signed in
    console.debug('sign in');
    await signIn();
  } else {
    // user has signed in
    console.debug('list projects');
    await renderPage();
  }
}


async function signIn() {
  await Qworum.eval(
    Script(
      Sequence(
        // Sign in and store user info
        Call(['@', 'user'], `${authServiceUrl}sign-in/`),

        // Return to current URL
        Goto(),
      ),
    )
  );
}

async function renderPage() {
  const 
  projects = await Projects.read(),
  listUi   = document.getElementById('list');

  document.querySelector('section.hide#user-profile').className = 'show';

  console.debug(`[home] projects:`, projects);
  if(projects.projects.length > 0)document.querySelector('section.hide#projects').className = 'show';
  for (const p of projects.projects) {

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

    listUi.appendChild(projectUi);

  }
}
