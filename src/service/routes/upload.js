import service from '../config';
/**
 *  上传图片
 */
export const uploadImage = ({formData}) => {
    return service.post('/v1/storage/image', formData, { baseURL: '/' });
};

/**
 *  上传视频
 */
export const uploadVideo = ({formData}) => {
    return service.post('/v1/storage/video', formData, {
        baseURL: '/'
     });
};
