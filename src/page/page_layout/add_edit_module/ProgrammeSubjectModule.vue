<template>
    <div class="shuffle-module-container">
        <h2 class="content-title">{{title}}</h2>
        <div class="seperator-line"></div>
        <div class="form-container">
            <el-form :model="layoutData"
                    :rules="inputRules"
                    status-icon
                    ref="shuffleModuleForm"
                    label-width="120px"
                    @submit.native.prevent
                    class="form-block my-form">
                <el-col :span="8">
                    <el-form-item label="模块名称" prop="title">
                        <el-input
                            :value="layoutData.title"
                            @input="inputHandler($event, 'title')"
                            placeholder="请输入模块名称"
                        ></el-input>
                    </el-form-item>
                    <el-form-item label="名称icon">
                        <single-image-uploader
                            :uri="layoutData.iconImage ? layoutData.iconImage.uri : ''"
                            :deleteImage="deleteIconImage"
                            :uploadSuccessHandler="iconImageuploadSuccessHandler"
                            :allowResolutions="[{width: 82, height: 82}]"
                        ></single-image-uploader>
                    </el-form-item>
                </el-col>
                <el-col :span="24">
                    <el-form-item label="选择专题" prop="layoutTemplate">
                        <el-button class="btn-style-two" @click="showDialog">节目专题</el-button>
                        <div v-if="checkedProgrammeSubjectList.length > 0" class="selected-table">
                            <p class="table-title">已选择的节目专题</p>
                            <el-table
                                :row-class-name="tableRowClassName"
                                :header-row-class-name='"common-table-header"' class="my-table-style" :data="checkedProgrammeSubjectList" border>
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
                        </div>
                    </el-form-item>
                </el-col>
                <el-col :span="24">
                    <el-col :span="24">
                        <el-form-item label="模块板式" prop="layoutTemplate">
                            <el-select
                                :value="layoutData.layoutTemplate"
                                @input="templateInputHandler($event)"
                                clearable
                                placeholder="请选择模块板式">
                                <el-option
                                    v-for="item in shuffleOptions"
                                    :key="item.value"
                                    :label="item.name"
                                    :value="item.value">
                                </el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item label=" ">
                            <ps-template114
                                :isEdit="true"
                                :index="index"
                                :programmeList="programmeList"
                                v-if="layoutData.layoutTemplate === 'LT_1_1_4'"
                            ></ps-template114>
                            <ps-template23
                                :isEdit="true"
                                :index="index"
                                :programmeList="programmeList"
                                v-if="layoutData.layoutTemplate === 'LT_2_3'"
                            ></ps-template23>
                            <ps-template26
                                :isEdit="true"
                                :index="index"
                                :programmeList="programmeList"
                                v-if="layoutData.layoutTemplate === 'LT_2_6'"
                            ></ps-template26>
                            <ps-template32
                                :isEdit="true"
                                :index="index"
                                :programmeList="programmeList"
                                v-if="layoutData.layoutTemplate === 'LT_3_2'"
                            ></ps-template32>
                            <ps-template66
                                :isEdit="true"
                                :index="index"
                                :programmeList="programmeList"
                                v-if="layoutData.layoutTemplate === 'LT_6_6'"
                            ></ps-template66>
                            <ps-template4
                                :isEdit="true"
                                :index="index"
                                :programmeList="programmeList"
                                v-if="layoutData.layoutTemplate === 'LT_4'"
                            ></ps-template4>
                        </el-form-item>
                    </el-col>
                </el-col>
            </el-form>
        </div>
        <div class="fixed-btn-container">
            <el-button class="btn-style-two" type="primary" @click="saveHandler">保存</el-button>
        </div>
        <el-dialog
            title="选择节目专题"
            class="my-dialog"
            width="80%"
            :visible.sync="dialogVisible"
            :show-close="true"
            :before-close="closeDialog"
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
                                    :value="programmeSubject.keyword"
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
                            :header-row-class-name='"common-table-header"' class="my-table-style" :data="programmeSubject.list" border>
                            <el-table-column align="center" width="60px" label="选择">
                                <template slot-scope="scope">
                                    <el-radio :value="subjectId" :label="scope.row.id" @input="setProgrammeSubjectHandler(scope.row)">&nbsp;</el-radio>
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
                            :current-page="programmeSubject.pagination.pageNum"
                            :page-size="programmeSubject.pagination.pageSize"
                            layout="total, prev, pager, next, jumper"
                            :total="programmeSubject.pagination.total">
                        </el-pagination>
                    </div>
                </div>
                <div slot="footer" class="dialog-footer text-right margin-top-l">
                    <el-button @click="closeDialog">取 消</el-button>
                    <el-button type="primary" @click="enterHandler">确 定</el-button>
                </div>
            </div>
        </el-dialog>
    </div>
</template>
<script>
import {mapGetters, mapMutations, mapActions} from 'vuex';
import _ from 'lodash';
import SingleImageUploader from 'sysComponents/custom_components/custom/SingleImageUploader';
import PsTemplate114 from '../programme_subject_module/PsTemplate114';
import PsTemplate23 from '../programme_subject_module/PsTemplate23';
import PsTemplate26 from '../programme_subject_module/PsTemplate26';
import PsTemplate32 from '../programme_subject_module/PsTemplate32';
import PsTemplate66 from '../programme_subject_module/PsTemplate66';
import PsTemplate4 from '../programme_subject_module/PsTemplate4';

const shuffleOptions = [
    {
        value: 'LT_2_3',
        name: '2+3',
        itemCount: 5
    },
    {
        value: 'LT_2_6',
        name: '2+6',
        itemCount: 8
    },
    {
        value: 'LT_3_2',
        name: '3+2',
        itemCount: 5
    },
    {
        value: 'LT_4',
        name: '4',
        itemCount: 4
    },
    {
        value: 'LT_6_6',
        name: '6+6',
        itemCount: 12
    },
    {
        value: 'LT_1_1_4',
        name: '1+1+4',
        itemCount: 6
    }
];

let defaultLayoutItem = {
    desc: '',
    id: '',
    layoutItemType: '',
    name: '',
    params: '',
    coverImage: {},
    coverImageBackground: {},
    cornerMark: {
        leftTop: {},
        leftBottom: {},
        rightTop: {},
        rightBottom: {}
    }
};

export default {
    name: 'ShuffleModule',
    components: {
        SingleImageUploader,
        PsTemplate114,
        PsTemplate26,
        PsTemplate23,
        PsTemplate32,
        PsTemplate66,
        PsTemplate4
    },
    data() {
        return {
            navbarId: '',
            index: 0,
            title: '',
            saveFlag: false, // 判断页面跳转之前如果没有点保存按钮的话，就删除新增的这个layoutItem
            allowResolutions: [],
            //  节目专题弹窗相关
            dialogVisible: false,
            programmeSubjectData: {},
            shuffleOptions: [],
            inputRules: {
                title: [
                    { required: true, message: '请输入混排模块名称' }
                ],
                layoutTemplate: [
                    { required: true, message: '请选择混排模块板式' }
                ]
            }
        };
    },
    beforeRouteLeave(to, from, next) {
        let {operator} = from.params;
        if (!this.saveFlag && operator === 'add') {
            this.deleteLayoutDataByIndex({navbarId: this.navbarId, index: this.index});
            this.saveLayoutToStore();
        }
        next();
    },
    async created() {
        try {
            let {navbarId, index, operator} = this.$route.params;
            this.navbarId = navbarId;
            this.index = parseInt(index);

            if (operator === 'add') {
                this.title = '添加节目专题模块';
            } else {
                this.title = '编辑节目专题模块';
            }

            if (this.subjectId) {
                let res = await this.$service.getSubjectById(this.subjectId);
                if (res && res.code === 0) {
                    this.programmeSubjectData = res.data;
                    this.setTemplateOptions();
                }
            }
        } catch (err) {
            console.log(err);
        }
    },
    computed: {
        ...mapGetters({
            getLayoutDataByNavbarId: 'pageLayout/getLayoutDataByNavbarId',
            getLayoutItemByNavbarId: 'pageLayout/getLayoutItemByNavbarId',
            getLayoutDataAttrByKey: 'pageLayout/getLayoutDataAttrByKey',
            programmeSubject: 'pageLayout/programmeSubject',
            selectAll: 'pageLayout/selectAll'
        }),
        layoutData() {
            let layoutData = this.getLayoutDataByNavbarId(this.navbarId, this.index);
            return layoutData;
        },
        layoutItem() {
            return (squareIndex) => {
                return this.getLayoutItemByNavbarId(this.navbarId, this.index, squareIndex);
            };
        },
        styleBgImageStr() {
            return (squareIndex) => {
                let uri = _.get(this.layoutItem(squareIndex), 'coverImage.uri');
                let bgStr = `background-image: url(${uri})`;
                return bgStr;
            };
        },
        subjectId() {
            return this.getLayoutDataAttrByKey(this.navbarId, this.index, 'subjectId');
        },
        programmeList() {
            return _.get(this.programmeSubjectData, 'subjectItemList') || [];
        },
        checkedProgrammeSubjectList() {
            if (this.subjectId && !_.isEmpty(this.programmeSubjectData)) {
                return [this.programmeSubjectData];
            } else {
                return [];
            }
        }
    },
    methods: {
        ...mapMutations({
            updateProgrammeSubjectPagination: 'pageLayout/updateProgrammeSubjectPagination',
            updateProgrammeSubject: 'pageLayout/updateProgrammeSubject',
            deleteLayoutDataByIndex: 'pageLayout/deleteLayoutDataByIndex',
            saveLayoutToStore: 'pageLayout/saveLayoutToStore',
            updateLayoutDataByKey: 'pageLayout/updateLayoutDataByKey'
        }),
        ...mapActions({
            getProgrammeSubjectList: 'pageLayout/getProgrammeSubjectList'
        }),
        inputHandler(value, key) {
            this.updateLayoutDataByKey({navbarId: this.navbarId, index: this.index, key, value});
        },
        templateInputHandler(value) {
            this.updateLayoutDataByKey({navbarId: this.navbarId, index: this.index, key: 'layoutTemplate', value});
            this.setLayoutItemMultiList(value);
        },
        iconImageuploadSuccessHandler(image) {
            this.updateLayoutDataByKey({navbarId: this.navbarId, index: this.index, key: 'iconImage', value: image});
        },
        deleteIconImage() {
            this.updateLayoutDataByKey({navbarId: this.navbarId, index: this.index, key: 'iconImage', value: null});
        },
        async saveHandler() {
            try {
                let valid = await this.$refs.shuffleModuleForm.validate();
                if (valid) {
                    if (!this.selectAll(this.navbarId, this.index)) {
                        this.saveLayoutToStore(this.navbarId);
                        this.saveFlag = true;
                        this.$message.success('保存成功');
                        this.$router.push({ name: 'PageLayout', params: {navbarId: this.navbarId} });
                    } else {
                        this.$message.error('专题色块必须全部选择');
                    }
                }
            } catch (err) {
                console.log(err);
            }
        },
        //  节目专题的相关操作开始
        async dialogOpenHandler() {
            try {
                if (this.subjectId) {
                    let res = await this.$service.getSubjectById(this.subjectId);
                    if (res && res.code === 0) {
                        this.programmeSubjectData = res.data;
                    }
                }
            } catch (err) {
                console.log(err);
            }
        },
        //  弹窗的操作
        showDialog() {
            this.dialogVisible = true;
            this.updateProgrammeSubjectPagination({key: 'pageSize', value: 5});
            this.getProgrammeSubjectList();
        },
        closeDialog() {
            this.dialogVisible = false;
        },
        enterHandler() {
            this.closeDialog();
        },
        //  节目列表搜索
        searchInputHandler(value, key) {
            this.updateProgrammeSubject({key, value});
        },
        searchEnterHandler() {
            this.getProgrammeSubjectList();
        },
        handlePaginationChange(value, key) {
            this.updateProgrammeSubjectPagination({key, value});
            this.getProgrammeSubjectList();
        },
        tableRowClassName({row, rowIndex}) {
            return row.id === this.subjectId ? 'checked' : '';
        },
        setProgrammeSubjectHandler(programmeSubjectData) {
            this.updateLayoutDataByKey({
                navbarId: this.navbarId,
                index: this.index,
                key: 'subjectId',
                value: programmeSubjectData.id
            });
            this.programmeSubjectData = programmeSubjectData;
            this.setTemplateOptions();
        },
        setTemplateOptions() {
            let templateOptions = [];
            if (this.subjectId) {
                let itemCount = _.get(this.programmeSubjectData, 'itemCount');
                templateOptions = shuffleOptions.filter((item) => parseInt(itemCount) >= parseInt(item.itemCount));
            }
            this.shuffleOptions = templateOptions;
        },
        //  节目专题的相关操作结束
        setLayoutItemMultiList(value) {
            switch (value) {
                case 'LT_2_3':
                    this.updateLayoutDataByKey({
                        navbarId: this.navbarId,
                        index: this.index,
                        key: 'layoutItemMultiList',
                        value: _.times(5, () => _.cloneDeep(defaultLayoutItem))
                    });
                    break;
                case 'LT_2_6':
                    this.updateLayoutDataByKey({
                        navbarId: this.navbarId,
                        index: this.index,
                        key: 'layoutItemMultiList',
                        value: _.times(8, () => _.cloneDeep(defaultLayoutItem))
                    });
                    break;
                case 'LT_3_2':
                    this.updateLayoutDataByKey({
                        navbarId: this.navbarId,
                        index: this.index,
                        key: 'layoutItemMultiList',
                        value: _.times(5, () => _.cloneDeep(defaultLayoutItem))
                    });
                    break;
                case 'LT_3_3':
                    this.updateLayoutDataByKey({
                        navbarId: this.navbarId,
                        index: this.index,
                        key: 'layoutItemMultiList',
                        value: _.times(6, () => _.cloneDeep(defaultLayoutItem))
                    });
                    break;
                case 'LT_6_6':
                    this.updateLayoutDataByKey({
                        navbarId: this.navbarId,
                        index: this.index,
                        key: 'layoutItemMultiList',
                        value: _.times(12, () => _.cloneDeep(defaultLayoutItem))
                    });
                    break;
                case 'LT_1_1_4':
                    this.updateLayoutDataByKey({
                        navbarId: this.navbarId,
                        index: this.index,
                        key: 'layoutItemMultiList',
                        value: _.times(6, () => _.cloneDeep(defaultLayoutItem))
                    });
                    break;
                case 'LT_4':
                    this.updateLayoutDataByKey({
                        navbarId: this.navbarId,
                        index: this.index,
                        key: 'layoutItemMultiList',
                        value: _.times(4, () => _.cloneDeep(defaultLayoutItem))
                    });
                    break;
                case 'LT_S6':
                    this.updateLayoutDataByKey({
                        navbarId: this.navbarId,
                        index: this.index,
                        key: 'layoutItemMultiList',
                        value: _.times(6, () => _.cloneDeep(defaultLayoutItem))
                    });
                    break;
                case 'LT_SN':
                    this.updateLayoutDataByKey({
                        navbarId: this.navbarId,
                        index: this.index,
                        key: 'layoutItemMultiList',
                        value: []
                    });
                    break;
                default:
                    throw new Error('模版类型错误');
            }
        }
    }
};
</script>
<style lang="scss" scoped>
@mixin paddingBg($paddingNum) {
    position: relative;
    height: 0;
    padding-bottom: $paddingNum;
    background-color: #2A3040;
    background-size: 100% 100%;
    background-repeat: no-repeat;
    background-position: center center;
    border-radius: 8px;
}
.special-square-contianer {
    display: flex;
    .left-field {
        width: 32.0733%;
        height: 100px;
        margin-right: 1.4891%;
        @include paddingBg(34.3642%);
    }
    .right-field {
        width: 66.4375%;
        height: 100px;
        @include paddingBg(34.3642%);
    }
}
</style>
