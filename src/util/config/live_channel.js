/**
 * @fileOverview Define the JSON of live channel data
 */

const DATA = [
    {
        // 目前只有唯一的一个值，枚举类型
        liveChannelType: 'LIVE_CHANNEL',
        liveChannel: {
            id: 'string',
            name: 'cctv5',
            no: '1'
        },
        navBarId: 'string',
        priority: 1,
        releaseStatus: 'RELEASED'
    }
];

export default DATA;
