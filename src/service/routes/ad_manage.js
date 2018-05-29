import service from '../config';
/**
 * 新增广告
 */
export const createAd = (ad) => {
    return service.post('/v1/ad/ad-material', ad);
};

/**
 * 获取广告列表
 */
export const getPersonList = ({pageNum, pageSize, name, mediaType}) => {
    return service.get('/v1/ad/ad-material/page', {
        params: {
            pageNum,
            pageSize,
            name,
            mediaType
        }
    });
};

/**
 * 根据广告的id修改广告
 */
export const updateAdInfo = ({id, ad}) => {
    return service.patch(`/v1/ad/ad-material/${id}`, ad);
};

/**
 * 删除广告资源
 */
export const deleteAd = ({id}) => {
    return service.delete(`/v1/ad/ad-material/${id}`);
};
