/**
 * @fileOverview Define global directives of Vue
 */

import Vue from 'vue';
import dragula from 'dragula';

/**
 * The Object of directives.
 * @type {Object.<Object>}
 * @const
 */
const DIRECTIVES = {
    // 拖动指令
    dragula: {
        bind(el, binding) {
            dragula([el], binding.value).on('drop', function (el, target, source, sibling) {
                // 更新list数据，实现实时更新
            });
        }
    }
};

/**
 * Register global directives in Vue.
 */
for (let directive in DIRECTIVES) {
    Vue.directive(directive, DIRECTIVES[directive]);
}

export default Vue;
