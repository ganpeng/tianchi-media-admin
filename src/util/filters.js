/**
 * @fileOverview Define global filters of Vue
 */

import Vue from 'vue';
import util from './extend';

/**
 * The Object of filters.
 * @type {Object.<Function>}
 * @const
 */
const FILTERS = {
    formatDate(milliseconds, format) {
        return milliseconds ? util.formatDate(new Date(milliseconds), format) : '';
    }
};

/**
 * Register global filters in Vue.
 */
for (let filter in FILTERS) {
    Vue.filter(filter, FILTERS[filter]);
}

export default Vue;
