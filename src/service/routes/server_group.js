import qs from 'querystring';
import _ from 'lodash';
import service from '../config';

export const createServerGroup = (reabody) => {
    return service.post('/v1/sys/server_group', reabody);
};

export const updateServerGroup = (reabody) => {
    return service.put('/v1/sys/server_group', reabody);
};

export const getServerGroupList = (params) => {
    let paramsStr = qs.stringify(_.pickBy(params, (item) => {
        return item !== '' && item !== undefined;
    }));
    return service.get(`/v1/sys/server_group/page?${paramsStr}`);
};

export const getServerGroupById = (id) => {
    return service.get(`/v1/sys/server_group/${id}`);
};

export const deleteSserverGroupById = (id) => {
    return service.delete(`/v1/sys/server_group?id=${id}`);
};
