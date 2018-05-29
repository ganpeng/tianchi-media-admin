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
    {
        value: 'HD_4K',
        label: 'HD_4K'
    },
    {
        value: 'HD_2K',
        label: 'HD_2K'
    },
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

export default {MAIN_ROLE_OPTIONS, VIDEO_TYPE, QUALITY_TYPE, VIDEO_TYPE_OBJ};
