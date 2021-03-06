const readline = require('readline-sync');
const rp = require('request-promise');
const $ = require('cheerio');
const state = require('./state');

async function robot(){
  const content = {};

  content.url = getUrl();
  content.contentTitle = await getTitle(content);
  //content.contentTitle = await sanitizeTitle(content);
  
  state.saveTemp(content);
  
  function getUrl(){
    return readline.question('Insira o link do conteudo desejado (ex:https://brasilescola.uol.com.br/historiab): ');

  }
  async function getTitle(content){
    
    const urlTitle = rp(content.url).then((html)=>{
      //TODO - criar um select de onde extrair o titulo ou digitar 
       return $('.titulo-definicao',html).text();
        

    }).catch((err)=>{
      console.log({error: err});
    });
    return urlTitle;
    
  }
  async function sanitizeTitle(content){
    const title = content.contentTitle;
    const titleWithoutBlankSpaces = title.normalize('NFD').replace(/([\u0300-\u036f]|[^0-9a-zA-Z])/g, '');
    return titleWithoutBlankSpaces;

  }

}

module.exports = robot;