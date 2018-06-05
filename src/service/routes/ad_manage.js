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
export const getAdList = ({pageNum, pageSize, name, mediaType}) => {
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

//  广告组接口

/**
 * 创建广告组
 */
export const createGeneralAd = ({generalAd}) => {
    return service.post(`/v1/ad/general-ad`, generalAd);
};

/**
 * 获取广告组列表
 */
export const getGeneralAdList = ({releaseStatus, strategyStatus, pageNum, pageSize}) => {
    return service.get(`/v1/ad/general-ad/page`, {
        params: { releaseStatus, strategyStatus, pageNum, pageSize }
    });
};

/**
 * 删除广告组
 */
export const deleteGeneralAd = ({id}) => {
    return service.delete(`/v1/ad/general-ad/${id}`);
};

/**
 * 更新广告组
 */
export const updateGeneralAd = ({id, generalAd}) => {
    return service.put(`/v1/ad/general-ad/${id}`, generalAd);
};
