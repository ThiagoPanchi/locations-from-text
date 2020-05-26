const state = require('./state');
const cities = require('all-the-cities');
const nodeGeocoder = require('node-geocoder');

const options = {
  provider: 'openstreetmap'
}
const geocoder = nodeGeocoder(options);

async function robot(){
  const content = state.load();

  await getLocations(content);

  state.saveTemp(content);

  async function getLocations(content){
    
    for(j=0; j<content.sentences.length;j++){
      //let checkCity = cities[i].name;
      for(i=0; i<cities.length; i++){
        if(content.sentences[j].text.match(" "+cities[i].name+" ") && cities[i].country == "BR"){
          //const states = [];      
          const address = ({
            city: cities[i].name,
            countryCode: cities[i].country,
            limit: 1 
          })
          //await stateName(address);
          const states = await geocoder.geocode(address);
          const stateName = states[0].state;
          console.log(stateName)
          
          content.sentences[j].locations.push({
            city: cities[i].name,
            state: stateName,
            country: cities[i].country,
            loc: cities[i].loc
          });          
        } else {
          await getStateName(content);
        }
      }
      
    }
  }

  async function getStateName(content){
    
  }
}

module.exports = robot;