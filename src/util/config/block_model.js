/**
 * @fileOverview Define block model of the project
 */

/**
 * The Array of block model type.
 * @type {Array.<Object>}
 */
const TYPE = [
    {
        id: 1,
        name: '1'
    }, {
        id: 2,
        name: '2'
    }, {
        id: 3,
        name: '3'
    }, {
        id: 4,
        name: '4'
    }, {
        id: 5,
        name: '2+3'
    }, {
        id: 6,
        name: '3+2'
    }, {
        id: 7,
        name: '2+4'
    }, {
        id: 8,
        name: '2+6'
    }, {
        id: 9,
        name: '3+3'
    }, {
        id: 10,
        name: '3+4'
    }, {
        id: 11,
        name: '4+3'
    }, {
        id: 12,
        name: '3+6'
    }, {
        id: 13,
        name: '4+4'
    }, {
        id: 14,
        name: '6+6'
    }, {
        id: 15,
        name: '2+3+4'
    }, {
        id: 16,
        name: '2+3+6'
    }, {
        id: 17,
        name: '3+2+4'
    }, {
        id: 18,
        name: '3+2+6'
    }, {
        id: 19,
        name: '4+2+3'
    }, {
        id: 20,
        name: '4+3+2'
    }
];

/**
 * The Object of block model size.
 * @type {Object}
 */
const SIZE = {
    1: {
        width: 1700,
        height: 200
    },
    2: {
        width: 824,
        height: 225
    },
    3: {
        width: 532,
        height: 225
    },
    4: {
        width: 386,
        height: 225
    },
    6: {
        width: 240,
        height: 350
    }
};

export default {TYPE, SIZE};
