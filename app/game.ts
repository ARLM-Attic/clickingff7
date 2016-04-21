import {Injectable} from 'angular2/core';
import {CHARACTERS} from './mock-characters';
import {Store} from './store';
import {Character} from './character';
import _ from 'lodash';

@Injectable()
export class Game {

  version: string = "0.1.0";

  store: Store;

  characters: Character[];

  constructor(store: Store) {

    this.store = store;
    this.store.characters = CHARACTERS;

    console.log(this.store.characters, _.VERSION);

    // @todo ajouter lodash

    // new game
    //addCharacter(Character.get('cloud'), true);


  }

  addCharacter(character: Character, inTeam: boolean = true) {
    character.active = inTeam;
    this.characters.push(character);
  }

}
