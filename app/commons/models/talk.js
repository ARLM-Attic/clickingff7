import _ from 'lodash';

export default class Talk {

    constructor(story) {

        // story instance
        this.story = story;

        // lines
        this.scene = story.scene;

        // line counter
        this.nbLine = 0;

        // displayed line
        // @var String
        this.current = '';

        // @var int
        this.refreshWaitingType();

        // source line
        // @var Line
        this.pickLine();
    }

    // game instance
    game() {
        return this.story.game;
    }

    /**
     * Display the line (animation)
     */
    play() {
        this.timer = this.game().$timeout(() => {
            this.current = this.line.text.substr(0, ++this.i);
            if (!this.isFullText()) {
                this.play();
            } else {
                this.refreshWaitingType();
            }
        }, 50);
    }

    /**
     * Resume the line
     */
    resume() {
        // stop the animation
        this.game().$timeout.cancel(this.timer);

        // display all current line
        this.current = this.line.text;
    }

    /**
     * Returns true if current line is completely displayed
     * @returns {boolean}
     */
    isFullText() {
        return (this.current.length == this.line.text.length);
    }

    /**
     * Pick a line
     */
    pickLine() {
        this.current = '';
        let t = this.scene[this.nbLine].split(': ');
        this.line = {speaker: ((t[0] != 'narrator') ? t[0]: null), text: t[1]};
        this.line.text = this.game().$translate.instant(this.line.text);
        this.i = 0;
        this.play();
    }

    /**
     * previous line to display
     */
    previousLine() {
        this.resume();
        this.nbLine--;
        this.pickLine();
    }

    /**
     * Full current or next line to display
     */
    nextLine() {
        if (!this.isFullText()) {
            this.resume();
            this.refreshWaitingType();
        } else if (this.nbLine + 1 < this.scene.length) {
            this.nbLine++;
            this.pickLine();
            this.refreshWaitingType();
        } else {
            this.story.played = true;

            // [saving]
            this.game().save();

            // redirect
            this.game().$location.path('/home');
        }
    }

    /**
     *
     */
    refreshWaitingType() {
        if (!this.line || !this.isFullText()) {
            this.waitingType = 1;
        } else if (this.nbLine + 1 < this.scene.length) {
            this.waitingType = 2;
        } else {
            this.waitingType = 3;
        }

    }


}