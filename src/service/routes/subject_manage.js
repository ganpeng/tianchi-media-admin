/**
 * @fileOverview Define the API functions of subject module
 */

import service from '../config';
import util from '../../util/extend';

/**
 * 创建人物专题
 * @param name The name of subject.
 * @param description The description of subject.
 * @param tagList Array of tags.
 * @param coverImage Object of coverImage including id、uri、height、width attribute.
 */
export const createFigureSubject = ({name, description, tagList, posterImageList}) => {
    return service.post('/v1/admin', {
        category: 'FIGURE',
        releaseStatus: 'RELEASED',
        name,
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
    return service.get(util.format('/v1/admin/list?name={0}&subjectCategory={1}&subjectType={2}&pageNum={3}&pageSize={4}', name, subjectCategory, subjectType, pageNum, pageSize));
};
