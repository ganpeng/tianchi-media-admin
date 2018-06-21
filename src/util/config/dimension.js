/**
 * @fileOverview Define the dimension of images.
 */

//  广告图片尺寸
export const ADVERT_DIMENSION = [
    //  暂停广告
    {
        value: '800*500',
        label: '暂停广告：800*500'
    },
    // 音量/换台广告
    {
        value: '435*220',
        label: '音乐/换台广告：435*220'
    },
    // 弹窗广告
    {
        value: '500*250',
        label: '弹窗广告：500*250'
    },
    // 会员广告
    {
        value: '316*146',
        label: '会员广告：316*146'
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
    // 推荐位三分位图出格图
    {
        value: '532*245',
        label: '推荐位三分位图出格图：532*245'
    },
    // 推荐位二分位图
    {
        value: '824*225',
        label: '推荐位二分位图：824*225'
    },
    // 推荐位横全图
    {
        value: '1700*200',
        label: '推荐位横全图：1700*200'
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
        width: 824,
        height: 463
    },
    /**
     *推荐页轮播图小
     */
    'carousel-2': {
        width: 733,
        height: 413
    },
    /**
     *推荐位横全图
     */
    'model-1': {
        width: 1700,
        height: 200
    },
    /**
     *推荐位二分位图
     */
    'model-2': {
        width: 824,
        height: 225
    },
    'model-3': {
        width: 532,
        height: 225
    },
    'model-4': {
        width: 386,
        height: 225
    },
    'model-6': {
        width: 240,
        height: 350
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

export default {
    ADVERT_DIMENSION,
    PROGRAMME_DIMENSION,
    LAYOUT_IMAGE_DIMENSION,
    CATALOGUE_DIMENSION,
    OPERATE_CORNER_MARK_DIMENSION,
    PERSON_DIMENSION,
    VIDEO_COVER_DIMENSION
};
