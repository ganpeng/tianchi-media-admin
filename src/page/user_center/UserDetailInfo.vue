<!--用户详情组件-->
<template>
    <div class="text-left">
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item>用户中心</el-breadcrumb-item>
            <el-breadcrumb-item>用户详情</el-breadcrumb-item>
        </el-breadcrumb>
        <el-form label-width="90px"
                 class="form-block">
            <el-form-item label="姓名:" prop="name">
                <label>{{userInfo.name}}</label>
            </el-form-item>
            <el-form-item label="身份证号:" prop="identityId">
                <label>{{userInfo.identityId}}</label>
            </el-form-item>
            <el-form-item :label="'设备ID' + (index + 1) + ':'"
                          v-for="(item, index) in userInfo.stbList"
                          :key="index">
                <label>{{item.no}}</label>
            </el-form-item>
            <el-form-item label="详细地址:" prop="fullAddress">
                <label>{{userInfo.fullAddress}}</label>
            </el-form-item>
            <el-form-item label="电话:" prop="telephone">
                <label>{{userInfo.telephone}}</label>
            </el-form-item>
            <el-form-item label="手机:" prop="mobile">
                <label>{{userInfo.mobile}}</label>
            </el-form-item>
            <div class="btn-box">
                <el-button type="primary" @click="toUserList">返回列表页</el-button>
            </div>
        </el-form>
    </div>
</template>

<script>

    export default {
        name: 'UserDetailInfo',
        data() {
            return {
                userInfo: {
                    name: '',
                    identityId: '',
                    stbList: [{no: ''}],
                    province: '',
                    city: '',
                    county: '',
                    street: '',
                    address: '',
                    telephone: '',
                    mobile: '',
                    fullAddress: ''
                }
            };
        },
        mounted() {
            this.init();
        },
        methods: {
            init() {
                this.$service.getUserInfoById({id: this.$route.params.id}).then(response => {
                    if (response && response.code === 0) {
                        this.userInfo = response.data;
                    }
                });
            },
            toUserList() {
                this.$router.push({name: 'UserList'});
            }
        }
    };
</script>

<style lang="scss" scoped>

    .el-breadcrumb {
        margin-bottom: 50px;
    }

    .el-form-item {
        margin-bottom: 10px;
        &:last-child {
            margin-bottom: 40px;
        }
    }

    .btn-box {
        text-align: center;
    }

</style>
