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
                <div class="seperator-line"></div>
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
            showExist: false,
            dialogVisible: false,
            personSubjectData: {}
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
            getLayoutItemByNavbarId: 'pageLayout/getLayoutItemByNavbarId',
            getLayoutDataByNavbarId: 'pageLayout/getLayoutDataByNavbarId'
        }),
        layoutItem() {
            let layoutItem = this.getLayoutItemByNavbarId(this.navbarId, this.index, this.squareIndex);
            return layoutItem;
        },
        getImageIdByKey() {
            return (key) => {
                return _.get(this.layoutItem, `${key}.id`);
            };
        },
        checkedPersonSubjectList() {
            let id = _.get(this.layoutItem, 'id');
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
            addImageToPersonSubjectListById: 'pageLayout/addImageToPersonSubjectListById',
            //  人物模块中人物的添加删除结束
            updateLayoutItemByIndex: 'pageLayout/updateLayoutItemByIndex',
            cancelLayoutItemByIndex: 'pageLayout/cancelLayoutItemByIndex'
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
        showDialog() {
            this.getPersonSubjectList();
            this.dialogVisible = true;
        },
        closeDialog() {
            this.resetPersonSubject();
            this.dialogVisible = false;
            this.showExist = false;
            this.personSubjectData = {};
        },
        async dialogOpenHandler() {
            try {
                let id = _.get(this.layoutItem, 'id');
                if (id) {
                    let res = await this.$service.getSubjectById(id);
                    if (res && res.code === 0) {
                        this.personSubjectData = res.data;
                        this.showExist = true;
                    }
                }
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
                if (_.get(this.layoutItem, 'coverImage.id')) {
                    this.updateLayoutItemByIndex({ index: this.index, navbarId: this.navbarId, squareIndex: this.squareIndex, key: 'layoutItemType', value: 'FIGURE_SUBJECT' });
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
                this.updateLayoutItemByIndex({ index: this.index, navbarId: this.navbarId, squareIndex: this.squareIndex, key: 'coverImage', value: coverImage });
            }
            this.updateLayoutItemByIndex({ index: this.index, navbarId: this.navbarId, squareIndex: this.squareIndex, key: 'id', value: id });
            this.updateLayoutItemByIndex({ index: this.index, navbarId: this.navbarId, squareIndex: this.squareIndex, key: 'name', value: name });
            this.personSubjectData = _.cloneDeep(personSubject);
        },
        cancelHanlder() {
            this.cancelLayoutItemByIndex({navbarId: this.navbarId, index: this.index, squareIndex: this.squareIndex});
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
