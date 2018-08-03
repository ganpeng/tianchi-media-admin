<template>
    <div class="container">
        <el-form :model="version" status-icon ref="createVersion"
                label-width="100px"
                @submit.native.prevent
                class="form-block">
            <el-form-item label="版本号:" prop="version">
                <p>{{version.version}}</p>
            </el-form-item>
            <el-form-item label="版本序列号:" prop="versionCode">
                <p>{{version.versionCode}}</p>
            </el-form-item>
            <el-form-item label="版本说明:" prop="updateLog">
                <p>{{version.updateLog}}</p>
            </el-form-item>
            <el-form-item label="升级类型:" prop="productType">
                <p>{{version.productType === 'TV_LAUNCHER' ? '应用升级' : '系统升级'}}</p>
            </el-form-item>
            <el-form-item label="升级方式:">
                <p>{{version.forced ? '强制升级' : '选择升级'}}</p>
            </el-form-item>
        </el-form>
    </div>
</template>
<script>
import {mapGetters} from 'vuex';
export default {
    name: 'VersionDisplay',
    computed: {
        ...mapGetters({
            version: 'version/version'
        })
    }
};
</script>
