import {Component} from 'angular2/core';
import {Game} from './game';
import {Store} from './store';
import {GameViewComponent} from './game.view.component';

@Component({
    selector: 'my-app',
    templateUrl: 'app/app.template.html',
    providers: [Game, Store],
    directives: [GameViewComponent]
})
export class AppComponent {

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
