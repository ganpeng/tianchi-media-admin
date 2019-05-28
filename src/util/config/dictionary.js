/**
 * @fileOverview Define the dictionary first level class
 */

/**
 * The JSON of first level class's filter dictionary.
 * @type {Object}
 */

const CLASS_FILTER_DICTIONARY = {
    // 电影
    MOVIE: [
        {
            type: 'AREA',
            name: '地区'
        },
        {
            type: 'CLASS',
            name: '分类'
        },
        {
            type: 'SPEC',
            name: '规格'
        }, {
            type: 'TIME',
            name: '时间'
        }],
    // 电视剧
    TV_DRAMA: [
        {
            type: 'AREA',
            name: '地区'
        },
        {
            type: 'CLASS',
            name: '分类'
        }, {
            type: 'TIME',
            name: '时间'
        }],
    // 新闻
    NEWS: [
        {
            type: 'CLASS',
            name: '分类'
        }],
    // 儿童
    CHILD: [
        {
            type: 'AREA',
            name: '地区'
        },
        {
            type: 'CLASS',
            name: '分类'
        }, {
            type: 'TIME',
            name: '时间'
        }],
    // 网视专区
    NETWORK: [
        {
            type: 'PLATFORM',
            name: '网站'
        },
        {
            type: 'CLASS',
            name: '分类'
        }, {
            type: 'TIME',
            name: '时间'
        }],
    // 体育
    SPORTS: [
        {
            type: 'CONTEST',
            name: '赛事'
        },
        {
            type: 'CLASS',
            name: '分类'
        }, {
            type: 'TIME',
            name: '时间'
        }],
    // 纪实
    RECORD: [
        {
            type: 'ANNOUNCER',
            name: '出品方'
        },
        {
            type: 'CLASS',
            name: '分类'
        }, {
            type: 'TIME',
            name: '时间'
        }],
    // 教育
    EDU: [
        {
            type: 'GRADE',
            name: '年级'
        },
        {
            type: 'CLASS',
            name: '分类'
        }, {
            type: 'SUBJECT',
            name: '科目'
        }],
    // 卫视综艺
    TV_SHOW_SATELLITE: [
        {
            type: 'PLATFORM',
            name: '频道'
        },
        {
            type: 'CLASS',
            name: '分类'
        }, {
            type: 'TIME',
            name: '时间'
        }],
    // 网络综艺
    TV_SHOW_NETWORK: [
        {
            type: 'PLATFORM',
            name: '频道'
        },
        {
            type: 'CLASS',
            name: '分类'
        }, {
            type: 'TIME',
            name: '时间'
        }],
    // 音乐
    MUSIC: [
        {
            type: 'CLASS',
            name: '分类'
        }, {
            type: 'AREA',
            name: '地区'
        }],
    // 曲艺
    TUNE_ART: [
        {
            type: 'CLASS',
            name: '分类'
        }, {
            type: 'FIGURE',
            name: '人物'
        }],
    // 幽默
    HUMOROUS: null,
    // 科普中国
    CHINA_SCIENCE: [
        {
            type: 'CLASS',
            name: '分类'
        }],
    // 党建
    COMMUNIST_PARTY_BUILD: null,
    //  二人转
    ER_REN_ZHUAN: [
        {
            type: 'CLASS',
            name: '分类'
        }
    ],
    //  吉林旅游
    JILIN_TRAVEL: [
        {
            type: 'CLASS',
            name: '分类'
        }
    ],
    //  高清4K
    HD_4K: [
        {
            type: 'CLASS',
            name: '分类'
        }
    ],
    //  生活
    LIFE: [
        {
            type: 'CLASS',
            name: '分类'
        }
    ],
    //  抖音
    DOUYIN: [
        {
            type: 'CLASS',
            name: '分类'
        }
    ]
};

export default {CLASS_FILTER_DICTIONARY};
