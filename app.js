const fs = require('fs');

const ask = require('./lib/ask');
const task = require('./lib/task');
const Pokemon = require('./lib/pokemon').Pokemon;

const pokemon = new Pokemon();


/////
// var log4js = require('log4js');

// log4js.loadAppender('file');
// log4js.addAppender(log4js.appenders.file('logs/cheese.log'), 'cheese');

// var logger = log4js.getLogger('cheese');
///


const config = {
    authType: 'google',
		username: process.env.POGO_USERNAME || null,
		password: process.env.POGO_PASSWORD || null,
		//proxy: process.env.POGO_PROXY,
		hashKey: fs.readFileSync('./hashing.key', 'utf8') || null,
    task: 1 || null,
};

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


let next;
//basic information
next = askQuestion('[Pokémon-Go] Gmail ID: ', 'username', 'plain')
  .then((username) => {
    config.username = username || config.username;
    return askQuestion('[Pokémon-Go] Password: ', 'password', 'password');
  }).then((password) => {
    config.password = password || config.password;
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
  if((`${taskNumber}`).search(/^[0-9]+$/) !== -1){
    config.task = taskNumber;
  }
  return config;
}).then((configInformation) => {
  console.log('');
  const taskNumber = parseInt(configInformation.task, 10) - 1;

  if(task[taskNumber] && typeof task[taskNumber].runner === 'function'){
    console.log(`execute [${taskNumber+1}] ${task[taskNumber].name} task: ${task[taskNumber].description}`);

    //원래 여기서부터 진행해야함
    //그러나 개발단계이므로 잠시 주석처리를 하고 받아온 data.log파일로 대체하여 처리
    // pokemon.init(configInformation)
    //   .then(() => pokemon.getInventory())
    //   .then((inventory) => {
    //     // execute each runner (define task.js)
    //     // var data = keysToCamelCase(JSON.parse(JSON.stringify(inventory)));
    //     // task[taskNumber].runner(pokemon, inventory);

    //   }).catch(e => console.error(e));
    ///////////////////////////////////////


    //test go
    let data = fs.readFileSync('./sample/data.json', 'utf8');
    // data = keysToCamelCase(JSON.parse(data));
    task[taskNumber].runner(null, data);


  } else{
    console.log(`Number [${taskNumber+1}] is unknown task.`)
  }

});


const keysToCamelCase = (source) => {
  console.log(typeof source);
  if (Array.isArray(source)) {
    return source.map(each => keysToCamelCase(each));
  } else if (typeof source === 'object' && source !== null) {
    return Object.entries(source).reduce((target, [key, value]) => {
      const newKey = key.replace(/\_([a-z])/g, (whole, p1) => p1.toUpperCase());
      return Object.assign({}, target, { [newKey]: keysToCamelCase(value) });
    }, {});
  }
  return source;
};


