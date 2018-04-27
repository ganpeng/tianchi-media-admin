<!--创建节目专题组件-->
<template>
    <div>
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>内容管理</el-breadcrumb-item>
            <el-breadcrumb-item>专题管理</el-breadcrumb-item>
            <el-breadcrumb-item>创建节目专题</el-breadcrumb-item>
        </el-breadcrumb>
        <div class="block-box">
            <el-form :model="subjectInfo" :rules="infoRules" status-icon ref="subjectInfo"
                     label-width="140px"
                     class="form-block">
                <el-form-item label="名称" prop="name" required>
                    <el-input v-model="subjectInfo.name" placeholder="请填写30个字以内的名称"></el-input>
                </el-form-item>
                <el-form-item label="简介" prop="description" required>
                    <el-input
                        v-model="subjectInfo.description"
                        placeholder="请填写150个字以内的简介"
                        type="textarea"
                        :rows="4"></el-input>
                </el-form-item>
                <el-form-item label="请选择角标" prop="tags" required>
                    <el-select v-model="subjectInfo.tags" multiple placeholder="请选择角标">
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
                    <el-button type="primary" @click="createAdmin">创 建</el-button>
                    <el-button @click="reset">重 置</el-button>
                </el-form-item>
            </el-form>
        </div>
        <preview-multiple-images
            :previewMultipleImages="previewImage">
        </preview-multiple-images>
        <upload-program-image-dialog
            title="节目专题封面设置"
            :imageUploadDialogVisible="imageUploadDialogVisible"
            v-on:changeImageDialogStatus="closeImageDialog($event)">
        </upload-program-image-dialog>
    </div>
</template>

<script>
    import PreviewMultipleImages from 'sysComponents/custom_components/global/PreviewMultipleImages';
    import UploadProgramImageDialog from '../../program_manage/UploadProgramImageDialog';

    export default {
        name: 'CreateProgramSubject',
        components: {
            PreviewMultipleImages,
            UploadProgramImageDialog
        },
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
                    description: [
                        {validator: checkDescription, trigger: 'blur'}
                    ],
                    tags: [
                        {validator: checkTags, trigger: 'change'}
                    ],
                    coverUrls: [
                        {validator: checkCoverUrls, trigger: 'change'}
                    ]
                }
            };
        },
        methods: {
            // 创建专题
            createAdmin() {
                this.$refs['subjectInfo'].validate((valid) => {
                    if (valid) {
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
            justify-content: space-around;
            height: 230px;
            &:last-child {
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
                font-size: 16px;
            }
        }
    }
</style>
