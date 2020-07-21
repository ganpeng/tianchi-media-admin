/**
 * @fileOverview Define the API functions of navigation bar module
 */
import qs from 'querystring';
import _ from 'lodash';
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
export const createNavBar = ({name, picRemark, focalImage, image, signCode, layoutTemplate}) => {
    return service.post('/v1/content/nav-bar', {name, picRemark, focalImage, image, signCode, layoutTemplate});
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
export const updateNavBar = ({id, name, picRemark, focalImage, image, signCode, layoutTemplate, applicableClientList}) => {
    return service.patch('/v1/content/nav-bar', {
        id,
        name,
        focalImage,
        picRemark,
        image,
        signCode,
        layoutTemplate,
        applicableClientList
    });
};

//  移动端的栏目管理接口开始
/**
 * 更新移动端navbar信息
 */
export const patchAppNavBar = (navBar) => {
    return service.patch(`/v1/mobile/content/nav-bar`, navBar);
};

/**
 * 新增移动端navbar
 */
export const createAppNavBar = (navBar) => {
    return service.post(`/v1/mobile/content/nav-bar`, navBar);
};

/**
 * 全量更新navbar
 */
export const putAppNavBar = (navBar) => {
    return service.put(`/v1/mobile/content/nav-bar`, navBar);
};

/**
 * 获取移动端navbar列表
 */
export const getAppNavBarList = (params) => {
    let paramsStr = qs.stringify(_.pickBy(params, (item) => {
        return item !== '' && item !== undefined;
    }));

    return service.get(`/v1/mobile/content/nav-bar/list?${paramsStr}`);
};

/**
 * 根据id查询移动端的navbar
 */
export const getAppNavBarById = (id) => {
    return service.get(`/v1/mobile/content/nav-bar/${id}`);
};
//  移动端的栏目管理接口结束
