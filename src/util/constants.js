/**
 * @fileOverview Define constants in an Object
 */

/**
 * The Object of RegExp.
 * @type {Object.<RegExp>}
 */
let RegExpConstants = {
    /**
     * The RegExp of empty.
     */
    EMPTY: /^$/,
    /**
     * The RegExp of email address.
     */
    EMAIL: /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+((.[a-zA-Z0-9_-]{2,3}){1,2})$/,
    /**
     * The RegExp of mobile number.
     */
    MOBILE: /^1[0-9]{10}$/,
    /**
     * The RegExp of telephone number.
     */
    TELEPHONE: /^((0\d{2,3})-)(\d{7,8})(-(\d{3,}))?$/,
    /**
     * The RegExp of password in project of h5-admin.
     */
    PASSWORD: /^[\da-zA-Z]{6,8}$/,
    /**
     * The RegExp of IP address.
     */
    MULTIPLE_IP_ADDRESS: /^2(?:2[4-9]|3\d)(?:\.(?:25[0-5]|2[0-4]\d|1\d\d|[1-9]\d?|0)){3}$/,
    /**
     * The RegExp of IP port.
     */
    IP_PORT: /^\d+$/,
    /**
     * The RegExp of website address.
     */
    WEB_SITE_ADDRESS: /^((ftp|https?):\/\/|www\.).*/,
    //  三位正整数
    THREE_POSITIVE: /^[0-9]{3}$/
};

/**
 * The Object of constants Object.
 * @type {Object.<Object>}
 * @const
 */
let constants = {RegExpConstants};

export default constants;
