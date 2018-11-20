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
