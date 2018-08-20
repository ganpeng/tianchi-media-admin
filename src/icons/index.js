import Vue from 'vue';
import SvgIcon from 'sysComponents/custom_components/global/widget/SvgIcon';
import generateIconsView from './generateIconsView.js';

Vue.component('svg-icon', SvgIcon);

const requireAll = requireContext => requireContext.keys().map(requireContext);
const req = require.context('./svg', false, /\.svg$/);
const iconMap = requireAll(req);

generateIconsView.generate(iconMap);
