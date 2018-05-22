/**
 * @fileOverview Define the API functions of admin module
 */

import service from '../config';
import util from '../../util/extend';

/**
 * 新增人物
 */
export const createPerson = (person) => {
    return service.post('/v1/content/figure', person);
};

/**
 * 获取人物列表
 */
export const getPersonList = ({pageNum, pageSize, name, area}) => {
    return service.get('/v1/content/figure/page', {
        params: { pageNum, pageSize, name, area }
    });
};

/**
 *  根据人物的id获取人物
 */
export const getPersonInfo = ({id}) => {
    return service.get(util.format('/v1/content/figure/{0}', id));
};

/**
 * 根据人物的id更新人物的信息
 */
export const updatePersonInfo = ({id, person}) => {
    return service.put(util.format('/v1/content/figure/{0}', id), person);
};

export const findPerson = ({name}) => {
    return service.get('/v1/content/figure/page', {
        params: { name }
    });
};
