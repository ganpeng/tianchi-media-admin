// 人物的角色
export const MAIN_ROLE_OPTIONS = [
    //  演员、导演、制片人、编剧, 歌手
    {
        value: 'DIRECTOR',
        label: '导演'
    },
    {
        value: 'ACTOR',
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
    },
    {
        value: 'ANIME_CHARACTER',
        label: '动漫人物'
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
        label: '一年级'
    },
    {
        label: '二年级'
    },
    {
        label: '三年级'
    },
    {
        label: '四年级'
    },
    {
        label: '五年级'
    },
    {
        label: '六年级'
    },
    {
        label: '初一'
    },
    {
        label: '初二'
    },
    {
        label: '初三'
    },
    {
        label: '高一'
    },
    {
        label: '高二'
    },
    {
        label: '高三'
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
export const CATEGORY = ['电影', '电视剧', '新闻', '网视', '体育', '儿童', '纪实', '教育', '卫视综艺', '网络综艺', '音乐', '曲艺', '幽默', '科普中国', '党建'].map((item, index) => {
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
// 视频转换的状态
export const VIDEO_TRANSFER_STATUS = {
    READY: '准备转码',
    ALLOCATING: '分配中',
    TRANSCODING: '转码中',
    SUCCESS: '转码成功',
    FAILED: '转码失败'
};

// 视频的注入状态
export const VIDEO_INJECTING_STATUS_OPTIONS = [
    {
        value: 'UPLOAD_COMPLETED',
        label: '上传成功'
    },
    {
        value: 'WAITING_SPLIT',
        label: '等待转码'
    },
    {
        value: 'SPLIT_TASK_ON_PROCESS',
        label: '转码中'
    },
    {
        value: 'SPLIT_TASK_SUCCESS',
        label: '入库中'
    },
    {
        value: 'SUCCESS',
        label: '注入成功'
    },
    {
        value: 'FAILED',
        label: '注入失败'
    },
    {
        value: 'DELETING',
        label: '删除中'
    }
];

// 视频的子站拉取主站状态
export const VIDEO_DOWNLOAD_STATUS_OPTIONS = [
    {
        value: 'ON_GOING',
        label: '拉取中'
    },
    {
        value: 'SUCCESS',
        label: '拉取成功'
    },
    {
        value: 'FAILED',
        label: '拉取失败'
    }
];

// 视频的子站向主站上传状态
export const VIDEO_UPLOAD_STATUS_OPTIONS = [
        {
            value: 'ON_GOING',
            label: '上传中'
        },
        {
            value: 'SUCCESS',
            label: '上传成功'
        },
        {
            value: 'FAILED',
            label: '上传失败'
        }
    ]
;

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

//  视频后缀
export const VIDEO_SUFFIX_OPTIONS = [
    {
        value: 'mpg',
        label: 'mpg'
    },
    {
        value: 'ts',
        label: 'ts'
    },
    {
        value: 'zip',
        label: 'zip'
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

// 硬件类型
const HARDWARE_TYPE_OPTIONS = [
    //  HARDWARE_3796      HARDWARE_3798
    {
        value: 'HARDWARE_3796',
        name: '3796'
    },
    {
        value: 'HARDWARE_3798',
        name: '3798'
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
        name: '党建'
    }
];

//  节目板式选项
const PROGRAMME_TEMPLATE_OPTIONS = [
    {
        label: '电影',
        value: 'MOVIE'
    },
    {
        label: '电视剧',
        value: 'TV_DRAMA'
    },
    {
        label: '新闻',
        value: 'NEWS'
    },
    {
        label: '综艺',
        value: 'TV_SHOW'
    }
];

// const defaultLayoutNavbarId = '5bf42d08b778252f2343eafe';

const NAV_LIST = ['首页', '内容管理', '用户管理', '版本设备', '管理员', '产品管理', '广告管理', '站点管理', '配置中心', ''];

const ASIDE_LIST = [
    [
        {
            text: '操控台',
            uri: '/worktop-manage',
            icon: 'aside_console'
        },
        {
            text: '客户端日志',
            uri: '/clientlog/list',
            icon: 'aside_clientlog'
        },
        {
            text: '存储空间',
            uri: '/server/space',
            icon: 'aside_server'
        }
    ],
    [
        {
            text: '节目管理',
            uri: '/programme-manage/list',
            icon: 'aside_programme'
        },
        {
            text: '页面布局',
            uri: `/page-layout`,
            icon: 'aside_layout'
        },
        {
            text: '视频管理',
            uri: '/manage-video/list',
            icon: 'aside_video'
        },
        {
            text: '专题管理',
            uri: '/subject-manage/list',
            icon: 'aside_subject'
        },
        {
            text: '人物管理',
            uri: '/person-manage/list',
            icon: 'aside_person'
        },
        {
            text: '栏目管理',
            uri: '/nav-bar-manage/setting',
            icon: 'aside_column'
        },
        {
            text: '直播频道',
            uri: '/channel-live/list',
            icon: 'shortcut_live_channel'
        },
        {
            text: '轮播频道',
            uri: '/channel-carousel/list',
            icon: 'shortcut_carousel_channel'
        },
        {
            text: '轮播插播',
            uri: '/channel-inter-cut/list',
            icon: 'shortcut_inter_cut'
        },
        {
            text: '类型管理',
            uri: '/category-manage',
            icon: 'aside_category'
        },
        {
            text: '角标管理',
            uri: '/corner-mark-manage/index',
            icon: 'aside_mark'
        },
        {
            text: '搜索管理',
            uri: '/search-manage',
            icon: 'search'
        }
    ],
    [
        {
            text: '用户管理',
            uri: '/user-center/list',
            icon: 'aside_user'
        },
        {
            text: '订单管理',
            uri: '/order-manage/list',
            icon: 'aside_order'
        }
    ],
    [
        {
            text: '版本管理',
            uri: '/manage-version/list',
            icon: 'shortcut_version'
        },
        {
            text: '设备管理',
            uri: '/manage-device/list',
            icon: 'aside_device'
        }
    ],
    [
        {
            text: '管理员',
            uri: '/manage-admin/list',
            icon: 'aside_admin'
        }
    ],
    [
        {
            text: '产品管理',
            uri: '/product-manage/list',
            icon: 'aside_product'
        },
        {
            text: '商品管理',
            uri: '/goods-manage/list',
            icon: 'goods_list'
        }
    ],
    [
        {
            text: '广告主',
            uri: '/adsowner-manage/list',
            icon: 'advertiser'
        },
        {
            text: '广告',
            uri: '/ads-manage/list',
            icon: 'ad'
        }
    ],
    [
        {
            text: '站点列表',
            uri: '/site-manage/list',
            icon: 'site_list'
        }
    ],
    [
        {
            text: '站点配置',
            uri: '/site-manage/config',
            icon: 'site_config'
        }
    ],
    [
        {
            text: '基本信息',
            uri: '/my-info',
            icon: 'basic_info'
        },
        {
            text: '修改密码',
            uri: '/modify-password',
            icon: 'modify_password'
        }
    ]
];

const LAYOUT_TEMPLATE_LIST = [
    {
        text: '节目',
        value: 'PROGRAMME'
    },
    {
        text: '专题',
        value: 'SUBJECT'
    },
    {
        text: '节目专题',
        value: 'PROGRAMME_SUBJECT'
    },
    {
        text: '人物专题',
        value: 'FIGURE_SUBJECT'
    },
    {
        text: '页面',
        value: 'LINK'
    },
    {
        text: '频道',
        value: 'CHANNEL'
    },
    {
        text: '人物',
        value: 'FIGURE'
    }
];

const PROGRAMME_ALLOW_PICTURE_DIMENSIONS = [
    {
        width: 260,
        height: 380
    },
    {
        width: 240,
        height: 350
    },
    {
        width: 738,
        height: 472
    },
    {
        width: 472,
        height: 472
    },
    {
        width: 342,
        height: 472
    },
    {
        width: 996,
        height: 472
    },
    {
        width: 860,
        height: 472
    },
    {
        width: 1310,
        height: 472
    },
    {
        width: 560,
        height: 720
    },
    {
        width: 560,
        height: 600
    },
    {
        width: 560,
        height: 222
    },
    {
        width: 560,
        height: 300
    },
    {
        width: 410,
        height: 216
    },
    {
        width: 410,
        height: 472
    },
    {
        width: 410,
        height: 615
    },
    {
        width: 807,
        height: 455
    },
    {
        width: 860,
        height: 440
    },
    {
        width: 860,
        height: 260
    },
    {
        width: 1160,
        height: 300
    },
    {
        width: 1160,
        height: 600
    }
];

const APP_PROGRAMME_ALLOW_PICTURE_DIMENSIONS = [
    {
        width: 351,
        height: 507
    },
    {
        width: 1089,
        height: 612
    },
    {
        width: 540,
        height: 303
    }
];

const AD_TYPE_OPTIONS = [
    {
        name: '开机广告',
        value: 'BOOT'
    },
    {
        name: '屏保广告',
        value: 'SCREEN_SAVER'
    },
    {
        name: '换台广告',
        value: 'CHANNEL_SWITCH'
    },
    {
        name: '音量条广告',
        value: 'VOLUME'
    },
    {
        name: '详情页广告',
        value: 'PROGRAMME_DETAIL'
    }
];

const AD_STATUS_OPTIONS = [
    {
        name: '生效中',
        value: 'ACTIVE'
    },
    {
        name: '未生效',
        value: 'WAITING'
    },
    {
        name: '已失效',
        value: 'EXPIRED'
    }
];

const PAY_WAY_OPTIONS = [
    {label: '支付宝', value: 'ALIPAY'},
    {label: '微信', value: 'WXPAY'}
];

const PAY_STATUS_OPTIONS = [
    {label: '待付款', value: 'CREATED'},
    {label: '付款成功', value: 'PAID'},
    {label: '付款失败', value: 'PAID_FAILED'},
    {label: '失效', value: 'EXPIRED'}
];

//  推荐专题（背景渲染） SUBJECT,
// 推荐节目PROGRAMME PROGRAMME,
//  节目列表页面 PROGRAMME_LIST,
//  视频播放页面 PROGRAMME_VIDEO,
//  链接类型 LINK,
//  电影节目类别 MOVIE_PROGRAMME_CATEGORY,
//  电影节目类型 MOVIE_PROGRAMME_TYPE,
//  电视剧节目类别 TV_DRAMA_PROGRAMME_CATEGORY,
//  电视剧节目类型 TV_DRAMA_PROGRAMME_TYPE,
//  新闻节目类别 NEWS_PROGRAMME_CATEGORY,
//  新闻节目类型 NEWS_PROGRAMME_TYPE,
//  网视节目类别 NETWORK_PROGRAMME_CATEGORY,
//  网视节目类型 NETWORK_PROGRAMME_TYPE,
//  体育节目类别 SPORTS_PROGRAMME_CATEGORY,
//  体育节目类型 SPORTS_PROGRAMME_TYPE,
//  儿童节目类别 CHILD_PROGRAMME_CATEGORY,
//  儿童节目类型 CHILD_PROGRAMME_TYPE,
//  纪实节目类别 RECORD_PROGRAMME_CATEGORY,
//  纪实节目类型 RECORD_PROGRAMME_TYPE,
//  教育节目类别 EDU_PROGRAMME_CATEGORY,
//  教育节目类型 EDU_PROGRAMME_TYPE,
//  卫视综艺节目类别 TV_SHOW_SATELLITE_PROGRAMME_CATEGORY,
//  卫视综艺节目类型 TV_SHOW_SATELLITE_PROGRAMME_TYPE,
//  网络综艺节目类别 TV_SHOW_NETWORK_PROGRAMME_CATEGORY,
//  网络综艺节目类型 TV_SHOW_NETWORK_PROGRAMME_TYPE,
//  音乐节目类别 MUSIC_PROGRAMME_CATEGORY,
//  音乐节目类型 MUSIC_PROGRAMME_TYPE,
//  曲艺节目类别 TUNE_ART_PROGRAMME_CATEGORY,
//  曲艺节目类型 TUNE_ART_PROGRAMME_TYPE,
//  幽默节目类别 HUMOROUS_PROGRAMME_CATEGORY,
//  幽默节目类型 HUMOROUS_PROGRAMME_TYPE,
//  科普中国节目类别 CHINA_SCIENCE_PROGRAMME_CATEGORY,
//  科普中国节目类型 CHINA_SCIENCE_PROGRAMME_TYPE,
//  新时代党建节目类别 COMMUNIST_PARTY_BUILD_PROGRAMME_CATEGORY,
//  新时代党建节目类型 COMMUNIST_PARTY_BUILD_PROGRAMME_TYPE,
//  直播频道（色块） CHANNEL,
//  频道组 CHANNEL_GROUP,
//  人物（人物） FIGURE,
//  更多  ALL,

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
    VIDEO_TRANSFER_STATUS,
    CONTEST,
    PLATFORM,
    ANNOUNCER,
    VIDEO_TYPE_OPTIONS,
    VIDEO_INJECTING_STATUS_OPTIONS,
    VIDEO_UPLOAD_STATUS_OPTIONS,
    VIDEO_DOWNLOAD_STATUS_OPTIONS,
    PRODUCT_TYPE_OPTIONS,
    FORCED_OPTIONS,
    RECOMMEND_OPTIONS,
    HARDWARE_TYPE_OPTIONS,
//  页面样式布局相关
    NAV_LIST,
    ASIDE_LIST,
    LAYOUT_TEMPLATE_LIST,
    VIDEO_SUFFIX_OPTIONS,
    PROGRAMME_ALLOW_PICTURE_DIMENSIONS,
    //  2.3.0新增
    APP_PROGRAMME_ALLOW_PICTURE_DIMENSIONS,
//  广告相关
    AD_TYPE_OPTIONS,
    AD_STATUS_OPTIONS,
// 节目板式
    PROGRAMME_TEMPLATE_OPTIONS,
//  支付相关
    PAY_WAY_OPTIONS,
    PAY_STATUS_OPTIONS
};
