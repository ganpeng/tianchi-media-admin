<!--  设置为节目的弹窗 -->
<template>
    <div class="edit-programme-container">
        <el-dialog
            title="设置为节目"
            class="my-dialog"
            width="80%"
            :visible.sync="dialogVisible"
            :show-close="true"
            :before-close="cancelHanlder"
            @open="dialogOpenHandler"
            :close-on-click-modal="false"
            :close-on-press-escape="false"
            :append-to-body="true">
            <div class="person-dialog-container">
                <div class="step-one">
                    <div class="step-one-wrapper">
                        <el-form class="my-el-form" :inline="true" @submit.native.prevent>
                            <el-form-item>
                                <el-input
                                    placeholder="搜索你想要的信息"
                                    clearable
                                    class="border-input"
                                    @input="searchFieldInputHandler($event, 'keyword')"
                                    :value="programmeSearchFields.keyword">
                                </el-input>
                            </el-form-item>
                            <el-form-item>
                                <el-button type="primary" class="btn-style-one" @click="searchEnterHandler">
                                    <svg-icon icon-class="search"></svg-icon>
                                    搜索
                                </el-button>
                            </el-form-item>
                        </el-form>
                        <el-table
                            :row-class-name="tableRowClassName"
                            ref="multipleTable"
                            header-row-class-name="common-table-header" class="my-table-style" :data="list" border>
                            <el-table-column  align="center" label="选择">
                                <template slot-scope="scope">
                                    <el-radio :value="programme.id" :label="scope.row.id" @input="selectProgrammeHandler(scope.row)">&nbsp;</el-radio>
                                </template>
                            </el-table-column>
                            <el-table-column prop="code" align="center" width="120px" label="节目编号">
                                <template slot-scope="scope">
                                    {{scope.row.code | padEmpty}}
                                </template>
                            </el-table-column>
                            <el-table-column prop="name" align="center" min-width="100px" label="节目名称">
                                <template slot-scope="scope">
                                    {{scope.row.name | padEmpty}}
                                </template>
                            </el-table-column>
                            <el-table-column label="节目图片" width="100px" align="center" >
                                <template slot-scope="scope">
                                    <img style="width:70px;height:auto;" :src="scope.row.coverImage ? scope.row.coverImage.uri : '' | imageUrl" alt="">
                                </template>
                            </el-table-column>
                            <el-table-column prop="featureVideoCount" width="100px" align="center" label="正片数量">
                                <template slot-scope="scope">
                                    {{scope.row.featureVideoCount | padEmpty}}
                                </template>
                            </el-table-column>
                            <el-table-column align="center" width="100px" label="分类">
                                <template slot-scope="scope">
                                    <span class="ellipsis four">
                                        {{categoryListString(scope.row.categoryList) | padEmpty}}
                                    </span>
                                </template>
                            </el-table-column>
                            <el-table-column align="center" min-width="100px" label="类型">
                                <template slot-scope="scope">
                                    <span class="ellipsis four">
                                        {{typeList(scope.row.id) | padEmpty}}
                                    </span>
                                </template>
                            </el-table-column>
                            <el-table-column align="center" min-width="100px" label="演员">
                                <template slot-scope="scope">
                                    <span class="ellipsis four">
                                        {{getChiefActor(scope.row.id) | padEmpty}}
                                    </span>
                                </template>
                            </el-table-column>
                            <el-table-column prop="releaseStatus" min-width="100px" align="center" label="状态">
                                <template slot-scope="scope">
                                    <i v-if="scope.row.visible" class="on-the-shelf">已上架</i>
                                    <i v-else class="off-the-shelf">已下架</i>
                                </template>
                            </el-table-column>
                            <el-table-column align="center" min-width="100px" label="更新时间">
                                <template slot-scope="scope">
                                    {{scope.row.updatedAt | formatDate('yyyy-MM-DD') | padEmpty}}
                                </template>
                            </el-table-column>
                        </el-table>
                        <el-pagination
                            @current-change="handlePaginationChange($event, 'pageNum')"
                            :current-page="programmePagination.pageNum"
                            :page-size="programmePagination.pageSize"
                            layout="total, prev, pager, next, jumper"
                            :total="programmePagination.total">
                        </el-pagination>
                    </div>
                </div>
                <div slot="footer" class="dialog-footer text-right margin-top-l">
                    <el-button @click="cancelHanlder">取 消</el-button>
                    <el-button type="primary" class="btn-style-two" @click="enterHandler">确 定</el-button>
                </div>
            </div>
        </el-dialog>
    </div>
</template>
<script>
import {mapGetters, mapActions, mapMutations} from 'vuex';
// import _ from 'lodash';
export default {
    name: 'ProgrammeDialog',
    props: {
        setAdSuccess: {
            type: Function,
            default: () => {}
        }
    },
    data() {
        return {
            dialogVisible: false,
            programme: {},
            customMarkOptions: [],
            command: '',
            adMaterial: {}
        };
    },
    created() {},
    computed: {
        ...mapGetters({
            list: 'programme/programmeList',
            programmeSearchFields: 'programme/programmeSearchFields',
            programmePagination: 'programme/programmePagination',
            categoryListString: 'programme/categoryListString',
            typeList: 'programme/typeList',
            getChiefActor: 'programme/getChiefActor'
        })
    },
    methods: {
        ...mapMutations({
            resetProgrammePagination: 'programme/resetProgrammePagination',
            resetProgrammeSearchFields: 'programme/resetProgrammeSearchFields',
            updateProgrammePagination: 'programme/updateProgrammePagination',
            updateProgrammeSearchFields: 'programme/updateProgrammeSearchFields'
        }),
        ...mapActions({
            getProgrammeListIsVisible: 'programme/getProgrammeListIsVisible',
            getProgrammeCategory: 'programme/getProgrammeCategory'
        }),
        keyupHandler(e) {
            if (e.keyCode === 13) {
                this.searchEnterHandler();
            }
        },
        searchFieldInputHandler(value, key) {
            this.updateProgrammeSearchFields({key, value});
        },
        //  弹窗的操作
        async showDialog(command, adMaterial) {
            try {
                this.dialogVisible = true;
                this.command = command;
                this.adMaterial = adMaterial;

                window.addEventListener('keyup', this.keyupHandler);
            } catch (err) {
                console.log(err);
            }
        },
        closeDialog() {
            this.resetProgrammePagination();
            this.resetProgrammeSearchFields();
            this.dialogVisible = false;
            this.programme = {};
            this.command = '';
            this.adMaterial = {};

            window.removeEventListener('keyup', this.keyupHandler);
        },

        async dialogOpenHandler() {
            try {
                await this.getProgrammeListIsVisible();
            } catch (err) {
                console.log(err);
            }
        },
        // 弹窗的操作结束
        handlePaginationChange(value, key) {
            this.updateProgrammePagination({key, value});
            this.getProgrammeListIsVisible();
        },
        selectProgrammeHandler(programme) {
            this.programme = programme;
        },
        tableRowClassName({row, rowIndex}) {
            return row.id === this.programme.id ? 'checked' : '';
        },
        searchEnterHandler() {
            this.getProgrammeListIsVisible();
        },
        //  最后一步的确认处理函数
        enterHandler() {
            if (this.programme.id) {
                this.setAdSuccess({
                    command: this.command,
                    adMaterial: this.adMaterial,
                    value: JSON.stringify(this.programme)
                });
                this.closeDialog();
            } else {
                this.$message.error('请选择节目');
            }
        },
        cancelHanlder() {
            this.closeDialog();
        }
    }
};
</script>
<style lang="scss" scoped>
.my-el-form {
    overflow: hidden;
    margin-top: 20px;
}
</style>
