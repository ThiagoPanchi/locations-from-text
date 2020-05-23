const rp = require('request-promise');
const $ = require('cheerio');
const state = require('./state');
const sentenceBoundaryDetection = require('sbd');

async function robot(){
  const content = state.load();
  
  //content.originalContent = await getContent(content);
  //content.referenceUrls = await getLinks(content);
  //content.contentSanitized = await sanitizeContent(content);
  content.sentences = [];
  await breakContentIntoSentences(content);

  state.saveTemp(content);

  async function getContent(content){
    const fullContent = rp(content.url).then((html) => {
      return  $('.conteudo-materia p', html).text().trim();
      
      
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

  async function sanitizeContent(content){
    console.log(JSON.stringify(content))
    //JSON.stringify(content);
    const withoutBlankLinesAndMarkdown = removeBlankLinesAndMarkdown(content.originalContent);
    //const withoutDatesInParentheses =  removeDatesInParentheses(withoutBlankLinesAndMarkdown);
    return withoutBlankLinesAndMarkdown;
    
    function removeBlankLinesAndMarkdown(text) {
      
      //console.log(text);
      const allLines = text.split('\n');
        const withoutBlankLinesAndMarkdown = allLines.filter((line) => {
          if(line.trim().length === 0 || line.trim().startsWith('=')) {
            return false;
          }
        return true;
        });
      return withoutBlankLinesAndMarkdown.join(' ');
    }
    function removeDatesInParentheses(text) {
      return text.replace(/\((?:\([^()]*\)|[^()])*\)/gm, '').replace(/  /g,' ');
    }
  }
async function breakContentIntoSentences(content){
  //content.sentences = [];

    const sentences = sentenceBoundaryDetection.sentences(content.contentSanitized);
    sentences.forEach((sentences) => {
      content.sentences.push({
        text: sentences,
        keywords: [],
        locations:[],
        dates: []
      });
    });
}
}

module.exports = robot;