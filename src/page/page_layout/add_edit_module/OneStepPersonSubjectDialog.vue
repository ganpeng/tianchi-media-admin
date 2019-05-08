<template>
    <div class="person-subject-container">
        <el-dialog
            title="选择人物专题"
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
                <div v-if="showExist">
                    <p class="table-title">已选择的节目专题</p>
                    <el-table
                        :row-class-name="tableRowClassName"
                        :header-row-class-name='"common-table-header"' class="my-table-style" :data="checkedPersonSubjectList" border>
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
                    <div class="btn-wrapper text-center">
                        <el-button @click="changeProgrammeHandler" class="btn-style-two">更换专题</el-button>
                    </div>
                </div>
                <div v-else class="step-one-wrapper">
                    <el-form class="searchForm" :inline="true" @submit.native.prevent>
                        <el-form-item class="search">
                            <el-input
                                placeholder="搜索你想要的信息"
                                clearable
                                class="border-input"
                                :value="personSubject.keyword"
                                @input="searchInputHandler($event, 'keyword')"
                            >
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
                        :header-row-class-name='"common-table-header"' class="my-table-style" :data="personSubject.list" border>
                        <el-table-column align="center" width="60px" label="选择">
                            <template slot-scope="scope">
                                <el-radio :disabled="disabled(scope.row)" :value="layoutBlockItemClone.id" :label="scope.row.id" @input="setPersonSubjectHandler(scope.row)">&nbsp;</el-radio>
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
                        @current-change="handlePaginationChange($event, 'pageNum')"
                        :current-page="personSubject.pagination.pageNum"
                        :page-size="personSubject.pagination.pageSize"
                        layout="total, prev, pager, next, jumper"
                        :total="personSubject.pagination.total">
                    </el-pagination>
                </div>
                <div slot="footer" class="dialog-footer text-right margin-top-l">
                    <el-button @click="cancelHanlder">取 消</el-button>
                    <el-button type="primary" class="btn-style-two" @click="enterSuccessHandler">确 定</el-button>
                </div>
            </div>
        </el-dialog>
    </div>
</template>
<script>
import {mapGetters, mapMutations, mapActions} from 'vuex';
import _ from 'lodash';
import SingleImageUploader from 'sysComponents/custom_components/custom/SingleImageUploader';
import SelectImage from './SelectImage';
export default {
    name: 'PersonSubjectDialog',
    components: {
        SingleImageUploader,
        SelectImage
    },
    props: {
        squareIndex: {
            type: Number,
            required: true
        },
        allowResolutions: {
            type: Array,
            default: () => [{width: 560, height: 600}]
        }
    },
    data() {
        return {
            navbarId: '',
            index: '',
            operator: '',
            showExist: false,
            dialogVisible: false,
            personSubjectData: {},

            //  2.3.0 新增字段
            layoutBlockId: '',
            layoutBlockItemClone: {}
        };
    },
    created() {
        let {navbarId, index, operator} = this.$route.params;
        this.navbarId = navbarId;
        this.index = parseInt(index);
        this.operator = operator;
    },
    computed: {
        ...mapGetters({
            personSubject: 'pageLayout/personSubject',

            //  2.3.0 新增
            activeLayout: 'pageLayout/getActiveLayout',
            getLayoutBlockItem: 'pageLayout/getLayoutBlockItem',
            getLayoutBlockItemByIndex: 'pageLayout/getLayoutBlockItemByIndex'
        }),
        layoutBlockItem() {
            if (this.operator === 'edit') {
                return this.getLayoutBlockItem(this.layoutBlockId, this.squareIndex);
            } else {
                return this.getLayoutBlockItemByIndex(this.index, this.squareIndex);
            }
        },
        getImageIdByKey() {
            return (key) => {
                return _.get(this.layoutBlockItemClone, `${key}.id`);
            };
        },
        disabled() {
            return (row) => {
                let layoutBlock = this.activeLayout.find((item) => item.id === this.layoutBlockId);
                let layoutItemMultiList = _.get(layoutBlock, `layoutItemMultiList`);
                let list = layoutItemMultiList.filter((item) => item.id !== this.personSubjectData.id);
                let index = list.findIndex((item) => item.id === row.id);
                return index >= 0;
            };
        },
        checkedPersonSubjectList() {
            let id = _.get(this.layoutBlockItemClone, 'id');
            if (id && !_.isEmpty(this.personSubjectData)) {
                return [this.personSubjectData];
            } else {
                return [];
            }
        }
    },
    methods: {
        ...mapMutations({
            resetPersonSubject: 'pageLayout/resetPersonSubject',
            updatePersonSubject: 'pageLayout/updatePersonSubject',
            updatePersonSubjectPagination: 'pageLayout/updatePersonSubjectPagination',

            //  2.3.0新增
            updateLayoutBlockById: 'pageLayout/updateLayoutBlockById',
            updateLayoutBlockByIndex: 'pageLayout/updateLayoutBlockByIndex'
        }),
        ...mapActions({
            getPersonSubjectList: 'pageLayout/getPersonSubjectList',
            updateSubjectById: 'pageLayout/updateSubjectById'
        }),
        keyupHandler(e) {
            if (e.keyCode === 13) {
                this.searchEnterHandler();
            }
        },
        handlePaginationChange(value, key) {
            this.updatePersonSubjectPagination({value, key});
            this.getPersonSubjectList();
        },
        //  动态的为符合条件的行添加class
        tableRowClassName({row, rowIndex}) {
            return this.layoutBlockItemClone.id === row.id ? 'checked' : '';
        },
        updateLayoutBlockItem(payload) {
            let {key, value} = payload;
            let _layoutBlockItemClone = Object.assign({}, this.layoutBlockItemClone, {[key]: value});
            this.layoutBlockItemClone = _layoutBlockItemClone;
        },
        //  弹窗控制方法
        showDialog() {
            let {id} = this.$route.query;
            this.layoutBlockId = id;
            this.dialogVisible = true;

            window.addEventListener('keyup', this.keyupHandler);
        },
        closeDialog() {
            this.resetPersonSubject();
            this.dialogVisible = false;
            this.showExist = false;
            this.personSubjectData = {};

            this.layoutBlockId = '';
            this.layoutBlockItemClone = {};

            window.removeEventListener('keyup', this.keyupHandler);
        },
        async dialogOpenHandler() {
            try {
                this.layoutBlockItemClone = _.cloneDeep(this.layoutBlockItem);
                let id = _.get(this.layoutBlockItemClone, 'id');
                if (id) {
                    let res = await this.$service.getSubjectById(id);
                    if (res && res.code === 0) {
                        this.personSubjectData = res.data;
                        this.showExist = true;
                    }
                }

                this.updatePersonSubjectPagination({key: 'pageSize', value: 5});
                await this.getPersonSubjectList();
            } catch (err) {
                console.log(err);
            }
        },
        changeProgrammeHandler() {
            this.showExist = false;
        },
        //  搜索人物的事件处理函数
        searchInputHandler(value, key) {
            this.updatePersonSubject({key, value});
        },
        async enterSuccessHandler() {
            try {
                if (_.get(this.layoutBlockItemClone, 'coverImage.id')) {
                    this.updateLayoutBlockItem({ key: 'layoutItemType', value: 'FIGURE_SUBJECT' });
                    if (this.operator === 'edit') {
                        this.updateLayoutBlockById({
                            squareIndex: this.squareIndex,
                            layoutBlockId: this.layoutBlockId,
                            layoutBlockItem: this.layoutBlockItemClone
                        });
                    } else {
                        this.updateLayoutBlockByIndex({
                            squareIndex: this.squareIndex,
                            index: this.index,
                            layoutBlockItem: this.layoutBlockItemClone
                        });
                    }
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
        setPersonSubjectHandler(personSubject) {
            let {id, name, posterImageList} = personSubject;
            let coverImage = posterImageList.find((image) => {
                return parseInt(image.width) === 260 && parseInt(image.height) === 600;
            });
            if (coverImage) {
                this.updateLayoutBlockItem({ key: 'coverImage', value: coverImage });
            }
            this.updateLayoutBlockItem({ key: 'id', value: id });
            this.updateLayoutBlockItem({ key: 'name', value: name });
            this.personSubjectData = _.cloneDeep(personSubject);
        },
        cancelHanlder() {
            this.closeDialog();
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
