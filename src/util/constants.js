/**
 * @fileOverview Define constants in an Object
 */

/**
 * The RegExp of empty.
 * @type {RegExp}
 */
const EMPTY = /^$/
/**
 * The RegExp of email address.
 * @type {RegExp}
 */
const EMAIL = /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+((.[a-zA-Z0-9_-]{2,3}){1,2})$/
/**
 * The RegExp of mobile number.
 * @type {RegExp}
 */
const MOBILE = /^1[0-9]{10}$/
/**
 * The RegExp of telephone number.
 * @type {RegExp}
 */
const TELEPHONE = /^((0\d{2,3})-)(\d{7,8})(-(\d{3,}))?$/
/**
 * The RegExp of password in project of h5-admin.
 * @type {RegExp}
 */
const PASSWORD = /^[\da-zA-Z]{6,8}$/

/**
 * The Object of RegExp.
 * @type {Object.<RegExp>}
 * @const
 */
let RegExpConstants = {
    EMPTY,
    EMAIL,
    MOBILE,
    TELEPHONE,
    PASSWORD
}

/**
 * The Object of constants Object.
 * @type {Object.<Object>}
 * @const
 */
let constants = {RegExpConstants}

export default constants
