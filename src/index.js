const robots = {
  url: require('./robots/input'),
  state: require('./robots/state'),
  text: require('./robots/text'),
  locations: require('./robots/locations')
}

async function start(){
  
  //robots.url();
  await robots.text();
  await robots.locations();
  const content = robots.state.load();
  console.log(content.sentences);

}

start();
