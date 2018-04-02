/**
 * 扩展公寓方法的工具类模块
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
     * @param {JSON} array An argument witch is an array that contains the keywords
     * @return {String} The final spelled string
     */
    format(str, array) {
        for (let k = 0; k < array.length; k++) {
            str = str.replace(new RegExp('\\{' + k + '\\}', 'g'), array[k])
        }
        return str
    }
}

export default util
