import qs from 'querystring';
import _ from 'lodash';
import service from '../config';

export const createServerGroup = (reabody) => {
    return service.post('/v1/server-group/create', reabody);
};

export const updateServerGroupById = (reabody) => {
    return service.post('/v1/server-group/edit', reabody);
};

export const getServerGroupList = (params) => {
    let paramsStr = qs.stringify(_.pickBy(params, (item) => {
        return item !== '' && item !== undefined;
    }));
    return service.post(`/v1/server-group/list?${paramsStr}`);
};
