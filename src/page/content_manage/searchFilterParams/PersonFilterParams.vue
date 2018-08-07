<!--人物列表搜索参数设置组件-->
<template>
    <div @keyup.enter="getPersonList">
        <el-form :inline="true" class="search-form">
            <el-form-item class="search">
                <el-input
                    v-model="listQueryParams.name"
                    placeholder="搜索你想要的信息"
                    clearable>
                    <i slot="prefix" class="el-input__icon el-icon-search"></i>
                </el-input>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" @click="getPersonList">搜索</el-button>
            </el-form-item>
            <el-form-item label="地区">
                <el-select
                    v-model="listQueryParams.area"
                    clearable
                    placeholder="请选择地区">
                    <el-option
                        v-for="(item, index) in areaOptions"
                        :key="index"
                        :label="item.name"
                        :value="item.code">
                    </el-option>
                </el-select>
            </el-form-item>
        </el-form>
    </div>
</template>

<script>
    import store from 'store';

    export default {
        name: 'PersonFilterParams',
        data() {
            return {
                areaOptions: store.get('areaList'),
                listQueryParams: {
                    area: '',
                    name: ''
                }
            };
        },
        methods: {
            getPersonList() {
                this.$emit('getPersonList', this.listQueryParams);
            }
        }
    };
</script>

<style lang="less" scoped>
</style>
