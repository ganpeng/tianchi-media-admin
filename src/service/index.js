/**
 * @fileOverview Combine the API functions of all module
 */

import * as adminRoutes from './routes/admin_manage';
import * as authorizeRoutes from './routes/authorize_manage';
import * as personRoutes from './routes/person_manage';

/**
 * The object including all service functions.
 * notice.Each module function should have a unique name. Otherwise，they will override each other.
 * @type {Object}
 */
let service = Object.assign({}, adminRoutes, authorizeRoutes, personRoutes);

export default service;