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
                <input
                    class="my-switch switch-anim"
                    type="checkbox"
                    v-model="scope.row.visible"
                    :checked="scope.row.visible"
                    @click.prevent="updateSubjectStatus(scope.row)"/>
                <i v-if="scope.row.visible" class="on-the-shelf">已上架</i>
                <i v-else class="off-the-shelf">已下架</i>
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
            width="110px">
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
                if (this.multipleSelection.length === 0) {
                    this.$emit('setBatchDisabledStatus', true);
                } else {
                    this.$emit('setBatchDisabledStatus', false);
                }
            },
            // 更改单个专题状态
            updateSubjectStatus(item) {
                this.$confirm('此操作将' + (item.visible ? '下架' : '上架') + item.name + '专题, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    this.$service.setSubjectVisible(item.id).then(response => {
                        if (response && response.code === 0) {
                            this.$message.success('"' + item.name + '"专题' + (item.visible ? '下架成功' : '上架成功'));
                            item.visible = !item.visible;
                        }
                    });
                }).catch(() => {
                    this.$message({
                        type: 'info',
                        message: '已取消' + (item.visible ? '下架' : '上架') + '专题'
                    });
                });
            },
            // 删除单个专题,只有下架的专题才能删除
            removeSubject(item) {
                if (item.visible) {
                    this.$message.warning('当前专题处于上架状态，请下架之后再进行删除操作');
                    return;
                }
                this.$confirm('此操作将删除' + item.name + '专题, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    this.$service.deleteSubject(item.id).then(response => {
                        if (response && response.code === 0) {
                            this.$message.success('"' + item.name + '"' + '专题删除成功!');
                            this.$emit('getSubjectList');
                            this.multipleSelection = [];
                            this.$emit('setBatchDisabledStatus', true);
                        }
                    });
                }).catch(() => {
                    this.$message({
                        type: 'info',
                        message: '已取消删除'
                    });
                });
            },
            // 批量上下架，已上架的可以继续上架
            batchUpdateStatus(visible) {
                if (!this.multipleSelection || this.multipleSelection.length === 0) {
                    this.$message.warning('请先选择专题');
                    return;
                }
                this.$confirm('此操作将批量' + (visible ? '上架' : '下架') + '专题, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    let idList = [];
                    this.multipleSelection.map(subject => {
                        idList.push(subject.id);
                    });
                    this.$service.batchUpdateSubjectStatus({idList, visible}).then(response => {
                        if (response && response.code === 0) {
                            this.$message.success('专题批量' + (visible ? '上架' : '下架') + '成功!');
                            this.$emit('getSubjectList');
                            this.multipleSelection = [];
                            this.$emit('setBatchDisabledStatus', true);
                        }
                    });
                }).catch(() => {
                    this.$message({
                        type: 'info',
                        message: '已取消批量' + (visible ? '上架' : '下架')
                    });
                });
            },
            // 批量删除专题，只有已下架的专题才能删除
            batchRemove() {
                if (!this.multipleSelection || this.multipleSelection.length === 0) {
                    this.$message.warning('请先选择专题');
                    return;
                }
                for (let i = 0; i < this.multipleSelection.length; i++) {
                    if (this.multipleSelection[i].visible) {
                        this.$message.warning('当前选中的专题中含有已上架的专题，暂时不能批量下架');
                        return;
                    }
                }
                this.$confirm('此操作将批量删除专题, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    let subjectIdList = [];
                    this.multipleSelection.map(subject => {
                        subjectIdList.push(subject.id);
                    });
                    this.$service.batchDeleteSubject({idList: subjectIdList}).then(response => {
                        if (response && response.code === 0) {
                            this.$message.success('专题批量删除成功!');
                            this.$emit('getSubjectList');
                            this.multipleSelection = [];
                            this.$emit('setBatchDisabledStatus', true);
                        }
                    });
                }).catch(() => {
                    this.$message({
                        type: 'info',
                        message: '已取消删除'
                    });
                });
            },
            // 查看专题详情
            toSubjectDetail(item) {
                this.$router.push({
                    name: item.category === 'FIGURE' ? 'FigureSubjectDetail' : 'ProgrammeSubjectDetail',
                    params: {id: item.id}
                });
            },
            // 编辑某一个专题
            editSubject(item) {
                this.$router.push({
                    name: item.category === 'FIGURE' ? 'EditFigureSubject' : 'EditProgrammeSubject',
                    params: {id: item.id}
                });
            }
        }
    };
</script>

<style lang="scss" scoped>

</style>
