/**
 * @fileOverview Combine the API functions of all module
 */

import * as adminRoutes from './routes/admin_manage';
import * as userRoutes from './routes/user_manage';
import * as authorizeRoutes from './routes/authorize_manage';
import * as personRoutes from './routes/person_manage';
import * as navBarRoutes from './routes/navi_bar_manage';
import * as programmeRoutes from './routes/programme_manage';
import * as uploadRoutes from './routes/upload';
import * as liveChannelLayoutRoutes from './routes/live_channel_layout_manage';
import * as programmeVideoRoutes from './routes/programme_video';
import * as subjectRoutes from './routes/subject_manage';
import * as layoutRoutes from './routes/layout_manage';
import * as videoRoutes from './routes/video_manage';
import * as channelRoutes from './routes/channel_manage';
import * as versionRoutes from './routes/version_manage';
import * as deviceRoutes from './routes/device_manage';
import * as hotSearchRoutes from './routes/hot_search';
import * as cornerMarkRoutes from './routes/corner_mark_manage';
import * as pageLayoutRoutes from './routes/page_layout_manage';
import * as productRoutes from './routes/product_manage';
import * as siteRoutes from './routes/site_manage';
import * as masterVideoRoutes from './routes/master_video_manage';
import * as advertisingOwner from './routes/advertisiing_owner_manage';
import * as adRoutes from './routes/ad_manage';
import * as interCutRoutes from './routes/inter_cut_manage';
import * as goodsRoutes from './routes/goods_manage';
import * as departmentRoutes from './routes/department_manage';
import * as comboRoutes from './routes/combo_manage';
import * as orderRoutes from './routes/order_manage';
import * as roleRoutes from './routes/role_manage';

/**
 * The object including all service functions.
 * notice.Each module function should have a unique name. Otherwise，they will override each other.
 * @type {Object}
 */
let service = Object.assign({}, deviceRoutes, adminRoutes, userRoutes, authorizeRoutes, personRoutes, navBarRoutes, programmeRoutes, uploadRoutes, liveChannelLayoutRoutes, programmeVideoRoutes, subjectRoutes, layoutRoutes, videoRoutes, channelRoutes, versionRoutes, productRoutes, siteRoutes, masterVideoRoutes, hotSearchRoutes, cornerMarkRoutes, pageLayoutRoutes, advertisingOwner, adRoutes, interCutRoutes, goodsRoutes, orderRoutes, comboRoutes, departmentRoutes, roleRoutes);

export default service;
