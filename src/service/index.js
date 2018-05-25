/**
 * @fileOverview Combine the API functions of all module
 */

import * as adminRoutes from './routes/admin_manage';
import * as authorizeRoutes from './routes/authorize_manage';
import * as personRoutes from './routes/person_manage';
import * as naviBarRoutes from './routes/navi_bar_manage';
import * as programmeRoutes from './routes/programme_manage';
import * as uploadRoutes from './routes/upload';
import * as liveChannelLayoutRoutes from './routes/live_channel_layout_manage';
import * as programmeVideoRoutes from './routes/programme_video';
import * as subjectRoutes from './routes/subject_manage';

/**
 * The object including all service functions.
 * notice.Each module function should have a unique name. Otherwise，they will override each other.
 * @type {Object}
 */
let service = Object.assign({}, adminRoutes, authorizeRoutes, personRoutes, naviBarRoutes, programmeRoutes, uploadRoutes, liveChannelLayoutRoutes, programmeVideoRoutes, subjectRoutes);

export default service;
