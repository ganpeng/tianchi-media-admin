import constants from './constants'

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
        return value.toString().replace(/(^\s*) | (\s*$)/g, '')
    },
    /**
     *format string
     * @param {String} str  The base string
     * @param {...args} ...args The arguments which amount is not defined
     * @return {String} The final spelled string
     */
    format(str, ...args) {
        return str.replace(/{(\d+)}/g, function (match, number) {
            return typeof args[number] !== 'undefined' ? args[number] : match
        })
    },
    /**
     *Judge string is or not empty
     * @param {String} str  The base string
     * @return {Boolean} Is or not empty
     */
    isEmpty(str) {
        return constants.RegExpConstants.EMPTY.test(this.trim(str))
    },
    /**
     *Judge string is or not an email address
     * @param {String} str  The base string
     * @return {Boolean} Is or not an email address
     */
    isEmail(str) {
        return constants.RegExpConstants.EMAIL.test(this.trim(str))
    },
    /**
     *Judge string is or not a mobile number
     * @param {String} str  The base string
     * @return {Boolean} Is or not a mobile number
     */
    isMobile(str) {
        return constants.RegExpConstants.MOBILE.test(this.trim(str))
    },
    /**
     *Judge string is or not a telephone number
     * @param {String} str  The base string
     * @return {Boolean} Is or not a telephone number
     */
    isTelephone(str) {
        return constants.RegExpConstants.TELEPHONE.test(this.trim(str))
    },
    /**
     *Judge string is or not a right password in h5-admin project
     * @param {String} str  The base string as a password
     * @return {Boolean} Is or not a right password
     */
    isPassword(str) {
        return constants.RegExpConstants.PASSWORD.test(this.trim(str))
    }
}

export default util
