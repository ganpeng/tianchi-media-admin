import service from '../config';

/**
 * 新增节目
 */
export const createProgramme = (programme) => {
    return service.post('/v1/content/programme', programme);
};

/**
 * 获取节目列表
 */
export const getProgrammeList = ({pageNum, pageSize}) => {
    return service.get('/v1/content/programme/page', { params: { pageNum, pageSize } });
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

/**
 *  查询该类别下的节目数量
 */
export const getProgrammeTypeCount = ({programmeTypeId}) => {
    return service.get(`/v1/content/programme-category/${programmeTypeId}/programme-count`);
};
