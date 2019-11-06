<!--部门列表搜索参数设置组件-->
<template>
    <div class="department-search-container">
        <div @keyup.enter="getDepartmentList" class="text-left filters-container">
            <el-form :inline="true" class="filter-form">
                <el-form-item>
                    <el-input
                        v-model="listQueryParams.keyword"
                        @change="getDepartmentList(true)"
                        clearable
                        class="border-input"
                        placeholder="请输入需要查找的信息">
                    </el-input>
                </el-form-item>
                <el-form-item>
                    <el-button
                        class="btn-style-one"
                        @click="getDepartmentList(false)"
                        type="primary">
                        <svg-icon icon-class="search"></svg-icon>
                        搜索
                    </el-button>
                </el-form-item>
                <el-form-item v-show="false">
                    <el-input
                        v-model="listQueryParams.keyword"
                        @change="getDepartmentList(true)"
                        clearable
                        class="border-input"
                        placeholder="请输入需要查找的信息">
                    </el-input>
                </el-form-item>
            </el-form>
        </div>
    </div>
</template>

<script>

    export default {
        name: 'DepartmentFilterParams',
        data() {
            return {
                listQueryParams: {
                    keyword: ''
                },
                departmentOptions: []
            };
        },
        mounted() {
            this.init();
        },
        methods: {
            init() {
                this.$service.getDepartmentList({
                    pageNum: 1,
                    pageSize: 10000
                }).then(response => {
                    if (response && response.code === 0) {
                        this.departmentOptions = response.data.list;
                    }
                });
            },
            initFilterParams(params) {
                this.listQueryParams.keyword = params.keyword ? params.keyword : '';
            },
            getDepartmentList(isReset) {
                this.$emit('getDepartmentList', this.listQueryParams, isReset);
            }
        }
    };
</script>

<style lang="scss" scoped>

    .department-search-container {
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
