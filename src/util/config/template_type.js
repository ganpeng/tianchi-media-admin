/**
 * @fileOverview Define template type of the programme subject
 */

/**
 * The Array of block template type.
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
    }, {
        id: 21,
        name: 's6'
    }, {
        id: 22,
        name: 's6+s6'
    }
];

/**
 * The Object of block template size.
 * @type {Object}
 */
const SIZE = {
    1: {
        count: 1,
        size: {
            width: 1700,
            height: 200
        }
    },
    2: {
        count: 2,
        size: {
            width: 824,
            height: 225
        }
    },
    3: {
        count: 3,
        size: {
            width: 532,
            height: 225
        }
    },
    4: {
        count: 4,
        size: {
            width: 386,
            height: 225
        }
    },
    6: {
        count: 6,
        size: {
            width: 240,
            height: 350
        }
    },
    s6: {
        count: 6,
        size: {
            width: 240,
            height: 134
        }
    }
};

/**
 * According the template name resolve template info.
 * @type {Object}
 */
const NAME_TO_INFO = {
    '1': {
        name: '1',
        count: 1,
        height: 200,
        width: 1700,
        style: 'model-1-200'
    },
    '2': {
        name: '2',
        count: 2,
        height: 225,
        width: 824,
        style: 'model-2-225'
    },
    '3': {
        name: '3',
        count: 3,
        height: 225,
        width: 532,
        style: 'model-3-225'
    },
    '4': {
        name: '4',
        count: 4,
        height: 225,
        width: 386,
        style: 'model-4-225'
    },
    '6': {
        name: '6',
        count: 6,
        height: 350,
        width: 240,
        style: 'model-6-350'
    },
    's6': {
        name: 's6',
        count: 6,
        height: 134,
        width: 240,
        style: 'model-6-134'
    }
};

/**
 * According the template count and height resolve template info.
 * @type {Object}
 */
const SIZE_TO_INFO = {
    '1-200': {
        name: '1',
        count: 1,
        height: 200,
        width: 1700,
        style: 'model-1-200'
    },
    '2-225': {
        name: '2',
        count: 2,
        height: 225,
        width: 824,
        style: 'model-2-225'
    },
    '3-225': {
        name: '3',
        count: 3,
        height: 225,
        width: 532,
        style: 'model-3-225'
    },
    '4-225': {
        name: '4',
        count: 4,
        height: 225,
        width: 386,
        style: 'model-4-225'
    },
    '6-350': {
        name: '6',
        count: 6,
        height: 350,
        width: 240,
        style: 'model-6-350'
    },
    '6-134': {
        name: 's6',
        count: 6,
        height: 134,
        width: 240,
        style: 'model-6-134'
    }
};

export default {TYPE, SIZE, NAME_TO_INFO, SIZE_TO_INFO};
