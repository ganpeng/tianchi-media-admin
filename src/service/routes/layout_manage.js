/**
 * @fileOverview Define the API functions of layout manage module
 */

import service from '../config';
import util from '../../util/extend';

/**
 * 设置栏目布局
 */
export const setContentLayout = (contentLayout) => {
    return service.post('/v1/content/subject', contentLayout);
};

/**
 * 修改栏目布局
 */
export const modifyContentLayout = ({id, contentLayout}) => {
    return service.put(util.format('/v1/content/layout/{0}', id), contentLayout);
};

/**
 * 获取栏目布局
 * @param id The id of navBar.
 */
export const getContentLayout = ({id}) => {
    return service.get(util.format('/v1/content/layout?id={0}', id));
};
