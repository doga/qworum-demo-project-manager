// Redirect the user to his preferred language. 

import { Settings } from "./settings.mjs";

class Redirect {
  static async do(){
    const 
    pageUrl  = new URL(`${location}`),
    settings = await Settings.read(),
    lang     = Redirect.findLocalisationForUser(settings.languages);
    
    if (['/', '/index.html'].includes(pageUrl.pathname)) {
      window.location.replace(`/check-qworum-availability-${lang}.html`);

    // } else if(pageUrl.pathname.startsWith('/check-qworum-availability')) {

    } else  { // 1st phase of an API endpoint redirects to localised phase
      window.location.replace(
        '/' + lang +
        window.location.pathname +
        window.location.search +
        window.location.hash
      );
    }
  }

  static findLocalisationForUser(languages){
    try {
      var lang = null;
      if (window.navigator.language) {
        const browserLang = window.navigator.language.split('-')[0];
        for (let j = 1; j < languages.length; j++) {
          const siteLang = languages[j];
          if (siteLang === browserLang) {
            lang = siteLang;
            break;
          }
        }
      } else if (window.navigator.languages) {
        for (let i = 0; i < window.navigator.languages.length; i++) {
          const browserLang = window.navigator.languages[i].split('-')[0];
          for (let j = 1; j < languages.length; j++) {
            const siteLang = languages[j];
            if (siteLang === browserLang) {
              lang = siteLang;
              break;
            }
          }
          if (lang) break;
        }
      } else if (window.navigator.userLanguage) {
        const browserLang = window.navigator.userLanguage.split('-')[0];
        for (let j = 1; j < languages.length; j++) {
          const siteLang = languages[j];
          if (siteLang === browserLang) {
            lang = siteLang;
            break;
          }
        }
      } else if (window.navigator.browserLanguage) {
        const browserLang = window.navigator.browserLanguage.split('-')[0];
        for (let j = 1; j < languages.length; j++) {
          const siteLang = languages[j];
          if (siteLang === browserLang) {
            lang = siteLang;
            break;
          }
        }
      } else if (window.navigator.systemLanguage) {
        const browserLang = window.navigator.systemLanguage.split('-')[0];
        for (let j = 1; j < languages.length; j++) {
          const siteLang = languages[j];
          if (siteLang === browserLang) {
            lang = siteLang;
            break;
          }
        }
      }
      if (!lang) lang = languages[0];

      return lang;
    } catch (error) {
      return 'en';
    }
  }
  
}

export {Redirect};
