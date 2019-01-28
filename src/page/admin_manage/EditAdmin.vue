<!--编辑管理员账号组件-->
<template>
    <div class="edit-admin-container">
        <h2 class="content-title">编辑管理员</h2>
        <div class="seperator-line"></div>
        <div class="form-container">
            <el-row>
                <el-col :span="8">
                    <div class="grid-content bg-purple">
                        <el-form :model="editInfo" :rules="infoRules" status-icon ref="editInfo"
                                label-width="100px"
                                class="form-block my-form">
                            <el-form-item label="姓名" prop="name" required>
                                <el-input v-model="editInfo.name" placeholder="请填写姓名"></el-input>
                            </el-form-item>
                            <el-form-item label="邮箱" prop="email" required>
                                <el-input v-model="editInfo.email" placeholder="请填写邮箱地址"></el-input>
                            </el-form-item>
                            <el-form-item label="手机" prop="mobile" required>
                                <el-input v-model="editInfo.mobile" placeholder="请填写手机号码"></el-input>
                            </el-form-item>
                            <el-form-item label="电话" prop="telephone">
                                <el-input v-model="editInfo.telephone" placeholder="请填写电话号码"></el-input>
                            </el-form-item>
                            <el-form-item label="状态">
                                <input
                                    class="my-switch switch-anim"
                                    type="checkbox"
                                    :checked="editInfo.status === 'NORMAL'"
                                    @click.prevent="toggleAdminStatus"/>
                                <i v-if="editInfo.status === 'NORMAL'" class="on-the-shelf inline">正常</i>
                                <i v-else class="off-the-shelf inline">禁用</i>
                            </el-form-item>
                        </el-form>
                    </div>
                </el-col>
            </el-row>
        </div>
        <div class="fixed-btn-container">
            <el-button class="btn-style-two" type="primary" @click="updateAdminInfo">保存</el-button>
            <el-button class="btn-style-three" @click="toAdminList" plain>返回列表</el-button>
        </div>
    </div>
</template>
<script>
    export default {
        name: 'EditInfo',
        data() {
            let checkName = (rule, value, callback) => {
                if (this.$util.isEmpty(value)) {
                    return callback(new Error('姓名不能为空'));
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
            let checkTelephone = (rule, value, callback) => {
                if (!this.$util.isEmpty(value) && !this.$util.isTelephone(value)) {
                    return callback(new Error('请填写正确的电话号码'));
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
            return {
                isLoading: false,
                editInfo: {
                    id: '',
                    name: '',
                    telephone: '',
                    email: '',
                    mobile: '',
                    status: 'NORMAL',
                    imageUrl: ''
                },
                infoRules: {
                    name: [
                        {validator: checkName, trigger: 'blur'}
                    ],
                    email: [
                        {validator: checkEmail, trigger: 'blur'}
                    ],
                    telephone: [
                        {validator: checkTelephone, trigger: 'blur'}
                    ],
                    mobile: [
                        {validator: checkMobile, trigger: 'blur'}
                    ]
                }
            };
        },
        filters: {
            displayStatus(status) {
                if (status === 'NORMAL') {
                    return '正常';
                } else {
                    return '失效';
                }
            }
        },
        mounted() {
            this.initData();
        },
        methods: {
            initData() {
                this.$service.getAdminInfo({id: this.$route.params.id}).then(response => {
                    if (response) {
                        this.editInfo = response.data;
                    }
                });
            },
            // 更新管理员信息
            updateAdminInfo() {
                this.$refs['editInfo'].validate((valid) => {
                    if (valid) {
                        // 请求接口
                        if (!this.isLoading) {
                            this.isLoading = true;
                            this.$service.updateAdminInfo({
                                id: this.editInfo.id,
                                email: this.editInfo.email,
                                telephone: this.editInfo.telephone,
                                mobile: this.editInfo.mobile,
                                name: this.editInfo.name
                            }).then(response => {
                                this.isLoading = false;
                                if (response) {
                                    this.$message(response.data.name + '的账号更新成功');
                                    this.$router.push({name: 'AdminList'});
                                }
                            }).catch((err) => {
                                console.log(err);
                                this.isLoading = false;
                            });
                        }
                    } else {
                        return false;
                    }
                });
            },
            toAdminList() {
                this.$router.push({name: 'AdminList'});
            },
            toggleAdminStatus() {
                let status = this.editInfo.status === 'FORBIDDEN' ? 'NORMAL' : 'FORBIDDEN';
                this.editInfo.status = status;
            }
        }
    };
</script>
<style lang="less" scoped>
</style>
