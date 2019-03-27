/**
 * @fileOverview Define the API functions of subject module
 */

import service from '../config';
import util from '../../util/extend';
import qs from 'querystring';
import _ from 'lodash';

/**
 * 创建专题
 * @param category The category of subject, such as 'PROGRAMME'、 'FIGURE'.
 * @param name The name of programme subject.
 * @param typeList An array of programme subject's types, such as TV_DRAMA、MOVIE、VARIETY_SHOW.
 * @param tagList Array of tags.
 * @param posterImageList The list of coverImages including id、uri、height、width attribute.
 */
export const createSubject = ({category, name, programmeCategoryList, tagList, backgroundImage, posterImageList, subjectItemList, visible}) => {
    return service.post('/v1/content/subject', {
        category,
        releaseStatus: 'RELEASED',
        name,
        programmeCategoryList,
        tagList,
        backgroundImage,
        posterImageList,
        subjectItemList,
        visible
    });
};

/**
 * 获取专题列表
 * @param name The name of subject.
 * @param category Including 'FIGURE' and 'PROGRAMME'.
 * @param pageNum The current page number.
 * @param pageSize The size of one page.
 */
export const getSubjectList = ({keyword, category, programmeCategoryId, createdAtBegin, createdAtEnd, pageNum, pageSize, visible, refCount}) => {
    const params = {
        pageNum: pageNum - 1,
        pageSize,
        keyword,
        category,
        programmeCategoryIdList: programmeCategoryId,
        createdAtBegin: createdAtBegin ? new Date(createdAtBegin).getTime() : '',
        createdAtEnd: createdAtEnd ? new Date(createdAtEnd).getTime() : '',
        visible,
        refCount
    };

    let paramsStr = qs.stringify(_.pickBy(params, (item) => {
        return item !== '' && item !== undefined;
    }));

    return service.get(`/v1/content/subject/page?${paramsStr}`);
};

/**
 * 获取专题标签列表
 */
export const getSubjectTagList = () => {
    return service.get('/v1/content/subject/tag/list');
};

/**
 * 修改专题信息
 */
export const updateSubjectInfo = ({id, name, programmeCategoryList, tagList, backgroundImage, posterImageList, subjectItemList, visible}) => {
    return service.patch(util.format('/v1/content/subject/{0}', id), {
        id,
        name,
        programmeCategoryList,
        tagList,
        backgroundImage,
        posterImageList,
        subjectItemList,
        visible
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
 * 删除单个专题
 * @param id The id of subject.
 */
export const deleteSubject = (id) => {
    return service.delete(util.format('/v1/content/subject/{0}', id));
};

/**
 * 批量删除专题
 * @param idList The idList of subject.
 */
export const batchDeleteSubject = ({idList}) => {
    return service.delete('/v1/content/subject', {data: idList});
};

/**
 * 专题的上下架，假如线上是上架状态，请求之后会更改为下架状态，反之亦然
 * @param id The id of subject.
 */
export const setSubjectVisible = (id) => {
    return service.patch(util.format('/v1/content/subject/{0}/visible', id));
};

/**
 * 批量上下架专题
 * @param idList The idList of subject.
 * @param visible The visible of subject.
 */
export const batchUpdateSubjectStatus = ({idList, visible}) => {
    return service.patch(util.format('/v1/content/subject/visible?visible={0}', visible), idList);
};
