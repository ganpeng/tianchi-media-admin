import service from '../config';
/**
 *  上传图片
 */
// export const uploadImage = ({formData}) => {
//     return service.post('/v1/storage/image', formData, { baseURL: '/' });
// };

export const uploadImage = ({formData, url}) => {
    return service.post(url, formData);
};

/**
 * 检测服务器是不是可用
 */
export const checkServerAvailable = (uri) => {
    return service.get(`${uri}/v1/server/available`);
};

/**
 * 获取负载均衡服务器地址
 */
export const getUpstream = () => {
    return service.get('/v1/sys/config/upstreams');
};
