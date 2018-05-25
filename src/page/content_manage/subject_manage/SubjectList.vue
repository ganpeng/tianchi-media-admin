<!--内容管理-专题管理-专题列表（包含人物和节目）组件-->
<template>
    <div>
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>内容管理</el-breadcrumb-item>
            <el-breadcrumb-item>专题管理</el-breadcrumb-item>
            <el-breadcrumb-item>专题列表</el-breadcrumb-item>
        </el-breadcrumb>
        <div class="block-box">
            <el-form :inline="true" class="demo-form-inline search-form">
                <el-form-item label="专题类型">
                    <el-select v-model="typeValue" clearable placeholder="请选择专题类型">
                        <el-option
                            v-for="item in typeOptions"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value">
                        </el-option>
                    </el-select>
                </el-form-item>
                <template v-if="typeValue === '1'">
                    <el-form-item label="节目类别">
                        <el-select v-model="categoryValue" clearable placeholder="请选择节目类别">
                            <el-option
                                v-for="item in categoryOptions"
                                :key="item.value"
                                :label="item.label"
                                :value="item.value">
                            </el-option>
                        </el-select>
                    </el-form-item>
                </template>
                <el-form-item label="创建时间">
                    <el-date-picker
                        v-model="createRangeTime"
                        type="daterange"
                        range-separator="至"
                        start-placeholder="开始日期"
                        end-placeholder="结束日期">
                    </el-date-picker>
                </el-form-item>
                <el-form-item class="search">
                    <el-input v-model="searchContent" placeholder="请填写关键字">
                        <i slot="prefix" class="el-input__icon el-icon-search"></i>
                    </el-input>
                </el-form-item>
                <el-form-item>
                    <el-dropdown @command="createSubject">
                        <el-button type="primary">
                            创建专题<i class="el-icon-arrow-down el-icon--right"></i>
                        </el-button>
                        <el-dropdown-menu slot="dropdown">
                            <el-dropdown-item command="PROGRAMME">创建节目专题</el-dropdown-item>
                            <el-dropdown-item command="PERSON">创建人物专题</el-dropdown-item>
                        </el-dropdown-menu>
                    </el-dropdown>
                </el-form-item>
            </el-form>
            <el-table
                :data="programmeList"
                border
                style="width: 100%">
                <el-table-column
                    prop="code"
                    width="60px"
                    label="编号">
                </el-table-column>
                <el-table-column
                    prop="name"
                    label="名称">
                </el-table-column>
                <el-table-column
                    prop="includingCount"
                    label="包含节目/人物数">
                </el-table-column>
                <el-table-column
                    prop="description"
                    label="简介">
                    <template slot-scope="scope">
                        <label>{{scope.row.description}}</label>
                        <el-popover
                            placement="right"
                            :title="scope.row.name + '简介'"
                            width="250"
                            trigger="hover"
                            :content="scope.row.description">
                            <el-button slot="reference" type="text" class="more">更多</el-button>
                        </el-popover>
                    </template>
                </el-table-column>
                <el-table-column
                    prop="tagList"
                    label="专题标签">
                    <template slot-scope="scope">
                        <label>{{scope.row.tagList.join(',')}}</label>
                    </template>
                </el-table-column>
                <el-table-column
                    prop="owner"
                    label="专题创建者">
                </el-table-column>
                <el-table-column
                    prop="category"
                    label="专题类型">
                    <template slot-scope="scope">
                        <label>{{scope.row.category === 'FIGURE'?'人物' : '节目'}}</label>
                    </template>
                </el-table-column>
                <el-table-column
                    prop="type"
                    label="节目专题类型">
                    <template slot-scope="scope">
                        <label>{{scope.row.type ?scope.row.type : '------' }}</label>
                    </template>
                </el-table-column>
                <el-table-column
                    label="创建时间">
                    <template slot-scope="scope">
                        {{scope.row.createdAt | formatDate('yyyy-MM-DD')}}
                    </template>
                </el-table-column>
                <el-table-column align="center"
                                 label="操作"
                                 class="operate">
                    <template slot-scope="scope">
                        <el-button type="text" size="small" @click="checkSubjectDetail(scope.row)">查看</el-button>
                        <el-button type="text" size="small" @click="editBasicInfo(scope.row)">编辑基本信息</el-button>
                        <el-button type="text" size="small" @click="editSubjectContainer(scope.row)">增删内容</el-button>
                    </template>
                </el-table-column>
            </el-table>
            <el-pagination
                @size-change="handleSizeChange"
                @current-change="handleCurrentChange"
                :current-page="currentPage"
                :page-sizes="[10, 20, 30, 50]"
                :page-size="pageSize"
                layout="total, sizes, prev, pager, next, jumper"
                :total="totalAmount">
            </el-pagination>
        </div>
    </div>
</template>

<script>

    export default {
        name: 'SubjectList',
        data() {
            return {
                typeOptions: [{
                    value: '1',
                    label: '节目专题'
                }, {
                    value: '2',
                    label: '人物专题'
                }],
                typeValue: '',
                categoryOptions: [{
                    value: '1',
                    label: '电视剧'
                }, {
                    value: '2',
                    label: '电影'
                }, {
                    value: '3',
                    label: '娱乐'
                }],
                categoryValue: '',
                pastPushOptions: [{
                    value: '1',
                    label: '是'
                }, {
                    value: '2',
                    label: '否'
                }],
                pastPushValue: '',
                createRangeTime: '',
                searchContent: '',
                currentPage: 1,
                pageSize: 10,
                totalAmount: 0,
                programmeList: []
            };
        },
        mounted() {
            this.init();
        },
        methods: {
            init() {
                this.$service.getSubjectList({
                    name: '',
                    subjectCategory: '',
                    subjectType: '',
                    pageNum: 1,
                    pageSize: 10
                }).then(response => {
                    if (response && response.code === 0) {
                        this.programmeList = response.data.list;
                        this.totalAmount = this.programmeList.length;
                    }
                });
            },
            handleSizeChange(pageSize) {
                this.pageSize = pageSize;
            },
            handleCurrentChange(currentPage) {
                this.currentPage = currentPage;
            },
            // 查询专题详情
            checkSubjectDetail(item) {
                this.$router.push({
                    name: item.category === 'FIGURE' ? 'PersonSubjectDetail' : 'ProgrammeSubjectDetail',
                    params: {id: item.id}
                });
            },
            // 编辑专题基本信息
            editBasicInfo(item) {
                this.$router.push({
                    name: item.category === 'FIGURE' ? 'EditPersonSubject' : 'EditProgrammeSubject',
                    params: {id: item.id}
                });
            },
            // 编辑专题包含项
            editSubjectContainer(item) {
                this.$router.push({
                    name: item.category === 'FIGURE' ? 'EditSubjectPersons' : 'EditSubjectProgrammes',
                    params: {id: item.id}
                });
            },
            // 创建专题
            createSubject(command) {
                this.$router.push({name: command === 'PROGRAMME' ? 'CreateProgrammeSubject' : 'CreatePersonSubject'});
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
            .search {
                margin-left: 50px;
                margin-right: 30px;
            }
        }
    }

    .el-table {
        label {
            display: -webkit-box;
            -webkit-line-clamp: 3;
            -webkit-box-orient: vertical;
            overflow: hidden;
            -ms-text-overflow: ellipsis;
            text-overflow: ellipsis;
        }
        .more {
            float: right;
        }
    }

</style>
