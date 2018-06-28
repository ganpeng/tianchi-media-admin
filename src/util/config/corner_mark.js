/**
 * @fileOverview Define corner marks of the programmes
 */

/**
 * The Array of corner marks of the programmes.
 * @type {Array.<Object>}
 */
const CORNER_MARKS = [{
    id: 1,
    position: '左上角标',
    type: '平台角标',
    value: '爱奇艺'
}, {
    id: 2,
    position: '左下角标',
    type: '更新集数',
    value: '45集'
}, {
    id: 3,
    position: '右上角标',
    type: '运营角标',
    value: '最热'
}, {
    id: 4,
    position: '右下角标',
    type: '评分',
    value: '8.2分'
}];

const PLATFORM_MARK_SWITCH = {'爱奇艺': 'IQIYI', '芒果': 'MANGO', '腾讯': 'TENCENT', '优酷': 'YOUKU', '搜狐': 'SOHU'};

export default {CORNER_MARKS, PLATFORM_MARK_SWITCH};
