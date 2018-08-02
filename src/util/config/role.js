// 人物的角色
export const MAIN_ROLE_OPTIONS = [
    //  演员、导演、制片人、编剧, 歌手
    {
        value: 'DIRECTOR',
        label: '导演'
    },
    {
        value: 'CHIEF_ACTOR',
        label: '主演'
    },
    {
        value: 'ACTOR',
        label: '演员'
    },
    {
        value: 'VICE_DIRECTOR',
        label: '副导演'
    },
    {
        value: 'SCENARIST',
        label: '编剧'
    },
    {
        value: 'PRODUCER',
        label: '制片人'
    },
    {
        value: 'SINGER',
        label: '歌手'
    },
    {
        value: 'AUTHOR',
        label: '作家'
    },
    {
        value: 'ANCHOR',
        label: '主持人'
    },
    {
        value: 'ATHLETE',
        label: '运动员'
    },
    {
        value: 'CARTOON_CHARACTER',
        label: '卡通人物'
    }
];

//  视频内容类型
export const VIDEO_TYPE = [
    // 正片，预告，花絮，看点  'FEATURE', 'PRE_SHOW', 'EXTRAS', 'HIGH_LIGHT'
    {
        value: 'FEATURE',
        label: '正片'
    },
    {
        value: 'PRE_SHOW',
        label: '预告'
    },
    {
        value: 'EXTRAS',
        label: '花絮'
    },
    {
        value: 'HIGH_LIGHT',
        label: '看点'
    }
];

export const QUALITY_TYPE = [
    // 'HD_4K', 'HD_2K', 'HD_1080', 'HD_720', 'HD_480'
    // {
    //     value: 'HD_4K',
    //     label: 'HD_4K'
    // },
    // {
    //     value: 'HD_2K',
    //     label: 'HD_2K'
    // },
    {
        value: 'HD_1080',
        label: 'HD_1080'
    },
    {
        value: 'HD_720',
        label: 'HD_720'
    },
    {
        value: 'HD_480',
        label: 'HD_480'
    }
];

export const VIDEO_TYPE_OBJ = {
    FEATURE: '正片',
    PRE_SHOW: '预告',
    EXTRAS: '花絮',
    HIGH_LIGHT: '看点'
};

export const BUSINESS_OPERATOR = [
    {
        value: 'IQIYI',
        label: '爱奇艺'
    },
    {
        value: 'YOUKU',
        label: '优酷'
    },
    {
        value: 'TENCENT',
        label: '腾讯'
    },
    {
        value: 'MANGGUO',
        label: '芒果'
    },
    {
        value: 'SOHU',
        label: '搜狐'
    }
];

export const BUSINESS_OPERATOR_OBJ = {
    IQIYI: '爱奇艺',
    YOUKU: '优酷',
    TENCENT: '腾讯',
    MANGGUO: '芒果',
    SOHU: '搜狐'
};

export const COPYRIGHT_RESERVER = [
    {
        value: 'CIBN',
        label: 'CIBN'
    }
];

export const COPYRIGHT_RESERVER_OBJ = {
    CIBN: 'CIBN'
};

export const RELEASE_STATUS = {
    DRAFT: '草稿',
    RELEASED: '已发布',
    PRE_RELEASED: '预发布'
};

// 年级
export const GRADE = [
    {
        value: 'ONE',
        label: '一年级'
    },
    {
        value: 'TWO',
        label: '二年级'
    },
    {
        value: 'THREE',
        label: '三年级'
    },
    {
        value: 'FOUR',
        label: '四年级'
    },
    {
        value: 'FIVE',
        label: '五年级'
    },
    {
        value: 'SIX',
        label: '六年级'
    },
    {
        value: 'CZ_ONE',
        label: '初中一年级'
    },
    {
        value: 'CZ_TWO',
        label: '初中二年级'
    },
    {
        value: 'CZ_THREE',
        label: '初中三年级'
    },
    {
        value: 'GZ_ONE',
        label: '高中一年级'
    },
    {
        value: 'GZ_TWO',
        label: '高中二年级'
    },
    {
        value: 'GZ_THREE',
        label: '高中三年级'
    }
];

// 规格
export const SPEC = [
    {
        value: 'HLW',
        label: '好莱坞'
    },
    {
        value: 'YX',
        label: '院线'
    },
    {
        value: 'WLDDY',
        label: '网络大电影'
    },
    {
        value: 'DB',
        label: '杜比'
    },
    {
        value: 'YS',
        label: '原声'
    }
];

// 科目: 语文，数学，英语，物理，化学，历史，地理，政治，生物
export const SUBJECT = [
    {
        value: 'YUWEN',
        label: '语文'
    },
    {
        value: 'SHUXUE',
        label: '数学'
    },
    {
        value: 'YINGYU',
        label: '英语'
    },
    {
        value: 'WULI',
        label: '物理'
    },
    {
        value: 'HUAXUE',
        label: '化学'
    },
    {
        value: 'LISHI',
        label: '历史'
    },
    {
        value: 'DILI',
        label: '地理'
    },
    {
        value: 'ZHENGZHI',
        label: '政治'
    },
    {
        value: 'SHENGWU',
        label: '生物'
    }
];

//  播出平台
const PLATFORM = [
    '腾讯',
    '爱奇艺',
    '优酷',
    '搜狐',
    '芒果',
    '中央电视台',
    '浙江卫视',
    '东方卫视',
    '江苏卫视',
    '湖南卫视',
    '安徽卫视',
    '北京卫视',
    '其他'
];

// 赛事
const CONTEST = [
    'NBA',
    'CBA',
    '足球世界杯',
    '英超',
    '意甲',
    '西甲',
    '德甲',
    '欧冠',
    '中超',
    '苏迪曼杯',
    '乒乓球世界杯',
    '乒乓球世锦赛',
    '电竞系列赛',
    'LOL全明星赛',
    'UFC',
    'WWE',
    '拳王争霸赛',
    '斯诺克',
    '其他'
];

// 发行方
const ANNOUNCER = [
    'CCTV',
    'BBC',
    'Discovery',
    '国家地理',
    '五洲传播中心',
    '其他'
];

const SIGN_CODE = ['MOVIE', 'TV_DRAMA', 'NEWS', 'NETWORK', 'SPORTS', 'CHILD', 'RECORD', 'EDU', 'TV_SHOW_SATELLITE', 'TV_SHOW_NETWORK', 'MUSIC', 'TUNE_ART', 'HUMOROUS', 'SCIENCE', 'COMMUNIST_PARTY_BUILD'];

// 一级分类
export const CATEGORY = ['电影', '电视剧', '新闻', '网视', '体育', '儿童', '纪实', '教育', '卫视综艺', '网络综艺', '音乐', '曲艺', '幽默', '科普中国', '新时代党建'].map((item, index) => {
    return {
        name: item,
        programmeTypeList: [],
        signCode: SIGN_CODE[index]
    };
});

// 视频注入的状态
export const VIDEO_UPLOAD_STATUS = {
    // 成功(COMPLETED) | 注入中(INJECTING) | 失败(FAILED)
    INJECTING: '注入中',
    FAILED: '失败',
    SUCCESS: '成功'
};

// 视频注入的状态
export const VIDEO_UPLOAD_STATUS_OPTIONS = [
    {
        value: 'INJECTING',
        label: '注入中'
    },
    {
        value: 'FAILED',
        label: '失败'
    },
    {
        value: 'SUCCESS',
        label: '成功'
    }
];

//  视频类型
export const VIDEO_TYPE_OPTIONS = [
    {
        value: 'VOD',
        label: '点播视频'
    },
    {
        value: 'CAROUSEL',
        label: '轮播视频'
    }
];

//  升级类型
const PRODUCT_TYPE_OPTIONS = [
    {
        value: 'TV_LAUNCHER',
        name: '应用升级'
    },
    {
        value: 'TV_ROM_3798',
        name: '系统升级'
    }
];

//  升级方式
const FORCED_OPTIONS = [
    {
        value: 1,
        name: '强制升级'
    },
    {
        value: 0,
        name: '选择升级'
    }
];

const RECOMMEND_OPTIONS = [
    {
        value: 'SEARCH',
        name: '搜索页面'
    },
    {
        value: 'MOVIE',
        name: '电影'
    },
    {
        value: 'TV_DRAMA',
        name: '电视剧'
    },
    {
        value: 'NEWS',
        name: '新闻'
    },
    {
        value: 'NETWORK',
        name: '网视'
    },
    {
        value: 'SPORTS',
        name: '体育'
    },
    {
        value: 'CHILD',
        name: '儿童'
    },
    {
        value: 'RECORD',
        name: '纪实'
    },
    {
        value: 'EDU',
        name: '教育'
    },
    {
        value: 'TV_SHOW_SATELLITE',
        name: '卫视综艺'
    },
    {
        value: 'TV_SHOW_NETWORK',
        name: '网络综艺'
    },
    {
        value: 'MUSIC',
        name: '音乐'
    },
    {
        value: 'TUNE_ART',
        name: '曲艺'
    },
    {
        value: 'HUMOROUS',
        name: '幽默'
    },
    {
        value: 'CHINA_SCIENCE',
        name: '科普中国'
    },
    {
        value: 'COMMUNIST_PARTY_BUILD',
        name: '新时代党建'
    }
];

export default {
    MAIN_ROLE_OPTIONS,
    VIDEO_TYPE,
    QUALITY_TYPE,
    VIDEO_TYPE_OBJ,
    BUSINESS_OPERATOR,
    BUSINESS_OPERATOR_OBJ,
    COPYRIGHT_RESERVER,
    COPYRIGHT_RESERVER_OBJ,
    RELEASE_STATUS,
    CATEGORY,
    GRADE,
    SPEC,
    SUBJECT,
    VIDEO_UPLOAD_STATUS,
    CONTEST,
    PLATFORM,
    ANNOUNCER,
    VIDEO_TYPE_OPTIONS,
    VIDEO_UPLOAD_STATUS_OPTIONS,
    PRODUCT_TYPE_OPTIONS,
    FORCED_OPTIONS,
    RECOMMEND_OPTIONS
};
