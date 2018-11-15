import qs from 'querystring';
import _ from 'lodash';
import service from '../config';

/**
 * 获取角标的列表
 */
export const getVideoList = ({markType}) => {
    let params = {
        markType
    };

    let paramsStr = qs.stringify(_.pickBy(params, (item) => {
        return item !== '' && item !== undefined;
    }));

    return service.get(`/v1/content/mark/list?${paramsStr}`);
};

/**
 * 添加运营角标
 */
export const createCustomCornerMark = ({id, caption, imageUri}) => {
    return service.post('/v1/storage/video/retry', {id, caption, imageUri, markType: 'CUSTOM'});
};

/**
 * 编辑运营角标
 */
export const updateCustomCornerMark = ({id, caption, imageUri}) => {
    return service.post('/v1/storage/video/retry', {id, caption, imageUri, markType: 'CUSTOM'});
};

/**
 * 根据id删除角标
 */
export const deleteCornerMarkById = ({id}) => {
    return service.delete(`/v1/content/mark/${id}`);
};
