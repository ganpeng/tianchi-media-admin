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
