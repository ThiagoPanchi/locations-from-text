
const fs = require('fs');
const state = require('./state');


async function robot(){
  const content = state.load();
  
  await save(content);

  async function save(content){
    
    const saveContent = {
      url: content.url,
      title: content.contentTitle,
      text: content.contentSanitized,
      locations: content.locations,
      dates: content.dates,
      referencesUrls: content.referencesUrls
    }

    const title = content.contentTitle.normalize('NFD').replace(/([\u0300-\u036f]|[^0-9a-zA-Z])/g, '_');
    const contentString = JSON.stringify(saveContent);
    return fs.writeFileSync( `./content/${title}.json`, contentString, 'utf8');
  
}

}

module.exports = robot;