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
