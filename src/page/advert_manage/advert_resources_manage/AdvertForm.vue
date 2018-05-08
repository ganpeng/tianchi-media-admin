<!-- 广告表单组件 -->
<template>
    <div class="advert-form-container">
        <el-form :model="advert" status-icon ref="createAdvert"
                label-width="100px"
                class="form-block">
            <el-form-item label="素材尺寸" prop="dimension">
                <el-select
                    v-model="advert.dimension"
                    filterable
                    clearable
                    placeholder="请选择素材尺寸">
                    <el-option
                        v-for="item in dimensionOptions"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value">
                    </el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="广告资源名称" prop="name">
                <el-input v-model="advert.name" placeholder="请输入素材名称">
                </el-input>
            </el-form-item>
            <el-form-item label="上传广告资源">
                <el-button type="primary">上传<i class="el-icon-upload el-icon--right"></i></el-button>
            </el-form-item>
            <el-form-item label="大小" prop="size">
                <el-input readonly v-model="advert.size">
                </el-input>
            </el-form-item>
        </el-form>
    </div>
</template>
<script>
export default {
    name: 'AdvertForm',
    props: {
        dimensionOptions: {
            type: Array
        }
    },
    data() {
        return {
            advert: {
                dimension: '',
                name: '',
                size: '5M'
            }
        };
    }
};
</script>
<style lang="less" scoped>
</style>
