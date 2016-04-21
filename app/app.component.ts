import {Component} from 'angular2/core';
import {Game} from './game';
import {Store} from './store';

@Component({
    selector: 'my-app',
    templateUrl: 'app/app.template.html',
    providers: [Game, Store]
})
export class AppComponent {

  game: Game;

  constructor(game: Game) {
    this.game = game;
  }

}
