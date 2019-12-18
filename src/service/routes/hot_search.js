import service from '../config';

//  获取热搜列表
export const getHotSearch = () => {
    return service.get('/v1/content/hot-search');
};

//  保存热搜列表
export const postHotSearch = (hotSearchList) => {
    return service.post('/v1/content/hot-search', hotSearchList);
};

//  移动端

//  获取移动端热搜列表
export const getAppHotSearch = () => {
    return service.get('/v1/mobile/content/hot-search');
};

//  保存移动端热搜列表
export const postAppHotSearch = (hotSearchList) => {
    return service.post('/v1/mobile/content/hot-search', hotSearchList);
};
