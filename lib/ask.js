const readLine = require('readline');

const ask = (question) => {
  const read = readLine.createInterface({
    input: process.stdin,
    output: process.stdout,
    terminal: false,
  });

  return new Promise((resolve, reject) => {
    read.question(question, (answer) => {
      read.close();
      resolve(answer);
    });
  });
};

const askPassword = (question) => {
  const stdin = process.openStdin();
  const listener = (char) => {
    char += '';
    switch(char){
      case '\n':
      case '\r':
      case '\u0004':
        stdin.pause();
        break;
      default:
        process.stdout.write('\033[2K\033[200D' + question + Array(read.line.length+1).join('*'));
        break;
    }
  };
  process.stdin.on('data', listener);
  const read = readLine.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  return new Promise((resolve) => {
    read.question(question, (answer) => {
      read.history = read.history.slice(1);
      read.close();
      process.stdin.removeListener('data', listener);
      resolve(answer);
    });
  });
};


exports.readLine = ask;
exports.readPasswordLine = askPassword;