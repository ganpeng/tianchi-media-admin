<!--管理员详情组件-->
<template>
    <div class="admin-detail-container">
        <h2 class="content-title">管理员详情</h2>
        <div class="seperator-line"></div>
        <el-row>
            <el-col :span="12">
                <div class="vice-block" id="basic-info">
                    <el-card>
                        <ul class="text-left">
                            <li><span>姓名</span><label>{{adminInfo.name}}</label></li>
                            <li><span>邮箱</span><label>{{adminInfo.email}}</label></li>
                            <li><span>手机</span><label>{{adminInfo.mobile}}</label></li>
                            <li><span>电话</span><label>{{adminInfo.telephone}}</label></li>
                            <li><span>创建时间</span><label>{{adminInfo.createdAt | formatDate('yyyy年MM月DD日')}}</label></li>
                        </ul>
                    </el-card>
                </div>
            </el-col>
        </el-row>
        <div class="fixed-btn-container">
            <el-button class="btn-style-three" @click="goBack" plain>返回列表</el-button>
        </div>
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
                this.$service.getAdminInfo({id: this.$route.params.id}).then(response => {
                    if (response) {
                        this.adminInfo = response.data;
                    }
                });
            },
            toEdit() {
                this.$router.push({name: 'EditAdmin', params: {id: this.$route.params.id}});
            },
            goBack() {
                this.$router.push({name: 'AdminList'});
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
                        }
                    }
                }
            }
        }
    }
</style>
