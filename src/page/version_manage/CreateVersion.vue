<!-- 创建页面  -->
<template>
    <div class="create-version-container">
        <h2 class="content-title">新增版本</h2>
        <div class="seperator-line"></div>
        <div class="form-container">
            <el-col :span="8">
                <el-form :model="version" :rules="infoRules" status-icon ref="createVersion"
                        label-width="100px"
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
                    <el-form-item label="升级类型" prop="productType">
                        <el-select
                            clearable
                            filterable
                            :value="version.productType"
                            placeholder="请选择升级类型"
                            @input="inputHandler($event, 'productType')"
                        >
                            <el-option
                                v-for="(item, index) in productTypeOptions"
                                :key="index"
                                :label="item.name"
                                :value="item.value">
                            </el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item v-if="version.productType === 'TV_ROM_3798'" label="硬件类型" prop="hardwareType">
                        <el-select
                            clearable
                            filterable
                            :value="version.hardwareType"
                            placeholder="请选择升级类型"
                            @input="inputHandler($event, 'hardwareType')"
                        >
                            <el-option
                                v-for="(item, index) in hardwareTypeOptions"
                                :key="index"
                                :label="item.name"
                                :value="item.value">
                            </el-option>
                        </el-select>
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
                    <el-form-item ref="uploadItem" label="升级包">
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
export default {
    name: 'CreateVersion',
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
                productType: [{required: true, message: '请选择升级类型'}],
                hardwareType: [{required: true, message: '请选择硬件类型'}],
                forced: [{required: true, message: '请选择升级方式'}],
                fullPackageUri: [{required: true, message: '请上传升级包'}]
            },
            productTypeOptions: role.PRODUCT_TYPE_OPTIONS,
            forcedOptions: role.FORCED_OPTIONS,
            hardwareTypeOptions: role.HARDWARE_TYPE_OPTIONS,
            percent: 0,
            file: {}
        };
    },
    mounted() {
        this.$util.toggleFixedBtnContainer();
    },
    created() {
        this.resetVersion();
        this.$nextTick(() => {
            let uploadInputFile = document.querySelector('#version-file-input');
            uploadInputFile.addEventListener('input', this.uploadChangeHandler);
        });
    },
    computed: {
        ...mapGetters({
            version: 'version/version'
        })
    },
    methods: {
        ...mapMutations({
            updateVersion: 'version/updateVersion',
            resetVersion: 'version/resetVersion'
        }),
        ...mapActions({
            postVersion: 'version/postVersion'
        }),
        async createVersionHandler() {
            try {
                let valid = await this.$refs.createVersion.validate();
                if (valid) {
                    let res = await this.postVersion();
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
            this.$router.push({name: 'VersionList'});
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
                    this.$message({
                        type: 'success',
                        message: '文件上传成功'
                    });
                }
            } else {
                this.$message({
                    type: 'error',
                    message: res.data[0].failReason
                });
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
</style>
