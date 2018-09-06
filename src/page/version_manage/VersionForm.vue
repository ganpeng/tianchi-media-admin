<template>
    <div class="container">
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
                <el-upload
                    class="upload-demo"
                    ref="versionUpload"
                    :headers="uploadHeaders"
                    :accept="accept"
                    :action="actionUrl"
                    :auto-upload="true"
                    :file-list="fileList"
                    :on-change="uploadChangeHandler"
                    :on-success="uploadSuccessHandler"
                    :on-error="uploadErrorHandler"
                    :with-credentials="false">
                        <el-button slot="trigger" size="small" type="primary">选择文件</el-button>
                        <!-- <el-button style="margin-left: 10px;" size="small" @click="submitUpload" type="success">点击上传</el-button> -->
                </el-upload>
            </el-form-item>
        </el-form>
    </div>
</template>
<script>
import {mapGetters, mapMutations} from 'vuex';
import role from '@/util/config/role';

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
            fileList: [],
            accept: '.apk, .zip',
            actionUrl: '',
            productTypeOptions: role.PRODUCT_TYPE_OPTIONS,
            forcedOptions: role.FORCED_OPTIONS,
            hardwareTypeOptions: role.HARDWARE_TYPE_OPTIONS,
            uploadHeaders: this.$util.getUploadHeaders(this.$store.state.user.token)
        };
    },
    created() {
        this.actionUrl = this.$util.getRandomUrl('/v1/storage/file');
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
        inputHandler(value, key) {
            this.updateVersion({key, value});
        },
        uploadChangeHandler() {},
        submitUpload() {
            this.$refs.versionUpload.submit();
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
        uploadErrorHandler() {
            this.$message.error('网络异常');
        }
    }
};
</script>
