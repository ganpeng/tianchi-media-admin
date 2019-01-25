import service from '../config';

//  获取热搜列表
export const getHotSearch = () => {
    return service.get('/v1/content/hot-search');
};

//  保存热搜列表
export const postHotSearch = (hotSearchList) => {
    return service.post('/v1/content/hot-search', hotSearchList);
};
