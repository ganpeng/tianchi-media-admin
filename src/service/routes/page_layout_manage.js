import qs from 'querystring';
import _ from 'lodash';
import service from '../config';

/**
 * 获取栏目列表
 */
export const getNavbarList = (releaseStatus) => {
    releaseStatus = releaseStatus || 'RELEASED';
    return service.get(`/v1/content/nav-bar/list?releaseStatus=${releaseStatus}`);
};

/**
 * 根据navbar的id获取栏目布局
 */
export const getPageLayoutByNavbarId = (id) => {
    return service.get(`/v1/content/layout-block?navBarId=${id}`);
};

/**
 * 根据navbar的id保存该栏目下的布局
 */
export const savePageLayoutByNavbarId = (id, layoutBlockVoList) => {
    return service.post(`/v1/content/layout-block?navBarId=${id}`, layoutBlockVoList);
};

/**
 * 根据navbar的id保存栏目布局
 */
export const postPageLayoutByNavbarId = (id, layoutBlockVoList) => {
    return service.post(`/v1/content/layout-block?navBarId=${id}`, layoutBlockVoList);
};

/**
 * 获取人物专题列表
 */
export const getPersonSubjectList = (params) => {
    const _params = {
        category: 'FIGURE',
        ...params
    };
    let paramsStr = qs.stringify(_.pickBy(_params, (item) => {
        return item !== '' && item !== undefined;
    }));
    return service.get(`/v1/content/subject/page?${paramsStr}`);
};

/**
 * 获取人物专题列表
 */
export const getProgrammeSubjectList = (params) => {
    const _params = {
        category: 'PROGRAMME',
        ...params
    };
    let paramsStr = qs.stringify(_.pickBy(_params, (item) => {
        return item !== '' && item !== undefined;
    }));
    return service.get(`/v1/content/subject/page?${paramsStr}`);
};

/**
 * 根据专题的id修改专题
 */
export const updateSubjectById = (id, subject) => {
    return service.patch(`/v1/content/subject/${id}`, subject);
};
