/**
 * @fileOverview Define global filters of Vue
 */

import Vue from 'vue';
import util from './extend';
import platformImage from '@/util/config/import_image.js';
import cornerMarkOptions from '@/util/config/corner_mark';

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
    },
    // 展示节目中不同类型人物列表
    displayFigures(figureMap, figureKey) {
        let str = '';
        if (figureMap && figureMap[figureKey] && figureMap[figureKey].length !== 0) {
            figureMap[figureKey].map(figure => {
                str = str + ',' + figure.name;
            });
            return str.slice(1);
        } else {
            return '------';
        }
    },
    setPlatformImage(copyRightCaptain) {
        return platformImage[cornerMarkOptions.PLATFORM_MARK_SWITCH[copyRightCaptain]];
    },
    // 转化秒数为正常时间
    fromSecondsToTime(seconds) {
        return util.fromSecondsToTime(seconds);
    }
};

/**
 * Register global filters in Vue.
 */
for (let filter in FILTERS) {
    Vue.filter(filter, FILTERS[filter]);
}

export default Vue;
