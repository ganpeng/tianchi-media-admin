import service from '../config';

/**
 * 获取区域数据
 */
export const fetchAreaList = () => {
    return service.get(`/v1/sys/area/list`);
};
