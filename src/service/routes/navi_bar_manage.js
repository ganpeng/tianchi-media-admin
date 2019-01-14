/**
 * @fileOverview Define the API functions of navigation bar module
 */

import service from '../config';
import util from '../../util/extend';

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

/**
 * 获取栏目详情
 * @param id The id of nav bar.
 */
export const getNavBarDetail = (id) => {
    return service.get(util.format('/v1/content/nav-bar/{0}', id));
};

/**
 * 修改栏目信息
 */
export const updateNavBar = ({id, name, focalImage, image, signCode, layoutTemplate}) => {
    return service.patch(util.format('/v1/content/nav-bar/{0}', id), {
        name,
        focalImage,
        image,
        signCode,
        layoutTemplate
    });
};
