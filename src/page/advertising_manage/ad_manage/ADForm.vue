<!--广告信息表单组件-->
<template>
    <div id="ad-form-container">
        <div class="seperator-line"></div>
        <el-form
            :model="adInfo"
            :rules="infoRules"
            status-icon
            ref="adInfo"
            label-width="120px"
            class="form-block fill-form">
            <el-form-item label="广告名称" prop="name">
                <el-input
                    v-model="adInfo.name"
                    size="medium"
                    placeholder="请填写广告名称，不超过20个字符">
                </el-input>
            </el-form-item>
            <el-form-item label="广告描述" prop="desc">
                <el-input
                    v-model="adInfo.desc"
                    size="medium"
                    type="textarea"
                    :maxlength="100"
                    :rows="8"
                    placeholder="请填写广告描述，不超过100字">
                </el-input>
                <label class="textarea-tip">已输入{{adInfo.desc ? adInfo.desc.length : '0'}}/100字</label>
            </el-form-item>
            <el-form-item label="广告类型">
                <label class="ad-category">{{status | getADCategory}}</label>
            </el-form-item>
            <!-- 已下架已失效的整个页面不可编辑，其它都可以编辑生效时间 -->
            <el-form-item label="生效时间" prop="applyDateBegin" required>
                <el-date-picker
                    v-model="adInfo.applyBeginDate"
                    type="date"
                    @change="validateSingleQuote('applyDateBegin')"
                    value-format="timestamp"
                    size="medium"
                    placeholder="请选择生效日期">
                </el-date-picker>
                <el-time-picker
                    v-model="adInfo.applyBeginPoint"
                    value-format="timestamp"
                    @change="validateSingleQuote('applyDateBegin')"
                    size="medium"
                    placeholder="请选择生效时间">
                </el-time-picker>
            </el-form-item>
            <el-form-item label="失效时间" prop="applyDateEnd" required>
                <el-date-picker
                    v-model="adInfo.applyEndDate"
                    type="date"
                    @change="validateSingleQuote('applyDateEnd')"
                    value-format="timestamp"
                    size="medium"
                    placeholder="请选择失效日期">
                </el-date-picker>
                <el-time-picker
                    v-model="adInfo.applyEndPoint"
                    value-format="timestamp"
                    @change="validateSingleQuote('applyDateEnd')"
                    size="medium"
                    placeholder="请选择失效时间">
                </el-time-picker>
            </el-form-item>
            <el-form-item label="时移回看" prop="timeShift" required v-if="status.indexOf('PAUSE') !== -1">
                <el-radio-group v-model="adInfo.timeShift">
                    <el-radio :label="true">是</el-radio>
                    <el-radio :label="false">否</el-radio>
                </el-radio-group>
            </el-form-item>
            <el-form-item
                label="作用类别" prop="categoryList" required
                v-if="status.indexOf('PREPOSITION') !== -1 || status.indexOf('PAUSE') !== -1">
                <div class="my-tags">
                    <el-tag
                        :key="index"
                        v-for="(item, index) in adInfo.categoryList"
                        closable
                        @close="removeCategory(item, index)"
                        :disable-transitions="false">
                        {{item.name}}
                    </el-tag>
                </div>
                <el-autocomplete
                    class="inline-input"
                    placeholder="请选择作用类别"
                    :fetch-suggestions="querySearch"
                    @blur="validateCategoryList"
                    @select="setCategories">
                    <template slot-scope="{ item }">
                        <div class="name">{{ item.name }}</div>
                    </template>
                    <i v-if="adInfo.categoryList.length !== 0"
                       slot="suffix"
                       @click="removeAllCategory"
                       class="close-btn el-select__caret el-input__icon el-icon-circle-close is-show-close"></i>
                </el-autocomplete>
            </el-form-item>
            <!-- 2.8去除展示 -->
            <!--<el-form-item label="上下架">-->
            <!--<el-radio v-model="adVisible" label="1">上架</el-radio>-->
            <!--</el-form-item>-->
            <el-form-item label="广告资源" prop="adMaterialList" required>
                <el-button @click="selectADResourceVisible = true" class="contain-svg-icon btn-style-four">
                    <svg-icon icon-class="file"></svg-icon>
                    关联资源
                </el-button>
                <!--视频资源列表-->
                <div id="ad-video-resource"
                     v-if="adInfo.adMaterialList.length !== 0 && (status === 'CREATE_BOOT_AD' || status === 'EDIT_BOOT_AD' || status === 'CREATE_PREPOSITION_AD' || status === 'EDIT_PREPOSITION_AD')">
                    <!--视频资源列表-->
                    <div class="video-list">
                        <div class="ad-video-container"
                             v-for="(item, index) in adInfo.adMaterialList"
                             :key="index"
                             @click="previewVideoResource(item)">
                        <span @click.stop="removeVideoResource(index)">
                           <svg-icon icon-class="remove_image_hover"></svg-icon>
                           <svg-icon icon-class="remove_image_default"></svg-icon>
                        </span>
                            <svg-icon icon-class="video-ad"></svg-icon>
                            <div class="ad-desc">
                                <div class="ellipsis one">{{item.name}}</div>
                                <div>{{item.width}}*{{item.height}}</div>
                                <div>{{item.duration}}s&nbsp;&nbsp;&nbsp;&nbsp;
                                    {{item.size | convertFileSize}}
                                </div>
                                <div>{{item.advertiserName}}</div>
                            </div>
                        </div>
                    </div>
                    <ul>
                        <li><label>总时长</label><span>{{videoResourceDuration}}s</span></li>
                        <li><label>总体积</label><span>{{resourceSize | convertFileSize}}</span></li>
                        <li>
                            <label>广告主</label>
                            <span>
                                <div class="ad-owner"
                                     v-for="(item,index) in advertiserArray"
                                     :key="index">
                                      {{item.advertiserName}}
                                 </div>
                            </span>
                        </li>
                    </ul>
                </div>
                <!--图片资源列表-->
                <div id="ad-image-resource"
                     v-if="adInfo.adMaterialList.length !== 0 && !(status === 'CREATE_BOOT_AD' || status === 'EDIT_BOOT_AD' || status === 'CREATE_PREPOSITION_AD' || status === 'EDIT_PREPOSITION_AD')">
                    <div class="image-list">
                        <div class="ad-image-container"
                             v-for="(item, index) in adInfo.adMaterialList"
                             :key="index"
                             :style="{'background-image': 'url(' + item.storageUri + ')'}">
                            <div class="image-cover" @click.self="displayImage(index)">
                                <span @click.stop="removeImageResource(item,index)">
                                     <svg-icon icon-class="remove_image_hover"></svg-icon>
                                     <svg-icon icon-class="remove_image_default"></svg-icon>
                                 </span>
                            </div>
                            <div class="ad-desc">
                                <div>{{item.width}}*{{item.height}}</div>
                                <div>{{item.size | convertFileSize}}</div>
                                <div>{{item.advertiserName}}</div>
                                <div class="set-label" :title="setLabel(item.visitType)">{{setLabel(item.visitType)}}
                                </div>
                                <div class="target-url" :title="targetUrl(item)">{{targetUrl(item)}}</div>
                            </div>
                            <div
                                v-if="setAdVisible"
                                class="set-dropdown-wrapper">
                                <el-dropdown
                                    class="set-dropdown"
                                    @command="setAD($event, item)" placement="bottom">
                                    <el-button class="btn-style-two contain-svg-icon">
                                        设置为
                                        <svg-icon icon-class="arrow_down"></svg-icon>
                                    </el-button>
                                    <el-dropdown-menu slot="dropdown">
                                        <el-dropdown-item command="LINK">网页</el-dropdown-item>
                                        <el-dropdown-item command="PROGRAMME">节目</el-dropdown-item>
                                        <el-dropdown-item command="VIP_BUY">会员购买</el-dropdown-item>
                                    </el-dropdown-menu>
                                </el-dropdown>
                            </div>
                        </div>
                    </div>
                    <ul :class="[setAdVisible && 'set-ad']">
                        <li><label>总体积</label><span>{{resourceSize | convertFileSize}}</span></li>
                        <li>
                            <label>广告主</label>
                            <span>
                                <div class="ad-owner"
                                     v-for="(item,index) in advertiserArray"
                                     :key="index">
                                      {{item.advertiserName}}
                                 </div>
                            </span>
                        </li>
                    </ul>
                </div>
            </el-form-item>
        </el-form>
        <div class="fixed-btn-container">
            <el-button class="btn-style-two" type="primary" @click="operateAD" :loading="isLoading">保存</el-button>
            <el-button class="btn-style-three" @click="toADList" plain>返回列表</el-button>
        </div>
        <el-dialog
            title="关联资源"
            :visible.sync="selectADResourceVisible"
            :close-on-click-modal=false
            custom-class="normal-dialog"
            width="80%">
            <select-ad-single-video-resource
                ref="selectADSingleVideoResource"
                :adType="adInfo.adType"
                v-if="selectADResourceVisible && (status === 'CREATE_BOOT_AD' || status === 'EDIT_BOOT_AD')">
            </select-ad-single-video-resource>
            <select-ad-multiple-video-resource
                ref="selectADMultipleVideoResource"
                :adType="adInfo.adType"
                v-if="selectADResourceVisible && (status === 'CREATE_PREPOSITION_AD' || status === 'EDIT_PREPOSITION_AD')">
            </select-ad-multiple-video-resource>
            <select-ad-image-resource
                ref="selectADImageResource"
                :adType="adInfo.adType"
                v-if="selectADResourceVisible && !(status === 'CREATE_BOOT_AD' || status === 'EDIT_BOOT_AD' || status === 'CREATE_PREPOSITION_AD' || status === 'EDIT_PREPOSITION_AD')">
            </select-ad-image-resource>
            <span slot="footer" class="dialog-footer">
                <el-button @click="selectADResourceVisible = false">取消</el-button>
                <el-button type="primary" @click="confirmLinkADResource">确定</el-button>
            </span>
        </el-dialog>
        <display-video-dialog
            :url="url"
            :title="title"
            :displayVideoDialogVisible="displayVideoDialogVisible"
            v-on:changeDisplayVideoDialogStatus="closeDisplayVideoDialog($event)">
        </display-video-dialog>
        <preview-multiple-images
            :previewMultipleImages="previewImage">
        </preview-multiple-images>
        <!-- dev_v2.5 -->
        <link-dialog ref="linkDialog" :setAdSuccess="setAdSuccess"></link-dialog>
        <programme-dialog ref="programmeDialog" :setAdSuccess="setAdSuccess"></programme-dialog>
    </div>
</template>

<script>
    import SelectAdImageResource from './components/SelectADImageResource';
    import SelectAdSingleVideoResource from './components/SelectADSingleVideoResource';
    import SelectAdMultipleVideoResource from './components/SelectADMultipleVideoResource';
    import DisplayVideoDialog from '../../video_manage/DisplayVideoDialog';
    import PreviewMultipleImages from 'sysComponents/custom_components/custom/PreviewMultipleImages';
    import _ from 'lodash';

    //  dev_v2.5 新增
    import LinkDialog from './setAdDialog/LinkDialog';
    import ProgrammeDialog from './setAdDialog/ProgrammeDialog';

    export default {
        name: 'ADForm',
        components: {
            SelectAdImageResource,
            SelectAdSingleVideoResource,
            SelectAdMultipleVideoResource,
            DisplayVideoDialog,
            PreviewMultipleImages,
            //  dev_v2.5
            LinkDialog,
            ProgrammeDialog
        },
        /* status: 'CREATE_BOOT_AD'代表创建开机广告 */
        props: {
            status: {
                type: String,
                default: ''
            },
            adInfo: {
                type: Object,
                default: function () {
                    return {};
                }
            }
        },
        filters: {
            getADCategory(status) {
                switch (status) {
                    case 'CREATE_BOOT_AD':
                    case 'EDIT_BOOT_AD':
                        return '开机广告';
                    case 'CREATE_PAUSE_AD':
                    case 'EDIT_PAUSE_AD':
                        return '暂停广告';
                    case 'CREATE_PREPOSITION_AD':
                    case 'EDIT_PREPOSITION_AD':
                        return '片头广告';
                    case 'CREATE_SCREEN_SAVER_AD':
                    case 'EDIT_SCREEN_SAVER_AD':
                        return '屏保广告';
                    case 'CREATE_VOLUME_AD':
                    case 'EDIT_VOLUME_AD':
                        return '音量条广告';
                    case 'CREATE_CHANNEL_SWITCH_AD':
                    case 'EDIT_CHANNEL_SWITCH_AD':
                        return '换台广告';
                    case 'CREATE_PROGRAMME_DETAIL_AD':
                    case 'EDIT_PROGRAMME_DETAIL_AD':
                        return '详情页广告';
                    default:
                        break;
                }
            }
        },
        data() {
            let checkName = (rule, value, callback) => {
                if (this.$util.isEmpty(value)) {
                    return callback(new Error('请输入广告名称'));
                } else if (this.$util.trim(value).length > 20) {
                    return callback(new Error('广告名称不能超过20字'));
                } else {
                    callback();
                }
            };
            let checkDesc = (rule, value, callback) => {
                if (!this.$util.isEmpty(value) && this.$util.trim(value).length > 100) {
                    return callback(new Error('广告描述不能超过100字'));
                } else {
                    callback();
                }
            };
            // 生效开始时间
            let checkApplyDateBegin = (rule, value, callback) => {
                if (!this.adInfo.applyBeginDate || !this.adInfo.applyBeginPoint) {
                    this.adInfo.applyDateBegin = '';
                    return callback(new Error('请完整选择生效开始时间'));
                } else {
                    this.adInfo.applyDateBegin = parseInt(this.adInfo.applyBeginDate) + this.getTimePointMilliseconds(this.adInfo.applyBeginPoint);
                    if (!this.isStartTimeFit(this.adInfo.applyDateBegin) && !(this.status.indexOf('EDIT') !== -1 && this.adInfo.visible && this.adInfo.adStatus === 'ACTIVE')) {
                        return callback(new Error('生效时间应大于当前时间'));
                    } else if (this.adInfo.applyDateEnd && (this.adInfo.applyDateBegin >= this.adInfo.applyDateEnd)) {
                        return callback(new Error('生效时间应小于失效时间'));
                    } else if (this.adInfo.applyDateEnd && this.getConflictMessage(this.adInfo.applyDateBegin, this.adInfo.applyDateEnd)) {
                        return callback(new Error(this.getConflictMessage(this.adInfo.applyDateBegin, this.adInfo.applyDateEnd)));
                    } else {
                        callback();
                    }
                }
            };
            // 失效时间
            let checkApplyDateEnd = (rule, value, callback) => {
                if (!this.adInfo.applyEndDate || !this.adInfo.applyEndPoint) {
                    this.adInfo.applyDateEnd = '';
                    return callback(new Error('请完整选择失效开始时间'));
                } else {
                    this.adInfo.applyDateEnd = parseInt(this.adInfo.applyEndDate) + this.getTimePointMilliseconds(this.adInfo.applyEndPoint);
                    if (this.adInfo.applyDateBegin && this.adInfo.applyDateBegin >= this.adInfo.applyDateEnd) {
                        return callback(new Error('失效时间应大于生效时间'));
                    } else if (this.adInfo.applyDateBegin && this.getConflictMessage(this.adInfo.applyDateBegin, this.adInfo.applyDateEnd)) {
                        return callback(new Error(this.getConflictMessage(this.adInfo.applyDateBegin, this.adInfo.applyDateEnd)));
                    } else {
                        callback();
                    }
                }
            };
            let checkCategoryList = (rule, value, callback) => {
                if (this.status.indexOf('PREPOSITION') !== -1 || this.status.indexOf('PAUSE') !== -1) {
                    if (this.adInfo.categoryList.length === 0) {
                        return callback(new Error('请选择作用类别'));
                    } else {
                        callback();
                    }
                } else {
                    callback();
                }
            };
            let checkResource = (rule, value, callback) => {
                if (this.adInfo.adMaterialList.length === 0) {
                    return callback(new Error('关联资源不能为空'));
                    //    换台广告、详情页广告总体积小于2MB
                } else if (this.status === 'CREATE_CHANNEL_SWITCH_AD' || this.status === 'EDIT_CHANNEL_SWITCH_AD' || this.status === 'CREATE_PROGRAMME_DETAIL_AD' || this.status === 'EDIT_PROGRAMME_DETAIL_AD') {
                    if (this.getResourceTotalSize(this.adInfo.adMaterialList) > 2 * 1024 * 1024) {
                        return callback(new Error('图片资源体积应小于2M'));
                    } else {
                        callback();
                    }
                    //    音量条广告总体积小于1MB
                } else if (this.status === 'CREATE_VOLUME_AD' || this.status === 'EDIT_VOLUME_AD') {
                    if (this.getResourceTotalSize(this.adInfo.adMaterialList) > 1 * 1024 * 1024) {
                        return callback(new Error('图片资源体积应小于1M'));
                    } else {
                        callback();
                    }
                    //    暂停、屏保广告总体积小于10MB
                } else if (this.status.indexOf('PAUSE') !== -1 || this.status.indexOf('SCREEN_SAVER') !== -1) {
                    if (this.getResourceTotalSize(this.adInfo.adMaterialList) > 10 * 1024 * 1024) {
                        return callback(new Error('图片资源体积应小于10M'));
                    } else {
                        callback();
                    }
                    //    片头广告总体积小于600MB，时间小于600s
                } else if (this.status === 'CREATE_PREPOSITION_AD' || this.status === 'EDIT_PREPOSITION_AD') {
                    if (this.getResourceTotalSize(this.adInfo.adMaterialList) > 600 * 1024 * 1024) {
                        return callback(new Error('视频资源体积应小于600M'));
                    } else if (this.getResourceTotalDuration(this.adInfo.adMaterialList) > 600) {
                        return callback(new Error('视频资源体积应小于600s'));
                    } else {
                        callback();
                    }
                } else {
                    callback();
                }
            };
            return {
                adVisible: '1',
                url: '',
                title: '',
                displayVideoDialogVisible: false,
                selectADResourceVisible: false,
                isLoading: false,
                categoryOptions: [],
                infoRules: {
                    name: [
                        {required: true, message: '请输入广告名称'},
                        {validator: checkName, trigger: 'blur'}
                    ],
                    desc: [
                        {validator: checkDesc, trigger: 'blur'}
                    ],
                    applyDateBegin: [
                        {validator: checkApplyDateBegin, trigger: 'blur'}
                    ],
                    applyDateEnd: [
                        {validator: checkApplyDateEnd, trigger: 'blur'}
                    ],
                    categoryList: [
                        {validator: checkCategoryList, trigger: 'blur'}
                    ],
                    adMaterialList: [
                        {validator: checkResource, trigger: 'change'}
                    ]
                },
                visibleTypeADList: [],
                previewImage: {
                    display: false,
                    autoplay: false,
                    activeIndex: 0,
                    list: []
                }
            };
        },
        computed: {
            resourceSize: function () {
                let size = 0;
                this.adInfo.adMaterialList.map(image => {
                    size = size + parseInt(image.size);
                });
                return size;
            },
            advertiserArray: function () {
                return _.uniqBy(this.adInfo.adMaterialList, 'advertiserName');
            },
            videoResourceDuration: function () {
                let duration = 0;
                this.adInfo.adMaterialList.map(video => {
                    duration = duration + parseInt(video.duration);
                });
                return duration;
            },
            setAdVisible() {
                return this.status === 'CREATE_SCREEN_SAVER_AD' ||
                    this.status === 'EDIT_SCREEN_SAVER_AD' ||
                    this.status === 'CREATE_PROGRAMME_DETAIL_AD' ||
                    this.status === 'EDIT_PROGRAMME_DETAIL_AD';
            },
            setLabel() {
                return (visitType) => {
                    switch (visitType) {
                        case 'LINK':
                            return '设置为网页';
                        case 'PROGRAMME':
                            return '设置为节目';
                        case 'VIP_BUY':
                            return '设置为会员购买';
                        default:
                            return '';
                    }
                };
            },
            targetUrl() {
                return (adMaterial) => {
                    let {visitType, targetUrl} = adMaterial;
                    switch (visitType) {
                        case 'LINK':
                            return targetUrl;
                        case 'PROGRAMME':
                            return targetUrl === null || targetUrl === '' ? '' : _.get(JSON.parse(targetUrl), 'name');
                        case 'VIP_BUY':
                            return '';
                        default:
                            return '';
                    }
                };
            }
        },
        mounted() {
            this.init();
        },
        methods: {
            validateSingleQuote(quote) {
                this.$refs['adInfo'].validateField(quote);
            },
            init() {
                this.$util.toggleFixedBtnContainer();
                this.$service.getADList({
                    adType: this.adInfo.adType,
                    visible: true,
                    pageNum: 1,
                    pageSize: 10000
                }).then(response => {
                    if (response && response.code === 0) {
                        this.visibleTypeADList = response.data.list;
                    }
                });
                if (this.status.indexOf('PREPOSITION') !== -1 || this.status.indexOf('PAUSE') !== -1) {
                    this.$service.getProgrammeCategory().then(response => {
                        if (response && response.code === 0) {
                            this.categoryOptions = response.data;
                            if (this.status.indexOf('CREATE') !== -1) {
                                // 默认全选
                                this.adInfo.categoryList = response.data.slice(0);
                            }
                            this.categoryOptions.unshift({id: '0', signCode: '0', name: '全选'});
                        }
                    });
                }
            },
            // 将当前时间选择器的毫秒数改为只是小时、分钟、秒的毫秒数
            getTimePointMilliseconds(milliseconds) {
                let currentDate = new Date(milliseconds);
                return (currentDate.getHours() * 60 * 60 + currentDate.getMinutes() * 60 + currentDate.getSeconds()) * 1000;
            },
            // 根据已上架的当前类型的广告列表检测当前设置是否有生效时间的冲突
            getConflictMessage(begin, end) {
                let beginTime = begin instanceof Date ? begin.getTime() : begin;
                let endTime = end instanceof Date ? end.getTime() : end;
                let conflictMessage = '';
                // 创建广告创建时的检测
                if (this.status.indexOf('CREATE') !== -1) {
                    for (let i = 0; i < this.visibleTypeADList.length; i++) {
                        let adIndexBegin = this.visibleTypeADList[i].applyDateBegin;
                        let adIndexEnd = this.visibleTypeADList[i].applyDateEnd;
                        if ((adIndexBegin <= beginTime && beginTime <= adIndexEnd) || (adIndexBegin <= endTime && endTime <= adIndexEnd) || (beginTime <= adIndexBegin && adIndexBegin <= endTime) || (beginTime <= adIndexEnd && adIndexEnd <= endTime)) {
                            conflictMessage = '该广告的起止时间和以下广告存在冲突：广告名称：' + this.visibleTypeADList[i].name + ' 有效期：' + this.$util.formatDate(new Date(this.visibleTypeADList[i].applyDateBegin), 'yyyy-MM-DD HH:mm:SS') + '至' + this.$util.formatDate(new Date(this.visibleTypeADList[i].applyDateEnd), 'yyyy-MM-DD HH:mm:SS') + '，暂不能设置';
                        }
                    }
                } else {
                    //  检测广告编辑时的检测
                    for (let i = 0; i < this.visibleTypeADList.length; i++) {
                        let adIndexBegin = this.visibleTypeADList[i].applyDateBegin;
                        let adIndexEnd = this.visibleTypeADList[i].applyDateEnd;
                        if (this.adInfo.id !== this.visibleTypeADList[i].id && ((adIndexBegin <= beginTime && beginTime <= adIndexEnd) || (adIndexBegin <= endTime && endTime <= adIndexEnd) || (beginTime <= adIndexBegin && adIndexBegin <= endTime) || (beginTime <= adIndexEnd && adIndexEnd <= endTime))) {
                            conflictMessage = '该广告的起止时间和以下广告存在冲突：广告名称：' + this.visibleTypeADList[i].name + ' 有效期：' + this.$util.formatDate(new Date(this.visibleTypeADList[i].applyDateBegin), 'yyyy-MM-DD HH:mm:SS') + '至' + this.$util.formatDate(new Date(this.visibleTypeADList[i].applyDateEnd), 'yyyy-MM-DD HH:mm:SS') + '，暂不能设置';
                        }
                    }
                }
                return conflictMessage;
            },
            // 生效开始时间不晚于当前时间
            isStartTimeFit(startTime) {
                return new Date().getTime() < startTime;
            },
            validateCategoryList() {
                this.$refs['adInfo'].validateField('categoryList');
            },
            removeAllCategory() {
                this.adInfo.categoryList.splice(0);
                this.validateCategoryList();
            },
            removeCategory(category, index) {
                this.adInfo.categoryList.splice(index, 1);
                this.validateCategoryList();
            },
            querySearch(queryString, cb) {
                let results = queryString ? this.categoryOptions.filter(this.createFilter(queryString)) : this.categoryOptions;
                cb(results);
            },
            createFilter(queryString) {
                return (categoryOptions) => {
                    return (categoryOptions.name.toLowerCase().indexOf(queryString.toLowerCase()) === 0);
                };
            },
            // 设置区域码，对全选进行处理
            setCategories(item) {
                // 对全选进行处理
                if (item.name === '全选') {
                    this.adInfo.categoryList.splice(0);
                    this.categoryOptions.map(category => {
                        if (category.name !== '全选') {
                            this.adInfo.categoryList.push(category);
                        }
                    });
                } else {
                    // 对非全选进行处理
                    this.adInfo.categoryList.push({id: item.id, name: item.name, signCode: item.signCode});
                    this.adInfo.categoryList = _.uniqBy(this.adInfo.categoryList, 'id');
                }
                this.validateCategoryList();
            },
            confirmLinkADResource() {
                switch (this.status) {
                    // 开机广告
                    case 'CREATE_BOOT_AD':
                    case 'EDIT_BOOT_AD':
                        let bootVideoList = this.$refs.selectADSingleVideoResource.getVideoArrayInfo();
                        if (bootVideoList) {
                            this.adInfo.adMaterialList = bootVideoList;
                            this.selectADResourceVisible = false;
                        }
                        break;
                    case 'CREATE_CHANNEL_SWITCH_AD':
                    case 'EDIT_CHANNEL_SWITCH_AD':
                    case 'CREATE_PROGRAMME_DETAIL_AD':
                    case 'EDIT_PROGRAMME_DETAIL_AD':
                    case 'CREATE_SCREEN_SAVER_AD':
                    case 'EDIT_SCREEN_SAVER_AD':
                    case 'CREATE_VOLUME_AD':
                    case 'EDIT_VOLUME_AD':
                    case 'CREATE_PAUSE_AD':
                    case 'EDIT_PAUSE_AD':
                        let imageList = this.$refs.selectADImageResource.getImageArrayInfo();
                        if (imageList) {
                            this.adInfo.adMaterialList = this.adInfo.adMaterialList.concat(imageList);
                            this.adInfo.adMaterialList = _.uniqBy(this.adInfo.adMaterialList, 'id');
                            this.selectADResourceVisible = false;
                        }
                        break;
                    //    片头广告
                    case 'CREATE_PREPOSITION_AD':
                    case 'EDIT_PREPOSITION_AD':
                        let prepositionVideoList = this.$refs.selectADMultipleVideoResource.getVideoArrayInfo();
                        if (prepositionVideoList) {
                            this.adInfo.adMaterialList = this.adInfo.adMaterialList.concat(prepositionVideoList);
                            this.adInfo.adMaterialList = _.uniqBy(this.adInfo.adMaterialList, 'id');
                            this.selectADResourceVisible = false;
                        }
                        break;
                    default:
                        break;
                }
            },
            removeVideoResource(index) {
                this.adInfo.adMaterialList.splice(index, 1);
            },
            removeImageResource(image, index) {
                this.adInfo.adMaterialList.splice(index, 1);
            },
            // 获取资源的总体积
            getResourceTotalSize(resourceList) {
                let size = 0;
                resourceList.map(resource => {
                    size = size + parseInt(resource.size);
                });
                return size;
            },
            // 获取资源的总时长
            getResourceTotalDuration(resourceList) {
                let duration = 0;
                resourceList.map(resource => {
                    duration = duration + parseInt(resource.duration);
                });
                return duration;
            },
            previewVideoResource(item) {
                this.url = item.storageUri;
                this.title = item.name;
                this.displayVideoDialogVisible = true;
            },
            operateAD() {
                this.$refs['adInfo'].validate((valid) => {
                    if (valid) {
                        this.isLoading = true;
                        // 创建广告
                        if (this.status.indexOf('CREATE') !== -1) {
                            this.$service.createAD(this.adInfo).then(response => {
                                if (response && response.code === 0) {
                                    this.$message.success('成功创建广告');
                                    this.toADList();
                                } else {
                                    this.isLoading = false;
                                }
                            });
                        } else {
                            this.$service.updateADInfo(this.adInfo).then(response => {
                                if (response && response.code === 0) {
                                    this.$message.success('成功更新广告');
                                    this.toADList();
                                } else {
                                    this.isLoading = false;
                                }
                            });
                        }
                    } else {
                        return false;
                    }
                });
            },
            toADList() {
                this.$router.push({name: 'ADList'});
            },
            closeDisplayVideoDialog(status) {
                this.displayVideoDialogVisible = status;
            },
            // 放大预览图片
            displayImage(index) {
                this.previewImage.display = true;
                for (let i = 0; i < this.adInfo.adMaterialList.length; i++) {
                    this.adInfo.adMaterialList[i].uri = this.adInfo.adMaterialList[i].storageUri;
                }
                this.previewImage.list = this.adInfo.adMaterialList;
                this.previewImage.activeIndex = index;
            },
            //  dev_v2.5新增逻辑
            setAD(command, adMaterial) {
                let index = this.adInfo.adMaterialList.findIndex((item) => item.id === adMaterial.id);
                switch (command) {
                    case 'LINK':
                        this.$refs.linkDialog.showDialog(command, adMaterial);
                        break;
                    case 'PROGRAMME':
                        this.$refs.programmeDialog.showDialog(command, adMaterial);
                        break;
                    case 'VIP_BUY':
                        _.set(this.adInfo.adMaterialList, `${index}.visitType`, command);
                        break;
                    default:
                        break;
                }
            },
            setAdSuccess(data) {
                let {command, value, adMaterial: {id}} = data;
                let index = this.adInfo.adMaterialList.findIndex((item) => item.id === id);
                if (index >= 0) {
                    _.set(this.adInfo.adMaterialList, `${index}.visitType`, command);
                    _.set(this.adInfo.adMaterialList, `${index}.targetUrl`, value);
                }
            }
        }
    };
</script>

<style lang="scss" scoped>

    .el-form {
        margin-top: 15px;
    }

    .textarea-tip {
        position: relative;
        right: 96px;
        top: 4px;
        color: #1989FA;
        font-size: 10px;
    }

    .ad-category {
        padding: 4px 11px;
        background: #2A3040;
        border-radius: 4px;
        font-size: 12px;
        color: #A8ABB3;
    }

    /*视频资源展示*/
    #ad-video-resource {
        margin-bottom: 170px;
        margin-top: 20px;
        height: 152px;
        .video-list {
            display: flex;
            justify-content: left;
            flex-wrap: wrap;
        }
        .ad-video-container {
            margin-right: 22px;
            position: relative;
            height: 100px;
            width: 170px;
            background: #2A3040;
            border: 1px solid #3E495E;
            border-radius: 8px;
            cursor: pointer;
            &:hover {
                border: 1px solid #1989FA;
                span {
                    visibility: visible;
                    .svg-icon-remove_image_hover {
                        display: none;
                    }
                    &:hover {
                        .svg-icon-remove_image_hover {
                            display: inline;
                        }
                        .svg-icon-remove_image_default {
                            display: none;
                        }
                    }
                }
                .svg-icon-video-ad {
                    fill-opacity: 1;
                }
            }
            .svg-icon-video-ad {
                margin-top: 25px;
                margin-left: 58px;
                width: 50px !important;
                height: 50px !important;
                fill-opacity: 0.5;
            }
            /*删除按钮*/
            span {
                visibility: hidden;
                position: absolute;
                top: 5px;
                right: 10px;
                z-index: 400;
                cursor: pointer;
                .svg-icon {
                    width: 23px !important;
                    height: 23px !important;
                }
            }
            .ad-desc {
                margin-top: 18px;
                div {
                    height: 20px;
                    line-height: 20px;
                    text-align: center;
                    font-size: 12px;
                    color: #A8ABB3;
                }
            }
        }
        ul {
            display: inline-block;
            min-width: 170px;
            padding-bottom: 5px;
            padding-right: 25px;
            border: 1px solid #3E495E;
            border-radius: 8px;
            margin-top: 100px;
            li {
                margin-left: 11px;
                margin-bottom: 10px;
                margin-top: 10px;
                height: 24px;
                line-height: 24px;
                label {
                    float: left;
                    margin-right: 34px;
                    width: 36px;
                    font-size: 12px;
                    color: #A8ABB3;
                }
                span {
                    float: left;
                    font-size: 12px;
                    color: #3AC26F;
                }
                .ad-owner {
                    font-size: 12px;
                    color: #A8ABB3;
                }
            }
        }
    }

    /*图片资源展示*/
    #ad-image-resource {
        margin-bottom: 170px;
        margin-top: 20px;
        height: 152px;
        .image-list {
            display: flex;
            justify-content: left;
            flex-wrap: wrap;
        }
        .ad-image-container {
            margin-right: 22px;
            margin-bottom: 80px;
            position: relative;
            height: 100px;
            width: 170px;
            background: #2A3040;
            border: 1px solid #3E495E;
            border-radius: 8px;
            cursor: pointer;
            background-size: cover;
            background-repeat: no-repeat;
            background-position: center;
            &:hover {
                .image-cover {
                    visibility: visible;
                }
            }
            .image-cover {
                visibility: hidden;
                position: absolute;
                height: 100px;
                width: 170px;
                left: 0px;
                top: 0px;
                background: rgba(41, 53, 80, 0.80);
                border-radius: 7px;
                cursor: zoom-in;
                /*删除按钮*/
                span {
                    position: absolute;
                    top: 5px;
                    right: 10px;
                    z-index: 400;
                    cursor: pointer;
                    .svg-icon {
                        width: 23px !important;
                        height: 23px !important;
                    }
                    .svg-icon-remove_image_hover {
                        display: none;
                    }
                    &:hover {
                        .svg-icon-remove_image_hover {
                            display: inline;
                        }
                        .svg-icon-remove_image_default {
                            display: none;
                        }
                    }
                }
            }
            .ad-desc {
                margin-top: 105px;
                cursor: default;
                div {
                    height: 20px;
                    line-height: 20px;
                    text-align: center;
                    font-size: 12px;
                    color: #A8ABB3;
                }
                .target-url,
                .set-label {
                    width: 100%;
                    text-overflow: ellipsis;
                    overflow: hidden;
                    white-space: nowrap;
                }
            }
            .set-dropdown-wrapper {
                display: flex;
                justify-content: center;
                margin: 10px 0;
            }
        }
        ul {
            display: inline-block;
            margin-top: 20px;
            min-width: 170px;
            padding-bottom: 10px;
            padding-right: 25px;
            border: 1px solid #3E495E;
            border-radius: 8px;
            &.set-ad {
                margin-top: 100px;
            }
            li {
                margin-left: 11px;
                margin-bottom: 15px;
                margin-top: 15px;
                height: 24px;
                line-height: 24px;
                label {
                    float: left;
                    margin-right: 34px;
                    width: 36px;
                    font-size: 12px;
                    color: #A8ABB3;
                }
                span {
                    float: left;
                    font-size: 12px;
                    color: #3AC26F;
                }
                .ad-owner {
                    font-size: 12px;
                    color: #A8ABB3;
                }
            }
        }
    }

    .my-tags {
        max-width: 600px;
    }

</style>
