<!--内容管理-专题管理-专题列表（包含人物和节目）组件-->
<template>
    <div>
        <custom-breadcrumb
            v-bind:breadcrumbList="[
            {name:'内容管理'},
            {name:'专题管理'},
            {name:'专题列表'}]">
        </custom-breadcrumb>
        <div class="block-box">
            <subject-filter-params
                v-on:getSubjectList="getSubjectList">
            </subject-filter-params>
            <el-table
                header-row-class-name="common-table-header"
                :data="subjectList"
                border
                style="width: 100%">
                <el-table-column
                    align="center"
                    prop="code"
                    width="120px"
                    label="编号">
                </el-table-column>
                <el-table-column
                    align="center"
                    width="186px"
                    prop="name"
                    label="名称">
                </el-table-column>
                <el-table-column
                    align="center"
                    width="140px"
                    prop="itemCount"
                    label="包含节目/人物数">
                    <template slot-scope="scope">
                        <label>{{scope.row.subjectItemList === null ? 0 : scope.row.subjectItemList.length}}</label>
                    </template>
                </el-table-column>
                <el-table-column
                    align="center"
                    prop="description"
                    width="210px"
                    show-overflow-tooltip
                    label="简介">
                    <template slot-scope="scope">
                        <label>{{scope.row.description ? scope.row.description : '------'}}</label>
                    </template>
                </el-table-column>
                <el-table-column
                    align="center"
                    prop="tagList"
                    width="120px"
                    label="专题标签">
                    <template slot-scope="scope">
                        <label>{{scope.row.tagList.length === 0 ? '------' : scope.row.tagList.join(',')}}</label>
                    </template>
                </el-table-column>
                <el-table-column
                    align="center"
                    width="128px"
                    prop="authorName"
                    label="专题创建者">
                    <template slot-scope="scope">
                        <label>{{scope.row.authorName ? scope.row.authorName : '------' }}</label>
                    </template>
                </el-table-column>
                <el-table-column
                    align="center"
                    prop="category"
                    label="专题类型">
                    <template slot-scope="scope">
                        <label>{{scope.row.category === 'FIGURE'?'人物' : '节目'}}</label>
                    </template>
                </el-table-column>
                <el-table-column
                    align="center"
                    prop="programmeCategoryList"
                    label="节目专题类型">
                    <template slot-scope="scope">
                        <label v-if="scope.row.programmeCategoryList && scope.row.programmeCategoryList.length !== 0">
                            {{scope.row.programmeCategoryList | jsonJoin('name') }}</label>
                        <label v-else>------</label>
                    </template>
                </el-table-column>
                <el-table-column
                    align="center"
                    width="120px"
                    label="创建时间">
                    <template slot-scope="scope">
                        {{scope.row.createdAt | formatDate('yyyy-MM-DD')}}
                    </template>
                </el-table-column>
                <el-table-column
                    align="center"
                    label="状态">
                    <template slot-scope="scope">
                        <i class="status-normal" v-if="scope.row.visible">已上架</i>
                        <i class="status-abnormal" v-else>已下架</i>
                    </template>
                </el-table-column>
                <el-table-column align="center"
                                 label="操作"
                                 width="120px"
                                 fixed="right"
                                 class="operate">
                    <template slot-scope="scope">
                        <el-button type="text" size="small" class="detail-btn" @click="checkSubjectDetail(scope.row)">
                            查看
                        </el-button>
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
            <el-dropdown @command="createSubject" class="create-item">
                <el-button type="primary" plain icon="el-icon-circle-plus-outline">
                    创建专题<i class="el-icon-arrow-down el-icon--right"></i>
                </el-button>
                <el-dropdown-menu slot="dropdown">
                    <el-dropdown-item command="PROGRAMME">创建节目专题</el-dropdown-item>
                    <el-dropdown-item command="PERSON">创建人物专题</el-dropdown-item>
                </el-dropdown-menu>
            </el-dropdown>
        </div>
    </div>
</template>

<script>
    import SubjectFilterParams from '../searchFilterParams/SubjectFilterParams';

    export default {
        name: 'SubjectList',
        components: {
            SubjectFilterParams
        },
        data() {
            return {
                listQueryParams: {
                    pageNum: 1,
                    pageSize: 10
                },
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
            },
            getSubjectList(searchParams) {
                // 设置请求参数
                if (searchParams) {
                    for (let key in searchParams) {
                        this.listQueryParams[key] = searchParams[key];
                    }
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

<style lang="scss" scoped>

    .block-box {
        position: relative;
        padding-top: 55px;
    }

    .create-item {
        position: absolute;
        right: 0px;
        top: 10px;
    }

    .el-pagination {
        margin-bottom: 126px;
    }

</style>
