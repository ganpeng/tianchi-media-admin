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
    TELEPHONE: /^[0-9|-]+$/,
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
    /**
     * The RegExp of channel no.
     */
    CHANNEL_NO: /^[0-9]{3}$/,
    /**
     * The RegExp of channel ts id.
     */
    CHANNEL_TS_ID: /^\d+$/,
    /**
     * The RegExp of channel service id.
     */
    CHANNEL_SERVICE_ID: /^\d+$/,
    /**
     * The RegExp of national id.
     */
    NATIONAL_ID: /^[1-9]\d{5}[1-9]\d{3}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}([0-9]|X)$/
};

/**
 * The Object of constants Object.
 * @type {Object.<Object>}
 * @const
 */
let constants = {RegExpConstants};

export default constants;
