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
 */
export const setNavBarList = (navBarList) => {
    return service.put('/v1/content/nav-bar', navBarList);
};

/**
 * 新增栏目
 */
export const createNavBar = ({name, focalImage, image, signCode, layoutTemplate}) => {
    return service.post('/v1/content/nav-bar', {name, focalImage, image, signCode, layoutTemplate});
};
