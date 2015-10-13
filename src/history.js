import _ from 'lodash';

export default class History {
    
    add(category, info) {
        if (this[category]) {
            this[category] = [];
        }
        this[category].push(info);
    }

}