<!--专题列表项组件-->
<template>
    <div>
        <el-table
            :data="subjectList"
            @selection-change="handleSelectionChange"
            @sort-change="sortChangeHandler"
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
                width="60px"
                prop="relatedCount"
                align="center"
                label="关联">
                <template slot-scope="scope">
                    <span @click="openRelateDialog(scope.row)" class="name">{{scope.row.refCount ? scope.row.refCount : '/'}}</span>
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
                sortable
                align="center"
                prop="createdAt"
                min-width="140px"
                label="创建时间">
                <template slot-scope="scope">
                    {{scope.row.createdAt | formatDate('yyyy-MM-DD HH:MM:SS')}}
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
        <display-related-dialog
            ref="displayRelatedDialog"
            :currentItemInfo="currentSubject"
            type="SUBJECT">
        </display-related-dialog>
    </div>
</template>

<script>
    import _ from 'lodash';
    import DisplayRelatedDialog from 'sysComponents/custom_components/custom/DisplayRelatedDialog';

    export default {
        name: 'SubjectOperateTable',
        components: {
            DisplayRelatedDialog
        },
        props: {
            subjectList: {
                type: Array,
                default: function () {
                    return [];
                }
            },
            setSubjectList: {
                type: Function,
                default: () => {}
            }
        },
        data() {
            return {
                multipleSelection: [],
                currentSubject: {}
            };
        },
        methods: {
            // 打开关联对话框
            openRelateDialog(item) {
                this.currentSubject = item;
                this.$refs.displayRelatedDialog.showDialog();
            },
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
                if (!this.$authority.isHasAuthority('content:subject:visible')) {
                    return;
                }
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
                });
            },
            // 删除单个专题,只有下架的专题才能删除
            removeSubject(item) {
                if (!this.$authority.isHasAuthority('content:subject:delete')) {
                    return;
                }
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
                });
            },
            // 批量上下架，已上架的可以继续上架
            batchUpdateStatus(visible) {
                if (!this.$authority.isHasAuthority('content:subject:batchVisible')) {
                    return;
                }
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
                });
            },
            // 批量删除专题，只有已下架的专题才能删除
            batchRemove() {
                if (!this.$authority.isHasAuthority('content:subject:batchDelete')) {
                    return;
                }
                if (!this.multipleSelection || this.multipleSelection.length === 0) {
                    this.$message.warning('请先选择专题');
                    return;
                }
                for (let i = 0; i < this.multipleSelection.length; i++) {
                    if (this.multipleSelection[i].visible) {
                        this.$message.warning('当前选中的专题中含有已上架的专题，暂时不能批量删除');
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
                });
            },
            // 查看专题详情
            toSubjectDetail(item) {
                if (!this.$authority.isHasAuthority('content:subject:get')) {
                    return;
                }
                this.$router.push({
                    name: item.category === 'FIGURE' ? 'FigureSubjectDetail' : 'ProgrammeSubjectDetail',
                    params: {id: item.id}
                });
            },
            // 编辑某一个专题
            editSubject(item) {
                if (!this.$authority.isHasAuthority('content:subject:patch')) {
                    return;
                }
                this.$router.push({
                    name: item.category === 'FIGURE' ? 'EditFigureSubject' : 'EditProgrammeSubject',
                    params: {id: item.id}
                });
            },
            // dev2.9
            sortChangeHandler(obj) {
                let {prop, order} = obj;
                if (prop === 'createdAt') {
                    let sortedList = [];
                    if (order === 'ascending') {
                        sortedList = _.chain(this.subjectList).sortBy('createdAt').value();
                    } else {
                        sortedList = _.chain(this.subjectList).sortBy('createdAt').reverse().value();
                    }
                    this.setSubjectList(sortedList);
                }
            }
        }
    };
</script>

<style lang="scss" scoped>

</style>
