const fs = require('fs');
const contentTempFilePath = '../content/content.json';

function save(content){
  const contentString = JSON.stringify(content);
  return fs.appendFileSync(`../content/${content.contentTitle}.json`, contentString, 'utf-8');
}

function saveTemp(content){
  const contentString = JSON.stringify(content);
  return fs.writeFileSync(contentTempFilePath, contentString);
}

function load(content){
  const fileBuffer = fs.readFileSync(contentTempFilePath, 'utf-8');
  const contentJson = JSON.parse(fileBuffer);
  return contentJson;
}

module.exports = {
  save,
  saveTemp,
  load
}