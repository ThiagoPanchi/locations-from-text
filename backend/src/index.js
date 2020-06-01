const robots = {
  url: require('./robots/input'),
  state: require('./robots/state'),
  text: require('./robots/text'),
  locations: require('./robots/locations'),
  newFile: require('./robots/newFile')
}

async function start(){
  
  //robots.url();
  //await robots.text();
  //await robots.locations();
  await robots.newFile();
  console.log('Arquivo Salvo.')
  //const content = robots.state.load();
  //console.log(content.sentences);

}

start();
