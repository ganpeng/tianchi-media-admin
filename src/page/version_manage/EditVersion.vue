<!-- 编辑版本 -->
<template>
    <div class="create-version-container">
        <h2 class="content-title">编辑版本</h2>
        <div class="seperator-line"></div>
        <div class="form-container">
            <el-form :model="version" :rules="infoRules" status-icon ref="createVersion"
                    label-width="140px"
                    @submit.native.prevent
                    class="form-block my-form">
                    <el-row>
                        <el-col :span="8">
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
                            <el-form-item label="升级依据" prop="updateAccord">
                                <el-select
                                    clearable
                                    filterable
                                    :value="version.updateAccord"
                                    placeholder="请选择升级方式"
                                    @input="inputHandler($event, 'updateAccord')"
                                >
                                    <el-option
                                        v-for="(item, index) in updateTypeOptions"
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
                            <el-form-item v-if="version.updateAccord" label="升级范围文件" prop="districtCodeList">
                                <div class="wrapper clearfix">
                                    <div class="file float-left">
                                        <input
                                            ref="districtUpload"
                                            type="file" accept="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"
                                            id="version-district-file-input">选择范围文件

                                    </div>
                                    <span class="float-left">{{districtFile.name}}</span>
                                    <span class="pointer moban" @click="exportTemplate" >模版文件</span>
                                </div>
                            </el-form-item>
                            <el-form-item v-else label="升级范围文件">
                                <div class="wrapper clearfix">
                                    <div class="file float-left">
                                        <input
                                            ref="districtUpload"
                                            type="file" accept="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"
                                            id="version-district-file-input">选择范围文件
                                    </div>
                                    <span class="float-left">{{districtFile.name}}</span>
                                    <span class="pointer moban" @click="exportTemplate" >模版文件</span>
                                </div>
                            </el-form-item>
                        </el-col>
                    </el-row>
                <el-row>
                    <el-form-item>
                        <el-table
                            header-row-class-name="common-table-header"
                            style="width: 500px;"
                            class="my-table-style" :data="version.batchList || []" border>
                            <el-table-column align="center" width="120px" label="升级日期">
                                <template slot-scope="scope">
                                    {{scope.row.createdAt  | formatDate('yyyy-MM-DD')}}
                                </template>
                            </el-table-column>
                            <el-table-column label="升级依据" width="120px" align="center">
                                <template slot-scope="scope">
                                    {{scope.row.haha || version.updateAccord}}
                                </template>
                            </el-table-column>
                            <el-table-column align="center" width="120px" label="状态">
                                <template slot-scope="scope">
                                    {{releaseStatus(scope.row.releaseStatus)}}
                                </template>
                            </el-table-column>
                            <el-table-column align="center" label="操作">
                                <template slot-scope="scope">
                                    <div class="operator-btn-wrapper">
                                        <span class="btn-text text-primary" @click="downloadBatchFile(scope.row)">下载</span>
                                    </div>
                                </template>
                            </el-table-column>
                        </el-table>
                    </el-form-item>
                </el-row>
            </el-form>
        </div>
        <div class="fixed-btn-container">
            <el-button class="btn-style-two" type="primary" @click="editVersionHandler">编辑</el-button>
            <el-button class="btn-style-three" @click="gotoList" plain>返回列表</el-button>
        </div>
    </div>
</template>
<script>
import axios from 'axios';
import _ from 'lodash';
import XLSX from 'xlsx';
import {mapGetters, mapMutations, mapActions} from 'vuex';

import role from '@/util/config/role';
import AreaCodeSearch from './AreaCodeSearch';

export default {
    name: 'EditVersion',
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
                productType: [{required: true, message: '请选择升级类型'}],
                hardwareType: [{required: true, message: '请选择硬件类型'}],
                forced: [{required: true, message: '请选择升级方式'}],
                fullPackageUri: [{required: true, message: '请上传升级包'}],
                districtCodeList: [ { required: true, message: '请选择所属区域' } ]
            },
            productTypeOptions: role.PRODUCT_TYPE_OPTIONS,
            forcedOptions: role.FORCED_OPTIONS,
            hardwareTypeOptions: role.HARDWARE_TYPE_OPTIONS,
            percent: 0,
            file: {},
            //  dev_v2.5 新增逻辑
            districtFile: {},
            updateTypeOptions: [
                {
                    name: 'CA号',
                    value: 'CA'
                },
                {
                    name: 'SN号',
                    value: 'SN'
                }
            ]
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

            //  获取版本信息
            let {id} = this.$route.params;
            if (id) {
                await this.getVersionById(id);
            }

            let uploadInputFile = document.querySelector('#version-file-input');
            let districtUploadInputFile = document.querySelector('#version-district-file-input');
            uploadInputFile.addEventListener('input', this.uploadChangeHandler);
            districtUploadInputFile.addEventListener('input', this.districtUploadHandler);
        } catch (err) {
            console.log(err);
        }
    },
    computed: {
        ...mapGetters({
            version: 'version/version'
        }),
        releaseStatus() {
            return (status) => {
                switch (status) {
                    case 'PRE_RELEASED':
                        return '未发布';
                    case 'RELEASED':
                        return '已发布';
                    case 'WITHDRAW':
                        return '已撤回';
                    default:
                        return '';
                }
            };
        }
    },
    methods: {
        ...mapMutations({
            updateVersion: 'version/updateVersion',
            resetVersion: 'version/resetVersion',
            addCompanyToList: 'version/addCompanyToList',
            deleteCompanyFromList: 'version/deleteCompanyFromList',
            addBatch: 'version/addBatch',
            replaceBatch: 'version/replaceBatch'
        }),
        ...mapActions({
            getFilialeList: 'version/getFilialeList',
            getVersionById: 'version/getVersionById',
            editVersionById: 'version/editVersionById'
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
                    this.updateVersion({key: 'packageSize', value: res.data[0].file.size});
                    this.$refs.createVersion.clearValidate('fullPackageUri');
                    this.$message.success('文件上传成功');
                }
            } else {
                this.$message.error(res.data[0].failReason);
            }
        },
        selectAreaCodeHandler(company) {
            this.addCompanyToList({company});
            this.clearvaidatorByProp('districtCodeList');
        },
        deleteCompanyHandler(company) {
            this.deleteCompanyFromList({company});
        },
        clearvaidatorByProp(prop) {
            let _prop = _.get(this.version, prop);
            if (_prop.length > 0) {
                this.$refs.createVersion.clearValidate(prop);
            }
        },
        clearCompanyListHandler() {
            this.updateVersion({key: 'districtCodeList', value: []});
        },
        // dev_v2.5 新增逻辑
        async districtUploadHandler(e) {
            try {
                let file = e.target.files[0];
                let workbook = await this.readWorkbookFromLocalFile(file);
                let sheetNames = workbook.SheetNames; // 工作表名称集合
                let worksheet = workbook.Sheets[sheetNames[0]]; // 这里我们只读取第一张sheet
                let resJson = XLSX.utils.sheet_to_json(worksheet);
                this.districtFile = file;
                let codeList = resJson.map((item) => item.value);
                this.addBatch({codeList});
            } catch (err) {
                console.log(err);
            }
        },
        readWorkbookFromLocalFile(file) {
            return new Promise((resolve) => {
                let reader = new FileReader();
                reader.onload = function(e) {
                    let data = e.target.result;
                    let workbook = XLSX.read(data, {type: 'binary'});
                    resolve(workbook);
                };
                reader.readAsBinaryString(file);
            });
        },
        exportTemplate() {
            let wb = XLSX.utils.book_new();
            let newWsName = '表1';
            let wsData = [
                {
                    no: '1',
                    value: '8512010000123458',
                    说明: 'B2 单元格填写 0 为全部 value'
                }, {
                    no: '2',
                    value: '8512010000123458',
                    说明: 'B2 单元格未填写则在导入时报错“value 不存在，无法导入”'
                }, {
                    no: '3',
                    value: '8512010000123458',
                    说明: 'value 可以为 CA卡号和 SN（设备序列号）的任何一种，但不能两个都有'
                }];
            let ws = XLSX.utils.json_to_sheet(wsData);
            XLSX.utils.book_append_sheet(wb, ws, newWsName);
            XLSX.writeFile(wb, '范围文件模版.xlsx');
        },
        async editVersionHandler() {
            try {
                let {id} = this.$route.params;
                if (id) {
                    let res = await this.editVersionById(id);
                    if (res && res.code === 0) {
                        this.gotoList();
                    }
                }
            } catch (err) {
                console.log(err);
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
