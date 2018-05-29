/**
 * @fileOverview Define the API functions of subject module
 */

import service from '../config';
import util from '../../util/extend';

/**
 * 创建专题
 * @param category The category of subject, such as 'PROGRAMME'、 'FIGURE'.
 * @param name The name of programme subject.
 * @param typeList An array of programme subject's types, such as TV_DRAMA、MOVIE、VARIETY_SHOW.
 * @param description The description of subject.
 * @param tagList Array of tags.
 * @param coverImage Object of coverImage including id、uri、height、width attribute.
 */
export const createSubject = ({category, name, typeList, description, tagList, posterImageList}) => {
    return service.post('/v1/content/subject', {
        category,
        releaseStatus: 'RELEASED',
        name,
        typeList,
        description,
        tagList,
        posterImageList
    });
};

/**
 * 获取专题列表
 * @param name The name of subject.
 * @param subjectCategory Including 'FIGURE' and 'PROGRAMME'.
 * @param subjectType Including 'TV_DRAMA'、 'MOVIE' and 'VARIETY_SHOW'.
 * @param pageNum The current page number.
 * @param pageSize The size of one page.
 */
export const getSubjectList = ({name, subjectCategory, subjectType, pageNum, pageSize}) => {
    return service.get(util.format('/v1/content/subject/page?name={0}&subjectCategory={1}&subjectType={2}&pageNum={3}&pageSize={4}', name, subjectCategory, subjectType, pageNum - 1, pageSize));
};

/**
 * 获取专题标签列表
 */
export const getSubjectTagList = () => {
    return service.get('/v1/content/subject/tag/list');
};

/**
 * 修改专题中的人物或者节目
 * @param id The id of subject.
 * @param subjectItemList An array of subject's figures or programme.
 */
export const updateSubjectItemList = ({id, subjectItemList}) => {
    return service.patch(util.format('/v1/content/subject/{0}', id), {
        subjectItemList
    });
};

/**
 * 修改专题基本信息
 */
export const updateSubjectBasicInfo = ({id, name, description, tagList, posterImageList}) => {
    return service.patch(util.format('/v1/content/subject/{0}', id), {
        id,
        name,
        description,
        tagList,
        posterImageList
    });
};

/**
 * 获取专题详情
 * @param id The id of subject.
 */
export const getSubjectDetail = (id) => {
    return service.get(util.format('/v1/content/subject/{0}', id));
};

/**
 * 删除专题
 * @param id The id of subject.
 */
export const deleteSubject = (id) => {
    return service.delete(util.format('/v1/content/subject/{0}', id));
};
