import qs from 'querystring';
import _ from 'lodash';
import service from '../config';

/**
 * 新增设备
 */
export const addDevice = (device) => {
    return service.post('/v1/stb', device);
};

/**
 * 根据id修改设备信息
 */
export const updateDeviceById = (id, device) => {
    return service.put(`/v1/stb/${id}`, device);
};

/**
 * 设备禁用
 */
// export const deviceStatus = ()

/**
 * 获取设备列表
 */
export const getDeviceList = ({pageNum, pageSize, no, hardWareId, status, registeredAtStart, registeredAtEnd}) => {
    const params = {
        pageNum,
        pageSize,
        no,
        hardWareId,
        status,
        registeredAtStart,
        registeredAtEnd
    };

    let paramsStr = qs.stringify(_.pickBy(params, (item) => {
        return item !== '' && item !== undefined;
    }));

    return service.get(`/v1/stb/page?${paramsStr}`);
};
