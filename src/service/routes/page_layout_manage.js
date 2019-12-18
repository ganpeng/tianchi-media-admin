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
 * 获取节目专题列表
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
 * 根据专题的id获取专题
 */
export const getSubjectById = (id) => {
    return service.get(`/v1/content/subject/${id}`);
};

/**
 * 根据专题的id修改专题
 */
export const updateSubjectById = (id, subject) => {
    return service.patch(`/v1/content/subject/${id}`, subject);
};

/**
 * 获取右上角的标签列表
 */
export const getCustomMarkList = () => {
    return service.get('/v1/content/mark/list?markType=CUSTOM');
};

//  2.3.0 版本新增加的修改
/**
 * 新增layoutBlock
 */
export const postLayoutBlock = (id, block) => {
    return service.post(`/v1/content/layout-block?navBarId=${id}`, block);
};

/**
 * 更新layoutBlock
 */
export const putLayoutBlock = (id, block) => {
    return service.put(`/v1/content/layout-block/${id}`, block);
};

/**
 * 根据id获取layoutBlock
 */
export const getLayoutBlockById = (id) => {
    return service.get(`/v1/content/layout-block/${id}`);
};

/**
 * 根据id删除layoutBlock
 */
export const deleteLayoutBlockById = (id) => {
    return service.delete(`/v1/content/layout-block/${id}`);
};

/**
 * 模块排序
 */
export const sortLayoutBlock = (layoutBlockSortVoList) => {
    return service.put('/v1/content/layout-block/sort', layoutBlockSortVoList);
};

//  移动端页面布局接口
/**
 * 获取移动端栏目列表
 */
export const getAppNavbarList = (status) => {
    let releaseStatus = status || 'RELEASED';
    return service.get(`/v1/mobile/content/nav-bar/list?releaseStatus=${releaseStatus}`);
};

/**
 * 根据navbar的id获取栏目布局
 */
export const getAppLayoutByNavbarId = (id) => {
    return service.get(`/v1/mobile/content/layout-block?navBarId=${id}`);
};

/**
 * 新增移动端layoutBlock
 */
export const postAppLayoutBlock = (id, block) => {
    return service.post(`/v1/mobile/content/layout-block?navBarId=${id}`, block);
};

/**
 * 编辑移动端layoutblock
 */
export const putAppLayoutBlock = (id, block) => {
    return service.put(`/v1/mobile/content/layout-block/${id}`, block);
};

/**
 * 移动端模块排序
 */
export const sortAppLayoutBlock = (layoutBlockSortVoList) => {
    return service.put('/v1/mobile/content/layout-block/sort', layoutBlockSortVoList);
};

/**
 * 根据id删除移动端layoutBlock
 */
export const deleteAppLayoutBlockById = (id) => {
    return service.delete(`/v1/mobile/content/layout-block/${id}`);
};
//  移动端页面布局接口结束
