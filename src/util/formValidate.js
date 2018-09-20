// 节目表单的校验
import _ from 'lodash';
import constants from './constants';

/**
 * 校验评分字段的规则，必须是1-10之间的数字，而且数字最多保留以为小数1.1 - 10
 */
export const checkScore = (rule, value, callback) => {
    if (!_.isEmpty(value)) {
        if (!_.isNumber(parseFloat(value))) {
            callback(new Error('请输入数字值'));
        } else {
            if (String(value).split('.')[1] && String(value).split('.')[1].length > 1) {
                return callback(new Error('评分只能保留一位小数'));
            }
            if (value > 10 || value < 1) {
                callback(new Error('评分必须是大于1小于10之间的数字'));
            } else {
                callback();
            }
        }
    } else {
        callback();
    }
};

/**
 * 分类校验
 */
export const checkCategory = (rule, value, callback) => {
    if (_.isEmpty(value)) {
        return callback(new Error('分类不能为空'));
    }
    callback();
};

/**
 *  必填项的校验
 */
export const requiredValidator = (msg) => {
    return (rule, value, callback) => {
        if (_.isEmpty(value)) {
            return callback(new Error(msg));
        }
        callback();
    };
};

/**
 * 检查图片是否已经存在
 */
export const checkImageExist = (imageList, img) => {
    let index = imageList.findIndex((item) => item.id === img.id);
    return index >= 0;
};

/**
 * 总集数不能小于0
 */
export const checkPositiveInteger = (msg) => {
    const positiveIntegerReg = /^\+?[1-9][0-9]*$/;
    return (rule, value, callback) => {
        if (!_.isEmpty(value)) {
            if (!positiveIntegerReg.test(value)) {
                return callback(new Error(msg));
            }
            callback();
        } else {
            callback();
        }
    };
};

/**
 *  校验ip地址，直播的IP地址会使用域名，因此暂时去掉校验
 */
export const checkIP = (rule, value, callback) => {
    if (!_.isEmpty(value)) {
        if (constants.RegExpConstants.MULTIPLE_IP_ADDRESS.test(value)) {
            callback();
        } else {
            return callback(new Error('请输入正确的IP地址'));
        }
    } else {
        callback();
    }
};

/**
 *  校验ip地址
 */
export const checkChannelNo = (rule, value, callback) => {
    if (!_.isEmpty(value)) {
        if (constants.RegExpConstants.CHANNEL_NO.test(value) && value !== '000') {
            callback();
        } else {
            return callback(new Error('请输入正确的三位频道编号, 例如"007"'));
        }
    } else {
        callback();
    }
};

/**
 *  校验ip地址
 */
export const checkPort = (rule, value, callback) => {
    if (!_.isEmpty(value)) {
        if (constants.RegExpConstants.IP_PORT.test(value)) {
            callback();
        } else {
            return callback(new Error('请输入正确的端口'));
        }
    } else {
        callback();
    }
};

/**
 *  校验真实ip地址
 */
export const checkIp = (rule, value, callback) => {
    // if (!_.isEmpty(value)) {
    //     if (constants.RegExpConstants.IP_ADDRESS.test(value)) {
    //         callback();
    //     } else {
    //         return callback(new Error('请输入正确的所属服务器地址'));
    //     }
    // } else {
    callback();
    // }
};

export const getPageSize = (key) => {
    let pageSize = window.localStorage.getItem(key);
    return pageSize ? parseInt(pageSize) : 10;
};

export default {
    checkScore,
    checkCategory,
    requiredValidator,
    checkImageExist,
    checkPositiveInteger,
    checkIP,
    checkPort,
    getPageSize
};
