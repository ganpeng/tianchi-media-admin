import store from 'store';
import _ from 'lodash';
import 'babel-polyfill';
import constants from './constants';
import {Message, MessageBox} from 'element-ui';
import service from '../service/index';
import vuexStore from '../store/index';

let timer = null;

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
     *Judge string is or not a right multicast IP address
     * @param {String} str  The base string as a multicast IP address
     * @return {Boolean} Is or not a right multicast IP address
     */
    isMulticastIPAddress(str) {
        return constants.RegExpConstants.MULTIPLE_IP_ADDRESS.test(this.trim(str));
    },
    /**
     * Judge string is or not a right IP address
     * @param {String} str  The base string as a IP address
     * @return {Boolean} Is or not a right IP address
     */
    isIPAddress(str) {
        return constants.RegExpConstants.IP_ADDRESS.test(this.trim(str));
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
     *Judge string is or not a web site address
     * @param {String} str  The base string as a Ip port
     * @return {Boolean} Is or not a right web site address
     */
    isWebSiteAddress(str) {
        return constants.RegExpConstants.WEB_SITE_ADDRESS.test(this.trim(str));
    },
    /**
     *Judge string is or not a channel no
     * @param {String} str  The base string as a channel no
     * @return {Boolean} Is or not a right channel no
     */
    isChannelNo(str) {
        return constants.RegExpConstants.CHANNEL_NO.test(this.trim(str)) && parseInt(this.trim(str)) !== 0;
    },
    /**
     *Judge string is or not a channel ts id
     * @param {String} str  The base string as a channel ts id
     * @return {Boolean} Is or not a right channel ts id
     */
    isChannelTsId(str) {
        return constants.RegExpConstants.CHANNEL_TS_ID.test(this.trim(str)) && parseInt(this.trim(str)) !== 0;
    },
    /**
     *Judge string is or not a channel service id
     * @param {String} str  The base string as a channel service id
     * @return {Boolean} Is or not a right channel service id
     */
    isChannelServiceId(str) {
        return constants.RegExpConstants.CHANNEL_SERVICE_ID.test(this.trim(str)) && parseInt(this.trim(str)) !== 0;
    },
    /**
     *Judge string is or not a national id
     * @param {String} str  The base string as a national id
     * @return {Boolean} Is or not a right channel national id
     */
    isNationalId(str) {
        return constants.RegExpConstants.NATIONAL_ID.test(this.trim(str)) && parseInt(this.trim(str)) !== 0;
    },
    /**
     * Format the date with specified format
     * @param {Date} date  The base string
     * @param {String} format  supported format options: yyyy: full year, MM: month, DD: date, HH: hours, mm: minutes, SS: seconds
     * @return {String} formated string
     **/
    formatDate(date, format) {
        if (format) {
            // handle yyyy
            format = format.replace(/yyyy/g, date.getFullYear());
        }
        if (format) {
            // handle MM
            format = format.replace(/MM/g, this.fillNumberBit(date.getMonth() + 1));
        }
        if (format) {
            // handle DD
            format = format.replace(/DD/g, this.fillNumberBit(date.getDate()));
        }
        if (format) {
            // handle HH
            format = format.replace(/HH/g, this.fillNumberBit(date.getHours()));
        }
        if (format) {
            // handle mm
            format = format.replace(/mm/g, this.fillNumberBit(date.getMinutes()));
        }
        if (format) {
            // handle SS
            format = format.replace(/SS/g, this.fillNumberBit(date.getSeconds()));
        }
        return format;
    },
    // 数字4变为04
    fillNumberBit(number) {
        return (parseInt(number) / 100).toFixed(2).toString().replace('0.', '');
    },
    fromSecondsToTime(seconds) {
        if (!seconds) {
            return '00:00:00';
        }
        let time = parseInt(seconds);
        if (parseInt(seconds) > 60) {
            let second = parseInt(seconds) % 60;
            let min = parseInt(seconds / 60);
            time = (min > 9 ? min : '0' + min) + ':' + (second > 9 ? second : '0' + second);
            if (min > 60) {
                min = parseInt(seconds / 60) % 60;
                let hour = parseInt(parseInt(seconds / 60) / 60);
                time = (hour > 9 ? hour : '0' + hour) + ':' + (min > 9 ? min : '0' + min) + ':' + (second > 9 ? second : '0' + second);
            } else {
                time = '00:' + (min > 9 ? min : '0' + min) + ':' + (second > 9 ? second : '0' + second);
            }
        } else {
            time = '00:00:' + (time > 9 ? time : '0' + time);
        }
        return time;
    },
    getUploadHeaders(token) {
        let cookie = document.cookie;
        return {
            'Accept': 'application/json',
            'x-tianchi-client': '{"role":"ADVISER","version":"v1.1.1","deviceId":"1234fads"}',
            'x-tianchi-token': token,
            'x-tianchi-cookie': cookie
        };
    },
    getRandomUrl(uri, count) {
        let servers = store.get('servers') || [];
        let totalServers = servers.reduce((res, curr) => {
            let times = curr.weight;
            let currServers = [];
            for (let i = 0; i < times; i++) {
                currServers.push(`${curr.ip}:${curr.port}`);
            }
            return res.concat(currServers);
        }, []);

        if (count) {
            let index = count % totalServers.length;
            return `http://${totalServers[index]}${uri}`;
        } else {
            return `http://${_.sample(totalServers)}${uri}`;
        }
    },
    showNetworkErrorMessage() {
        if (window.navigator.onLine) {
            Message({
                message: '服务器连接失败，请稍后重试',
                type: 'error'
            });
        } else {
            Message({
                message: '网络连接失败，请检查您的网络连接情况',
                type: 'error'
            });
        }
    },
    setProjectTitle(siteName) {
        document.title = (siteName || '未配置站点') + '--天驰管理平台';
    },
    loopGetUploadServer(resolve) {
        service.getUpstream().then((res) => {
            if (res && res.code === 0) {
                let {ip, port} = res.data;
                let url = `http://${ip}:${port}`;
                resolve(url);
                clearTimeout(timer);
            } else {
                console.log(`上传地址获取失败: ${res}`);
                clearTimeout(timer);
                timer = setTimeout(() => {
                    util.loopGetUploadServer(resolve);
                }, 1000);
            }
        }).catch((err) => {
            let code = _.get(err, 'response.data.code');
            if (code === 1001 || code === 1003) {
                console.log(`上传地址获取失败, 账号已被踢出, 错误原因: ${err}`);
                clearTimeout(timer);
            } else {
                console.log(`上传地址获取失败, 错误原因: ${err}`);
                clearTimeout(timer);
                timer = setTimeout(() => {
                    util.loopGetUploadServer(resolve);
                }, 1000);
            }
        });
    },
    getUploadServer() {
        return new Promise((resolve) => {
            util.loopGetUploadServer(resolve);
        });
    },
    toggleFixedBtnContainer() {
        let content = document.querySelector('.content-wrapper');
        let fixedBtnContainer = document.querySelector('.fixed-btn-container');
        let isBottom = content.scrollHeight - content.scrollTop === content.clientHeight;
        if (fixedBtnContainer) {
            if (isBottom) {
                fixedBtnContainer.style.background = 'transparent';
                fixedBtnContainer.style.boxShadow = 'none';
            } else {
                fixedBtnContainer.style.background = '#293550';
                fixedBtnContainer.style.boxShadow = 'none';
            }
        }
    },
    async deleteLayoutItemHandler(id) {
        try {
            let confirm = await MessageBox.confirm('您确定要删除该板式吗？', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'error'
            });
            if (confirm) {
                let res = await service.deleteLayoutBlockById(id);
                if (res && res.code === 0) {
                    vuexStore.commit('pageLayout/setActiveLayout', {layout: res.data});
                    Message.success('删除成功');
                } else {
                    Message.error('删除成功');
                }
            }
        } catch (err) {
            console.log(err);
        }
    },
    async deleteAppLayoutItemHandler(id) {
        try {
            let confirm = await MessageBox.confirm('您确定要删除该板式吗？', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'error'
            });
            if (confirm) {
                let res = await service.deleteAppLayoutBlockById(id);
                if (res && res.code === 0) {
                    vuexStore.commit('appPageLayout/setActiveLayout', {layout: res.data});
                    Message.success('删除成功');
                } else {
                    Message.error('删除成功');
                }
            }
        } catch (err) {
            console.log(err);
        }
    },
    cutStr(str, len) {
        let charLength = 0;
        if (!str) {
            return '';
        }
        for (let i = 0; i < str.length; i++) {
            let sonStr = str.charAt(i);
            encodeURI(sonStr).length > 2 ? charLength += 1 : charLength += 0.5;
            if (charLength >= len) {
                let subLen = charLength === len ? i + 1 : i;
                return `${str.substr(0, subLen)}...`;
            }
        }
        return str;
    },
    lowerFrameProgrammeErrorHandler(res) {
        let {code, data, message} = res;
        let msg = '';
        switch (code) {
            case 3110:
                msg = data.map((item) => {
                    return item ? `"${item}"` : '';
                }).join(',');
                return `节目包含在如下${msg}专题中`;
            case 3111:
                msg = data.map((item) => {
                    return item ? `"${item}"` : '';
                }).join(',');
                return `节目包含在如下${msg}推荐位`;
            default:
                return message;
        }
    },
    convertFileSize(size) {
        let kb = 1024;
        let mb = kb * 1024;
        let gb = mb * 1024;
        if (!size) {
            return '';
        }
        if (size >= gb) {
            return Math.round(size / gb) + 'Gb';
        } else if (size >= mb) {
            let f = size / mb;
            return Math.round(f) + 'Mb';
        } else if (size >= kb) {
            let f = size / kb;
            return Math.round(f) + 'Kb';
        } else {
            return size + 'Byte';
        }
    },
    //  银行家舍入法（四舍六入五取偶）
    bankersRounding(value, length) {
        let carry = 0; // 存放进位标志
        let num, multiple; // num为原浮点数放大multiple倍后的数，multiple为10的length次方
        let str = value + ''; // 将调用该方法的数字转为字符串
        let dot = str.indexOf('.'); // 找到小数点的位置
        if (str.substr(dot + length + 1, 1) >= 5) {
            carry = 1; // 找到要进行舍入的数的位置，手动判断是否大于等于5，满足条件进位标志置为1
        }
        multiple = Math.pow(10, length); // 设置浮点数要扩大的倍数
        num = Math.floor(value * multiple) + carry; // 去掉舍入位后的所有数，然后加上我们的手动进位数
        let result = num / multiple + ''; // 将进位后的整数再缩小为原浮点数
        // 处理进位后无小数
        dot = result.indexOf('.');
        if (dot < 0) {
            result += '.';
            dot = result.indexOf('.');
        }
        // 处理多次进位
        let len = result.length - (dot + 1);
        if (len < length) {
            for (let i = 0; i < length - len; i++) {
                result += 0;
            }
        }
        return result;
    },
    //  页面布局默认的数据结构
    defaultLayoutBlock: {
        desc: '',
        id: '',
        layoutItemType: '',
        programmeTemplate: null,
        name: '',
        params: '',
        coverImage: {},
        coverImageBackground: {},
        cornerMark: {
            leftTop: {},
            leftBottom: {},
            rightTop: {},
            rightBottom: {}
        }
    },
    checkSize(img) {
        return (parseInt(img.width) === 240 && parseInt(img.height) === 350) || (parseInt(img.width) === 260 && parseInt(img.height) === 380);
    },
    imageWidth240AndWidth260NoRepeat(image, imageList) {
        if (util.checkSize(image)) {
            return imageList.filter((img) => {
                return !util.checkSize(img);
            });
        } else {
            return imageList;
        }
    },
    checkSizeForApp(img) {
        //  384*561  330*186
        return (parseInt(img.width) === 384 && parseInt(img.height) === 561);
    },
    imageWidth384AndWidth561NoRepeat(image, imageList) {
        if (util.checkSizeForApp(image)) {
            return imageList.filter((img) => {
                return !util.checkSizeForApp(img);
            });
        } else {
            return imageList;
        }
    },
    downloadFile(url, name) {
        if (typeof url === 'object' && url instanceof Blob) {
            url = URL.createObjectURL(url); // 创建blob地址
        }
        let aLink = document.createElement('a');
        aLink.href = url;
        aLink.download = name || ''; // HTML5新增的属性，指定保存文件名，可以不要后缀，注意，file:///模式下不会生效
        let event;
        if (window.MouseEvent) {
            event = new MouseEvent('click');
        } else {
            event = document.createEvent('MouseEvents');
            event.initMouseEvent('click', true, false, window, 0, 0, 0, 0, 0, false, false, false, false, 0, null);
        }
        aLink.dispatchEvent(event);
    }
};

export default util;
