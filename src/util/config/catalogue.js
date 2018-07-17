/**
 * @fileOverview Define the config of catalogue
 */

/**
 * The object of catalogue config.
 * @type {Object}
 */
const CATALOGUE_CONFIG_MAP = {
    // 推荐
    RECOMMEND: null,
    // 频道
    LIVE_CHANNEL: {
        level: 'CHANNEL',
        categorySignCode: 'LIVE_CHANNEL',
        layoutItemType: {
            category: 'CHANNEL_GROUP'
        },
        allExist: false
    },
    // 电视剧
    TV_DRAMA: {
        level: 'SECOND',
        categorySignCode: 'TV_DRAMA',
        layoutItemType: {
            category: 'TV_DRAMA_PROGRAMME_CATEGORY',
            type: 'TV_DRAMA_PROGRAMME_TYPE'
        },
        allExist: true
    },
    // 电影
    MOVIE: {
        level: 'SECOND',
        categorySignCode: 'MOVIE',
        layoutItemType: {
            category: 'MOVIE_PROGRAMME_CATEGORY',
            type: 'MOVIE_PROGRAMME_TYPE'
        },
        allExist: true
    },
    // 新闻
    NEWS: {
        level: 'SECOND',
        categorySignCode: 'NEWS',
        layoutItemType: {
            category: 'NEWS_PROGRAMME_CATEGORY',
            type: 'NEWS_PROGRAMME_TYPE'
        },
        allExist: false
    },
    // 儿童
    CHILD: {
        level: 'SECOND',
        categorySignCode: 'CHILD',
        layoutItemType: {
            category: 'CHILD_PROGRAMME_CATEGORY',
            type: 'CHILD_PROGRAMME_TYPE'
        },
        allExist: true
    },
    // 网视专区
    NETWORK: {
        level: 'SECOND',
        categorySignCode: 'NETWORK',
        layoutItemType: {
            category: 'NETWORK_PROGRAMME_CATEGORY',
            type: 'NETWORK_PROGRAMME_TYPE'
        },
        allExist: true
    },
    // 体育
    SPORTS: {
        level: 'SECOND',
        categorySignCode: 'SPORTS',
        layoutItemType: {
            category: 'SPORTS_PROGRAMME_CATEGORY',
            type: 'SPORTS_PROGRAMME_TYPE'
        },
        allExist: true
    },
    // 纪实
    RECORD: {
        level: 'SECOND',
        categorySignCode: 'RECORD',
        layoutItemType: {
            category: 'RECORD_PROGRAMME_CATEGORY',
            type: 'RECORD_PROGRAMME_TYPE'
        },
        allExist: true
    },
    // 教育
    EDU: {
        level: 'SECOND',
        categorySignCode: 'EDU',
        layoutItemType: {
            category: 'EDU_PROGRAMME_CATEGORY',
            type: 'EDU_PROGRAMME_TYPE'
        },
        allExist: true
    },
    // 娱乐
    ENTERTAINMENT: {
        level: 'FIRST',
        categorySignCode: ['TV_SHOW_SATELLITE', 'TV_SHOW_NETWORK', 'MUSIC', 'TUNE_ART', 'HUMOROUS'],
        layoutItemType: {
            TV_SHOW_SATELLITE: {
                category: 'TV_SHOW_SATELLITE_PROGRAMME_CATEGORY',
                type: 'TV_SHOW_SATELLITE_PROGRAMME_TYPE'
            },
            TV_SHOW_NETWORK: {
                category: 'TV_SHOW_NETWORK_PROGRAMME_CATEGORY',
                type: 'TV_SHOW_NETWORK_PROGRAMME_TYPE'
            },
            MUSIC: {
                category: 'MUSIC_PROGRAMME_CATEGORY',
                type: 'MUSIC_PROGRAMME_TYPE'
            },
            TUNE_ART: {
                category: 'TUNE_ART_PROGRAMME_CATEGORY',
                type: 'TUNE_ART_PROGRAMME_TYPE'
            },
            HUMOROUS: {
                category: 'HUMOROUS_PROGRAMME_CATEGORY',
                type: 'HUMOROUS_PROGRAMME_TYPE'
            }
        },
        allExist: true
    },
    // 科普中国
    CHINA_SCIENCE: {
        level: 'SECOND',
        categorySignCode: 'CHINA_SCIENCE',
        layoutItemType: {
            category: 'CHINA_SCIENCE_PROGRAMME_CATEGORY',
            type: 'CHINA_SCIENCE_PROGRAMME_TYPE'
        },
        allExist: true
    },
    // 新时代党建
    COMMUNIST_PARTY_BUILD: null
};

export default CATALOGUE_CONFIG_MAP;
