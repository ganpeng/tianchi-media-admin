<!--部门表单页面-->
<template>
    <div>
        <div class="seperator-line"></div>
        <el-form
            ref="departmentInfo"
            :model="departmentInfo"
            :rules="infoRules"
            status-icon
            label-width="110px"
            class="form-block">
            <el-form-item label="部门名称" prop="name" required>
                <el-input
                    v-model="departmentInfo.name"
                    size="medium"
                    clearable
                    placeholder="请填写20个字以内的部门名称">
                </el-input>
            </el-form-item>
            <el-form-item label="负责人" prop="adminList">
                <div class="my-tags">
                    <el-tag
                        :key="index"
                        v-for="(item, index) in departmentInfo.adminList"
                        closable
                        @close="removeAdmin(item, index)"
                        :disable-transitions="false">
                        {{item.name}}
                    </el-tag>
                </div>
                <el-autocomplete
                    class="inline-input"
                    :fetch-suggestions="querySearch"
                    placeholder="请选择部门的负责人"
                    @blur="validateAdminList"
                    @select="setAdmins">
                    <template slot-scope="{ item }">
                        <div class="name">{{ item.name }}</div>
                    </template>
                    <i v-if="departmentInfo.adminList.length !== 0"
                       slot="suffix"
                       @click="removeAllAdmin"
                       class="close-btn el-select__caret el-input__icon el-icon-circle-close is-show-close"></i>
                </el-autocomplete>
            </el-form-item>
            <el-form-item label="部门描述" prop="description">
                <el-input
                    v-model="departmentInfo.description"
                    size="medium"
                    type="textarea"
                    :maxlength="600"
                    :rows="8"
                    placeholder="请填写部门描述，不超过300字">
                </el-input>
                <label class="textarea-tip">已输入{{departmentInfo.description ? departmentInfo.description.length :
                    '0'}}/600字</label>
            </el-form-item>
        </el-form>
        <div class="fixed-btn-container">
            <el-button class="btn-style-two" type="primary" @click="saveDepartmentInfo" :loading="isLoading">保存
            </el-button>
            <el-button class="btn-style-three" @click="toDepartmentList" plain>返回列表</el-button>
        </div>
    </div>
</template>

<script>
    import _ from 'lodash';

    export default {
        name: 'DepartmentForm',
        props: {
            // 创建：'CREATE_DEPARTMENT'，编辑：'EDIT_DEPARTMENT'
            status: {
                type: String,
                default: function () {
                    return 'CREATE_DEPARTMENT';
                }
            }
        },
        data() {
            let checkName = (rule, value, callback) => {
                if (this.$util.isEmpty(value)) {
                    return callback(new Error('部门名称不能为空'));
                } else if (this.$util.trim(value).length > 20) {
                    return callback(new Error('部门名称不能超过20个字'));
                } else {
                    callback();
                }
            };
            let checkDesc = (rule, value, callback) => {
                if (this.$util.isEmpty(value)) {
                    callback();
                } else if (this.$util.trim(value).length > 600) {
                    return callback(new Error('部门描述不能超过600字'));
                } else {
                    callback();
                }
            };
            let checkAdminList = (rule, value, callback) => {
                if (this.departmentInfo.adminList.length === 0) {
                    callback();
                } else {
                    callback();
                }
            };
            return {
                isLoading: false,
                departmentInfo: {
                    name: '',
                    description: '',
                    adminList: []
                },
                adminOptions: [],
                infoRules: {
                    name: [
                        {validator: checkName, trigger: 'blur'}
                    ],
                    description: [
                        {validator: checkDesc, trigger: 'blur'}
                    ],
                    adminList: [
                        {validator: checkAdminList, trigger: 'blur'}
                    ]
                }
            };
        },
        mounted() {
            this.init();
        },
        methods: {
            init() {
                this.$util.toggleFixedBtnContainer();
                this.$service.getAdminList({
                    pageNum: 1,
                    pageSize: 10000,
                    orderList: 'ID_DESC'
                }).then(response => {
                    if (response && response.code === 0) {
                        this.adminOptions = response.data.list;
                        this.adminOptions.unshift({id: '0', name: '全选'});
                    }
                });
                if (this.status === 'EDIT_DEPARTMENT') {
                    this.getDepartmentDetail();
                }
            },
            getDepartmentDetail() {
                this.$service.getDepartmentDetail(this.$route.params.id).then(response => {
                    if (response && response.code === 0) {
                        for (let key in response.data) {
                            this.departmentInfo[key] = response.data[key];
                        }
                    }
                });
            },
            validateAdminList() {
                this.$refs['departmentInfo'].validateField('adminList');
            },
            removeAllAdmin() {
                this.departmentInfo.adminList.splice(0);
                this.validateAdminList();
            },
            removeAdmin(admin, index) {
                this.departmentInfo.adminList.splice(index, 1);
                this.validateAdminList();
            },
            querySearch(queryString, cb) {
                let results = queryString ? this.adminOptions.filter(this.createFilter(queryString)) : this.adminOptions;
                cb(results);
            },
            createFilter(queryString) {
                return (adminOptions) => {
                    return (adminOptions.name.toLowerCase().indexOf(queryString.toLowerCase()) === 0);
                };
            },
            // 设置负责人，对全选进行处理
            setAdmins(item) {
                // 对全选进行处理
                if (item.name === '全选') {
                    this.departmentInfo.adminList.splice(0);
                    this.adminOptions.map(admin => {
                        if (admin.name !== '全选') {
                            this.departmentInfo.adminList.push(admin);
                        }
                    });
                } else {
                    // 对非全选进行处理
                    this.departmentInfo.adminList.push({
                        id: item.id,
                        name: item.name
                    });
                    this.departmentInfo.adminList = _.uniqBy(this.departmentInfo.adminList, 'id');
                }
                this.validateAdminList();
            },
            // 保存
            saveDepartmentInfo() {
                this.$refs['departmentInfo'].validate((valid) => {
                    if (valid) {
                        this.isLoading = true;
                        switch (this.status) {
                            case 'CREATE_DEPARTMENT':
                                this.$service.createDepartment(this.departmentInfo).then(response => {
                                    if (response && response.code === 0) {
                                        this.$message.success('成功创建部门');
                                        this.toDepartmentList();
                                    } else {
                                        this.isLoading = false;
                                    }
                                });
                                break;
                            case 'EDIT_DEPARTMENT':
                                this.$service.updateDepartmentInfo(this.departmentInfo).then(response => {
                                    if (response && response.code === 0) {
                                        this.$message.success('保存部门信息成功');
                                        this.toDepartmentList();
                                    } else {
                                        this.isLoading = false;
                                    }
                                });
                                break;
                            default:
                                break;
                        }
                    } else {
                        return false;
                    }
                });
            },
            toDepartmentList() {
                this.$router.push({name: 'DepartmentList'});
            }
        }
    }
    ;
</script>

<style lang="scss" scoped>

    .el-form {
        margin-top: 20px;
    }

    .textarea-tip {
        position: relative;
        right: 96px;
        top: 4px;
        color: #1989FA;
        font-size: 10px;
    }

    .my-tags {
        max-width: 1050px;
    }

</style>
