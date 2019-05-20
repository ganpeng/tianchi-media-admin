/**
 * @fileOverview Define the API functions of user module
 */

import service from '../config';
import util from '../../util/extend';
import qs from 'querystring';
import _ from 'lodash';

/**
 * 添加用户
 */
export const updateUser = ({
                               id,
                               name,
                               identityId,
                               stbList,
                               province,
                               city,
                               county,
                               address,
                               street,
                               mobile,
                               telephone,
                               fullAddress,
                               districtCode
                           }) => {
    return service.put('/v1/user', {
        id,
        name,
        identityId,
        identityType: 'ID_CARD',
        stbList,
        province,
        city,
        county,
        address,
        street,
        mobile,
        telephone,
        fullAddress,
        districtCode,
        status: 'NORMAL'
    });
};

/**
 * 获取用户信息列表
 */
export const getUserList = ({keyword, caNoAvailable, isVip, tvVersion, registeredAtStart, registeredAtEnd, vipExpireAtStart, vipExpireAtEnd, pageNum, pageSize}) => {
    let params = {
        keyword,
        caNoAvailable,
        isVip,
        tvVersion,
        registeredAtStart,
        registeredAtEnd,
        vipExpireAtStart,
        vipExpireAtEnd,
        pageNum: pageNum - 1,
        pageSize
    };
    let paramsStr = qs.stringify(_.pickBy(params, (item) => {
        return item !== '' && item !== undefined;
    }));
    return service.get(`/v1/user/page?${paramsStr}`);
};

/**
 * 根据Id获取平台管理员详细信息
 */
export const getUserInfoById = ({id}) => {
    return service.get(util.format('/v1/user/{0}', id));
};

/**
 * 根据身份证号获取平台管理员详细信息
 */
export const getUserInfoByIdentityId = ({identityId}) => {
    return service.get(util.format(`/v1/user/page?keyword={0}`, identityId));
};

/**
 * 禁用及恢复用户设备
 */
export const setStbListStatus = ({stbList}) => {
    return service.patch(`/v1/stb/status`, stbList);
};
