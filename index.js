const rp = require('request-promise');
const $ = require('cheerio');
const robots = {
  url: require('./robots/input')
}



async function start(){
  const content = {};
  robots.url(content);
   
  content.originalContent = await getContent(content);
  content.referenceUrls =  await getLinks(content);

  console.log(content);





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
