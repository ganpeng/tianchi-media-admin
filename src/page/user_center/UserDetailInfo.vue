<!--用户详情组件-->
<template>
    <div>
        <custom-breadcrumb
            v-bind:breadcrumbList="[
            {name:'用户管理'},
            {name:'用户详情'}]">
        </custom-breadcrumb>
        <div class="vice-block" id="basic-info">
            <h3 class="block-vice-title">专题基本信息</h3>
            <el-card>
                <ul class="text-left">
                    <li><span>用户姓名</span><label>{{userInfo.name}}</label></li>
                    <li><span>身份证号</span><label>{{userInfo.identityId}}</label></li>
                    <li>
                        <span>设备ID</span>
                        <label>
                            <el-tag v-for="(item, index) in userInfo.stbList"
                                    :key="index"
                                    type="info">
                                {{item.no}}
                            </el-tag>
                        </label>
                    </li>
                    <li><span>详细地址</span><label>{{userInfo.fullAddress}}</label></li>
                    <li><span>手机号码</span><label>{{userInfo.mobile}}</label></li>
                    <li><span>电话号码</span><label>{{userInfo.telephone}}</label></li>
                </ul>
            </el-card>
        </div>
        <div class="operate-item">
            <el-button type="primary" @click="toEdit" class="page-main-btn">编辑</el-button>
            <el-button @click="toUserList" class="page-main-btn">返回列表页</el-button>
        </div>
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
            toEdit() {
                this.$router.push({
                        name: 'EditUserInfo',
                        params: {
                            id: this.$route.params.id
                        }
                    }
                );
            },
            toUserList() {
                this.$router.push({name: 'UserList'});
            }
        }
    };
</script>

<style lang="scss" scoped>

    #basic-info {
        .el-card {
            width: 600px;
            ul {
                li {
                    display: flex;
                    margin-bottom: 10px;
                    min-height: 32px;
                    flex-direction: row;
                    justify-content: left;
                    align-items: center;
                    > span {
                        width: 120px;
                        flex-shrink: 0;
                        text-align: center;
                        font-size: $largerFontSize;
                        color: $baseGray;
                    }
                    label {
                        width: 380px;
                        font-size: $normalFontSize;
                        color: #909399;
                        flex-shrink: 0;
                        line-height: 2;
                        .el-tag {
                            margin-right: 10px;
                            border: none;
                        }
                    }
                }
            }
        }
    }

    .operate-item {
        margin: 120px 0px 80px 0px;
    }

</style>
