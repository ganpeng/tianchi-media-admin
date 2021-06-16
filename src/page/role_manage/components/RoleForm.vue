<!--角色表单页面-->
<template>
    <div id="role-page-container">
        <div class="seperator-line"></div>
        <el-form
            ref="roleInfo"
            :model="roleInfo"
            :rules="infoRules"
            status-icon
            label-width="110px"
            class="form-block">
            <el-form-item label="角色名称" prop="roleName" required>
                <el-input
                    v-model="roleInfo.roleName"
                    size="medium"
                    clearable
                    placeholder="请填写20个字以内的角色名称">
                </el-input>
            </el-form-item>
            <el-form-item label="角色描述" prop="roleDesc">
                <el-input
                    v-model="roleInfo.roleDesc"
                    size="medium"
                    type="textarea"
                    :maxlength="600"
                    :rows="8"
                    placeholder="请填写角色描述，不超过600字">
                </el-input>
                <label class="textarea-tip">已输入{{roleInfo.roleDesc ? roleInfo.roleDesc.length :
                    '0'}}/600字</label>
            </el-form-item>
            <el-form-item label="状态" prop="visible" required>
                <el-radio-group v-model="roleInfo.visible">
                    <el-radio :label="true">上架</el-radio>
                    <el-radio :label="false">下架</el-radio>
                </el-radio-group>
            </el-form-item>
            <el-form-item label="权限" prop="resourceList">
                <el-tree
                    :data="data"
                    show-checkbox
                    default-expand-all
                    node-key="id"
                    ref="authorityTree"
                    highlight-current
                    :props="defaultProps">
                </el-tree>
            </el-form-item>
        </el-form>
        <div class="fixed-btn-container">
            <el-button class="btn-style-two" type="primary" @click="saveRoleInfo" :loading="isLoading">保存</el-button>
            <el-button class="btn-style-three" @click="toRoleList" plain>返回列表</el-button>
        </div>
    </div>
</template>

<script>
    export default {
        name: 'RoleForm',
        props: {
            // 创建：'CREATE_ROLE'，编辑：'EDIT_ROLE'
            status: {
                type: String,
                default: function () {
                    return 'CREATE_ROLE';
                }
            }
        },
        data() {
            let checkName = (rule, value, callback) => {
                if (this.$util.isEmpty(value)) {
                    return callback(new Error('角色名称不能为空'));
                } else if (this.$util.trim(value).length > 20) {
                    return callback(new Error('角色名称不能超过20个字'));
                } else {
                    callback();
                }
            };
            let checkDesc = (rule, value, callback) => {
                if (this.$util.isEmpty(value)) {
                    callback();
                } else if (this.$util.trim(value).length > 600) {
                    return callback(new Error('角色描述不能超过600字'));
                } else {
                    callback();
                }
            };
            let checkVisible = (rule, value, callback) => {
                if (value === '' || value === undefined) {
                    return callback(new Error('请选择角色状态'));
                } else {
                    callback();
                }
            };
            let checkResourceList = (rule, value, callback) => {
                if (this.$refs.authorityTree.getCheckedKeys().length === 0) {
                    return callback(new Error('请选择角色权限'));
                } else {
                    callback();
                }
            };
            return {
                data: [],
                defaultProps: {
                    children: 'children',
                    label: 'label'
                },
                isLoading: false,
                roleInfo: {
                    roleName: '',
                    roleDesc: '',
                    resourceList: [],
                    visible: false
                },
                infoRules: {
                    roleName: [
                        {validator: checkName, trigger: 'blur'}
                    ],
                    roleDesc: [
                        {validator: checkDesc, trigger: 'blur'}
                    ],
                    resourceList: [
                        {validator: checkResourceList, trigger: 'change'}
                    ],
                    visible: [
                        {validator: checkVisible, trigger: 'blur'}
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
                this.$service.getAuthorityTree().then(response => {
                    if (response && response.code === 0) {
                        this.data = response.data.map((item) => {
                            item.label = `${item.label} (全选)`;
                            return item;
                        });
                    }
                });
                if (this.status === 'EDIT_ROLE') {
                    this.getRoleDetail();
                }
            },
            getRoleDetail() {
                this.$service.getRoleDetail(this.$route.params.id).then(response => {
                    if (response && response.code === 0) {
                        for (let key in response.data) {
                            this.roleInfo[key] = response.data[key];
                        }
                        let idList = [];
                        this.roleInfo.resourceList.map(role => {
                            idList.push(role.id);
                        });
                        this.$nextTick(function () {
                            this.$refs.authorityTree.setCheckedKeys(idList);
                        });
                    }
                });
            },
            // 保存
            saveRoleInfo() {
                this.$refs['roleInfo'].validate((valid) => {
                    if (valid) {
                        // 编辑权限列表
                        let idList = this.$refs.authorityTree.getCheckedKeys();
                        this.roleInfo.resourceList = [];
                        idList.map(id => {
                            if (id) {
                                this.roleInfo.resourceList.push({id: id});
                            }
                        });
                        this.isLoading = true;
                        switch (this.status) {
                            case 'CREATE_ROLE':
                                this.$service.createRole(this.roleInfo).then(response => {
                                    if (response && response.code === 0) {
                                        this.$message.success('成功创建角色');
                                        this.toRoleList();
                                    } else {
                                        this.isLoading = false;
                                    }
                                });
                                break;
                            case 'EDIT_ROLE':
                                this.$service.updateRoleInfo(this.roleInfo).then(response => {
                                    if (response && response.code === 0) {
                                        this.$message.success('保存角色信息成功');
                                        this.toRoleList();
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
            toRoleList() {
                this.$router.push({name: 'RoleList'});
            }
        }
    };
</script>

<style lang="scss">

    #role-page-container {
        .el-tree-node {
            margin-bottom: 10px;
            &.is-checked {
                .el-tree-node__label {
                    color: #fff;
                }
            }
        }
        .el-tree-node__content {
            background-color: transparent !important;
            &:hover {
                background-color: transparent !important;
            }
        }
        .el-tree {
            >.el-tree-node {
                border-bottom: 1px solid #252D3F;
                >.el-tree-node__children {
                    display: flex;
                    flex-wrap: wrap;
                    >.el-tree-node {
                        width: 16%;
                    }
                }
            }
        }
    }

</style>

<style lang="scss" scoped>

    .el-tree {
        background: transparent;
    }

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
