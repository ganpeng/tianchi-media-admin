import service from '../config';

/**
 *  上传图片
 */
export const uploadImage = ({formData, fileName}) => {
    return service.post('/v1/media/file', formData, {
        params: {
            fileName: fileName
        }
    });
};