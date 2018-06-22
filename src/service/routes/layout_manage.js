/**
 * @fileOverview Define the API functions of layout manage module
 */

import service from '../config';
import util from '../../util/extend';

/**
 * 修改栏目布局
 */
export const modifyContentLayout = ({id, contentLayout}) => {
    return service.put('/v1/content/layout', contentLayout);
};

/**
 * 获取栏目布局
 * @param id The id of navBar.
 */
export const getContentLayout = ({navBarId}) => {
    return service.get(util.format('/v1/content/layout?navBarId={0}', navBarId));
};

/**
 * 获取角标的列表
 * @param markType The mark type such as SCORE、EPISODES_NUMBER、COPYRIGHT_RESERVER、LICENCE、CUSTOM.
 */
export const getCornerMarkList = ({markType}) => {
    return service.get(util.format('/v1/content/layout/mark/list?markType={0}', markType));
};
