<template>
    <div class="container">
        <el-form :model="version" :rules="infoRules" status-icon ref="createVersion"
                label-width="100px"
                @submit.native.prevent
                class="form-block my-form">
            <el-form-item label="版本名称" prop="version">
                <el-input
                    :value="version.version"
                    :maxlength="10"
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
            <!--
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
            -->
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
                <div class="wrapper clearfix">
                    <div class="file float-left">
                        <input ref="versionUpload" type="file" accept=".zip, .apk" id="version-file-input">
                        <svg-icon icon-class="file"></svg-icon>
                        选择文件
                    </div>
                    <span class="float-left">{{file.name}}</span>
                </div>
                <el-progress
                    v-show="percent !== 0"
                    class="bar"
                    :stroke-width="3"
                    :percentage="percent"
                    :status="percent !== 100 ? 'primary' : 'success'">
                </el-progress>
                <span v-show="percent !== 0">{{percent}}%</span>
            </el-form-item>
            <el-form-item label="公共频道">
                <span>{{version.allCompanyUpdate ? '是' : '否'}}</span>
            </el-form-item>
            <el-form-item label="区域码" prop="districtCodeList" style="min-width:1050px;">
                <div class="my-tags">
                    <el-tag
                        :key="index"
                        v-for="(company, index) in version.districtCodeList"
                        closable
                        @close="deleteCompanyHandler(company)"
                        :disable-transitions="false">
                        {{company.name}}
                    </el-tag>
                </div>
                <area-code-search
                    :showDeleteBtn="version.districtCodeList.length > 0"
                    :handleSelect="selectAreaCodeHandler"
                    :clearHandler="clearCompanyListHandler"
                ></area-code-search>
            </el-form-item>
        </el-form>
    </div>
</template>
<script>
import {mapGetters, mapMutations} from 'vuex';
import role from '@/util/config/role';
import axios from 'axios';
import AreaCodeSearch from '../channel_manage/AreaCodeSearch';

export default {
    name: 'VersionForm',
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
            percent: 0,
            file: {},
            productTypeOptions: role.PRODUCT_TYPE_OPTIONS,
            forcedOptions: role.FORCED_OPTIONS,
            hardwareTypeOptions: role.HARDWARE_TYPE_OPTIONS
        };
    },
    created() {
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
            resetVersion: 'version/resetVersion',
            addCompanyToList: 'version/addCompanyToList'
        }),
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
        },
        selectAreaCodeHandler(company) {
            this.addCompanyToList({company});
            this.clearvaidatorByProp('districtCodeList');
        },
        clearvaidatorByProp(prop) {
            let _prop = _.get(this.version, prop);
            if (_prop.length > 0) {
                this.$refs.createVersion.clearValidate(prop);
            }
        },
        clearCompanyListHandler() {
            this.updateVersion({key: 'districtCodeList', value: []});
        }
    }
};
</script>
<style lang="less" scoped>
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
.bar {
    width: 80%;
    margin-right: -30px;
    display: inline-block;
}
</style>
