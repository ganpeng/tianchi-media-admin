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
    return service.get(util.format('/v1/content/figure/list?pageNum={0}&pageSize={1}', pageNum, pageSize), {
        params: {
            name: name,
            area: area
        }
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
