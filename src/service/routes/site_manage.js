/**
 * @fileOverview Define the API functions of site module
 */

import service from '../config';
import util from '../../util/extend';
import qs from 'querystring';
import _ from 'lodash';

/**
 * 获取本站点站点信息
 */
export const getSiteInfo = () => {
    return service.get('/v1/sys/system-config/site');
};

/**
 * 设置站点token
 * @param siteToken The token of site.
 */
export const configSiteToken = ({siteToken}) => {
    return service.patch(util.format('/v1/sys/system-config/site-token?siteToken={0}', siteToken));
};

/**
 * 添加子站点
 */
export const createChildSite = ({name}) => {
    return service.post('/v1/sys/site', {name});
};

/**
 * 修改子站点
 */
export const updateChildSite = ({id, name, token}) => {
    return service.put('/v1/sys/site', {id, name, token});
};

/**
 * 根据token获取本站点站点名称
 */
export const getSiteNameByToken = ({id, token}) => {
    return service.get(util.format('/v1/sys/site?siteToken={0}', id), {
        headers: {'x-site-toke': token}
    });
};

/**
 * 删除子站点
 * @param id The id of site.
 */
export const deleteChildSite = ({id}) => {
    return service.delete(util.format('/v1/sys/site/{0}', id));
};

/**
 * 获取子站点列表
 */
export const getChildSiteList = ({keyword, pageNum, pageSize}) => {
    const params = {
        pageNum: pageNum - 1,
        pageSize,
        keyword
    };

    let paramsStr = qs.stringify(_.pickBy(params, (item) => {
        return item !== '' && item !== undefined;
    }));

    return service.get(`/v1/sys/site/page?${paramsStr}`);
};

/**
 * 获取全部站点
 */
export const getAllSiteList = () => {
    return service.get(`/v1/sys/site/list?includeMasterSite=false`);
};

/**
 * 获取全部视频来源
 */
export const getAllVideoSourceList = () => {
    return service.get(`/v1/sys/site/list?includeMasterSite=true`);
};

/**
 * 单个视频进行多个共享站点设置
 */
export const setSingleVideoToBatchSite = ({videoId, siteIdList}) => {
    return service.patch(util.format('/v1/storage/video/share-site?videoId={0}', videoId), siteIdList, {
        baseURL: '/storage'
    });
};

/**
 * 多个视频进行多个共享站点设置
 */
export const setBatchVideoToBatchSite = ({siteIdList, videoIdList}) => {
    return service.patch('/v1/storage/video/share-site/batch', {siteIdList, videoIdList}, {
        baseURL: '/storage'
    });
};
