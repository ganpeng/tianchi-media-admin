<!--内容管理-栏目管理-选择单个专题组件-->
<template>
    <div>
        <el-form :inline="true" class="demo-form-inline search-form">
            <template v-if="listQueryParams.category === 'PROGRAMME'">
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
                <el-button type="success" @click="initSubjectList(recommendIdList)">查 询</el-button>
            </el-form-item>
        </el-form>
        <el-table
            :data="subjectList"
            border
            ref="singleSubject"
            highlight-current-row
            @current-change="setSubject"
            :row-class-name="tableRowClassName"
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
                    <el-button type="text" size="small" @click.stop="checkSubjectDetail(scope.row)">查看</el-button>
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
        // mode:The category of subject, such as 'PROGRAMME' & 'FIGURE'
        props: ['mode'],
        data() {
            return {
                recommendIdList: [],
                listQueryParams: {
                    category: this.mode,
                    subjectType: '',
                    name: '',
                    pageNum: 1,
                    pageSize: 10
                },
                createRangeTime: '',
                typeListOptions: [],
                totalAmount: 0,
                subjectList: []
            };
        },
        mounted() {
            this.init();
        },
        methods: {
            init() {
                this.$service.getProgrammeCategory().then(response => {
                    if (response && response.code === 0) {
                        this.typeListOptions = response.data;
                    }
                });
            },
            tableRowClassName({row}) {
                if (row.recommend || !row.visible) {
                    return 'warning-row';
                }
                return '';
            },
            initSubjectList(recommendIdList) {
                this.recommendIdList = recommendIdList;
                this.$service.getSubjectList(this.listQueryParams).then(response => {
                    if (response && response.code === 0) {
                        this.subjectList = response.data.list;
                        this.totalAmount = response.data.total;
                        // 设置重复推荐专题的筛选
                        for (let i = 0; i < recommendIdList.length; i++) {
                            for (let k = 0; k < this.subjectList.length; k++) {
                                if (recommendIdList[i] === this.subjectList[k].id) {
                                    this.subjectList[k].recommend = true;
                                }
                            }
                        }
                    }
                });
            },
            setSubject(row) {
                let message = '';
                switch (true) {
                    case !row:
                        return;
                    case row.recommend:
                        message = '当前专题已经被推荐，请选择其它专题';
                        break;
                    case !row.visible:
                        message = '当前专题已经被下架，请选择其它专题';
                        break;
                    case this.mode === 'PROGRAMME' && row.subjectItemList.length === 0:
                        message = '该专题中没有节目，不可选择';
                        break;
                    case this.mode === 'FIGURE' && row.subjectItemList.length < 7:
                        message = '该专题中没有人物数量少于7个，不可选择';
                        break;
                }
                if (message) {
                    this.$message({
                        message: message,
                        type: 'warning'
                    });
                    this.$refs.singleSubject.setCurrentRow();
                    this.$emit('resetSubjectInfo');
                    return;
                }
                this.$emit('setSubject', row);
            },
            handleSizeChange(pageSize) {
                this.listQueryParams.pageSize = pageSize;
                this.initSubjectList(this.recommendIdList);
            },
            handleCurrentChange(pageNum) {
                this.listQueryParams.pageNum = pageNum;
                this.initSubjectList(this.recommendIdList);
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
