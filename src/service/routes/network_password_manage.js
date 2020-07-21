/**
 * @fileOverview Define the API functions of admin module
 */

import service from '../config';
import qs from 'querystring';
import _ from 'lodash';
import util from '../../util/extend';


/**
 * 获取网络设置密码列表
 */
export const getNetPsdList = () => {
    return service.get('/v1/sys/system-config/net-setting/password');
};

/**
 * 修改网络密码
 */
export const updateNetPsd = ({newPassword, originPassword}) => {
    return service.patch('/v1/sys/system-config/net-setting/password', {
        newPassword,
        originPassword
    });
};
