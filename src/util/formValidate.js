// 节目表单的校验
import _ from 'lodash';

/**
 * 校验评分字段的规则，必须是1-10之间的数字，而且数字最多保留以为小数1.1 - 10
 */
export const checkScore = (rule, value, callback) => {
    if (!value) {
        return callback(new Error('评分不能为空'));
    }
    if (!_.isNumber(parseFloat(value))) {
        callback(new Error('请输入数字值'));
    } else {
        if (String(value).split('.')[1].length > 1) {
            return callback(new Error('评分只能保留一位小数'));
        }
        if (value > 10 || value < 1) {
            callback(new Error('评分必须是大于1小于10之间的数字'));
        } else {
            callback();
        }
    }
};

export default {
    checkScore
};
