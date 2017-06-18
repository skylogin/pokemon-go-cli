const pogobuf = require('pogobuf-vnext');

class Pokemon {
  constructor() {
    this.instance = null;
  }

  async init(config) {
    const self = this;

    self.instance = new pogobuf.Client({
      authType: config.authType,
      username: config.username,
      password: config.password,
      // version: 6301,
      useHashingServer: true,
      hashingKey: config.hashKey,
      // includeRequestTypeInResponse: true,
      //proxy: config.proxy,
    });

    let coordinates = {
      latitude: 37.543962,
      longitude: 126.950471
    };    //Gongduck-station, Seoul, Korea
    self.instance.setPosition(coordinates.latitude, coordinates.longitude);

    await self.instance.init(false);
    await self.instance.batchStart().batchCall();
    await self.instance.getPlayer('US', 'en', 'Europe/Paris');

    return self.instance;
  }

  async getInventory() {
    const self = this;

    let response = await self.instance.batchStart()
      .downloadRemoteConfigVersion(1, '', '', '', 6100)
      .checkChallenge()
      .getHatchedEggs()
      .getInventory()
      .checkAwardedBadges()
      .downloadSettings()
      // .getBuddyWalked()
      .batchCall();

    let inventory = pogobuf.Utils.splitInventory(response[3]);
    self.instance.cleanUp();

    return inventory;
  }


  async setRenamingAlias(id, alias){
    const self = this;

    // setTimeout(() => {
    //   await self.instance.batchStart()
    //     .nicknamePokemon(id, alias)
    //     .batchCall();
    //     console.log(`+ Change your pokémon nickname: ${name}`);
    // }, 1000);

  }
}

exports.Pokemon = Pokemon;