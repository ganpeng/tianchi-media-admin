<!--广告信息表单组件-->
<template>
    <div>
        <div class="seperator-line"></div>
        <el-form
            :model="adInfo"
            :rules="infoRules"
            status-icon
            ref="adInfo"
            label-width="120px"
            class="form-block fill-form">
            <el-form-item label="广告名称" prop="name" required>
                <el-input
                    v-model="adInfo.name"
                    size="medium"
                    placeholder="请填写广告名称，不超过20个字符">
                </el-input>
            </el-form-item>
            <el-form-item label="广告描述" prop="desc" required>
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
            <el-form-item label="起止时间" prop="effectRangeTime" required>
                <el-date-picker
                    v-model="adInfo.effectRangeTime"
                    type="datetimerange"
                    clearable
                    onPick="onPickTimeRange"
                    value-format="timestamp"
                    range-separator="至"
                    start-placeholder="开始日期"
                    end-placeholder="结束日期">
                </el-date-picker>
            </el-form-item>
            <el-form-item label="上下架">
                <label class="ad-status">上架</label>
            </el-form-item>
            <el-form-item label="广告资源" prop="resource" required>
                <el-button @click="selectADResourceVisible = true" class="contain-svg-icon btn-style-four">
                    <svg-icon icon-class="file"></svg-icon>
                    关联资源
                </el-button>
                <!--视频资源列表-->
                <div id="ad-video-resource"
                     v-if="adInfo.videoResource.name && (status === 'CREATE_BOOT_AD' || status === 'EDIT_BOOT_AD')">
                    <div class="ad-video-container" @click="previewVideoResource">
                        <i class="el-icon-circle-close" @click.stop="removeVideoResource"></i>
                        <svg-icon icon-class="video-ad"></svg-icon>
                        <div class="ad-desc">
                            <div>{{adInfo.videoResource.name}}</div>
                            <div>{{adInfo.videoResource.duration}}ss&nbsp;&nbsp;&nbsp;&nbsp;{{adInfo.videoResource.size}}</div>
                        </div>
                    </div>
                    <ul>
                        <li><label>总时长</label><span>{{adInfo.videoResource.duration}}s</span></li>
                        <li><label>总体积</label><span>{{adInfo.videoResource.size}}</span></li>
                        <li><label>广告主</label><span class="ad-owner">{{adInfo.videoResource.owner}}</span></li>
                    </ul>
                </div>
                <!--图片资源列表-->
                <div id="ad-image-resource"
                     v-if="adInfo.imageResourceList.length !== 0 && !(status === 'CREATE_BOOT_AD' || status === 'EDIT_BOOT_AD')">
                    <div class="image-list">
                        <div class="ad-image-container"
                             v-for="(item, index) in adInfo.imageResourceList"
                             :key="index"
                             :style="{'background-image': 'url(' + item.url + ')'}">
                            <i class="el-icon-circle-close" @click.stop="removeImageResource(item,index)"></i>
                            <div class="ad-desc">
                                <div>{{item.name}}</div>
                                <div>{{item.size}}</div>
                            </div>
                        </div>
                    </div>
                    <ul>
                        <li><label>总体积</label><span>{{imageResourceSize}}</span></li>
                        <li>
                            <label>广告主</label>
                            <span>
                                <div class="ad-owner"
                                     v-for="(item,index) in adInfo.imageResourceList"
                                     :key="index">
                                      {{item.owner}}
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
            <select-ad-video-resource
                ref="selectADVideoResource"
                v-if="selectADResourceVisible && (status === 'CREATE_BOOT_AD' || status === 'EDIT_BOOT_AD')">
            </select-ad-video-resource>
            <select-ad-image-resource
                ref="selectADImageResource"
                v-if="selectADResourceVisible && !(status === 'CREATE_BOOT_AD' || status === 'EDIT_BOOT_AD')">
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
    </div>
</template>

<script>
    import SelectAdImageResource from './SelectADImageResource';
    import SelectAdVideoResource from './SelectADVideoResource';
    import DisplayVideoDialog from '../../video_manage/DisplayVideoDialog';
    import _ from 'lodash';

    export default {
        name: 'ADForm',
        components: {
            SelectAdImageResource,
            SelectAdVideoResource,
            DisplayVideoDialog
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
                    return callback(new Error('广告名称不能为空'));
                } else if (this.$util.trim(value).length > 20) {
                    return callback(new Error('广告名称不能超过20字'));
                } else {
                    callback();
                }
            };
            let checkDesc = (rule, value, callback) => {
                if (this.$util.isEmpty(value)) {
                    return callback(new Error('广告描述不能为空'));
                } else if (this.$util.trim(value).length > 100) {
                    return callback(new Error('广告描述不能超过100字'));
                } else {
                    callback();
                }
            };
            let checkEffectRangeTime = (rule, value, callback) => {
                if (!value || this.$util.isEmpty(value[0])) {
                    return callback(new Error('起止时间不能为空'));
                } else if (!this.isStartTimeFit(value[0])) {
                    return callback(new Error('最早时间应为当前小时+1'));
                } else {
                    callback();
                }
            };
            let checkResource = (rule, value, callback) => {
                if (this.status === 'CREATE_BOOT_AD' || this.status === 'EDIT_BOOT_AD') {
                    if (!this.adInfo.videoResource.name) {
                        return callback(new Error('关联资源不能为空'));
                    } else {
                        callback();
                    }
                } else if (!(this.status === 'CREATE_BOOT_AD' || this.status === 'EDIT_BOOT_AD')) {
                    if (this.adInfo.imageResourceList.length === 0) {
                        return callback(new Error('关联资源不能为空'));
                    } else if (this.getImageResourceTotalSize(this.adInfo.imageResourceList) > 50) {
                        return callback(new Error('图片资源体积应小于300M'));
                    } else {
                        callback();
                    }
                }
            };
            return {
                url: '',
                title: '',
                displayVideoDialogVisible: false,
                selectADResourceVisible: false,
                isLoading: false,
                infoRules: {
                    name: [
                        {validator: checkName, trigger: 'blur'}
                    ],
                    desc: [
                        {validator: checkDesc, trigger: 'blur'}
                    ],
                    effectRangeTime: [
                        {validator: checkEffectRangeTime, trigger: 'blur'}
                    ],
                    resource: [
                        {validator: checkResource, trigger: 'change'}
                    ]
                }
            };
        },
        computed: {
            imageResourceSize: function () {
                let size = 0;
                this.adInfo.imageResourceList.map(image => {
                    size = size + parseInt(image.size);
                });
                return size;
            }
        },
        mounted() {
            this.init();
        },
        methods: {
            init() {
                this.$util.toggleFixedBtnContainer();
            },
            // 生效开始时间为最早当前时数+1
            isStartTimeFit(startTime) {
                let current = new Date();
                let nowMilliseconds = current.getTime();
                let hourMilliseconds = nowMilliseconds - (current.getMinutes() * 60 + current.getSeconds()) * 1000;
                let nextHour = hourMilliseconds + 60 * 60 * 1000;
                return nextHour < startTime;
            },
            confirmLinkADResource() {
                if (this.status !== 'CREATE_BOOT_AD' && this.status !== 'EDIT_BOOT_AD') {
                    let imageInfo = this.$refs.selectADImageResource.getImageInfo();
                    if (imageInfo) {
                        this.adInfo.imageResourceList = this.adInfo.imageResourceList.concat(imageInfo);
                        this.adInfo.imageResourceList = _.uniqBy(this.adInfo.imageResourceList, 'value');
                        this.selectADResourceVisible = false;
                    }
                } else {
                    let videoInfo = this.$refs.selectADVideoResource.getVideoInfo();
                    if (videoInfo) {
                        this.adInfo.videoResource = videoInfo;
                        this.selectADResourceVisible = false;
                    }
                }
            },
            removeVideoResource() {
                this.adInfo.videoResource = {};
            },
            removeImageResource(image, index) {
                this.adInfo.imageResourceList.splice(index, 1);
            },
            // 获取图片资源的总体积
            getImageResourceTotalSize(imageList) {
                let size = 0;
                imageList.map(image => {
                    size = size + parseInt(image.size);
                });
                return size;
            },
            previewVideoResource() {
                this.displayVideoDialogVisible = true;
                this.url = this.adInfo.videoResource.url;
                this.title = this.adInfo.videoResource.title;
            },
            operateAD() {
                this.$refs['adInfo'].validate((valid) => {
                    if (valid) {
                        // 设置节目专题的背景图片
                        if (this.status === 'CREATE_PROGRAMME' || this.status === 'EDIT_PROGRAMME') {
                            this.adInfo.posterImageList.map(image => {
                                if (image.width.toString() === '1920' && image.height.toString() === '1080') {
                                    this.adInfo.backgroundImage = image;
                                }
                            });
                        }
                        this.isLoading = true;
                        // 创建专题
                        if (this.status === 'CREATE_PROGRAMME' || this.status === 'CREATE_FIGURE') {
                            this.adInfo.category = this.status === 'CREATE_PROGRAMME' ? 'PROGRAMME' : 'FIGURE';
                            this.$service.createSubject(this.adInfo).then(response => {
                                if (response && response.code === 0) {
                                    this.$message.success('成功创建专题');
                                    this.toADList();
                                } else {
                                    this.isLoading = false;
                                }
                            });
                        } else {
                            this.$service.updateSubjectInfo(this.adInfo).then(response => {
                                if (response && response.code === 0) {
                                    this.$message.success('成功更新专题');
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
        margin-top: 20px;
        height: 152px;
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
                i {
                    visibility: visible;
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
            i {
                position: absolute;
                top: 2px;
                right: 2px;
                font-size: 16px;
                color: #6F7480;
                cursor: pointer;
                visibility: hidden;
                &:hover {
                    color: #C35757;
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
            margin-top: 60px;
            padding-right: 25px;
            height: 100px;
            min-width: 170px;
            background: #2A3040;
            border: 1px solid #3E495E;
            border-radius: 8px;
            li {
                margin-left: 11px;
                margin-bottom: 10px;
                height: 18px;
                label {
                    margin-right: 34px;
                    width: 36px;
                    font-size: 12px;
                    color: #A8ABB3;
                }
                span {
                    font-size: 12px;
                    color: #3AC26F;
                    &.ad-owner {
                        color: #A8ABB3;
                    }
                }
            }
        }
    }

    /*图片资源展示*/
    #ad-image-resource {
        margin-top: 20px;
        height: 152px;
        .image-list {
            display: flex;
            justify-content: left;
        }
        .ad-image-container {
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
                i {
                    visibility: visible;
                }
            }
            /*删除按钮*/
            i {
                position: absolute;
                top: 2px;
                right: 2px;
                font-size: 16px;
                color: #6F7480;
                cursor: pointer;
                visibility: hidden;
                &:hover {
                    color: #C35757;
                }
            }
            .ad-desc {
                margin-top: 105px;
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
            margin-top: 60px;
            min-width: 170px;
            padding-bottom: 10px;
            padding-right: 25px;
            background: #2A3040;
            border: 1px solid #3E495E;
            border-radius: 8px;
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

</style>
