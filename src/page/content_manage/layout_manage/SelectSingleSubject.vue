<!--内容管理-栏目管理-选择单个专题组件-->
<template>
    <div>
        <el-form :inline="true" class="demo-form-inline search-form">
            <el-form-item label="专题类型">
                <el-select v-model="listQueryParams.subjectCategory" clearable placeholder="请选择专题类型">
                    <el-option
                        v-for="item in categoryOptions"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value">
                    </el-option>
                </el-select>
            </el-form-item>
            <template v-if="listQueryParams.subjectCategory === 'PROGRAMME'">
                <el-form-item label="节目类别">
                    <el-select v-model="listQueryParams.subjectType" clearable placeholder="请选择节目类别">
                        <el-option
                            v-for="item in typeListOptions"
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
        </el-form>
        <el-table
            :data="subjectList"
            border
            ref="singleSubject"
            highlight-current-row
            @current-change="setSubject"
            style="width: 100%">
            <el-table-column
                prop="code"
                width="60px"
                label="编号">
                <template slot-scope="scope">
                    <i class="el-icon-success"></i>
                    <label>{{scope.row.code}}</label>
                </template>
            </el-table-column>
            <el-table-column
                prop="name"
                label="名称">
            </el-table-column>
            <el-table-column
                label="包含节目/人物数">
                <template slot-scope="scope">
                    <label>{{scope.row.subjectItemList === null ? 0 : scope.row.subjectItemList.length}}</label>
                </template>
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
                </template>
            </el-table-column>
        </el-table>
        <el-pagination
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page="listQueryParams.pageNum"
            :page-sizes="[10, 20, 30, 50]"
            :page-size="listQueryParams.pageSize"
            layout="total, sizes, prev, pager, next, jumper"
            :total="totalAmount">
        </el-pagination>
    </div>
</template>

<script>
    export default {
        name: 'SelectSingleSubject',
        data() {
            return {
                listQueryParams: {
                    subjectCategory: '',
                    subjectType: '',
                    name: '',
                    pageNum: 1,
                    pageSize: 10
                },
                createRangeTime: '',
                categoryOptions: [{
                    value: 'PROGRAMME',
                    label: '节目专题'
                }, {
                    value: 'FIGURE',
                    label: '人物专题'
                }],
                typeListOptions: [],
                totalAmount: 0,
                subjectList: [],
                // 当前是否处于取消选择操作中
                cancelStatus: false
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
                        this.typeListOptions = response.data;
                    }
                });
            },
            getSubjectList() {
                this.$service.getSubjectList(this.listQueryParams).then(response => {
                    if (response && response.code === 0) {
                        this.subjectList = response.data.list;
                        this.totalAmount = response.data.total;
                    }
                });
            },
            setSubject(row) {
                if (!this.cancelStatus) {
                    this.$emit('setSubject', row);
                } else {
                    this.cancelStatus = false;
                }
            },
            cancelSubject() {
                this.cancelStatus = true;
                this.$refs.singleSubject.setCurrentRow();
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
            }
        }
    };
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="less" scoped>

    .el-form {
        margin-left: 20px;
        text-align: left;
        &.search-form {
            margin-top: 20px;
            .search {
                margin-left: 50px;
                margin-right: 30px;
            }
            .el-input {
                width: 360px;
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
        .el-icon-success {
            margin-right: 5px;
            color: #409EFF;
            visibility: hidden;
        }
        .current-row {
            .el-icon-success {
                visibility: visible;
            }
        }
    }

</style>
