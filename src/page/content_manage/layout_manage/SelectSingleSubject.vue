<!--内容管理-栏目管理-选择单个专题组件-->
<template>
    <div>
        <subject-filter-params
            :mode="mode"
            v-on:getSubjectList="getSubjectList">
        </subject-filter-params>
        <el-table
            :data="subjectList"
            header-row-class-name="common-table-header"
            border
            ref="singleSubject"
            highlight-current-row
            @current-change="setSubject"
            :row-class-name="tableRowClassName"
            style="width: 100%">
            <el-table-column
                width="50px"
                label="选择">
                <template slot-scope="scope">
                    <i class="el-icon-success"></i>
                </template>
            </el-table-column>
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
    import SubjectFilterParams from '../searchFilterParams/SubjectFilterParams';

    export default {
        name: 'SelectSingleSubject',
        // mode:The category of subject, such as 'PROGRAMME' & 'FIGURE'
        props: ['mode'],
        components: {
            SubjectFilterParams
        },
        data() {
            return {
                recommendIdList: [],
                listQueryParams: {
                    category: this.mode,
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
                this.$service.getProgrammeCategory().then(response => {
                    if (response && response.code === 0) {
                        this.typeListOptions = response.data;
                    }
                });
            },
            tableRowClassName({row}) {
                if (row.recommend || !row.visible) {
                    return 'warning-row subject-row';
                }
                return 'subject-row';
            },
            // 初始化被推荐的专题的list
            initRecommendIdList(recommendIdList) {
                this.recommendIdList = recommendIdList;
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
                        // 设置重复推荐专题的筛选
                        for (let i = 0; i < this.recommendIdList.length; i++) {
                            for (let k = 0; k < this.subjectList.length; k++) {
                                if (this.recommendIdList[i] === this.subjectList[k].id) {
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
                this.getSubjectList();
            },
            handleCurrentChange(pageNum) {
                this.listQueryParams.pageNum = pageNum;
                this.getSubjectList(this.recommendIdList);
            }
        }
    };
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="less" scoped>

    .el-table {
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
