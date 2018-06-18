import service from '../config';

/**
 * 获取所有视频的列表
 */
export const getVideoList = ({ userId, name, key, m3u8For480P, m3u8For720P, m3u8For1080P, bitrate, frameRate, pageNum, pageSize }) => {
    return service.get('/v1/storage/video/page', {
        baseURL: '/',
        params: {
            userId,
            name,
            key,
            m3u8For480P,
            m3u8For720P,
            m3u8For1080P,
            bitrate,
            frameRate,
            pageNum,
            pageSize
        }
    });
};
