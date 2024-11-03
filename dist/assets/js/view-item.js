import { Projects, Project, Member } from "./modules/projects.mjs"; 
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

// console.debug('hi');

await build();

async function build() {
  // console.debug(`[home] showing ${items.length} items`);
  const 
  createProjectButton = document.getElementById('create-project-button'),
  projects            = await Projects.read(),
  listUi              = document.getElementById('list');
  // console.debug('projects',projects);

  createProjectButton.addEventListener('click', async (event) => {
    event.preventDefault();
    await Qworum.eval(
      Script(
        Try(
          Sequence(
            // Sign in and store user info
            Data(
              ['@', 'user'], Call('@', '../sign-in/'),
            ),

            // Return to current URL
            Goto(),
          ),

          // Unset user info if sign-in was cancelled by user
          [{
            catch: ['cancelled'],
            do   : Goto()
          }]
        ),
      )
    );
  });

  for (const cred of projects.credentials) {
    // console.debug(`[home] showing item ${i}`);

  // <md-list-item
  //     type="link"
  //     href="https://google.com/search?q=buy+kiwis&tbm=shop"
  //     target="_blank">
  //   <div slot="headline">Shop for Kiwis</div>
  //   <div slot="supporting-text">This will link you out in a new tab</div>
  //   <md-icon slot="end">open_in_new</md-icon>
  // </md-list-item>

    const
    credUi         = document.createElement('md-list-item'),
    headline       = document.createElement('div'),
    supportingText = document.createElement('div'),
    icon           = document.createElement('md-icon')
    ;

    headline.setAttribute('slot', 'headline');
    headline.appendChild(document.createTextNode(cred.username));
    supportingText.setAttribute('slot', 'supporting-text');
    supportingText.appendChild(document.createTextNode(cred.passwordDigest));
    // icon.setAttribute('slot', 'end');
    icon.appendChild(document.createTextNode('shield_person'));
    credUi.appendChild(headline);
    credUi.appendChild(supportingText);
    credUi.appendChild(icon);

    listUi.appendChild(credUi);

  }

}
