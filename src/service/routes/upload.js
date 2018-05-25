import service from '../config';

/**
 *  上传图片
 */
export const uploadImage = ({formData, fileName}) => {
    return service.post('/v1/media/image', formData, { params: { fileName }, baseURL: '/storage' });
};

/**
 *  上传视频
 */
export const uploadVideo = ({formData, fileName}) => {
    return service.post('/v1/media/video', formData, { params: { fileName } });
};
