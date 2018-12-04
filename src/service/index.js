/**
 * @fileOverview Combine the API functions of all module
 */

import * as adminRoutes from './routes/admin_manage';
import * as userRoutes from './routes/user_manage';
import * as authorizeRoutes from './routes/authorize_manage';
import * as personRoutes from './routes/person_manage';
import * as naviBarRoutes from './routes/navi_bar_manage';
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
import * as productRoutes from './routes/product_manage';
import * as siteRoutes from './routes/site_manage';
import * as masterVideoRoutes from './routes/master_video_manage';

/**
 * The object including all service functions.
 * notice.Each module function should have a unique name. Otherwise，they will override each other.
 * @type {Object}
 */
let service = Object.assign({}, deviceRoutes, adminRoutes, userRoutes, authorizeRoutes, personRoutes, naviBarRoutes, programmeRoutes, uploadRoutes, liveChannelLayoutRoutes, programmeVideoRoutes, subjectRoutes, layoutRoutes, videoRoutes, channelRoutes, versionRoutes, productRoutes, siteRoutes, masterVideoRoutes);

export default service;
