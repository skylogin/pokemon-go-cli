const inventory = require('./inventory');
const renameAll = require('./renameAll');
const renameOne = require('./renameOne');

module.exports = [
  {
    name: 'inventory',
    description: 'Print a Pokemon information in your inventory.',
    runner: inventory
  },
  {
    name: 'renameAll',
    description: 'Change the alias of the entire Pokemon.',
    runner: renameAll,
  },
  {
    name: 'renameOne',
    description: 'Change the alias of a specific Pokemon.',
    runner: renameOne,
  },

]