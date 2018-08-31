import qs from 'querystring';
import _ from 'lodash';
import service from '../config';

/**
 * 新增设备
 */
export const addDevice = (device) => {
    return service.put('/v1/stb', device);
};

/**
 * 设备禁用
 */
// export const deviceStatus = ()

/**
 * 获取设备列表
 */
export const getDeviceList = ({pageNum, pageSize, caCardNo, hardWareId, status, registeredAt}) => {
    const params = {
        pageNum,
        pageSize,
        caCardNo,
        hardWareId,
        status,
        registeredAt
    };

    let paramsStr = qs.stringify(_.pickBy(params, (item) => {
        return item !== '' && item !== undefined;
    }));

    return service.get(`/v1/stb/page?${paramsStr}`);
};
