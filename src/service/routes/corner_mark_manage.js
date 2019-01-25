import qs from 'querystring';
import _ from 'lodash';
import service from '../config';

/**
 * 获取角标的列表
 * @param markType The type of mark,such as 'SCORE', 'EPISODES_NUMBER', 'LICENCE', 'COPYRIGHT_RESERVED', 'CUSTOM', 'PLATFORM'.
 */
export const getCornerMarkList = ({markType}) => {
    let params = {
        markType
    };

    let paramsStr = qs.stringify(_.pickBy(params, (item) => {
        return item !== '' && item !== undefined;
    }));

    return service.get(`/v1/content/mark/list?${paramsStr}`);
};

/**
 * 添加角标
 */
export const createCornerMark = ({markType, caption, image}) => {
    return service.post('/v1/content/mark', {markType, caption, image});
};

/**
 * 编辑角标
 */
export const updateCornerMark = ({id, markType, caption, image}) => {
    return service.put('/v1/content/mark', {id, markType, caption, image});
};

/**
 * 根据id删除角标
 */
export const deleteCornerMarkById = ({id}) => {
    return service.delete(`/v1/content/mark/${id}`);
};
