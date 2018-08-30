<!--管理员详情组件-->
<template>
    <div>
        <custom-breadcrumb
            v-bind:breadcrumbList="[
            {name:'管理员管理'},
            {name:'管理员列表-详情'}]">
        </custom-breadcrumb>
        <el-row>
            <el-col :span="12">
                <div class="vice-block" id="basic-info">
                    <h3 class="block-vice-title">管理员基本信息</h3>
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
            <el-col :span="12">
                <div class="vice-block" id="basic-info">
                    <h3 class="block-vice-title">管理员头像</h3>
                    <img src="adminInfo.imageUrl">
                </div>
            </el-col>
        </el-row>
        <el-button class="page-main-btn bak-btn page-margin-btn" @click="goBack" plain>返回人物列表</el-button>
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

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
    img {
        display: block;
        // margin: 96px auto 20px auto;
        width: 178px;
        height: 178px;
    }
    .bak-btn {
        position: absolute;
        bottom: 164px;
    }

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
