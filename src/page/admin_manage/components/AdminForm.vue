<!--管理员表单页面-->
<template>
    <div>
        <div class="seperator-line"></div>
        <el-form
            ref="adminInfo"
            :model="adminInfo"
            :rules="infoRules"
            status-icon
            label-width="110px"
            class="form-block">
            <el-form-item label="姓名" prop="name">
                <el-input
                    v-model="adminInfo.name"
                    size="medium"
                    clearable
                    placeholder="请填写20个字以内的姓名">
                </el-input>
            </el-form-item>
            <el-form-item label="邮箱" prop="email">
                <el-input
                    v-model="adminInfo.email"
                    size="medium"
                    clearable
                    placeholder="请填写60个字以内的邮箱">
                </el-input>
            </el-form-item>
            <el-form-item label="手机" prop="mobile">
                <el-input
                    v-model="adminInfo.mobile"
                    size="medium"
                    clearable
                    placeholder="请填写手机号">
                </el-input>
            </el-form-item>
            <!-- <el-form-item label="部门" prop="departmentList"> -->
            <el-form-item label="部门" prop="department">
                <div class="my-tags">
                    <el-tag
                        :key="index"
                        v-for="(item, index) in adminInfo.departmentList"
                        closable
                        @close="removeDepartment(item, index)"
                        :disable-transitions="false">
                        {{item.name}}
                    </el-tag>
                </div>
                <el-autocomplete
                    class="inline-input"
                    :fetch-suggestions="querySearch"
                    placeholder="请选择部门"
                    @blur="validateDepartmentList"
                    @select="setDepartments">
                    <template slot-scope="{ item }">
                        <div class="name">{{ item.name }}</div>
                    </template>
                    <i v-if="adminInfo.departmentList.length !== 0"
                       slot="suffix"
                       @click="removeAllDepartment"
                       class="close-btn el-select__caret el-input__icon el-icon-circle-close is-show-close"></i>
                </el-autocomplete>
            </el-form-item>
            <el-form-item label="角色" prop="roleId">
                <el-select
                    v-model="adminInfo.roleId"
                    clearable
                    size="medium"
                    placeholder="请选择角色">
                    <el-option
                        v-for="item in roleOptions"
                        :key="item.id"
                        :label="item.roleName"
                        :value="item.id">
                    </el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="备注" prop="remark">
                <el-input
                    v-model="adminInfo.remark"
                    size="medium"
                    type="textarea"
                    :maxlength="600"
                    :rows="8"
                    placeholder="请填写管理员描述，不超过600字">
                </el-input>
                <label class="textarea-tip">已输入{{adminInfo.remark ? adminInfo.remark.length :
                    '0'}}/600字</label>
            </el-form-item>
        </el-form>
        <div class="fixed-btn-container">
            <el-button class="btn-style-two" type="primary" @click="saveAdminInfo" :loading="isLoading">保存</el-button>
            <el-button class="btn-style-three" @click="toAdminList" plain>返回列表</el-button>
        </div>
    </div>
</template>

<script>
    import _ from 'lodash';

    export default {
        name: 'AdminForm',
        props: {
            // 创建：'CREATE_ADMIN'，编辑：'EDIT_ADMIN'
            status: {
                type: String,
                default: function () {
                    return 'CREATE_ADMIN';
                }
            }
        },
        data() {
            let checkName = (rule, value, callback) => {
                if (this.$util.isEmpty(value)) {
                    return callback(new Error('管理员姓名不能为空'));
                } else if (this.$util.trim(value).length > 20) {
                    return callback(new Error('管理员姓名不能超过20个字'));
                } else {
                    callback();
                }
            };
            let checkEmail = (rule, value, callback) => {
                if (this.$util.isEmpty(value)) {
                    return callback(new Error('邮箱地址不能为空'));
                } else if (!this.$util.isEmail(value)) {
                    return callback(new Error('请填写正确的邮箱地址'));
                } else {
                    callback();
                }
            };
            let checkMobile = (rule, value, callback) => {
                if (this.$util.isEmpty(value)) {
                    return callback(new Error('手机号码不能为空'));
                } else if (!this.$util.isMobile(value)) {
                    return callback(new Error('请填写正确的手机号码'));
                } else {
                    callback();
                }
            };
            let checkDepartment = (rule, value, callback) => {
                if (this.adminInfo.departmentList.length === 0) {
                    return callback(new Error('请选择部门'));
                } else {
                    callback();
                }
            };
            let checkRoleId = (rule, value, callback) => {
                if (this.$util.isEmpty(value)) {
                    return callback(new Error('请选择角色'));
                } else {
                    callback();
                }
            };
            let checkRemark = (rule, value, callback) => {
                if (this.$util.isEmpty(value)) {
                    callback();
                } else if (this.$util.trim(value).length > 600) {
                    return callback(new Error('管理员描述不能超过600字'));
                } else {
                    callback();
                }
            };
            return {
                isLoading: false,
                adminInfo: {
                    name: '',
                    email: '',
                    mobile: '',
                    department: '',
                    departmentList: [],
                    roleList: [],
                    roleId: '',
                    remark: ''
                },
                departmentOptions: [],
                roleOptions: [],
                infoRules: {
                    name: [
                        {validator: checkName, trigger: 'blur'}
                    ],
                    email: [
                        {validator: checkEmail, trigger: 'blur'}
                    ],
                    mobile: [
                        {validator: checkMobile, trigger: 'blur'}
                    ],
                    department: [
                        {validator: checkDepartment, trigger: 'change'}
                    ],
                    roleId: [
                        {validator: checkRoleId, trigger: 'change'}
                    ],
                    remark: [
                        {validator: checkRemark, trigger: 'blur'}
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
                if (this.status === 'EDIT_ADMIN') {
                    this.getAdminDetail();
                }
            },
            getAdminDetail() {
                this.$service.getAdminInfo({id: this.$route.params.id}).then(response => {
                    if (response && response.code === 0) {
                        for (let key in response.data) {
                            this.adminInfo[key] = response.data[key];
                        }
                        this.adminInfo.roleId = this.adminInfo.roleList[0].id;
                    }
                });
            },
            validateDepartmentList() {
                this.$refs['adminInfo'].validateField('department');
            },
            removeAllDepartment() {
                this.adminInfo.departmentList.splice(0);
                this.validateDepartmentList();
            },
            removeDepartment(department, index) {
                this.adminInfo.departmentList.splice(index, 1);
                this.validateDepartmentList();
            },
            querySearch(queryString, cb) {
                let results = queryString ? this.departmentOptions.filter(this.createFilter(queryString)) : this.departmentOptions;
                cb(results);
            },
            createFilter(queryString) {
                return (departmentOptions) => {
                    return (departmentOptions.name.toLowerCase().indexOf(queryString.toLowerCase()) === 0);
                };
            },
            // 设置频道，对全选进行处理
            setDepartments(item) {
                this.adminInfo.departmentList.push({
                    id: item.id,
                    name: item.name
                });
                this.adminInfo.departmentList = _.uniqBy(this.adminInfo.departmentList, 'id');
                this.validateDepartmentList();
            },
            // 保存
            saveAdminInfo() {
                this.$refs['adminInfo'].validate((valid) => {
                    if (valid) {
                        this.isLoading = true;
                        this.adminInfo.roleList = [{id: this.adminInfo.roleId}];
                        switch (this.status) {
                            case 'CREATE_ADMIN':
                                this.$service.createAdmin(this.adminInfo).then(response => {
                                    if (response && response.code === 0) {
                                        this.$message.success('成功创建管理员');
                                        this.toAdminList();
                                    } else {
                                        this.isLoading = false;
                                    }
                                });
                                break;
                            case 'EDIT_ADMIN':
                                this.$service.updateAdminInfo(this.adminInfo).then(response => {
                                    if (response && response.code === 0) {
                                        this.$message.success('保存管理员信息成功');
                                        this.toAdminList();
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
            toAdminList() {
                this.$router.push({name: 'AdminList'});
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
