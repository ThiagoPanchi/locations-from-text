const rp = require('request-promise');
const $ = require('cheerio');



async function start(){

  const content = {};

  content.url = getUrl();
  content.contentTitle = await getTitle(content);  
  content.originalContent = await getContent(content);
  content.referenceUrls =  await getLinks(content);

  console.log(content);

  function getUrl(){
    const url = 'https://brasilescola.uol.com.br/historiab';
    return url;
  }

  async function getTitle(content){
    
    const urlTitle = rp(content.url).then((html)=>{
      return $('.titulo-definicao',html).text();

    }).catch((err)=>{
      console.log({error: err});
    });
    return urlTitle;
  }

  async function getContent(content){
    const fullContent = rp(content.url).then((html)=>{
      return $('.conteudo-materia p', html).text().trim();
    }).catch((err)=>{
      console.log({error: err});
    });
    return fullContent;
  }

  async function getLinks(content){
    const urlRef = rp(content.url).then((html)=>{
      const data = []; 
        for(i=0; i < $('strong a ', html).length; i++){
          data.push($('strong a ', html)[i].attribs.href);
        }
      return data;
    }).catch((err)=>{
      console.log({error: err});
    });
    return urlRef;
  }

}

start();
