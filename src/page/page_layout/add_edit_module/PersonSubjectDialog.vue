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
                <el-steps class="my-steps" align-center :active="active" finish-status="success">
                    <el-step title="选择人物专题"></el-step>
                    <el-step title="推荐位海报"></el-step>
                </el-steps>
                <div class="seperator-line"></div>
                <div v-show="active === 0" class="step-one">
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
                </div>
                <div v-show="active === 1" class="step-two">
                    <el-form status-icon
                            label-width="120px"
                            @submit.native.prevent>
                        <el-col :span="24">
                            <el-form-item label="专题封面图" required>
                                <div class="image-container">
                                    <select-image
                                        name="personSubjectCoverImage"
                                        :images="matchedProgrammeList"
                                        :id="getImageIdByKey('coverImage') || ''"
                                        :allowResolutions="allowResolutions"
                                        :changeImageHandler="changeCoverImageHandler"
                                    ></select-image>
                                    <single-image-uploader
                                        id="personSubjectImageUploader"
                                        :showImage="false"
                                        :uri="layoutBlockItemClone.coverImage ? layoutBlockItemClone.coverImage.uri : ''"
                                        :uploadSuccessHandler="uploadPersonSubjectCoverImageSuccessHandler"
                                        :allowResolutions="allowResolutions"
                                    ></single-image-uploader>
                                </div>
                            </el-form-item>
                        </el-col>
                    </el-form>
                </div>
                <div slot="footer" class="dialog-footer text-right margin-top-l">
                    <el-button @click="cancelHanlder">取 消</el-button>
                    <el-button v-show="active > 0" class="btn-style-three prev-btn" @click="prevBtnClickHandler">上一步</el-button>
                    <el-button v-show="active < 1" class="btn-style-three next-btn" @click="nextBtnClickHandler">下一步</el-button>
                    <el-button v-show="active === 1" type="primary" class="btn-style-two" @click="enterSuccessHandler">确 定</el-button>
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
            showExist: false,
            layoutItemType: '',
            dialogVisible: false,
            active: 0,
            personSubjectData: {},

            //  2.3.0 新增字段
            layoutBlockId: '',
            layoutBlockItemClone: {}
        };
    },
    created() {
        let {navbarId, index} = this.$route.params;
        this.navbarId = navbarId;
        this.index = index;
    },
    computed: {
        ...mapGetters({
            personSubject: 'pageLayout/personSubject',

            //  2.3.0 新增
            activeLayout: 'pageLayout/getActiveLayout',
            getLayoutBlockItem: 'pageLayout/getLayoutBlockItem'
        }),
        layoutBlockItem() {
            return this.getLayoutBlockItem(this.layoutBlockId, this.squareIndex);
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
        },
        matchedProgrammeList() {
            let posterImageList = _.get(this.personSubjectData, 'posterImageList') || [];
            let matchedProgrammeList = posterImageList.filter((image) => {
                let width = _.get(this.allowResolutions, '0.width');
                let height = _.get(this.allowResolutions, '0.height');
                return parseInt(image.width) === parseInt(width) && parseInt(image.height) === parseInt(height);
            });
            return matchedProgrammeList;
        }
    },
    methods: {
        ...mapMutations({
            resetPersonSubject: 'pageLayout/resetPersonSubject',
            updatePersonSubject: 'pageLayout/updatePersonSubject',
            updatePersonSubjectPagination: 'pageLayout/updatePersonSubjectPagination',
            addImageToPersonSubjectListById: 'pageLayout/addImageToPersonSubjectListById',

            //  2.3.0新增
            updateLayoutBlockById: 'pageLayout/updateLayoutBlockById'
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
        //  弹窗控制方法
        showDialog(layoutItemType) {
            let {id} = this.$route.query;
            this.layoutBlockId = id;
            this.layoutItemType = layoutItemType;
            this.dialogVisible = true;

            window.addEventListener('keyup', this.keyupHandler);
        },
        closeDialog() {
            this.resetPersonSubject();
            this.dialogVisible = false;
            this.active = 0;
            this.showExist = false;
            this.layoutItemType = '';
            this.personSubjectData = {};

            this.layoutBlockId = '';
            this.layoutBlockItemClone = {};

            window.removeEventListener('keyup', this.keyupHandler);
        },
        async dialogOpenHandler() {
            try {
                this.layoutBlockItemClone = _.cloneDeep(this.layoutBlockItem);
                let _layoutItemType = _.get(this.layoutBlockItemClone, 'layoutItemType');
                if (this.layoutItemType !== _layoutItemType) {
                    this.layoutBlockItemClone = _.cloneDeep(this.$util.defaultLayoutBlock);
                } else {
                    let id = _.get(this.layoutBlockItemClone, 'id');
                    if (id) {
                        let res = await this.$service.getSubjectById(id);
                        if (res && res.code === 0) {
                            this.personSubjectData = res.data;
                            this.showExist = true;
                        }
                    }
                }
                this.updatePersonSubjectPagination({key: 'pageSize', value: 5});
                await this.getPersonSubjectList();
            } catch (err) {
                console.log(err);
            }
        },
        changeProgrammeHandler() {
            this.layoutBlockItemClone = _.cloneDeep(this.$util.defaultLayoutBlock);
            this.showExist = false;
        },
        updateLayoutBlockItem(payload) {
            let {key, value} = payload;
            let _layoutBlockItemClone = Object.assign({}, this.layoutBlockItemClone, {[key]: value});
            this.layoutBlockItemClone = _layoutBlockItemClone;
        },
        //  搜索人物的事件处理函数
        searchInputHandler(value, key) {
            this.updatePersonSubject({key, value});
        },
        async enterSuccessHandler() {
            try {
                if (_.get(this.layoutBlockItemClone, 'coverImage.id')) {
                    this.updateLayoutBlockItem({ key: 'layoutItemType', value: 'FIGURE_SUBJECT' });
                    this.updateLayoutBlockById({
                        squareIndex: this.squareIndex,
                        layoutBlockId: this.layoutBlockId,
                        layoutBlockItem: this.layoutBlockItemClone
                    });
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
                if (this.active === 0 && this.layoutBlockItemClone.id) {
                    this.active++;
                } else {
                    this.$message.error('请选择人物专题');
                    return false;
                }
            }
        },
        setPersonSubjectHandler(personSubject) {
            let {id, name} = personSubject;
            this.updateLayoutBlockItem({ key: 'id', value: id });
            this.updateLayoutBlockItem({ key: 'name', value: name });
            this.personSubjectData = _.cloneDeep(personSubject);
        },
        changeCoverImageHandler(image) {
            this.updateLayoutBlockItem({ key: 'coverImage', value: image });
        },
        async uploadPersonSubjectCoverImageSuccessHandler(image) {
            try {
                let {id, posterImageList} = this.personSubjectData;
                let clonePosterImageList = _.cloneDeep(posterImageList);
                clonePosterImageList.push(image);
                clonePosterImageList = _.uniqBy(clonePosterImageList, 'id');
                let res = await this.$service.updateSubjectById(id, {
                    posterImageList: clonePosterImageList
                });
                if (res && res.code === 0) {
                    this.personSubjectData = Object.assign({}, this.personSubjectData, {posterImageList: clonePosterImageList});
                }
            } catch (err) {
                console.log(err);
            }
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
