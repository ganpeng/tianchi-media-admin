import service from '../config';
import qs from 'querystring';
import _ from 'lodash';

/**
 * 新增节目
 */
export const createProgramme = (programme) => {
    return service.post('/v1/content/programme', programme);
};

/**
 * 获取节目列表
 */
export const getProgrammeList = ({pageNum, pageSize, keyword, releaseAtStart, releaseAtEnd, produceAreaList, programmeCategoryIdList, programmeTypeIdList, visible}) => {
    const params = {
        pageNum,
        pageSize,
        keyword,
        releaseAtStart: releaseAtStart ? new Date(releaseAtStart).getTime() : '',
        releaseAtEnd: releaseAtEnd ? new Date(releaseAtEnd).getTime() : '',
        produceAreaList,
        programmeCategoryIdList,
        programmeTypeIdList,
        visible
    };

    let paramsStr = qs.stringify(_.pickBy(params, (item) => {
        return item !== '' && item !== undefined;
    }));

    return service.get(`/v1/content/programme/page?${paramsStr}`);
};

/**
 *  根据节目的id获取节目
 */
export const getProgrammeInfo = ({id}) => {
    return service.get(`/v1/content/programme/${id}`);
};

/**
 * 根据节目的id更新节目信息
 */
export const updateProgrammeInfo = ({id, programme}) => {
    return service.put(`/v1/content/programme/${id}`, programme);
};

//   节目类型管理服务

/**
 * 获取节目类型
 */
export const getProgrammeCategory = () => {
    return service.get(`/v1/content/programme-category`);
};

/**
 * 更新节目类型
 */
export const updateProgrammeCategory = ({categoryList}) => {
    return service.put(`/v1/content/programme-category`, categoryList);
};

/**
 * 获取节目的标签列表
 */
export const getProgrammeTagList = () => {
    return service.get('/v1/content/programme/tag/list');
};

export const getProgrammeAnnouncerList = () => {
    return service.get('/v1/content/programme/announcer/list');
};

export const getProgrammeContestList = () => {
    return service.get('/v1/content/programme/contest/list');
};

export const getProgrammeCopyrightList = () => {
    return service.get('/v1/content/programme/copyright_reserved/list');
};

export const getProgrammeLicenceList = () => {
    return service.get('/v1/content/programme/licence/list');
};

export const getProgrammePlatformList = () => {
    return service.get('/v1/content/programme/platform/list');
};

/**
 *  查询该类别下的节目数量
 */
export const getProgrammeTypeCount = ({programmeTypeId}) => {
    return service.get(`/v1/content/programme-category/${programmeTypeId}/programme-count`);
};

/**
 *  子集下架
 */
export const deleteProgrammeVideo = ({id}) => {
    return service.patch(`/v1/content/programme/video/${id}/visible`);
};

/**
 * 节目下架
 */
export const deleteProgramme = ({id}) => {
    return service.patch(`/v1/content/programme/${id}/visible`);
};

/**
 * 获取字典数据
 */
export const getDict = (categoryList) => {
    const params = {
        categoryList
    };
    let paramsStr = qs.stringify(_.pickBy(params, (item) => {
        return item !== '' && item !== undefined;
    }));
    return service.get(`/v1/content/programme-dict/list?${paramsStr}`);
};
