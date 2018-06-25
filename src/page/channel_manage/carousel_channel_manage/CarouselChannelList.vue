<!--内容管理-频道管理-轮播频道管理-轮播频道列表组件-->
<template>
    <div>
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>内容管理</el-breadcrumb-item>
            <el-breadcrumb-item>频道管理</el-breadcrumb-item>
            <el-breadcrumb-item>轮播频道管理</el-breadcrumb-item>
            <el-breadcrumb-item>轮播频道列表</el-breadcrumb-item>
        </el-breadcrumb>
        <div class="block-box">
            <el-form :inline="true" class="demo-form-inline search-form">
                <el-form-item label="频道类别">
                    <el-select v-model="listQueryParams.channelCategory" clearable placeholder="请选择频道类别">
                        <el-option
                            v-for="item in categoryOptions"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="频道状态">
                    <el-select v-model="listQueryParams.status" clearable placeholder="请选择频道状态">
                        <el-option
                            v-for="item in statusOptions"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="关键字">
                    <el-input v-model="listQueryParams.keyWords" placeholder="请填写频道名称或编号">
                    </el-input>
                </el-form-item>
                <el-form-item>
                    <el-button type="success" @click="getChannelList">查 询</el-button>
                </el-form-item>
            </el-form>
            <el-table
                :data="channelList"
                border
                style="width: 100%">
                <el-table-column
                    width="60px"
                    label="序号">
                    <template slot-scope="scope">
                        <label>{{scope.$index + 1}}</label>
                    </template>
                </el-table-column>
                <el-table-column
                    prop="code"
                    label="编号">
                </el-table-column>
                <el-table-column
                    prop="name"
                    label="名称">
                </el-table-column>
                <el-table-column
                    label="类别">
                    <template slot-scope="scope">
                        <label>{{scope.row.categoryList.join(',')}}</label>
                    </template>
                </el-table-column>
                <el-table-column
                    label="状态">
                    <template slot-scope="scope">
                        <label>{{scope.row.status}}</label>
                    </template>
                </el-table-column>
                <el-table-column align="center"
                                 label="操作"
                                 class="operate">
                    <template slot-scope="scope">
                        <el-button type="text" size="small" @click="checkChannelDetail(scope.row)">查看</el-button>
                        <el-button type="text" size="small" @click="editChannelInfo(scope.row)">编辑</el-button>
                    </template>
                </el-table-column>
            </el-table>
            <el-pagination
                @size-change="handleSizeChange"
                @current-change="handleCurrentChange"
                :current-page="listQueryParams.currentPage"
                :page-sizes="[10, 20, 30, 50]"
                :page-size="listQueryParams.pageSize"
                layout="total, sizes, prev, pager, next, jumper"
                :total="totalAmount">
            </el-pagination>
        </div>
    </div>
</template>

<script>
    export default {
        name: 'CarouselChannelList',
        data() {
            return {
                listQueryParams: {
                    channelCategory: '',
                    status: '',
                    keyWords: '',
                    pageNum: 1,
                    pageSize: 10
                },
                categoryOptions: [{
                    value: '1',
                    label: '电视剧'
                }, {
                    value: '2',
                    label: '电影'
                }],
                statusOptions: [{
                    value: 1,
                    label: '正常'
                }, {
                    value: 2,
                    label: '禁播'
                }],
                totalAmount: 0,
                channelList: [{
                    id: '001',
                    name: '甄嬛传',
                    code: '001',
                    status: '正常',
                    categoryList: ['电视剧', '电影']
                }]
            };
        },
        mounted() {
            this.init();
        },
        methods: {
            init() {
                this.getChannelList();
                // 初始化频道类别列表
            },
            getChannelList() {
            },
            handleSizeChange(pageSize) {
                this.listQueryParams.pageSize = pageSize;
                this.getChannelList();
            },
            handleCurrentChange(pageNum) {
                this.listQueryParams.pageNum = pageNum;
                this.getChannelList();
            },
            // 查看详情
            checkChannelDetail(item) {
                this.$router.push({
                    name: 'CarouselChannelDetail',
                    params: {id: item.id}
                });
            },
            // 编辑信息
            editChannelInfo(item) {
                this.$router.push({
                    name: 'EditCarouselChannel',
                    params: {id: item.id}
                });
            }
        }
    };
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="less" scoped>

    .block-box {
        margin-top: 50px;
    }

    .el-form {
        margin-left: 20px;
        text-align: left;
        &.search-form {
            margin-top: 60px;
        }
    }

</style>
