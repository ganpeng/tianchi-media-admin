<!--创建管理员账号组件-->
<template>
    <div class="create-admin-container">
        <h2 class="content-title">添加管理员</h2>
        <div class="seperator-line"></div>
        <div class="form-container">
            <el-row>
                <el-col :span="8">
                    <el-form :model="createInfo" :rules="infoRules" status-icon ref="createInfo"
                                label-width="100px"
                                class="form-block my-form">
                        <el-form-item label="姓名" prop="name" required>
                            <el-input v-model="createInfo.name" placeholder="请填写姓名"></el-input>
                        </el-form-item>
                        <el-form-item label="邮箱" prop="email" required>
                            <el-input v-model="createInfo.email" placeholder="请填写邮箱地址"></el-input>
                        </el-form-item>
                        <el-form-item label="电话" prop="telephone">
                            <el-input v-model="createInfo.telephone" placeholder="请填写电话号码"></el-input>
                        </el-form-item>
                        <el-form-item label="手机" prop="mobile" required>
                            <el-input v-model="createInfo.mobile" placeholder="请填写手机号码"></el-input>
                        </el-form-item>
                        <el-form-item label="状态">
                            <input
                                class="my-switch switch-anim"
                                type="checkbox"
                                :checked="createInfo.status === 'NORMAL'"
                                @click.prevent="toggleAdminStatus"/>
                            <i v-if="createInfo.status === 'NORMAL'" class="on-the-shelf inline">正常</i>
                            <i v-else class="off-the-shelf inline">禁用</i>
                        </el-form-item>
                    </el-form>
                </el-col>
            </el-row>
        </div>
        <div class="fixed-btn-container">
            <el-button class="btn-style-two" type="primary" @click="createAdmin">创建</el-button>
            <el-button class="btn-style-three" @click="goBack" plain>返回列表</el-button>
        </div>
    </div>
</template>
<script>
    export default {
        name: 'CreateAdmin',
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
                createInfo: {
                    name: '',
                    telephone: '',
                    email: '',
                    mobile: '',
                    status: 'NORMAL'
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
        methods: {
            // 创建管理员
            createAdmin() {
                this.$refs['createInfo'].validate((valid) => {
                    if (valid) {
                        // 请求接口
                        if (!this.isLoading) {
                            this.isLoading = true;
                            this.$service.createAdmin({
                                email: this.createInfo.email,
                                mobile: this.createInfo.mobile,
                                name: this.createInfo.name
                            }).then(response => {
                                this.isLoading = false;
                                if (response) {
                                    this.$message(response.data.name + '的账号创建成功');
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
            reset() {
                this.$refs['createInfo'].resetFields();
            },
            goBack() {
                this.$router.back();
            },
            toggleAdminStatus() {
                let status = this.createInfo.status === 'FORBIDDEN' ? 'NORMAL' : 'FORBIDDEN';
                this.createInfo.status = status;
            }
        }
    };
</script>
<style lang="scss" scoped>
</style>
