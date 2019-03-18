/**
 * @fileOverview Define the API functions of inter cut module
 */

import service from '../config';
import util from '../../util/extend';
import qs from 'querystring';
import _ from 'lodash';

/**
 * 创建插播
 */
export const createInterCut = ({category, name, programmeCategoryList, tagList, backgroundImage, posterImageList, subjectItemList, visible}) => {
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
 * 获取插播列表
 */
export const getInterCutList = ({keyword, category, programmeCategoryId, createdAtBegin, createdAtEnd, pageNum, pageSize, visible}) => {
    const params = {
        pageNum: pageNum - 1,
        pageSize,
        keyword,
        category,
        programmeCategoryIdList: programmeCategoryId,
        createdAtBegin: createdAtBegin ? new Date(createdAtBegin).getTime() : '',
        createdAtEnd: createdAtEnd ? new Date(createdAtEnd).getTime() : '',
        visible
    };

    let paramsStr = qs.stringify(_.pickBy(params, (item) => {
        return item !== '' && item !== undefined;
    }));

    return service.get(`/v1/content/subject/page?${paramsStr}`);
};

/**
 * 修改插播信息
 */
export const updateInterCInfo = ({id, name, programmeCategoryList, tagList, backgroundImage, posterImageList, subjectItemList, visible}) => {
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
 * 获取插播详情
 * @param id The id of subject.
 */
export const getSubjectDetail = (id) => {
    return service.get(util.format('/v1/content/subject/{0}', id));
};

/**
 * 删除单个插播
 * @param id The id of subject.
 */
export const deleteSubject = (id) => {
    return service.delete(util.format('/v1/content/subject/{0}', id));
};

/**
 * 批量删除插播
 * @param idList The idList of subject.
 */
export const batchDeleteSubject = ({idList}) => {
    return service.delete('/v1/content/subject', {data: idList});
};

/**
 * 插播的上下架，假如线上是上架状态，请求之后会更改为下架状态，反之亦然
 * @param id The id of subject.
 */
export const setSubjectVisible = (id) => {
    return service.patch(util.format('/v1/content/subject/{0}/visible', id));
};

/**
 * 批量上下架插播
 * @param idList The idList of subject.
 * @param visible The visible of subject.
 */
export const batchUpdateSubjectStatus = ({idList, visible}) => {
    return service.patch(util.format('/v1/content/subject/visible?visible={0}', visible), idList);
};
