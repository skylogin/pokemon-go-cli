const pogobuf = require('pogobuf-vnext');
require('pogobuf-signature');   //not required, just to check version


async function init(config){
  let client = new pogobuf.Client({
    authType: config.authType,
    username: config.username,
    password: config.password,
    version: 6301,
    useHashingServer: true,
    hashingKey: config.hashKey,
    includeRequestTypeInResponse: true,
    //proxy: config.proxy,
  });

  let coordinates = {
    latitude: 37.543962,
    longitude: 126.950471
  };
  client.setPosition(coordinates.latitude, coordinates.longitude);

  await client.init(false);
  await client.batchStart().batchCall();

  let player = await client.getPlayer('US', 'en', 'Europe/Paris');
  player = {
    warn: player.warn,
    banned: player.banned,
    player_data: player.player_data,
  };

  let response = await client.batchStart()
    .downloadRemoteConfigVersion(1, '', '', '', 6100)
    .checkChallenge()
    .getHatchedEggs()
    .getInventory()
    .checkAwardedBadges()
    .downloadSettings()
    .getBuddyWalked()
    .batchCall();

  let inventory = pogobuf.Utils.splitInventory(response[3]);
  console.log(inventory);
  client.cleanUp();
};


exports.init = init;