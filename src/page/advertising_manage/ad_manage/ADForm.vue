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
            <el-form-item label="广告资源" prop="resource" required>
                <el-button @click="selectADResourceVisible = true" class="contain-svg-icon btn-style-four">
                    <svg-icon icon-class="file"></svg-icon>
                    关联资源
                </el-button>
                <div id="ad-resource" v-if="adInfo.resource.name">
                    <div class="ad-container" @click="previewVideoResource">
                        <i class="el-icon-circle-close" @click.stop="removeVideoResource"></i>
                        <svg-icon icon-class="video-ad"></svg-icon>
                        <div class="ad-desc">
                            <div>{{adInfo.resource.name}}</div>
                            <div>{{adInfo.resource.duration}}ss&nbsp;&nbsp;&nbsp;&nbsp;{{adInfo.resource.size}}</div>
                        </div>
                    </div>
                    <ul>
                        <li><label>总时长</label><span>{{adInfo.resource.duration}}s</span></li>
                        <li><label>总体积</label><span>{{adInfo.resource.size}}</span></li>
                        <li><label>广告主</label><span class="ad-owner">{{adInfo.resource.owner}}</span></li>
                    </ul>
                </div>
                <!--<thumbnail-->
                <!--:imageList="adInfo.posterImageList">-->
                <!--</thumbnail>-->
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
            <!--<select-ad-image-resource>-->
            <!--</select-ad-image-resource>-->
            <select-ad-video-resource
                ref="selectADVideoResource"
                v-if="selectADResourceVisible">
            </select-ad-video-resource>
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
    import Thumbnail from 'sysComponents/custom_components/custom/Thumbnail';
    import SelectAdImageResource from './SelectADImageResource';
    import SelectAdVideoResource from './SelectADVideoResource';
    import DisplayVideoDialog from '../../video_manage/DisplayVideoDialog';

    export default {
        name: 'ADForm',
        components: {
            Thumbnail,
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
                if (!this.adInfo.resource.name) {
                    return callback(new Error('关联资源不能为空'));
                } else {
                    callback();
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
                let videoInfo = this.$refs.selectADVideoResource.getVideoInfo();
                if (videoInfo) {
                    this.adInfo.resource = videoInfo;
                    this.selectADResourceVisible = false;
                }
            },
            removeVideoResource() {
                this.adInfo.resource = {};
            },
            previewVideoResource() {
                this.displayVideoDialogVisible = true;
                this.url = this.adInfo.resource.url;
                this.title = this.adInfo.resource.title;
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

    #ad-resource {
        margin-top: 20px;
        height: 152px;
        .ad-container {
            float: left;
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
            float: left;
            margin-left: 22px;
            height: 100px;
            width: 170px;
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

</style>
