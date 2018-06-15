/**
 * @fileOverview Define the API functions of navigation bar module
 */

import service from '../config';

/**
 * 获取导航栏目列表
 */
export const getNavBarList = () => {
    return service.get('/v1/content/nav-bar/list');
};

/**
 * 导航栏全量修改
 * @param navBarList An array of navigation bar list
 * @example navBarList [{
 *       id: 'string',
 *       name: 'string',
 *       releaseStatus: 'RELEASED',
 *       sort: 0,
 *       uri: 'empty',
 *       visible: false
 *     }]
 */
export const setNavBarList = (navBarList) => {
    return service.put('/v1/content/nav-bar', navBarList);
};
