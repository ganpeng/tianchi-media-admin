import service from '../config';

/**
 * 获取区域数据
 */
export const fetchArea = () => {
    return service.get(`/v1/sys/area/area/list`);
};
