/**
 * Game class
 */

function Game() {};

/**
 * Init the game with angular variables
 */
Game.prototype.init = function($rootScope, $cookieStore, $http, $timeout) {
  this.$rootScope = $rootScope;
  this.$cookieStore = $cookieStore;
  this.$http = $http;
  this.$timeout = $timeout;

  // Detect first load
  this.loaded = false;

  // Fight mode
  this.fight = false;

  // scopes INFOS
  this.enemy_hp_max = 0;
  this.enemy_hp = 0;
  this.characters_level_max = 1;
  this.total_gils = 0;
  this.boss_defeated = false;

  this.zoneLvl = 1;

  this.enemies = new Enemies(this);
  this.characters = new Characters(this);
  this.weapons = {};
  this.materias = {};
  this.items = {};

  this.data = {};
};

/**
 * Load game infos : characters, enemy & zone
 * depending the zone level
 */
Game.prototype.load = function() {
  // Data from save
  if (!this.loaded) {
    var save = this.$cookieStore.get('game');
    if (save) {
      this.zoneLvl = save.zoneLvl;
    }
  }

  this._loadJSON([
    ['lines', 'zones', 'enemies', 'weapons', 'materias', 'items'],
    ['characters']
  ]);
};

/**
 * Load JSON files
 * @param  {array} jsons
 */
Game.prototype._loadJSON = function(jsons) {
  if (jsons.length == 0) {
    this.begin();
    return;
  }

  var self = this;
  var n = 0;
  var max = jsons[0].length;
  for (var i in jsons[0]) {
    var loader = '_load_' + jsons[0][i];
    self[loader](function() {
      n++;
      if (n == max) {
        jsons.splice(0, 1);
        self._loadJSON(jsons);
      }
    });
  }
};

Game.prototype._load_lines = function(finish) {
  var self = this;
  this.$http.get('data/lines.json').success(function(data) {
    self.data.lines = data;

    finish();
  });
};

Game.prototype._load_zones = function(finish) {
  var self = this;
  this.$http.get('data/zones.json').success(function(data) {
    self.data.zones = data;

    // Setting current zone
    self.zone = data[self.zoneLvl];

    finish();
  });
};

Game.prototype._load_enemies = function(finish) {
  var self = this;
  this.$http.get('data/enemies.json?v=' + new Date().getTime()).success(function(data) {
    self.data.enemies = data;

    finish();
  });
};

Game.prototype._load_weapons = function(finish) {
  var self = this,
    weapon;
  this.$http.get('data/weapons.json?v=' + new Date().getTime()).success(function(data) {
    self.data.weapons = data;

    finish();
  });
};

Game.prototype._load_materias = function(finish) {
  var self = this,
    materia;
  this.$http.get('data/materias.json?v=' + new Date().getTime()).success(function(data) {
    self.data.materias = data;

    finish();
  });
};

Game.prototype._load_items = function(finish) {
  var self = this,
    item;
  this.$http.get('data/items.json?v=' + new Date().getTime()).success(function(data) {
    self.data.items = data;

    finish();
  });
};

Game.prototype._load_characters = function(finish) {
  var self = this;
  this.$http.get('data/characters.json?v=' + new Date().getTime()).success(function(data) {
    self.data.characters = data;

    finish();
  });
};

/**
 * Operations that begins after getting data
 */
Game.prototype.begin = function() {
  var $cookieStore = this.$cookieStore;
  var $timeout = this.$timeout;

  if (!this.loaded) {
    var save = this.$cookieStore.get('game');
    if (save) {
      this.extends(save);
    }
  }

  this.loaded = true;

  this.characters.build();
  this.characters.refresh();
  this.enemies.refresh();

  this.refresh();
};

/**
 * Extends the properties with new ones
 * @param  {object} infos
 */
Game.prototype.extends = function(save) {
  for (var i in save.characters) {
    _.extend(this.data.characters[i], save.characters[i]);
  }

  for (var i in save.weapons) {
    if (i in this.weapons) {
      this.weapons[i].extends(save.weapons[i]);
    } else {
      this.weapons[i] = new Weapon(this, i);
      this.weapons[i].extends(this.data.weapons[i].data);
      this.weapons[i].extends(save.weapons[i]);
    }
  }

  for (var i in save.materias) {
    if (i in this.materias) {
      this.materias[i].extends(save.materias[i]);
    } else {
      this.materias[i] = new Materia(this, i);
      this.materias[i].extends(this.data.materias[i].data);
      this.materias[i].extends(save.materias[i]);
    }
  }

  for (var i in save.items) {
    if (i in this.items) {
      this.items[i].extends(save.items[i]);
    } else {
      this.items[i] = new Item(this, i);
      this.items[i].extends(this.data.items[i].data);
      this.items[i].extends(save.items[i]);
    }
  }

  for (var i in save.zone) {
    if (i in this.zone) {
      this.zone[i].extends(save.zone[i]);
    } else {
      this.zone[i] = new Zone(this, i);
      this.zone[i].extends(this.data.itzoneems[i].data);
      this.zone[i].extends(save.zone[i]);
    }
  }

  this.time = new Date(save.time).toLocaleString();

  this.last_export = JSON.stringify(save);
};

/**
 * Returns if it is possible to go next zone
 * @return {boolean}
 */
Game.prototype.can_next_zone = function() {
  return !this.fight && this.boss_defeated;
};

/**
 * Returns if it is possible to buy an item from the shop
 * @return {boolean}
 */
Game.prototype.can_buy = function(item) {
  return this.total_gils >= item.get_gils();
};

/**
 * Refresh the total characters hp
 * @return {[type]} [description]
 */
Game.prototype.refresh_characters_hp = function() {
  var characters_hp = 0;
  this.get_characters(function(i, character) {
    characters_hp += character.get_hp();
  });
  this.set('characters_hp_max', characters_hp);
  if (!this.characters_hp || this.characters_hp > characters_hp) {
    this.set('characters_hp', characters_hp);
  }
};

/**
 * Refresh the total characters hp
 * @return {[type]} [description]
 */
Game.prototype.refresh_characters_limit = function() {
  var characters_limit = 0;
  this.get_characters(function(i, character) {
    characters_limit += character.get_hp();
  });
  this.set('characters_limit_max', characters_limit);
  if (!this.characters_limit || this.characters_limit > characters_limit) {
    this.set('characters_limit', 0);
  }
};

/**
 * Refresh the characters level max
 */
Game.prototype.refresh_level_max = function() {
  var self = this;
  this.get_characters(function(i, character) {
    self.characters_level_max = Math.max(self.characters_level_max, character.data.level);
  });
};

/**
 * Return item number in stock
 * @param  {string} i
 * @return {int}
 */
Game.prototype.get_item_stock = function(i) {
  var res = 0;

  if (i in this.items) {
    res = this.items[i].data.number;
  }

  return res;
};

/**
 * Returns true if there are no weapons in stock
 */
Game.prototype.no_items = function() {
  return Object.keys(this.items).length == 0;
};

/**
 * Returns true if there are no weapons to buy
 */
Game.prototype.no_weapons = function() {
  var res = 1;
  for (var i in this.data.weapons) {
    if (!(i in this.weapons)) {
      res = 0;
      break;
    }
  }
  return res;
};

/**
 * Characters start auto-attacking
 */
Game.prototype.start_fight = function() {
  if (!this.fight) {
    this.fight = true;

    this.characters.run();
    this.enemies.run();
  }
};

/**
 * Characters stop attacking and wait for next fight
 * @param  {boolean} victory
 */
Game.prototype.end_fight = function(victory) {
  this.fight = false;

  var enemies = this.enemies.getTeam();
  var characters = this.characters.getTeam();

  for (var i in enemies) {
    var enemy = enemies[i];

    // Rewards if victory
    if (victory) {
      this.total_gils += enemy.gilsReward();

      if (enemy.boss) {
        this.boss_defeated = true;
      }

      // XP for characters
      for (var j in characters) {
        var character = characters[j];
        var xp = enemy.xpReward();
        character.setXp(xp);
      }

      // AP for materias
      /*for (var j in this.materias) {
        var ap = enemy.apReward();
        this.materias[j].set_ap(ap);
      }*/
    }
  }

  this.enemies.remove();
  this.enemies.refresh();
};

/**
 * Escape from fight
 * @return {[type]} [description]
 */
Game.prototype.escape = function() {
  this.end_fight(false);
};

/**
 * Go the next zone level
 */
Game.prototype.next_zone = function() {
  this.zone.level += 1;
  this.boss_defeated = false;
  this.load();
};

/**
 * Refresh all scopes
 */
Game.prototype.refresh = function() {
  this.$rootScope.game = this;
};

/**
 * Returns in pixels characters limit bar width
 * @param  {int} pixel_max
 * @return {int}
 */
Game.prototype.characters_limit_progress = function(pixels_max) {
  return this.characters_limit / this.characters_limit_max * pixels_max;
};

/**
 * Export the game for saving
 * @return {object}
 */
Game.prototype.export = function() {
  var characters = this.characters.save();

  var weapons = {};
  for (var i in this.weapons) {
    weapons[i] = this.weapons[i].save();
  }

  var materias = {};
  for (var i in this.materias) {
    materias[i] = this.materias[i].save();
  }

  var items = {};
  for (var i in this.items) {
    items[i] = this.items[i].save();
  }

  var zones = {};
  for (var i in this.zones) {
    zones[i] = this.zones[i].save();
  }

  var save = {};

  save.characters = characters;
  save.weapons = weapons;
  save.materias = materias;
  save.items = items;
  save.zones = zones;
  save.zoneLvl = this.zoneLvl;

  save.boss_defeated = this.boss_defeated;

  save.time = (new Date()).toLocaleString();

  return save;
};

/**
 * Import a save
 * @param  {object} save
 */
Game.prototype.import = function(save) {
  this.$cookieStore.put('game', save);
};

/**
 * Save the game
 */
Game.prototype.save = function() {
  var save = this.export();
  this.$cookieStore.put('game', save);
  this.time = save.time;
  this.last_export = JSON.stringify(save);
};

/**
 * Remove the COOKIE & reset the game
 */
Game.prototype.reset = function() {
  this.$cookieStore.remove('game');
};