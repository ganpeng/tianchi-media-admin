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
                               name,
                               identityId,
                               stbList,
                               province,
                               city,
                               county,
                               address,
                               street,
                               mobile,
                               telephone
                           }) => {
    return service.put('/v1/user', {
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
        status: 'NORMAL'
    });
};

/**
 * 获取用户信息列表
 */
export const getUserList = ({keyword, districtCode, registeredAtStart, registeredAtEnd, pageNum, pageSize}) => {
    let params = {
        keyword,
        districtCode,
        registeredAtStart: registeredAtStart ? Date.parse(registeredAtStart) : '',
        registeredAtEnd: registeredAtStart ? Date.parse(registeredAtEnd) : '',
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
