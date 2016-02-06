import _ from 'lodash';

export default class History {

    constructor() {
        this.categories = {};
    }

    /**
     *
     * @param cat
     * @param info
     */
    add(cat, info) {
        if (!this.categories[cat]) {
            this.categories[cat] = [];
        }
        this.categories[cat].push(info);
    }

}