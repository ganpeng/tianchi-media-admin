<template>
    <div class="person-module-container">
        <h2 class="content-title">新增人物专题模块</h2>
        <div class="seperator-line"></div>
        <div class="form-container">
            <el-form :model="personSubjectModule" status-icon ref="createPerson"
                    label-width="120px"
                    @submit.native.prevent
                    class="form-block">
                <el-col :span="8">
                    <el-form-item label="人物模块名称" prop="title" required>
                        <el-input
                            :value="personSubjectModule.title"
                            @input="inputHandler($event, 'title')"
                            placeholder="请输入人物姓名"
                        ></el-input>
                    </el-form-item>
                    <el-form-item label="名称icon">
                        <single-image-uploader
                            id="personSubjectIconUploader"
                            :uri="personSubjectModule.icon ? personSubjectModule.icon.uri : ''"
                            :uploadSuccessHandler="uploadSuccessHandler"
                            :dimension="{width: 40, height: 40}"
                            :allowResolutions="[{width: 200, height: 200}]"
                        ></single-image-uploader>
                    </el-form-item>
                </el-col>
                <el-col :span="24">
                    <el-form-item label="选择人物专题" required>
                        <person-subject-list></person-subject-list>
                    </el-form-item>
                </el-col>
            </el-form>
        </div>
        <div class="fixed-btn-container">
            <el-button class="btn-style-two" type="primary" @click="saveHandler">保存</el-button>
        </div>
        <el-dialog
            title="选择人物专题"
            class="my-dialog"
            width="80%"
            :visible.sync="selectPersonDialogVisible"
            :show-close="true"
            :before-close="closeSelectPersonDialog"
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
                                <el-radio :disabled="isDisabled(scope.row)" :value="id" :label="scope.row.id" @input="setIdHandler(scope.row.id)">&nbsp;</el-radio>
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
                                    :uri="getImage ? getImage.uri : ''"
                                    :uploadSuccessHandler="uploadPersonSubjectImageSuccessHandler"
                                    :dimension="{width: 78, height: 180}"
                                    :allowResolutions="[{width: 260, height: 600}]"
                                ></single-image-uploader>
                            </el-form-item>
                        </el-col>
                    </el-form>
                </div>
                <div slot="footer" class="dialog-footer text-right margin-top-l">
                    <el-button @click="closeSelectPersonDialog">取 消</el-button>
                    <el-button v-show="active > 0" class="btn-style-three" @click="prevBtnClickHandler">上一步</el-button>
                    <el-button v-show="active < 1" class="btn-style-three" @click="nextBtnClickHandler">下一步</el-button>
                    <el-button v-show="active === 1" type="primary" @click="selectPersonEnterHandler">确 定</el-button>
                </div>
            </div>
        </el-dialog>
    </div>
</template>
<script>
// import _ from 'lodash';
import {mapGetters, mapMutations, mapActions} from 'vuex';
import SingleImageUploader from 'sysComponents/custom_components/custom/SingleImageUploader';
import PersonSubjectList from './PersonSubjectList';
export default {
    name: 'PersonSubjectModule',
    components: {
        SingleImageUploader,
        PersonSubjectList
    },
    data() {
        return {
            selectPersonDialogVisible: false,
            index: null,
            active: 0,
            id: '' //  选中的人物专题的id
        };
    },
    created() {
        window.eventBus.$on('showDialog', this.showSelectPersonDialog);
        this.resetPersonSubjectModule();
    },
    computed: {
        ...mapGetters({
            personSubjectModule: 'pageLayout/personSubjectModule',
            personSubject: 'pageLayout/personSubject'
        }),
        checkIsChecked() {
            return (row) => {
                let index = this.personSubjectModule.layoutItemMultiList.findIndex((layoutItem) => layoutItem.id === row.id);
                return index >= 0;
            };
        },
        isDisabled() {
            return (row) => {
                let index = this.personSubjectModule.layoutItemMultiList.findIndex((layoutItem) => layoutItem.id === row.id);
                return index >= 0;
            };
        },
        getImage() {
            let personSubject = this.personSubject.list.find((personSubject) => personSubject.id === this.id);
            if (personSubject) {
                let {posterImageList} = personSubject;
                let img = posterImageList.find((item) => parseInt(item.width) === 260 && parseInt(item.height) === 600);
                if (img) {
                    return img;
                } else {
                    return null;
                }
            } else {
                return null;
            }
        }
    },
    methods: {
        ...mapMutations({
            resetPersonSubject: 'pageLayout/resetPersonSubject',
            resetPersonSubjectModule: 'pageLayout/resetPersonSubjectModule',
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
        inputHandler(value, key) {
            this.updatePersonSubjectModule({key, value});
        },
        handlePaginationChange(value, key) {
            this.updatePersonSubjectPagination({value, key});
            this.getPersonSubjectList();
        },
        //  动态的为符合条件的行添加class
        tableRowClassName({row, rowIndex}) {
            let index = this.personSubjectModule.layoutItemMultiList.findIndex((layoutItem) => layoutItem.id === row.id);
            return index >= 0 ? 'checked' : '';
        },
        checkHandler(value, person) {
        },
        saveHandler() { },
        //  弹窗控制方法
        showSelectPersonDialog(index) {
            this.index = index;
            this.resetPersonSubject();
            this.getPersonSubjectList();
            this.selectPersonDialogVisible = true;
        },
        closeSelectPersonDialog() {
            this.selectPersonDialogVisible = false;
            this.index = null;
            this.active = 0;
        },
        //  搜索人物的事件处理函数
        searchInputHandler(value, key) {
            this.updatePersonSubject({key, value});
        },
        //  选择人物点击事件处理函数
        async selectPersonEnterHandler() {
            try {
                if (this.id) {
                    let res = await this.updateSubjectById(this.id);
                    if (res && res.code === 0) {
                        this.updateLayoutItemMultiListByIndex({index: this.index, id: this.id, image: this.getImage});
                        this.closeSelectPersonDialog();
                    }
                }
            } catch (err) {
                console.log(err);
            }
        },
        searchEnterHandler() {
            this.getPersonSubjectList();
        },
        //  长传icon的成功回调函数
        uploadSuccessHandler(image) {
            this.updatePersonSubjectModule({key: 'icon', value: image});
        },
        //  上下步的处理方法
        prevBtnClickHandler() {
            if (this.active > 0) {
                this.active--;
            }
        },
        nextBtnClickHandler() {
            if (this.active < 1) {
                if (this.active === 0 && this.id) {
                    this.active++;
                } else {
                    this.$message.error('请选择人物专题');
                    return false;
                }
            }
        },
        setIdHandler(id) {
            this.id = id;
        },
        uploadPersonSubjectImageSuccessHandler(image) {
            this.addImageToPersonSubjectListById({id: this.id, image});
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
