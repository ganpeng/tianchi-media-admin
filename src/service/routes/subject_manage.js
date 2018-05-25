/**
 * @fileOverview Define the API functions of subject module
 */

import service from '../config';
import util from '../../util/extend';

/**
 * 创建人物专题
 * @param name The name of figure subject.
 * @param description The description of subject.
 * @param tagList Array of tags.
 * @param coverImage Object of coverImage including id、uri、height、width attribute.
 */
export const createFigureSubject = ({name, description, tagList, posterImageList}) => {
    return service.post('/v1/content/subject', {
        category: 'FIGURE',
        releaseStatus: 'RELEASED',
        name,
        description,
        tagList,
        posterImageList
    });
};

/**
 * 创建节目专题
 * @param name The name of programme subject.
 * @param typeList An array of programme subject's types, such as TV_DRAMA、MOVIE、VARIETY_SHOW.
 * @param description The description of subject.
 * @param tagList Array of tags.
 * @param coverImage Object of coverImage including id、uri、height、width attribute.
 */
export const createProgrammeSubject = ({name, typeList, description, tagList, posterImageList}) => {
    return service.post('/v1/content/subject', {
        category: 'PROGRAMME',
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
    return service.get(util.format('/v1/content/subject/page?name={0}&subjectCategory={1}&subjectType={2}&pageNum={3}&pageSize={4}', name, subjectCategory, subjectType, pageNum, pageSize));
};

/**
 * 获取专题标签列表
 */
export const getSubjectTagList = () => {
    return service.get('/v1/content/subject/tag/list');
};

/**
 * 修改人物专题人物列表
 * @param id The id of figure.
 * @param subjectItemList An array of subject's figures.
 */
export const updateSubjectPersonList = ({id, subjectItemList}) => {
    return service.put(util.format('/v1/content/subject/{0}', id), {
        subjectItemList
    });
};
