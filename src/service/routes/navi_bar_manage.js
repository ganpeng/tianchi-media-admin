/**
 * @fileOverview Define the API functions of navigation bar module
 */

import service from '../config';

/**
 * 获取导航栏目列表
 */
export const getNaviBarList = () => {
    return service.get('/v1/content/nav-bar/list');
};
