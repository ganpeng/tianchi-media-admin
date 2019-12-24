<!-- 创建页面  -->
<template>
    <div class="create-version-container">
        <h2 class="content-title">新增版本</h2>
        <div class="seperator-line"></div>
        <div class="form-container">
            <el-col :span="8">
                <el-form :model="version" :rules="infoRules" status-icon ref="createVersion"
                        label-width="140px"
                        @submit.native.prevent
                        class="form-block my-form">
                    <el-form-item label="版本名称" prop="version">
                        <el-input
                            :value="version.version"
                            :maxlength="11"
                            @input="inputHandler($event, 'version')"
                            placeholder="请输入版本号，最长10个字符"
                        ></el-input>
                    </el-form-item>
                    <el-form-item label="版本号" prop="versionCode">
                        <el-input
                            :value="version.versionCode"
                            @input="inputHandler($event, 'versionCode')"
                            placeholder="请输入版本序列号, 大于0的整数"
                        ></el-input>
                    </el-form-item>
                    <el-form-item label="版本说明" prop="updateLog">
                        <el-input
                            type="textarea"
                            :maxlength="200"
                            :minlength="110"
                            :autosize="{ minRows: 4, maxRows: 12}"
                            placeholder="请输入版本说明"
                            :value="version.updateLog"
                            @input="inputHandler($event, 'updateLog')"
                        ></el-input>
                    </el-form-item>
                    <el-form-item label="升级方式" prop="forced">
                        <el-select
                            clearable
                            filterable
                            :value="version.forced"
                            placeholder="请选择升级方式"
                            @input="inputHandler($event, 'forced')"
                        >
                            <el-option
                                v-for="(item, index) in forcedOptions"
                                :key="index"
                                :label="item.name"
                                :value="item.value">
                            </el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item ref="uploadItem" label="升级包" prop="fullPackageUri">
                        <el-button class="float-left file btn-style-four">
                            <svg-icon icon-class="file"></svg-icon>
                            <input ref="versionUpload" type="file" accept=".zip, .apk" id="version-file-input">选择文件
                        </el-button>
                    </el-form-item>
                    <el-form-item class="upload-info-container">
                        <span class="uploading-info">
                            <span class="file-name">{{file.name}}</span>
                            <span class="file-percent" v-show="percent !== 0">{{percent}}%</span>
                        </span>
                    </el-form-item>
                </el-form>
            </el-col>
        </div>
        <div class="fixed-btn-container">
            <el-button class="btn-style-two" type="primary" @click="createVersionHandler">创建</el-button>
            <el-button class="btn-style-three" @click="gotoList" plain>返回列表</el-button>
        </div>
    </div>
</template>
<script>
import axios from 'axios';
import {mapGetters, mapMutations, mapActions} from 'vuex';

import role from '@/util/config/role';
import AreaCodeSearch from './AreaCodeSearch';

export default {
    name: 'CreateAppVersion',
    components: {AreaCodeSearch},
    data() {
        let checkVersionCode = (rule, value, callback) => {
            let reg = /^\+?[1-9][0-9]*$/;
            if (!reg.test(value)) {
                callback(new Error('只能输入大于0的整数'));
            }
            callback();
        };
        return {
            infoRules: {
                version: [{required: true, message: '请输入版本名称'}],
                versionCode: [
                    {required: true, message: '请输入版本号'},
                    {validator: checkVersionCode}
                ],
                updateLog: [{required: true, message: '请输入版本说明'}],
                forced: [{required: true, message: '请选择升级方式'}],
                fullPackageUri: [{required: true, message: '请上传升级包'}]
            },
            forcedOptions: role.FORCED_OPTIONS,
            percent: 0,
            file: {}
        };
    },
    mounted() {
        this.$util.toggleFixedBtnContainer();
    },
    async created() {
        try {
            this.resetVersion();
            this.getFilialeList();
            await this.$nextTick();
            let uploadInputFile = document.querySelector('#version-file-input');
            uploadInputFile.addEventListener('input', this.uploadChangeHandler);
        } catch (err) {
            console.log(err);
        }
    },
    computed: {
        ...mapGetters({
            version: 'appVersion/version'
        })
    },
    methods: {
        ...mapMutations({
            updateVersion: 'appVersion/updateVersion',
            resetVersion: 'appVersion/resetVersion',
            addCompanyToList: 'appVersion/addCompanyToList',
            deleteCompanyFromList: 'appVersion/deleteCompanyFromList',
            addBatch: 'appVersion/addBatch',
            replaceBatch: 'appVersion/replaceBatch'
        }),
        ...mapActions({
            newPostVersion: 'appVersion/newAppPostVersion',
            getFilialeList: 'appVersion/getFilialeList'
        }),
        async createVersionHandler() {
            try {
                let valid = await this.$refs.createVersion.validate();
                if (valid) {
                    let res = await this.newPostVersion();
                    if (res && res.code === 0) {
                        this.gotoList();
                        this.$message.success('保存成功');
                    }
                }
            } catch (err) {
                console.log(err);
            }
        },
        gotoList() {
            this.$router.push({name: 'AppVersionList'});
        },
        inputHandler(value, key) {
            this.updateVersion({key, value});
        },
        uploadChangeHandler(e) {
            let files = Array.from(e.target.files).filter((file) => {
                return /(.zip|.apk)$/.test(file.name);
            });
            if (files.length === 0) {
                this.$message.warning('只能上传.zip或者.apk文件');
                this.$refs.versionUpload.value = null;
                return false;
            }
            this.uploadHandler(files[0]);
            this.$refs.versionUpload.value = null;
        },
        uploadHandler(file) {
            let formData = new FormData();
            formData.append('file', file);
            this.file = file;
            this.$util.getUploadServer()
                .then((baseUri) => {
                    let url = `${baseUri}/v1/storage/file`;
                    axios.post(`${url}`, formData, {
                        headers: this.$util.getUploadHeaders(this.$store.state.user.token),
                        onUploadProgress: (progressEvent) => {
                            let percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
                            this.percent = percentCompleted;
                        }
                    }).then((res) => {
                        this.uploadSuccessHandler(res.data);
                    }).catch((err) => {
                        console.log(err);
                    });
                });
        },
        uploadSuccessHandler(res) {
            if (res && res.code === 0 && res.data[0]) {
                if (res.data[0].failCode === 0 || res.data[0].failCode === 3300) {
                    this.updateVersion({key: 'fullPackageUri', value: res.data[0].file.uri});
                    this.updateVersion({key: 'fullPackageMd5', value: res.data[0].file.key});
                    this.updateVersion({key: 'packageSize', value: res.data[0].file.size});
                    this.$refs.createVersion.clearValidate('fullPackageUri');
                    this.$message.success('文件上传成功');
                }
            } else {
                this.$message.error(res.data[0].failReason);
            }
        }
    }
};
</script>
<style lang="scss" scoped>
.upload-info-container {
    line-height: 18px;
}
.uploading-info {
    display: block;
    background: #2A3040;
    border-radius: 4px;
    padding: 4px 10px;
    font-size: 12px;
    color: #6F7480;
    .file-percent {
        margin-left: 10px;
    }
}
.moban {
    margin-left: 10px;
    color: #409EFF;
}
.file {
    position: relative;
    display: inline-block;
    background: #409EFF;
    border: 1px solid #409EFF;
    border-radius: 3px;
    font-size: 12px;
    line-height: 34px;
    padding: 0px 15px;
    overflow: hidden;
    color: #fff;
    text-decoration: none;
    text-indent: 0;
    margin-right: 10px;
}
.file input {
    position: absolute;
    font-size: 100px;
    right: 0;
    top: 0;
    width: 80px;
    height: 34px;
    opacity: 0;
    cursor: pointer;
}
</style>
