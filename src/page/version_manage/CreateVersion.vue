<!-- 创建页面  -->
<template>
    <div class="create-version-container">
        <h2 class="content-title">添加设备</h2>
        <div class="seperator-line"></div>
        <div class="form-container">
            <el-col :span="8">
                <el-form :model="version" :rules="infoRules" status-icon ref="createVersion"
                        label-width="100px"
                        @submit.native.prevent
                        class="form-block">
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
                        <!--
                        <div class="wrapper clearfix">
                            <div class="file float-left">
                                <input ref="versionUpload" type="file" accept=".zip, .apk" id="version-file-input">选择文件
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
                        -->
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
import {mapGetters, mapMutations, mapActions} from 'vuex';
import role from '@/util/config/role';
export default {
    name: 'CreateDevice',
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
            hardwareTypeOptions: role.HARDWARE_TYPE_OPTIONS
        };
    },
    created() {
        this.resetVersion();
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
        }
    }
};
</script>
<style lang="scss" scoped>
</style>
