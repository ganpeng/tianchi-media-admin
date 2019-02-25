import qs from 'querystring';
import _ from 'lodash';
import service from '../config';

/**
 * 新增广告主
 */
export const postAdvertisingOwner = (advertisingOwner) => {
    return service.post(`/v1/ad/advertiser`, advertisingOwner);
};

/**
 * 编辑广告主
 */
export const putAdvertisingOwner = (advertisingOwner) => {
    return service.put(`/v1/ad/advertiser`, advertisingOwner);
};

/**
 * @param {广告主的id} id 根据广告主的id获取广告主的信息
 */
export const getAdvertisingOwnerById = (id) => {
    return service.get(`/v1/ad/advertiser/${id}`);
};

/**
 * 获取广告主的列表
 */
export const getAdvertisingOwnerList = (params) => {
    let paramsStr = qs.stringify(_.pickBy(params, (item) => {
        return item !== '' && item !== undefined;
    }));
    return service.get(`/v1/ad/advertiser/page?${paramsStr}`);
};

/**
 * 删除广告资源
 */
export const deleteAdMaterialById = (id) => {
    return service.delete(`/v1/ad/ad-material/${id}`);
};

/**
 * 根据广告主的id获取该广告主所投放的广告列表
 */
export const getAdListByAdvertiserId = (params) => {
    let paramsStr = qs.stringify(_.pickBy(params, (item) => {
        return item !== '' && item !== undefined;
    }));

    return service.get(`/v1/ad/general-ad/page?${paramsStr}`);
};
