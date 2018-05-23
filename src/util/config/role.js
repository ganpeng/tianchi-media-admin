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
    //  'FEATURE', 'PRE_SHOW', 'EXTRAS', 'HIGH_LIGHT'
    {
        value: 'FEATURE',
        label: 'FEATURE'
    },
    {
        value: 'PRE_SHOW',
        label: 'PRE_SHOW'
    },
    {
        value: 'EXTRAS',
        label: 'EXTRAS'
    },
    {
        value: 'HIGH_LIGHT',
        label: 'HIGH_LIGHT'
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

export default {MAIN_ROLE_OPTIONS, VIDEO_TYPE, QUALITY_TYPE};
