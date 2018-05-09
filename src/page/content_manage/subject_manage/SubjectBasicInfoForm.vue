<!--专题基本信息表单组件-->
<template>
    <div>
        <el-form :model="subjectInfo" :rules="infoRules" status-icon ref="subjectInfo"
                 label-width="140px"
                 class="form-block">
            <el-form-item label="名称" prop="name" required>
                <el-input v-model="subjectInfo.name" placeholder="请填写30个字以内的名称"></el-input>
            </el-form-item>
            <template v-if="status === '0' || status === '2'">
                <el-form-item label="节目专题类别" prop="type" required>
                    <el-select v-model="subjectInfo.type" multiple placeholder="请选择节目专题类别">
                        <el-option
                            v-for="item in typeOptions"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value">
                        </el-option>
                    </el-select>
                </el-form-item>
            </template>
            <el-form-item label="简介" prop="description" required>
                <el-input
                    v-model="subjectInfo.description"
                    placeholder="请填写150个字以内的简介"
                    type="textarea"
                    :rows="4">
                </el-input>
            </el-form-item>
            <el-form-item label="请选择标签" prop="tags" required>
                <el-select v-model="subjectInfo.tags" multiple placeholder="请选择标签">
                    <el-option
                        v-for="item in tagOptions"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value">
                    </el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="是否显示在往日推荐" prop="pastPush">
                <el-popover
                    placement="top"
                    title="往日推荐"
                    width="200"
                    trigger="hover"
                    content="设置当前专题是否出现在栏目中的'更多'下拉专题瀑布流中">
                    <el-button slot="reference" type="text">?</el-button>
                </el-popover>
                <el-switch v-model="subjectInfo.pastPush"></el-switch>
            </el-form-item>
            <el-form-item label="上传专题封面：" prop="coverUrls">
                <ul class="cover-list">
                    <li v-for="(item,index) in subjectInfo.coverUrls" :key="index">
                        <img :src="item.url" :alt="item.name" @click="displayImage(index)">
                        <label>{{item.name}}</label>
                    </li>
                    <li @click="imageUploadDialogVisible = true">
                        <i class="el-icon-plus"></i>
                    </li>
                </ul>
            </el-form-item>
            <el-form-item class="tips">
                <label class="tips">带 <i>*</i> 号的为必填项</label>
            </el-form-item>
            <el-form-item class="operate">
                <el-button type="primary" @click="createAdmin">
                    {{this.status === '0' || this.status === '1' ? '创建' : '更新'}}
                </el-button>
                <el-button @click="reset">重 置</el-button>
            </el-form-item>
        </el-form>
        <preview-multiple-images
            :previewMultipleImages="previewImage">
        </preview-multiple-images>
        <upload-programme-image-dialog
            title="节目专题封面设置"
            :imageUploadDialogVisible="imageUploadDialogVisible"
            v-on:changeImageDialogStatus="closeImageDialog($event)">
        </upload-programme-image-dialog>
        <el-dialog
            title="提示"
            :visible.sync="dialogVisible"
            width="30%"
            :before-close="handleClose">
            <span>{{remainder}}</span>
            <span slot="footer" class="dialog-footer">
                <el-button @click="toSubjectList">前往专题列表页面</el-button>
                <el-button type="primary" @click="toAppend" v-if="status === '0' || status === '1'">前往添加专题{{ status === '0' ? '节目':'人物'}}</el-button>
                <el-button type="primary" @click="toEdit" v-if="status === '2' || status === '3'">前往编辑专题{{ status === '2' ? '节目':'人物'}}</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
    import PreviewMultipleImages from 'sysComponents/custom_components/global/PreviewMultipleImages';
    import UploadProgrammeImageDialog from '../../programme_manage/UploadProgrammeImageDialog';

    export default {
        name: 'CreateSubjectForm',
        components: {
            PreviewMultipleImages,
            UploadProgrammeImageDialog
        },
        /* status: 0代表创建节目专题，1代表创建人物专题，2代表编辑节目专题，3代表编辑人物专题 */
        props: ['status'],
        data() {
            let checkName = (rule, value, callback) => {
                if (this.$util.isEmpty(value)) {
                    return callback(new Error('专题名称不能为空'));
                } else if (this.$util.trim(value).length > 30) {
                    return callback(new Error('专题名称不能超过30字'));
                } else {
                    callback();
                }
            };
            let checkTypes = (rule, value, callback) => {
                // 对于创建或者编辑节目专题，不存在当前字段，也不校验
                if (this.status === '1' || this.status === '3') {
                    return;
                }
                if (!this.subjectInfo.types) {
                    return callback(new Error('请选择节目专题类别'));
                } else {
                    callback();
                }
            };
            let checkDescription = (rule, value, callback) => {
                if (this.$util.isEmpty(value)) {
                    return callback(new Error('专题简介不能为空'));
                } else if (this.$util.trim(value).length > 150) {
                    return callback(new Error('专题简介不能超过150字'));
                } else {
                    callback();
                }
            };
            let checkTags = (rule, value, callback) => {
                if (this.subjectInfo.tags.length === 0) {
                    return callback(new Error('请选择专题角标'));
                } else {
                    callback();
                }
            };
            let checkCoverUrls = (rule, value, callback) => {
                if (this.subjectInfo.coverUrls.length === 0) {
                    return callback(new Error('请填写上传专题的封面图片'));
                } else {
                    callback();
                }
            };
            return {
                subjectInfo: {
                    name: '',
                    types: [],
                    description: '',
                    tags: [],
                    pastPush: true,
                    coverUrls: [{
                        id: 1,
                        name: '定妆照',
                        url: 'https://tse1-mm.cn.bing.net/th?id=OIP.zn7At_hL_CSW6MsoVrzGuAHaEo&w=300&h=187&c=7&o=5&pid=1.7'
                    }, {
                        id: 2,
                        name: '发布会照片',
                        url: 'http://photocdn.sohu.com/20160107/Img433729049.jpg'
                    }, {
                        id: 3,
                        name: '通稿照片',
                        url: 'http://pic.4j4j.cn/upload/pic/20151015/465ce1d4b0.jpg'
                    }]
                },
                typeOptions: [{
                    label: '电视剧',
                    value: 1
                }, {
                    label: '电影',
                    value: 2
                }, {
                    label: '娱乐',
                    value: 3
                }],
                tagOptions: [{
                    value: '1',
                    label: '奥斯卡'
                }, {
                    value: '2',
                    label: '爱情'
                }, {
                    value: '3',
                    label: '古装'
                }, {
                    value: '4',
                    label: '年代'
                }, {
                    value: '5',
                    label: '乡村'
                }],
                previewImage: {
                    display: false,
                    autoplay: false,
                    activeIndex: 0,
                    list: []
                },
                imageUploadDialogVisible: false,
                infoRules: {
                    name: [
                        {validator: checkName, trigger: 'blur'}
                    ],
                    types: [
                        {validator: checkTypes, trigger: 'change'}
                    ],
                    description: [
                        {validator: checkDescription, trigger: 'blur'}
                    ],
                    tags: [
                        {validator: checkTags, trigger: 'change'}
                    ],
                    coverUrls: [
                        {validator: checkCoverUrls, trigger: 'change'}
                    ]
                },
                dialogVisible: false
            };
        },
        computed: {
            remainder() {
                switch (this.status) {
                    case '0':
                        return '成功创建节目专题，关闭本对话框可继续添加专题，请选择：';
                    case '1':
                        return '成功创建人物专题，关闭本对话框可继续添加专题，请选择：';
                    case '2':
                        return '成功更新节目专题，关闭本对话框可继续编辑专题，请选择：';
                    case '3':
                        return '成功更新人物专题，关闭本对话框可继续编辑专题，请选择：';
                    default:
                        break;
                }
            }
        },
        mounted() {
            this.init();
        },
        methods: {
            // 初始化数据
            init() {
                switch (this.status) {
                    // 创建节目专题，获取节目类型等数据
                    case '0':
                        break;
                    // 创建人物专题
                    case '1':
                        break;
                    // 编辑节目专题，初始化当前专题信息
                    case '2':
                        break;
                    // 编辑人物专题，初始化当前专题信息
                    case '3':
                        break;
                    default:
                        break;
                }
            },
            // 创建或更新专题
            createAdmin() {
                this.$refs['subjectInfo'].validate((valid) => {
                    if (valid) {
                        switch (this.status) {
                            // 创建节目专题
                            case '0':
                                break;
                            // 创建人物专题
                            case '1':
                                break;
                            // 更新节目专题
                            case '2':
                                break;
                            // 更新人物专题
                            case '3':
                                break;
                            default:
                                break;
                        }
                        this.dialogVisible = true;
                    } else {
                        return false;
                    }
                });
            },
            // 关闭上传图片对话框
            closeImageDialog(status) {
                this.imageUploadDialogVisible = status;
            },
            // 放大预览图片
            displayImage(index) {
                this.previewImage.display = true;
                this.previewImage.list = this.subjectInfo.coverUrls;
                this.previewImage.activeIndex = index;
            },
            reset() {
                this.$refs['subjectInfo'].resetFields();
            },
            handleClose() {
                this.dialogVisible = false;
            },
            // 添加节目或者人物
            toAppend() {
                this.$router.push({name: this.status === '0' ? 'AppendProgrammesToSubject' : 'AppendPersonsToSubject'});
            },
            // 编辑专题内的节目或者人物
            toEdit() {
                this.$router.push({name: this.status === '2' ? 'EditSubjectProgrammes' : 'EditSubjectPersons'});
            },
            toSubjectList() {
                this.$router.push({name: 'SubjectList'});
            }
        }
    };
</script>

<style lang="less" scoped>

    .block-box {
        margin-top: 50px;
    }

    .el-input, .el-textarea, .el-select {
        width: 600px;
    }

    .cover-list {
        display: flex;
        margin-top: 30px;
        justify-content: left;
        li {
            display: flex;
            margin-right: 30px;
            flex-direction: column;
            justify-content: space-between;
            height: 230px;
            &:last-child {
                justify-content: center;
                width: 180px;
                height: 180px;
                border: 1px dotted gray;
                text-align: center;
                cursor: pointer;
                &:hover {
                    border: 1px dotted #409EFF;
                    i {
                        color: #409EFF;
                    }
                }
            }
            img {
                display: block;
                height: 180px;
                cursor: zoom-in;
            }
            label {
                text-align: center;
                font-size: 16px;
            }
        }
    }

    div {
        text-align: left;
    }
</style>
