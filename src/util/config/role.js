// 人物的角色
export const MAIN_ROLE_OPTIONS = [
    {
        value: 'DIRECTOR',
        label: '导演'
    },
    {
        value: 'VICE_DIRECTOR',
        label: '副导演'
    },
    {
        value: 'CHIEF_ACTOR',
        label: '主演'
    },
    {
        value: 'ACTOR',
        label: '演员'
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
    COMPLETED: '成功',
    INJECTING: '注入中',
    FAILED: '失败',
    SUCCESS: '成功'
};

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
    VIDEO_UPLOAD_STATUS
};