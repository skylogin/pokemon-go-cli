const pokemonInformation = require('./service/pokemonInformation');
const userInformation = require('./service/userInformation');
const renameAll = require('./service/renameAll');
const renameOne = require('./service/renameOne');

module.exports = [
  {
    name: 'pokemon Information',
    description: 'Print a Pokémon information list.',
    runner: pokemonInformation
  },
  {
    name: 'user Information',
    description: 'Print your information.',
    runner: userInformation
  },
  {
    name: 'rename All',
    description: 'Change the alias of the entire Pokémon.',
    runner: renameAll,
  },
  {
    name: 'rename One',
    description: 'Change the alias of a specific Pokémon.',
    runner: renameOne,
  },

]