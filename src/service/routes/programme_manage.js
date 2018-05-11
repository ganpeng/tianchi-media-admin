/**
 * @fileOverview Define the API functions of admin module
 */

import service from '../config';
import util from '../../util/extend';

/**
 * 新增节目
 */
export const createProgramme = (programme) => {
    return service.post('/v1/content/programme', programme);
};

/**
 * 获取节目列表
 */
export const getProgrammeList = ({pageNum, pageSize}) => {
    return service.get(util.format('/v1/content/programme/list?pageNum={0}&pageSize={1}', pageNum, pageSize));
};

/**
 *  根据节目的id获取节目
 */
export const getProgrammeInfo = ({id}) => {
    return service.get(util.format('/v1/content/programme/{id}', id));
};

/**
 * 根据节目的id更新节目信息
 */
export const updateProgrammeInfo = ({id, person}) => {
    return service.put(util.format('/v1/content/programme/{id}', id), person);
};
