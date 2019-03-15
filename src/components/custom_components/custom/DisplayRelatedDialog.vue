<!-- 视频播放的组件  -->
<template>
    <el-dialog
        title="关联关系"
        class="my-dialog"
        custom-class="related-custom-dialog"
        :visible.sync="displayRelatedDialogVisible"
        :show-close="true"
        :before-close="closeDialog"
        :close-on-click-modal="false"
        :close-on-press-escape="false"
        :append-to-body="true">
        <div v-if="displayRelatedDialogVisible">
            <div class="text-center origin-name">
                《毒液：致命守护者》
            </div>
            <div class="text-center tips">
                已被关联在以下位置
            </div>
            <el-table
                header-row-class-name="common-table-header"
                class="my-table-style"
                :data="tableData"
                border>
                <el-table-column
                    prop="type"
                    label="关联页面"
                    width="180">
                </el-table-column>
                <el-table-column
                    prop="position"
                    label="关联位置"
                    width="180">
                    <template slot-scope="scope">
                        <span @click="toRelateRoute(scope.row)" class="name">{{scope.row.position}}</span>
                    </template>
                </el-table-column>
            </el-table>
        </div>
        <div slot="footer" class="dialog-footer">
            <el-button @click="closeDialog">关闭</el-button>
        </div>
    </el-dialog>
</template>

<script>

    export default {
        name: 'DisplayRelateDialog',
        props: {
            relatedJson: {
                type: Array,
                default: function () {
                    return [];
                }
            }
        },
        data() {
            return {
                displayRelatedDialogVisible: false,
                tableData: [{
                    type: '推荐栏目',
                    position: '混排模块'
                }, {
                    type: '节目专题',
                    position: '乌龙院专题'
                }, {
                    type: '轮播频道',
                    position: '刘德华频道'
                }]
            };
        },
        methods: {
            toRelateRoute(item) {

            },
            showDialog() {
                this.displayRelatedDialogVisible = true;
            },
            closeDialog() {
                this.displayRelatedDialogVisible = false;
            }
        }
    };
</script>

<style lang="scss" scoped>

    .origin-name {
        font-size: 14px;
    }

    .tips {
        margin-bottom: 20px;
        font-size: 14px;
    }

</style>

<style lang="scss">

    .my-dialog {
        .related-custom-dialog {
            width: 405px !important;
        }
    }

</style>
