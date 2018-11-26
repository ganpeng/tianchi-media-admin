<template>
    <div class="person-subject-container">
        <el-dialog
            title="选择人物专题"
            class="my-dialog"
            width="80%"
            :visible.sync="dialogVisible"
            :show-close="true"
            :before-close="closeDialog"
            @open="showDialog"
            :close-on-click-modal="false"
            :close-on-press-escape="false"
            :append-to-body="true">
            <div class="person-dialog-container">
                <el-steps class="my-steps" :active="active" finish-status="success">
                    <el-step title="选择人物专题"></el-step>
                    <el-step title="推荐位海报"></el-step>
                </el-steps>
                <div class="seperator-line"></div>
                <div v-show="active === 0" class="step-one">
                    <el-form class="searchForm" :inline="true" @submit.native.prevent>
                        <el-form-item class="search">
                            <el-input
                                placeholder="搜索你想要的信息"
                                clearable
                                class="border-input"
                                :value="personSubject.name"
                                @input="searchInputHandler($event, 'name')"
                            >
                            </el-input>
                        </el-form-item>
                        <el-form-item>
                            <el-button type="primary" class="btn-style-one" @click="searchEnterHandler">搜索</el-button>
                        </el-form-item>
                    </el-form>
                    <el-table
                        :row-class-name="tableRowClassName"
                        :header-row-class-name='"common-table-header"' class="my-table-style" :data="personSubject.list" border>
                        <el-table-column align="center" width="60px" label="选择">
                            <template slot-scope="scope">
                                <el-radio :value="layoutItem.id" :label="scope.row.id" @input="setPersonSubjectHandler(scope.row)">&nbsp;</el-radio>
                            </template>
                        </el-table-column>
                        <el-table-column prop="id" align="center" width="120px" label="编号">
                            <template slot-scope="scope">
                                {{scope.row.id | padEmpty}}
                            </template>
                        </el-table-column>
                        <el-table-column prop="name" align="center" label="专题名称">
                            <template slot-scope="scope">
                                    {{scope.row.name | padEmpty}}
                            </template>
                        </el-table-column>
                        <el-table-column prop="name" align="center" label="内容数量">
                            <template slot-scope="scope">
                                    {{scope.row.itemCount | padEmpty}}
                            </template>
                        </el-table-column>
                        <el-table-column prop="name" align="center" label="内容类型">
                            <template slot-scope="scope">
                                    {{scope.row.programmeCategoryList.map((item) => item.name).join(', ') | padEmpty}}
                            </template>
                        </el-table-column>
                        <el-table-column align="center" label="更新时间">
                            <template slot-scope="scope">
                                {{scope.row.updatedAt | formatDate('yyyy-MM-DD') | padEmpty}}
                            </template>
                        </el-table-column>
                    </el-table>
                    <el-pagination
                        @size-change="handlePaginationChange($event, 'pageSize')"
                        @current-change="handlePaginationChange($event, 'pageNum')"
                        :current-page="personSubject.pagination.pageNum"
                        :page-sizes="[5, 10, 20, 30, 50]"
                        :page-size="personSubject.pagination.pageSize"
                        layout="total, sizes, prev, pager, next, jumper"
                        :total="personSubject.pagination.total">
                    </el-pagination>
                </div>
                <div v-show="active === 1" class="step-two">
                    <el-form status-icon
                            label-width="120px"
                            @submit.native.prevent>
                        <el-col :span="24">
                            <el-form-item label="专题封面图" required>
                                <single-image-uploader
                                    id="personSubjectImageUploader"
                                    :uri="layoutItem.coverImage ? layoutItem.coverImage.uri : ''"
                                    :uploadSuccessHandler="uploadPersonSubjectImageSuccessHandler"
                                    :allowResolutions="allowResolutions"
                                ></single-image-uploader>
                            </el-form-item>
                        </el-col>
                    </el-form>
                </div>
                <div slot="footer" class="dialog-footer text-right margin-top-l">
                    <el-button @click="closeDialog">取 消</el-button>
                    <el-button v-show="active > 0" class="btn-style-three" @click="prevBtnClickHandler">上一步</el-button>
                    <el-button v-show="active < 1" class="btn-style-three" @click="nextBtnClickHandler">下一步</el-button>
                    <el-button v-show="active === 1" type="primary" @click="enterSuccessHandler">确 定</el-button>
                </div>
            </div>
        </el-dialog>
    </div>
</template>
<script>
import _ from 'lodash';
import {mapGetters, mapMutations, mapActions} from 'vuex';
import SingleImageUploader from 'sysComponents/custom_components/custom/SingleImageUploader';
export default {
    name: 'PersonSubjectDialog',
    components: {
        SingleImageUploader
    },
    props: {
        allowResolutions: {
            type: Array,
            default: () => [{width: 560, height: 600}]
        },
        successhandler: {
            type: Function,
            default: () => {}
        }
    },
    data() {
        return {
            layoutItem: {
                coverImage: {},
                id: '',
                name: '',
                layoutItemType: ''
            },
            dialogVisible: false,
            active: 0
        };
    },
    computed: {
        ...mapGetters({
            personSubjectModule: 'pageLayout/personSubjectModule',
            personSubject: 'pageLayout/personSubject'
        })
    },
    methods: {
        ...mapMutations({
            resetPersonSubject: 'pageLayout/resetPersonSubject',
            updatePersonSubject: 'pageLayout/updatePersonSubject',
            updatePersonSubjectModule: 'pageLayout/updatePersonSubjectModule',
            updatePersonSubjectPagination: 'pageLayout/updatePersonSubjectPagination',
            addImageToPersonSubjectListById: 'pageLayout/addImageToPersonSubjectListById',
            //  人物模块中人物的添加删除
            updateLayoutItemMultiListByIndex: 'pageLayout/updateLayoutItemMultiListByIndex'
            //  人物模块中人物的添加删除结束
        }),
        ...mapActions({
            getPersonSubjectList: 'pageLayout/getPersonSubjectList',
            updateSubjectById: 'pageLayout/updateSubjectById'
        }),
        handlePaginationChange(value, key) {
            this.updatePersonSubjectPagination({value, key});
            this.getPersonSubjectList();
        },
        //  动态的为符合条件的行添加class
        tableRowClassName({row, rowIndex}) {
            return this.layoutItem.id === row.id ? 'checked' : '';
        },
        //  弹窗控制方法
        showDialog(index) {
            this.getPersonSubjectList();
            this.dialogVisible = true;
        },
        closeDialog() {
            this.dialogVisible = false;
            this.active = 0;
            this.layoutItem = {
                coverImage: {},
                id: '',
                name: '',
                layoutItemType: ''
            };
        },
        //  搜索人物的事件处理函数
        searchInputHandler(value, key) {
            this.updatePersonSubject({key, value});
        },
        async enterSuccessHandler() {
            try {
                if (_.get(this.layoutItem, 'coverImage.id')) {
                    this.layoutItem.layoutItemType = 'FIGURE_SUBJECT';
                    this.successhandler(this.layoutItem);
                    this.closeDialog();
                } else {
                    this.$message.error('请设置推荐位海报');
                    return false;
                }
            } catch (err) {
                console.log(err);
            }
        },
        searchEnterHandler() {
            this.getPersonSubjectList();
        },
        //  上下步的处理方法
        prevBtnClickHandler() {
            if (this.active > 0) {
                this.active--;
            }
        },
        nextBtnClickHandler() {
            if (this.active < 1) {
                if (this.active === 0 && this.layoutItem.id) {
                    this.active++;
                } else {
                    this.$message.error('请选择人物专题');
                    return false;
                }
            }
        },
        setPersonSubjectHandler(personSubject) {
            this.layoutItem.id = personSubject.id;
            this.layoutItem.name = personSubject.name;
        },
        uploadPersonSubjectImageSuccessHandler(image) {
            this.layoutItem.coverImage = image;
        }
    }
};
</script>
<style lang="scss" scoped>
.searchForm {
    margin-top: 20px;
}
.step-two {
    margin-top: 20px;
}
</style>
