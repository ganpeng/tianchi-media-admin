<!--内容管理-栏目管理-广告组列表组件-->
<template>
    <div>
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>内容管理</el-breadcrumb-item>
            <el-breadcrumb-item>栏目管理</el-breadcrumb-item>
            <el-breadcrumb-item>广告组列表</el-breadcrumb-item>
        </el-breadcrumb>
        <el-row>
            <div class="block-title">广告组列表</div>
            <el-tag>
                <router-link to="/column-manage/setting/ad">添加广告</router-link>
            </el-tag>
            <el-table
                :data="adList"
                border
                style="width: 100%">
                <el-table-column
                    prop="name"
                    label="广告组名称">
                </el-table-column>
                <el-table-column
                    prop="area"
                    label="作用地区">
                </el-table-column>
                <el-table-column
                    prop="duration"
                    label="作用时间">
                </el-table-column>
                <el-table-column
                    prop="images"
                    align="center"
                    width="560px"
                    label="广告图片">
                    <template slot-scope="scope">
                        <ul class="imagesList">
                            <li v-for="(item,index) in scope.row.images" v-bind:key='index'>
                                <img :src="item">
                            </li>
                        </ul>
                    </template>
                </el-table-column>
                <el-table-column
                    label="创建日期">
                    <template slot-scope="scope">
                        {{scope.row.createdAt | formatDate('yyyy-MM-DD')}}
                    </template>
                </el-table-column>
                <el-table-column align="center"
                                 fixed="right"
                                 label="操作">
                    <template slot-scope="scope">
                        <el-button type="text" size="small" @click="editAdInfo(scope.row.id)">编辑</el-button>
                        <el-button v-if="!scope.row.default" type="text" size="small" @click="removeAd(scope.row.id)">
                            删除
                        </el-button>
                        <el-button size="mini" plain>
                            {{scope.row.status === 'NORMAL' ? '正常' : '已失效'}}
                        </el-button>
                    </template>
                </el-table-column>
            </el-table>
        </el-row>
    </div>
</template>

<script>
    export default {
        name: 'AdGroup',
        data() {
            return {
                adList: [
                    {
                        id: 1,
                        name: '一汽广告+长春地区+4月2日',
                        area: '长春',
                        duration: '4月2日',
                        images: [
                            'http://preview.quanjing.com/age_foto55/u60-1278679.jpg',
                            'http://preview.quanjing.com/age_foto55/u60-1278679.jpg'],
                        createdAt: 1402233166999,
                        status: 'NORMAL',
                        default: false
                    },
                    {
                        id: 2,
                        name: '一汽广告+长春地区+4月2日',
                        area: '长春',
                        duration: '4月2日',
                        images: [
                            'http://preview.quanjing.com/age_foto55/u60-1278679.jpg',
                            'http://preview.quanjing.com/age_foto55/u60-1278679.jpg'],
                        createdAt: 1402233166999,
                        status: 'NORMAL',
                        default: false
                    },
                    {
                        id: 3,
                        name: '一汽广告+长春地区+4月2日',
                        area: '长春',
                        duration: '4月2日',
                        images: [
                            'http://preview.quanjing.com/age_foto55/u60-1278679.jpg',
                            'http://preview.quanjing.com/age_foto55/u60-1278679.jpg',
                            'http://preview.quanjing.com/age_foto55/u60-1278679.jpg',
                            'http://preview.quanjing.com/age_foto55/u60-1278679.jpg',
                            'http://preview.quanjing.com/age_foto55/u60-1278679.jpg'],
                        createdAt: 1402233166999,
                        status: 'DISABLED',
                        default: false
                    },
                    {
                        id: 4,
                        name: '默认',
                        area: '全局',
                        duration: '全局',
                        images: ['http://preview.quanjing.com/age_foto55/u60-1278679.jpg'],
                        createdAt: 1402233166999,
                        status: 'NORMAL',
                        default: true
                    }
                ]
            };
        },
        mounted() {
            this.init();
        },
        methods: {
            init() {
            },
            // 编辑广告信息
            editAdInfo(id) {

            },
            // 删除广告信息
            removeAd(id) {
                this.$confirm('此操作将删除该广告, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    this.$message('删除成功');
                }).catch(() => {
                    this.$message('已取消删除' + id);
                });
            }
        }
    };
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="less" scoped>

    .el-row {
        text-align: left;
    }

    .el-tag {
        margin-left: 10px;
    }

    .el-table {
        text-align: left;
        margin: 20px 10px;
        .imagesList {
            display: flex;
            justify-content: left;
            li {
                margin-right: 10px;
                width: 100px;
                flex-shrink: 0;
                &:last-child {
                    margin-right: 0;
                }
                img {
                    width: 100%;
                }
            }
        }
    }
</style>
