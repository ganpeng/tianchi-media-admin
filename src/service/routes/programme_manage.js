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
export const getProgrammeList = ({pageNum, pageSize, keyword, releaseAtStart, releaseAtEnd, produceAreaList, programmeCategoryIdList, programmeTypeIdList, visible, refCount, paymentType}) => {
    const params = {
        pageNum,
        pageSize,
        keyword,
        releaseAtStart: releaseAtStart ? new Date(releaseAtStart).getTime() : '',
        releaseAtEnd: releaseAtEnd ? new Date(releaseAtEnd).getTime() : '',
        produceAreaList,
        programmeCategoryIdList,
        programmeTypeIdList,
        visible,
        refCount,
        paymentType
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
 * 根据节目的id完整更新节目信息
 */
export const updateProgrammeInfo = ({id, programme}) => {
    return service.put(`/v1/content/programme/${id}`, programme);
};

/**
 * 根据节目的id部分更新节目信息
 */
export const updatePartProgrammeInfo = ({id, programme}) => {
    return service.patch(`/v1/content/programme/${id}`, programme);
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
 * 导入节目
 */
export const importProgramme = (formData) => {
    return service.post('/v1/content/programme/import', formData);
};

/**
 * 获取字典数据
 * @param categoryList
 * @param nameList such as 出品方'ANNOUNCER', 网站'PLATFORM', 赛事'CONTEST', 人物'FIGURE'
 */
export const getDict = ({categoryList, nameList}) => {
    const params = {
        categoryList,
        nameList
    };
    let paramsStr = qs.stringify(_.pickBy(params, (item) => {
        return item !== '' && item !== undefined;
    }));
    return service.get(`/v1/content/programme-dict/list?${paramsStr}`);
};

/**
 * 获取节目规格
 */
export const getProgrammeSpec = () => {
    return service.get('/v1/content/programme-dict/spec/list');
};

/**
 * 获取节目年级
 */
export const getProgrammeGrade = () => {
    return service.get('/v1/content/programme-dict/grade/list');
};

/**
 * 获取节目科目
 */
export const getProgrammeSubject = () => {
    return service.get('/v1/content/programme-dict/subject/list');
};

/**
 * 根据节目id删除节目
 */
export const realDeleteProgramme = (id) => {
    return service.delete(`/v1/content/programme/${id}`);
};

export const upLowerFrameProgramme = (idList, visible) => {
    const params = {
        visible
    };
    let paramsStr = qs.stringify(_.pickBy(params, (item) => {
        return item !== '' && item !== undefined;
    }));

    return service.patch(`/v1/content/programme/visible?${paramsStr}`, idList);
};

/**
 * 批量删除节目
 */
export const batchDeleteProgrammes = (idList) => {
    return service.delete(`/v1/content/programme`, {data: idList});
};

/**
 * 视频列表为空时候的保存
 */
export const editEmptyProgrammeVideo = (id) => {
    return service.delete(`/v1/content/programme/video/all/${id}`);
};
