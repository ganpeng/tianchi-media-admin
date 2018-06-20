import qs from 'querystring';
import _ from 'lodash';
import service from '../config';

/**
 * 获取所有视频的列表
 */
export const getVideoList = ({ userId, name, key, m3u8For480P, m3u8For720P, m3u8For1080P, bitrate, frameRate, pageNum, pageSize }) => {
    let params = {
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
    };

    let paramsStr = qs.stringify(_.pickBy(params, (item) => {
        return item !== '' && item !== undefined;
    }));

    return service.get(`/v1/storage/video/page?${paramsStr}`, {
        baseURL: '/'
    });
};

/**
 * 根据id删除视频
 */
export const deleteVideoById = (id) => {
    return service.delete(`/v1/storage/video/${id}`, {
        baseURL: '/'
    });
};
