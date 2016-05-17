import {Component} from 'angular2/core';
import {Game} from './game';
import {Store} from './store';

@Component({
  selector: 'game-view',
  templateUrl: 'app/game.view.template.html',
  providers: [Game, Store],
})
export class GameViewComponent {

  game:Game;

  version:string = '0.1.0';

  loaded:boolean = true;

  constructor(game:Game) {
    this.game = game;
  }

  isActive():boolean {
    return false;
  }

}
