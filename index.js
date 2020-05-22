const robots = {
  url: require('./robots/input'),
  state: require('./robots/state'),
  text: require('./robots/text')
}

async function start(){
  
  //robots.url();
  await robots.text();
  const content = robots.state.load();
  console.log(content);

}

start();
