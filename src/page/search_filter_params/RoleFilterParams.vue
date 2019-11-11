<!--角色列表搜索参数设置组件-->
<template>
    <div class="goods-search-container">
        <div @keyup.enter="getRoleList" class="text-left filters-container">
            <el-form :inline="true" class="filter-form">
                <el-form-item>
                    <el-input
                        v-model="listQueryParams.keyword"
                        @change="getRoleList(true)"
                        clearable
                        class="border-input"
                        placeholder="请输入需要查找的信息">
                    </el-input>
                </el-form-item>
                <el-form-item>
                    <el-button
                        class="btn-style-one"
                        @click="getRoleList(false)"
                        type="primary">
                        <svg-icon icon-class="search"></svg-icon>
                        搜索
                    </el-button>
                </el-form-item>
                <el-form-item label="状态">
                    <el-select
                        v-model="listQueryParams.visible"
                        @change="getRoleList(true)"
                        clearable
                        placeholder="全部">
                        <el-option
                            v-for="item in visibleOptions"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item>
                    <el-button
                        class="btn-style-one"
                        @click="clearFilters"
                        type="primary">
                        <svg-icon icon-class="reset"></svg-icon>
                        重置
                    </el-button>
                </el-form-item>
            </el-form>
        </div>
    </div>
</template>

<script>

    export default {
        name: 'RoleFilterParams',
        data() {
            return {
                listQueryParams: {
                    keyword: '',
                    visible: ''
                },
                visibleOptions: [{
                    value: true,
                    label: '已启用'
                }, {
                    value: false,
                    label: '已禁用'
                }]
            };
        },
        mounted() {
            this.init();
        },
        methods: {
            init() {
            },
            initFilterParams(params) {
                this.listQueryParams.visible = params.visible !== '' ? params.visible : '';
                this.listQueryParams.keyword = params.keyword ? params.keyword : '';
            },
            getRoleList(isReset) {
                this.$emit('getRoleList', this.listQueryParams, isReset);
            },
            clearFilters() {
                for (let key in this.listQueryParams) {
                    this.listQueryParams[key] = '';
                }
                this.getRoleList(true);
            }
        }
    };
</script>

<style lang="scss" scoped>

    .goods-search-container {
        padding-bottom: 20px;
        border-bottom: 1px solid #252D3F;
        .filters-container {
            background: #2A3040;
            border-radius: 8px;
        }
        .svg-icon {
            margin-right: 10px;
        }
    }

    // 按钮
    .more-filters {
        font-size: 12px;
        color: #6F7480;
        &.active {
            color: #1989FA;
            i {
                color: #6F7480;
            }
        }
        i {
            margin-left: 8px;
        }
    }

    .more-filter-box {
        background: #252C3D;
        border-bottom-left-radius: 8px;
        border-bottom-right-radius: 8px;
    }

</style>
