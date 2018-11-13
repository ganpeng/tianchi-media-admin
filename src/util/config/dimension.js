/**
 * @fileOverview Define the dimension of images
 */

/**
 * 2.0人物专题封面尺寸
 */
export const FIGURE_SUBJECT_DIMENSION = [
    {
        width: 560,
        height: 600,
        name: '专题A'
    },
    {
        width: 410,
        height: 472,
        name: '专题D'
    },
    {
        width: 260,
        height: 600,
        name: '专题E'
    }
];

/**
 * 2.0节目专题封面尺寸
 */
export const PROGRAMME_SUBJECT_DIMENSION = [
    {
        width: 410,
        height: 472,
        name: '专题D'
    },
    {
        width: 1160,
        height: 600,
        name: '专题B'
    },
    {
        width: 1310,
        height: 472,
        name: '专题C'
    },
    {
        width: 860,
        height: 440,
        name: '横版A'
    },
    {
        width: 560,
        height: 300,
        name: '横版B'
    },
    {
        width: 560,
        height: 720,
        name: '竖版A'
    },
    {
        width: 1160,
        height: 300,
        name: '横版C'
    },
    {
        width: 260,
        height: 380,
        name: '竖版B'
    },
    {
        width: 996,
        height: 472,
        name: '横版D'
    },
    {
        width: 342,
        height: 472,
        name: '竖版D'
    },
    {
        width: 860,
        height: 260,
        name: '横版E'
    },
    {
        width: 860,
        height: 472,
        name: '横版F'
    }
];

/**
 * 节目图片尺寸
 * 专题封面图片尺寸，与节目图片尺寸一致
 */
export const PROGRAMME_DIMENSION = [
    //  推荐页轮播图大
    {
        value: '824*463',
        label: '推荐页轮图大：824*463'
    },
    // 推荐页轮播图小
    {
        value: '733*413',
        label: '推荐页轮播图小：733*413'
    },
    // 推荐位六分位图  节目必须海报图
    {
        value: '240*350',
        label: '推荐位六分位图：240*350'
    },
    // 推荐位六分位图小（s6）
    {
        value: '240*134',
        label: '推荐位六分位图小：240*134'
    },
    // 横版海报图  节目必须海报图
    {
        value: '807*455',
        label: '横版海报图：807*455'
    },
    // 推荐位四分位图
    {
        value: '386*225',
        label: '推荐位四分位图：386*225'
    },
    // 推荐位三分位图
    {
        value: '532*225',
        label: '推荐位三分位图：532*225'
    },
    // 推荐位三分位图出格图（背景图）
    {
        value: '532*245',
        label: '推荐位三分位图出格图：532*245'
    },
    // 推荐位二分位图
    {
        value: '824*225',
        label: '推荐位二分位图：824*225'
    },
    // 推荐位二分位图出格图（背景图）
    {
        value: '824*245',
        label: '推荐位二分位图出格图：824*245'
    },
    // 推荐位横全图
    {
        value: '1700*200',
        label: '推荐位横全图：1700*200'
    }
];

/**
 * The background image of subject
 */
export const SUBJECT_BACKGROUND_IMAGE_DIMENSION = [
    {
        value: '1920*1080',
        label: '专题背景图片：1920*1080'
    }
];

/**
 * layout image dimension
 */
export const LAYOUT_IMAGE_DIMENSION = {
    /**
     *推荐页轮播图大
     */
    'carousel-1': {
        // 封面图的大小
        coverImage: {
            width: 824,
            height: 463
        }
    },
    /**
     *推荐页轮播图小
     */
    'carousel-2': {
        coverImage: {
            width: 733,
            height: 413
        }
    },
    /**
     *推荐位横全图
     */
    'model-1': {
        coverImage: {
            width: 1700,
            height: 200
        }
    },
    /**
     *推荐位二分位图
     */
    'model-2': {
        coverImage: {
            width: 824,
            height: 225
        },
        // 背景图的大小，一般比封面图高20
        coverImageBackground: {
            width: 824,
            height: 245
        }
    },
    'model-3': {
        coverImage: {
            width: 532,
            height: 225
        },
        coverImageBackground: {
            width: 532,
            height: 245
        }
    },
    'model-4': {
        coverImage: {
            width: 386,
            height: 225
        }
    },
    'model-6': {
        coverImage: {
            width: 240,
            height: 350
        }
    },
    /**
     * 推荐位六分位图小
     */
    'model-s6': {
        coverImage: {
            width: 240,
            height: 134
        }
    }
};

/**
 * catalogue image dimension
 */
export const CATALOGUE_DIMENSION = [
    {
        value: '240*134',
        label: '色块图片：240*134'
    }
];

/**
 * operate corner mark image dimension
 */
export const OPERATE_CORNER_MARK_DIMENSION = [
    {
        value: '54*30',
        label: '运营角标图片：54*30'
    }
];

// 人物图片尺寸
export const PERSON_DIMENSION = [
    // 人物头像
    {
        value: '200*200',
        label: '人物头像：200*200'
    },
    // 人物背景图
    {
        value: '1920*1080',
        label: '人物背景图：1920*1080'
    }
];

//  视频封面图
export const VIDEO_COVER_DIMENSION = [
    {
        value: '807*455',
        label: '视频封面图：807*455'
    }
];

//  直播频道logo图
export const CHANNEL_LOGO_DIMENSION = [
    {
        value: '240*134',
        label: 'Logo：240*134'
    }
];

export default {
    FIGURE_SUBJECT_DIMENSION,
    PROGRAMME_SUBJECT_DIMENSION,
    PROGRAMME_DIMENSION,
    SUBJECT_BACKGROUND_IMAGE_DIMENSION,
    LAYOUT_IMAGE_DIMENSION,
    CATALOGUE_DIMENSION,
    OPERATE_CORNER_MARK_DIMENSION,
    PERSON_DIMENSION,
    VIDEO_COVER_DIMENSION,
    CHANNEL_LOGO_DIMENSION
};
