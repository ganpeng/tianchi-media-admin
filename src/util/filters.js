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
    },
    // 转化对象数组中的某一个属性为字符
    jsonJoin(array, attr) {
        if (!array) return;
        let str = '';
        for (let i = 0; i < array.length; i++) {
            str = str + ',' + array[i][attr];
        }
        return str.slice(1);
    },
    imageUrl(uri) {
        let baseUri = window.localStorage.getItem('imageBaseUri');
        return baseUri + uri;
    }
};

/**
 * Register global filters in Vue.
 */
for (let filter in FILTERS) {
    Vue.filter(filter, FILTERS[filter]);
}

export default Vue;
