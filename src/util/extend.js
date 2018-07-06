import constants from './constants';
/**
 * 扩展公共方法的工具类模块，使用ES6 module
 * @type {{trim: ((value))}}
 */
let util = {
    /**
     *remove white space
     * @param value
     * @return {String}
     */
    trim(value) {
        return value.toString().replace(/(^\s*) | (\s*$)/g, '');
    },
    /**
     *format string
     * @param {String} str  The base string
     * @param {...args} ...args The arguments which amount is not defined
     * @return {String} The final spelled string
     */
    format(str, ...args) {
        return str.replace(/{(\d+)}/g, function (match, number) {
            return typeof args[number] !== 'undefined' ? args[number] : match;
        });
    },
    /**
     *Judge string is or not empty
     * @param {String} str  The base string
     * @return {Boolean} Is or not empty
     */
    isEmpty(str) {
        return str === null || str === undefined || constants.RegExpConstants.EMPTY.test(this.trim(str));
    },
    /**
     *Judge string is or not an email address
     * @param {String} str  The base string
     * @return {Boolean} Is or not an email address
     */
    isEmail(str) {
        return constants.RegExpConstants.EMAIL.test(this.trim(str));
    },
    /**
     *Judge string is or not a mobile number
     * @param {String} str  The base string
     * @return {Boolean} Is or not a mobile number
     */
    isMobile(str) {
        return constants.RegExpConstants.MOBILE.test(this.trim(str));
    },
    /**
     *Judge string is or not a telephone number
     * @param {String} str  The base string
     * @return {Boolean} Is or not a telephone number
     */
    isTelephone(str) {
        return constants.RegExpConstants.TELEPHONE.test(this.trim(str));
    },
    /**
     *Judge string is or not a right password in h5-admin project
     * @param {String} str  The base string as a password
     * @return {Boolean} Is or not a right password
     */
    isPassword(str) {
        return constants.RegExpConstants.PASSWORD.test(this.trim(str));
    },
    /**
     *Judge string is or not a right IP address
     * @param {String} str  The base string as a IP address
     * @return {Boolean} Is or not a right IP address
     */
    isMulticastIPAddress(str) {
        return constants.RegExpConstants.MULTIPLE_IP_ADDRESS.test(this.trim(str));
    },
    /**
     *Judge string is or not a right IP port
     * @param {String} str  The base string as a Ip port
     * @return {Boolean} Is or not a right IP port
     */
    isPort(str) {
        return constants.RegExpConstants.IP_PORT.test(this.trim(str));
    },
    /**
     * Format the date with specified format
     * @param {Date} date  The base string
     * @param {String} format  supported format options: yyyy: full year, MM: month, DD: date, HH: hours, mm: minutes, SS: seconds
     * @return {String} formated string
     **/
    formatDate(date, format) {
        // handle yyyy
        format = format.replace(/yyyy/g, date.getFullYear());
        // handle MM
        format = format.replace(/MM/g, date.getMonth() + 1);
        // handle DD
        format = format.replace(/DD/g, date.getDate());
        // handle HH
        format = format.replace(/HH/g, date.getHours());
        // handle mm
        format = format.replace(/mm/g, date.getMinutes());
        // handle SS
        format = format.replace(/SS/g, date.getSeconds());
        return format;
    },
    fromSecondsToTime(seconds) {
        if (!seconds) {
            return 0;
        }
        let time = parseInt(seconds) + '秒';
        if (parseInt(seconds) > 60) {
            let second = parseInt(seconds) % 60;
            let min = parseInt(seconds / 60);
            time = min + '分' + second + '秒';
            if (min > 60) {
                min = parseInt(seconds / 60) % 60;
                var hour = parseInt(parseInt(seconds / 60) / 60);
                time = hour + '小时' + min + '分' + second + '秒';
                if (hour > 24) {
                    hour = parseInt(parseInt(seconds / 60) / 60) % 24;
                    let day = parseInt(parseInt(parseInt(seconds / 60) / 60) / 24);
                    time = day + '天' + hour + '小时' + min + '分' + second + '秒';
                }
            }
        }
        return time;
    },
    getUploadHeaders(token) {
        return {
            'Accept': 'application/json',
            'x-tianchi-client': '{"role":"ADVISER","version":"v1.1.1","deviceId":"1234fads"}',
            'x-tianchi-token': token
        };
    }
};

export default util;
