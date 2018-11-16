<!--专题列表项组件-->
<template>
    <el-table
        :data="subjectList"
        @selection-change="handleSelectionChange"
        border
        style="width: 100%">
        <el-table-column
            type="selection"
            align="center"
            width="60px">
        </el-table-column>
        <el-table-column
            align="center"
            prop="code"
            width="120px"
            label="ID">
        </el-table-column>
        <el-table-column
            align="center"
            prop="name"
            min-width="220px"
            label="专题名称">
            <template slot-scope="scope">
                <span @click="toSubjectDetail(scope.row)" class="ellipsis four name">
                    {{scope.row.name}}
                </span>
            </template>
        </el-table-column>
        <el-table-column
            align="center"
            min-width="140px"
            prop="itemCount"
            label="内容数量">
            <template slot-scope="scope">
                <label>{{scope.row.itemCount}}</label>
            </template>
        </el-table-column>
        <el-table-column
            align="center"
            prop="category"
            min-width="140px"
            label="专题类型">
            <template slot-scope="scope">
                <label>{{scope.row.category === 'FIGURE'?'人物' : '节目'}}</label>
            </template>
        </el-table-column>
        <el-table-column
            align="center"
            prop="programmeCategoryList"
            min-width="130px"
            label="内容分类">
            <template slot-scope="scope">
                <label v-if="scope.row.programmeCategoryList && scope.row.programmeCategoryList.length !== 0">
                    {{scope.row.programmeCategoryList | jsonJoin('name') }}</label>
                <label v-else>------</label>
            </template>
        </el-table-column>
        <el-table-column
            align="center"
            min-width="140px"
            label="状态">
            <template slot-scope="scope">
                {{scope.row.visible ? '已上架' : '已下架'}}
            </template>
        </el-table-column>
        <el-table-column
            align="center"
            min-width="140px"
            label="创建时间">
            <template slot-scope="scope">
                {{scope.row.createdAt | formatDate('yyyy-MM-DD')}}
            </template>
        </el-table-column>
        <el-table-column
            align="center"
            label="操作"
            width="110px"
            fixed="right">
            <template slot-scope="scope">
                <div class="operator-btn-wrapper">
                    <span class="btn-text" @click="editSubject(scope.row)">编辑</span>
                    <span class="btn-text text-danger" @click="removeSubject(scope.row)">删除</span>
                </div>
            </template>
        </el-table-column>
    </el-table>
</template>

<script>
    export default {
        name: 'SubjectOperateTable',
        props: {
            subjectList: {
                type: Array,
                default: function () {
                    return [];
                }
            }
        },
        data() {
            return {
                multipleSelection: []
            };
        },
        methods: {
            // 勾选专题
            handleSelectionChange(val) {
                this.multipleSelection = val;
            },
            // 批量上架
            batchShelve() {

            },
            // 批量下架
            batchUnShelve() {

            },
            // 批量删除
            batchRemove() {

            },
            // 查看某一个专题详情
            toSubjectDetail(subject) {
                this.$router.push({
                    name: subject.category === 'FIGURE' ? 'FigureSubjectDetail' : 'ProgrammeSubjectDetail',
                    params: {id: subject.id}
                });
            },
            // 编辑某一个专题
            editSubject(subject) {
                this.$router.push({
                    name: subject.category === 'FIGURE' ? 'EditFigureSubject' : 'EditProgrammeSubject',
                    params: {id: subject.id}
                });
            },
            // 删除某一个专题
            removeSubject(subject) {
                this.$confirm('此操作将删除当前专题, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    this.$service.deleteSubject(subject.id).then(response => {
                        if (response && response.code === 0) {
                            this.$message({
                                type: 'success',
                                message: '"' + subject.name + '"' + '专题删除成功!'
                            });
                            this.$emit('getSubjectList');
                        }
                    });
                }).catch(() => {
                    this.$message({
                        type: 'info',
                        message: '已取消删除'
                    });
                });
            }
        }
    };
</script>

<style lang="scss" scoped>

</style>
