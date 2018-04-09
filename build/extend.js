/**
 * define a bunch of functions in commonjs
 */

'use strict'

let util = {
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
    }
}

module.exports = util
