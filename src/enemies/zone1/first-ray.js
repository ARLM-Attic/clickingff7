class FirstRay extends Enemy {

    constructor(game) {
        super(game);

        this.name = '1st Ray';

        this.image = '/img/enemies/zone1/1st-ray.png';

        // BELOW – rate over 5
        this.hpMax = 1;
        this.hits = 1;
        this.xp = 1;
        this.ap = 1;
        this.gils = 5;
        // END
    }

}