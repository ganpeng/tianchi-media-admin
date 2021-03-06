import service from '../config';
import qs from 'querystring';
import _ from 'lodash';
/**
 * 新增人物
 */
export const createPerson = (person) => {
    return service.post('/v1/content/figure', person);
};

/**
 * 获取人物列表
 */
export const getPersonList = (params) => {
    let paramsStr = qs.stringify(_.pickBy(params, (item) => {
        return item !== '' && item !== undefined;
    }));

    return service.get(`/v1/content/figure/page?${paramsStr}`);
};

/**
 *  根据人物的id获取人物
 */
export const getPersonById = (id) => {
    return service.get((`/v1/content/figure/${id}`));
};

/**
 * 根据人物的id全量更新人物的信息
 */
export const updatePersonById = (id, person) => {
    return service.put(`/v1/content/figure/${id}`, person);
};

/**
 * 根据人物的id部分更新人物的信息
 */
export const updatePartPersonById = ({id, person}) => {
    return service.patch(`/v1/content/figure/${id}`, person);
};

export const findPerson = ({name}) => {
    return service.get('/v1/content/figure/page', {
        params: {name}
    });
};

/**
 * 热门人物修改
 */
export const putHotPerson = (hotCategory, hotFigureList) => {
    return service.put(`/v1/content/hot-figure/${hotCategory}/list`, hotFigureList);
};

/**
 * 获取热门人物的修改
 */
export const getHotPerson = () => {
    return service.get(`/v1/content/hot-figure/list`);
};

/**
 * 删除人物
 */
export const deletePerson = (id) => {
    return service.delete(`/v1/content/figure/${id}`);
};

/**
 * 下架人物
 */
export const lowerFramePerson = (id) => {
    return service.patch(`/v1/content/figure/${id}/visible`);
};

/**
 * 人物去重查询
 */
export const getDuplicateList = ({pageNum, pageSize, name}) => {
    return service.get(`/v1/content/figure/duplicate/page`, {
        params: {pageNum, pageSize, name}
    });
};

/**
 * 检查人物的别名是否存在
 */
export const checkAliasIsExist = (alias) => {
    return service.get(`/v1/content/figure/duplicate/alias?alias=${alias}`);
};

/**
 * 批量上下架人物
 */
export const batchLowerUpFramePerson = (idList, visible) => {
    return service.patch(`/v1/content/figure/visible?visible=${visible}`, idList);
};

/**
 * 批量删除人物
 */
export const batchDeletePerson = (idList) => {
    return service.delete('/v1/content/figure', {data: idList});
};
