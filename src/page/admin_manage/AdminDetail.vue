<!--管理员详情组件-->
<template>
    <div>
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>管理员管理</el-breadcrumb-item>
            <el-breadcrumb-item :to="{ path: '/admin-manage/list' }">管理员列表</el-breadcrumb-item>
            <el-breadcrumb-item>管理员详情</el-breadcrumb-item>
        </el-breadcrumb>
        <el-row>
            <el-col :span="8">
                <div class="block-title">管理员信息
                    <el-tag size="mini">{{adminInfo.status | displayStatus}}</el-tag>
                </div>
                <div class="grid-content bg-purple">
                    <el-form :model="adminInfo" ref="adminInfo"
                             label-width="100px">
                        <el-form-item label="姓名">
                            <el-input v-model="adminInfo.name" readonly></el-input>
                        </el-form-item>
                        <el-form-item label="邮箱">
                            <el-input v-model="adminInfo.email" readonly></el-input>
                        </el-form-item>
                        <el-form-item label="手机">
                            <el-input v-model="adminInfo.mobile" readonly></el-input>
                        </el-form-item>
                        <el-form-item label="电话">
                            <el-input v-model="adminInfo.telephone" readonly></el-input>
                        </el-form-item>
                        <el-form-item class="tips">
                            <label class="tips">此账号创建于{{adminInfo.createdAt | formatDate('yyyy年MM月DD日')}}</label>
                        </el-form-item>
                        <el-form-item>
                            <el-button type="primary" @click="toEdit">编辑信息</el-button>
                        </el-form-item>
                    </el-form>
                </div>
            </el-col>
            <el-col :span="16">
                <div class="avatar">
                    <img src="adminInfo.imageUrl">
                    <label>用户头像</label>
                </div>
            </el-col>
        </el-row>
    </div>
</template>

<script>

    export default {
        name: 'AdminDetail',
        data() {
            return {
                adminInfo: {
                    name: '',
                    email: '',
                    mobile: '',
                    telephone: '',
                    createdAt: '',
                    status: 'NORMAL',
                    imageUrl: ''
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
            this.initInfo();
        },
        methods: {
            initInfo() {
                this.$axios.get(this.$util.format('/v1/admin/{0}', this.$route.params.id)).then(response => {
                    if (response) {
                        this.adminInfo = response.data;
                    }
                });
            },
            toEdit() {
                this.$router.push({name: 'EditAdmin', params: {id: this.$route.params.id}});
            }
        }
    };
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="less" scoped>

    .tips {
        text-align: left;
    }

    img {
        display: block;
        margin: 96px auto 20px auto;
        width: 178px;
        height: 178px;
    }
</style>
