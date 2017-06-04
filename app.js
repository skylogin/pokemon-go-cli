const fs = require('fs');

const ask = require('./lib/ask');
const task = require('./lib/task');
const pokemon = require('./lib/pokemon');


const config = {
    authType: 'google',
		username: process.env.POGO_USERNAME || null,
		password: process.env.POGO_PASSWORD || null,
		//proxy: process.env.POGO_PROXY,
    location: process.env.PGO_LOCATION || '서울시 마포구 공덕동',
		hashKey: fs.readFileSync('./hashing.key', 'utf8') || null,
    task: 1 || null,
};

/*
process.argv.forEach((arg) => {
  const [, key, value] = arg.match(/^--(username|password|location|task):(.*)$/) || [];
  if(key && typeof config[key] !== 'undefined'){
    config[key] = value;
  }
});
*/

async function askQuestion(question, configType, askType){
  let answer;
  if(askType === 'plain'){
    answer = await ask.readLine(question);
  } else if(askType === 'password'){
    answer = await ask.readPasswordLine(question);
  }
  return saveInformation(answer, configType);
}

function saveInformation(answer, configType){
  return config[configType] = answer || config[configType];
}


let next;   //proceed variable

//basic information
next = askQuestion('[Pokémon-Go] Gmail ID: ', 'username', 'plain')
  .then((username) => {
    config.username = username || config.username;
    return askQuestion('[Pokémon-Go] Password: ', 'password', 'password');
  }).then((password) => {
    config.password = password || config.password
    return askQuestion('[Pokémon-Go] Location: ', 'location', 'plain');
  }).then((location) => {
    config.location = location || config.location;
  });

//task information
next.then(() => {
  console.log('');
  console.log('Please select a number from the follow list.');
  task.forEach((item, index) => {
    console.log(`${index+1}.${item.description}`);
  });
  return askQuestion('[Pokémon-Go] Number: ', 'task', 'plain');
}).then((taskNumber) => {
  if(taskNumber.search(/^[0-9]+$/) !== -1){
    config.task = taskNumber;
  }
  return config;
}).then((configInformation) => {
  console.log('');
  const taskNumber = parseInt(configInformation.task, 10) - 1;

  if(task[taskNumber] && typeof task[taskNumber].runner === 'function'){
    pokemon.init(configInformation);




  } else{
    console.log(`Number [${taskNumber+1}] is unknown task.`)
  }

});


