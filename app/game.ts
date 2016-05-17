import {Injectable} from 'angular2/core';
import {CHARACTERS} from './mock-characters';
import {Store} from './store';
import {Character} from './character';
import _ from 'lodash';

@Injectable()
export class Game {

  version: string = "0.1.0";

  store: Store;

  characters: Character[] = [];
  team: Character[];
  backup: Character[];

  constructor(store: Store) {

    this.store = store;
    this.store.characters = CHARACTERS;

    // new game
    this.addCharacter(this.store.getCharacter('cloud'), true);
    this.addCharacter(this.store.getCharacter('barret'), true);
    this.addCharacter(this.store.getCharacter('tifa'));

    this.buildTeam();
  }

  addCharacter(character: Character, inTeam: boolean = false) {
    character.active = inTeam;
    this.characters.push(character);
  }

  buildTeam() {
    this.team = _.filter(this.characters, {active: true});
    this.backup = _.filter(this.characters, {active: false});
  }

}
