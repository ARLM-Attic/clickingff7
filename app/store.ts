import {Character} from './character';
import _ from 'lodash';

export class Store {

  characters: Character[];

  constructor() {

  }

  getCharacter(ref: string): Character {
    return _.find(this.characters, {ref: ref});
  }

}
