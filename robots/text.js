const rp = require('request-promise');
const $ = require('cheerio');
const state = require('./state');
const sentenceBoundaryDetection = require('sbd');

const watsonApiKey = require('../credentials/watson-nlu.json').apikey;
const NaturalLanguageUnderstandingV1 = require('watson-developer-cloud/natural-language-understanding/v1.js');
 
const nlu = new NaturalLanguageUnderstandingV1({
  iam_apikey: watsonApiKey,
  version: '2018-04-05',
  url: 'https://gateway.watsonplatform.net/natural-language-understanding/api/'
});

async function robot(){
  const content = state.load();
  
  content.originalContent = await getContent(content);
  content.referenceUrls = await getLinks(content);
  content.contentSanitized = await sanitizeContent(content);
  content.sentences = [];
  await breakContentIntoSentences(content);
  await getSentencesKeywords(content);
  await getDatesfromSentences(content);

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
    
    const withoutBlankLinesAndMarkdown = removeBlankLinesAndMarkdown(content.originalContent);
    return withoutBlankLinesAndMarkdown;
    
    function removeBlankLinesAndMarkdown(text) {
      
      const allLines = text.split('\n');
        const withoutBlankLinesAndMarkdown = allLines.filter((line) => {
          if(line.trim().length === 0 || line.trim().startsWith('=')) {
            return false;
          }
        return true;
        });
      return withoutBlankLinesAndMarkdown.join(' ');
    }
  }
  async function breakContentIntoSentences(content){

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
  async function getSentencesKeywords(content){
    for(const sentence of content.sentences) {
      sentence.keywords = await fetchWatsonAndReturnKeywords(sentence.text);
    }
  }
  async function fetchWatsonAndReturnKeywords(sentence) {
    return new Promise((resolve, reject) => {
      nlu.analyze({
        text: sentence,
        features: {
          keywords:{}
        },
        language: "pt"
      }, (error, response) => {
        if(error){
          throw error
        }
        const keywords = response.keywords.map((keyword) => {
          return keyword.text
        });
        resolve(keywords);
      })
    })
  }
  async function getDatesfromSentences(content){
     
    for(i=0; i<content.sentences.length; i++){
      content.sentences[i].dates = content.sentences[i].text.match(/\d{4}/gm);
    }
  } 
}

module.exports = robot;