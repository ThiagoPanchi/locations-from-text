const state = require('./state');
const cities = require('all-the-cities');
const nodeGeocoder = require('node-geocoder');
const countries = require('../countries.json');
const states = require('../states.json'); 
//const fs = require('fs');
//const contentTempFilePath = './locations.json';


const options = {
  provider: 'openstreetmap'
}
const geocoder = nodeGeocoder(options);

async function robot(){
  const content = state.load();
  
  content.locations = [];
  await getCitiesInContent(content);
  await getStatesInContent(content);

  state.saveTemp(content);

  async function getCitiesInContent(content){
    
    for(j=0; j<content.sentences.length;j++){
      
      for(i=0; i<cities.length; i++){
        const matchText = content.sentences[j].text;
          const parsedText = matchText.normalize('NFD').replace(/([\u0300-\u036f]|[^0-9a-zA-Z\s])/g, '');


        if(parsedText.match(' '+cities[i].name+' ') && cities[i].country === "BR"){
     
          const address = ({
            city: cities[i].name,
            countryCode: cities[i].country,
            limit: 3 
          })

          
          const cityStates = await geocoder.geocode(address);
          //console.log(cities[i]);
          //console.log(cityStates);

          const stateName = cityStates[0].state;
          
          content.locations.push({
            city: cities[i].name,
            state: stateName,
            country: cities[i].country,
            loc: cities[i].loc,
            text: parsedText
          });          
        } 
        }
      }
      
    }
    async function getStatesInContent(content){
      

      for(i=0;i<content.sentences.length;i++){
        
        for(k=0;k < states.states.length; k++){
          
          const selectedCountry = getCountryId('BR');
            function getCountryId(code){
              return countries.countries.filter((data)=>{return data.sortname == code});
            }
          const matchText = content.sentences[i].text;
          const parsedText = matchText.normalize('NFD').replace(/([\u0300-\u036f]|[^0-9a-zA-Z\s])/g, '');

          if(parsedText.match(' '+states.states[k].name+' ') && states.states[k].country_id == selectedCountry[0].id){
            
            const address = ({
              state: states.states[k].name,
              countryCode: selectedCountry[0].sortname,
              limit:3
            })
    
            const geoLoc = await geocoder.geocode(address);
    
            content.locations.push({
              city: null,
              state: states.states[k].name,
              country: selectedCountry[0].sortname,
              loc: {
                type: 'Point',
                coordinates: [geoLoc[0].latitude,geoLoc[0].longitude],
              },
              text: parsedText
            });
          } 
        } 
      }
    }
  
  }

module.exports = robot;