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
                    <el-select v-model="listQueryParams.category" clearable placeholder="请选择专题类型">
                        <el-option
                            v-for="item in categoryOptions"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value">
                        </el-option>
                    </el-select>
                </el-form-item>
                <template v-if="listQueryParams.category === 'PROGRAMME'">
                    <el-form-item label="节目类别">
                        <el-select v-model="listQueryParams.programmeCategoryIdList" multiple clearable
                                   placeholder="请选择节目类别">
                            <el-option
                                v-for="item in programmeCategoryIdListOptions"
                                :key="item.id"
                                :label="item.name"
                                :value="item.id">
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
                <el-form-item label="专题名称">
                    <el-input v-model="listQueryParams.name" placeholder="请填写专题名称">
                    </el-input>
                </el-form-item>
                <el-form-item>
                    <el-button type="success" @click="getSubjectList">查 询</el-button>
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
                :data="subjectList"
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
                    prop="itemCount"
                    label="包含节目/人物数">
                    <template slot-scope="scope">
                        <label>{{scope.row.subjectItemList === null ? 0 : scope.row.subjectItemList.length}}</label>
                    </template>
                </el-table-column>
                <el-table-column
                    prop="description"
                    label="简介">
                    <template slot-scope="scope">
                        <label class="ellipsis-three">{{scope.row.description}}</label>
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
                    prop="authorName"
                    label="专题创建者">
                    <template slot-scope="scope">
                        <label>{{scope.row.authorName ? scope.row.authorName : '------' }}</label>
                    </template>
                </el-table-column>
                <el-table-column
                    prop="category"
                    label="专题类型">
                    <template slot-scope="scope">
                        <label>{{scope.row.category === 'FIGURE'?'人物' : '节目'}}</label>
                    </template>
                </el-table-column>
                <el-table-column
                    prop="programmeCategoryList"
                    label="节目专题类型">
                    <template slot-scope="scope">
                        <label v-if="scope.row.programmeCategoryList && scope.row.programmeCategoryList.length !== 0">
                            {{scope.row.programmeCategoryList | jsonJoin('name') }}</label>
                        <label v-else>------</label>
                    </template>
                </el-table-column>
                <el-table-column
                    label="创建时间">
                    <template slot-scope="scope">
                        {{scope.row.createdAt | formatDate('yyyy-MM-DD')}}
                    </template>
                </el-table-column>
                <el-table-column
                    label="状态">
                    <template slot-scope="scope">
                        {{scope.row.visible ? '已上架' : '已下架'}}
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
        name: 'SubjectList',
        data() {
            return {
                listQueryParams: {
                    category: '',
                    programmeCategoryIdList: [],
                    createdAtBegin: '',
                    createdAtEnd: '',
                    name: '',
                    pageNum: 1,
                    pageSize: 10
                },
                createRangeTime: [],
                categoryOptions: [{
                    value: 'PROGRAMME',
                    label: '节目专题'
                }, {
                    value: 'FIGURE',
                    label: '人物专题'
                }],
                programmeCategoryIdListOptions: [],
                totalAmount: 0,
                subjectList: []
            };
        },
        mounted() {
            this.init();
        },
        methods: {
            init() {
                this.getSubjectList();
                this.$service.getProgrammeCategory().then(response => {
                    if (response && response.code === 0) {
                        this.programmeCategoryIdListOptions = response.data;
                    }
                });
            },
            getSubjectList() {
                // 设置请求参数
                if (this.createRangeTime.length === 2) {
                    this.listQueryParams.createdAtBegin = Date.parse(this.createRangeTime[0]);
                    this.listQueryParams.createdAtEnd = Date.parse(this.createRangeTime[1]);
                }
                this.$service.getSubjectList(this.listQueryParams).then(response => {
                    if (response && response.code === 0) {
                        this.subjectList = response.data.list;
                        this.totalAmount = response.data.total;
                    }
                });
            },
            handleSizeChange(pageSize) {
                this.listQueryParams.pageSize = pageSize;
                this.getSubjectList();
            },
            handleCurrentChange(pageNum) {
                this.listQueryParams.pageNum = pageNum;
                this.getSubjectList();
            },
            // 查询专题详情
            checkSubjectDetail(item) {
                this.$router.push({
                    name: item.category === 'FIGURE' ? 'PersonSubjectDetail' : 'ProgrammeSubjectDetail',
                    params: {id: item.id}
                });
            },
            // 设置专题的上下架
            setSubjectVisible(row) {
                this.$confirm('此操作将' + (row.visible ? '下架该专题' : '上架该专题') + ', 是否继续?', '提示', {
                        confirmButtonText: '确定',
                        cancelButtonText: '取消',
                        type: 'warning'
                    }
                ).then(() => {
                    this.$service.setSubjectVisible(row.id).then(response => {
                        if (response && response.code === 0) {
                            this.$message(row.visible ? '下架成功' : '上架成功');
                            row.visible = !row.visible;
                        }
                    });
                }).catch(() => {
                    this.$message({
                        type: 'info',
                        message: '已取消' + (row.visible ? '下架该专题' : '上架该专题')
                    });
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
        }
    }

    .el-table {
        .more {
            float: right;
        }
    }

</style>
