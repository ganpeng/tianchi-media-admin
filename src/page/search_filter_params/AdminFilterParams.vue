<!--管理员列表搜索参数设置组件-->
<template>
    <div class="admin-search-container">
        <div @keyup.enter="getAdminList" class="text-left filters-container">
            <el-form :inline="true" class="filter-form">
                <el-form-item>
                    <el-input
                        v-model="listQueryParams.keyword"
                        @change="getAdminList(true)"
                        clearable
                        class="border-input"
                        placeholder="请输入需要查找的信息">
                    </el-input>
                </el-form-item>
                <el-form-item>
                    <el-button
                        class="btn-style-one"
                        @click="getAdminList(false)"
                        type="primary">
                        <svg-icon icon-class="search"></svg-icon>
                        搜索
                    </el-button>
                </el-form-item>
                <el-form-item label="部门">
                    <el-select
                        v-model="listQueryParams.departmentId"
                        @change="getAdminList(true)"
                        filterable
                        clearable
                        placeholder="全部">
                        <el-option
                            v-for="item in departmentOptions"
                            :key="item.id"
                            :label="item.name"
                            :value="item.id">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="角色">
                    <el-select
                        v-model="listQueryParams.roleId"
                        @change="getAdminList(true)"
                        filterable
                        clearable
                        placeholder="全部">
                        <el-option
                            v-for="item in roleOptions"
                            :key="item.id"
                            :label="item.roleName"
                            :value="item.id">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="状态">
                    <el-select
                        v-model="listQueryParams.visible"
                        @change="getAdminList(true)"
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
        name: 'AdminFilterParams',
        data() {
            return {
                moreFilters: false,
                listQueryParams: {
                    keyword: '',
                    departmentId: '',
                    roleId: '',
                    visible: ''
                },
                departmentOptions: [],
                roleOptions: [],
                createRangeTime: [],
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
                this.$service.getDepartmentList({
                    pageNum: 1,
                    pageSize: 10000
                }).then(response => {
                    if (response && response.code === 0) {
                        this.departmentOptions = response.data.list;
                    }
                });
                this.$service.getRoleList({
                    pageNum: 1,
                    pageSize: 10000
                }).then(response => {
                    if (response && response.code === 0) {
                        this.roleOptions = response.data.list;
                    }
                });
            },
            initFilterParams(params) {
                this.listQueryParams.keyword = params.keyword ? params.keyword : '';
                this.listQueryParams.departmentId = params.departmentId ? params.departmentId : '';
                this.listQueryParams.roleId = params.roleId ? params.roleId : '';
                this.listQueryParams.visible = params.visible !== '' ? params.visible : '';
            },
            getAdminList(isReset) {
                this.$emit('getAdminList', this.listQueryParams, isReset);
            },
            clearFilters() {
                for (let key in this.listQueryParams) {
                    this.listQueryParams[key] = '';
                }
                this.getAdminList(true);
            }
        }
    };
</script>

<style lang="scss" scoped>

    .admin-search-container {
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
