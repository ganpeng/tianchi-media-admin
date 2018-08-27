<!--内容管理-栏目管理-节目模块设置-->
<template>
    <div class="text-left">
        <custom-breadcrumb
            v-bind:breadcrumbList="[
            {name:'栏目管理'},
            {name:currentNavBarInfo.name + '-节目模块设置'}]">
        </custom-breadcrumb>
        <!--模块名称-->
        <div class="vice-block">
            <h3 class="block-vice-title">1.请输入节目模块名称：</h3>
            <el-input
                placeholder="请输入模块名称，30个字符以内"
                v-model="title"
                clearable>
            </el-input>
        </div>
        <!--选择专题-->
        <div class="vice-block">
            <h3 class="block-vice-title">2.{{mode === 'EDIT' ? '当前推荐的专题' : '请选择要推荐的节目专题'}}：</h3>
            <select-single-subject
                v-show="mode === 'NORMAL'"
                ref="selectSingleSubject"
                mode="PROGRAMME"
                v-on:resetSubjectInfo='resetSubjectInfo'
                v-on:setSubject="setSubject">
            </select-single-subject>
            <template v-if="mode === 'EDIT'">
                <single-subject-table
                    :singleSubjectList="currentSubjectList">
                </single-subject-table>
            </template>
        </div>
        <!--设置模板各项-->
        <div class="vice-block">
            <h3 class="block-vice-title">3.请选择模块板式：</h3>
            <el-select v-model="templateType" clearable placeholder="请选择模块板式" @change="setBlockModel"
                       :disabled="!currentSubject.id">
                <el-option
                    v-for="item in templateTypeOptions"
                    :key="item.id"
                    :label="item.name"
                    :value="item.name">
                </el-option>
            </el-select>
            <div class="model-block">
                <ul :class="row.listClass" v-for="(row,rowIndex) in subjectLayoutItemList" :key="rowIndex">
                    <li v-for="(item,index) in row" :key="index"
                        @click="setModelItem(rowIndex,index,row.listClass,item.layoutItemType === 'ALL',item)">
                        <div class="ab-center text-center">
                            <img :src="item.coverImage ? item.coverImage.uri : '' | imageUrl"
                                 :alt="item.coverImage.name"
                                 v-if="item.coverImage && item.coverImage.id">
                            <template v-else>
                                <label class="tip"
                                       v-if="item.layoutItemType === 'ALL' && !item.coverImage.id">此处为“更多“入口，点击上传图片</label>
                                <label class="tip"
                                       v-else>点击设置模块推荐位内的节目</label>
                            </template>
                        </div>
                        <!--左上角标-->
                        <span v-if="item.cornerMark && item.cornerMark.leftTop"
                              class="corner-mark left-top">
                                 <img :src="item.cornerMark.leftTop.caption | setPlatformImage"
                                      :alt="item.cornerMark.leftTop.caption">
                             </span>
                        <!--左下角标-->
                        <span v-if="item.cornerMark && item.cornerMark.leftBottom"
                              class="corner-mark left-bottom">{{item.cornerMark.leftBottom.caption}}</span>
                        <!--右上角标-->
                        <span v-if="item.cornerMark && item.cornerMark.rightTop"
                              class="corner-mark right-top">
                                <img :src="item.cornerMark.rightTop.imageUri | imageUrl"
                                     :alt="item.cornerMark.rightTop.caption">
                                </span>
                        <!--右下角标-->
                        <span v-if="item.cornerMark && item.cornerMark.rightBottom"
                              class="corner-mark right-bottom">{{item.cornerMark.rightBottom.caption}}</span>
                    </li>
                </ul>
            </div>
        </div>
        <div class="text-center save-btn">
            <el-button type="primary" @click="switchMode" v-if="mode === 'EDIT'" class="page-main-btn">更换专题</el-button>
            <el-button type="primary" @click="saveBlock" class="page-main-btn">保 存</el-button>
        </div>
        <el-dialog title="设置模块推荐位内的节目" center :visible.sync="dialogTableVisible">
            <set-subject-programme
                v-if="dialogTableVisible"
                :imageSpec="imageSpec"
                :originProgramme="originProgramme"
                :programmeList="programmeList"
                :subjectLayoutItemList="subjectLayoutItemList"
                v-on:setCurrentSubjectItem="setCurrentSubjectItem">
            </set-subject-programme>
        </el-dialog>
        <upload-image
            :size='size'
            title="上传'全部'图片"
            :successHandler="addProgrammeAllImage"
            :imageUploadDialogVisible="imageUploadDialogVisible"
            v-on:changeImageDialogStatus="closeImageDialog($event)">
        </upload-image>
    </div>
</template>
<script>
    import SelectSingleSubject from './SelectSingleSubject';
    import SetSubjectProgramme from './SetSubjectProgramme';
    import SingleSubjectTable from './SingleSubjectTable';
    import templateTypeInfo from '@/util/config/template_type';
    import UploadImage from 'sysComponents/custom_components/custom/UploadImage';
    import _ from 'lodash';

    export default {
        name: 'ModelAppendProgrammeSubject',
        components: {
            SelectSingleSubject,
            SetSubjectProgramme,
            SingleSubjectTable,
            UploadImage
        },
        data() {
            return {
                // 以'_'分割，设置每层的样式高度
                templateHeight: '',
                size: [],
                imageUploadDialogVisible: false,
                navBarId: this.$route.params.navBarId,
                navBarSignCode: this.$route.params.navBarSignCode,
                // 当前页面选择人物专题的操作，operate有add && edit
                operate: this.$route.params.operate,
                dialogTableVisible: false,
                title: '',
                currentSubject: {},
                templateTypeOptions: templateTypeInfo.TYPE,
                templateType: '',
                // 布局一定的节目列表
                subjectLayoutItemList: [],
                // 当前专题中的节目列表
                programmeList: [],
                // 当前设置节目所在行数
                currentRow: '',
                // 当前设置节目所在某行的index
                currentIndex: '',
                // 当前编辑的节目
                originProgramme: {},
                imageSpec: {},
                // 当前本地数据中模块推荐位推荐的专题的id的数组
                recommendSubjectIdList: [],
                // 编辑状态，本地对应的模块推荐位回填信息
                recommendModelInfo: {},
                // 当operate是edit的时候的模式,mode含有'NORMAL'和'EDIT'
                mode: this.$route.params.operate === 'edit' ? 'EDIT' : 'NORMAL',
                // 编辑模式下的当前专题
                currentSubjectList: [],
                saveDisabled: false
            };
        },
        computed: {
            currentNavBarInfo() {
                return this.$store.getters['layout/getNavBarInfo']({
                    navBarId: this.navBarId
                });
            },
            // 当前选择的板式的最后一行的index
            lastRow() {
                return this.subjectLayoutItemList.length - 1;
            },
            // 当前选择的板式的最后一行的最后一个item的index
            lastIndex() {
                return this.subjectLayoutItemList[this.lastRow].length - 1;
            }
        },
        mounted() {
            this.init();
        },
        methods: {
            init() {
                // 编辑模式下进行回填
                if (this.mode === 'EDIT') {
                    this.recommendModelInfo = this.$store.getters['layout/getRecommendModelInfo']({
                        navBarSignCode: this.navBarSignCode,
                        model: this.$route.params.model
                    });
                    this.initCurrentRecommendSubject();
                }
                this.recommendSubjectIdList = this.$store.getters['layout/getRecommendModelSubjectIdList']({
                    navBarSignCode: this.navBarSignCode
                });
                if (this.mode !== 'EDIT') {
                    this.$nextTick(function () {
                        this.$refs.selectSingleSubject.initRecommendIdList(this.recommendSubjectIdList);
                        this.$refs.selectSingleSubject.getSubjectList();
                    });
                }
            },
            // 回填选中的专题数据
            initCurrentRecommendSubject() {
                this.title = this.recommendModelInfo.title;
                this.subjectLayoutItemList = _.cloneDeep(this.recommendModelInfo.layoutItemMultiList);
                this.templateHeight = this.recommendModelInfo.height;
                // 初始化模板样式
                this.templateType = '';
                for (let i = 0; i < this.subjectLayoutItemList.length; i++) {
                    this.templateType = this.templateType + '+' + templateTypeInfo.SIZE_TO_INFO[this.subjectLayoutItemList[i].length + '-' + this.templateHeight.split('_')[i]].name;
                    this.subjectLayoutItemList[i].listClass = templateTypeInfo.SIZE_TO_INFO[this.subjectLayoutItemList[i].length + '-' + this.templateHeight.split('_')[i]].style;
                }
                this.templateType = this.templateType.slice(1);
                this.$service.getSubjectDetail(this.recommendModelInfo.subjectId).then(response => {
                    if (response && response.code === 0) {
                        this.currentSubjectList.push(response.data);
                        this.currentSubject = response.data;
                        this.programmeList = response.data.subjectItemList;
                    }
                });
            },
            // 选择某一个专题
            setSubject(item) {
                this.currentSubject = item;
                this.programmeList = item.subjectItemList;
                this.resetModel();
            },
            // 由'EDIT'模式更换为'NORMAL'模式
            switchMode() {
                this.mode = 'NORMAL';
                this.title = '';
                this.resetSubjectInfo();
                this.$refs.selectSingleSubject.initRecommendIdList(this.recommendSubjectIdList);
                this.$refs.selectSingleSubject.getSubjectList();
            },
            // 重置专题信息
            resetSubjectInfo() {
                this.resetModel();
                this.currentSubject = {};
                this.programmeList = [];
            },
            // 初始化模块板式
            resetModel() {
                this.templateType = '';
                this.subjectLayoutItemList = [];
            },
            // 选择模块板式
            setBlockModel() {
                if (!this.templateType) {
                    this.resetModel();
                    return;
                }
                if (this.getModelCount() > this.programmeList.length) {
                    this.$message({
                        message: '该模块板式需要节目数量多于专题节目数量，不可选择',
                        type: 'warning'
                    });
                    this.resetModel();
                    return;
                }
                // 初始化模块列表
                this.subjectLayoutItemList = [];
                this.templateHeight = '';
                for (let k = 0; k < this.templateType.split('+').length; k++) {
                    this.subjectLayoutItemList[k] = [];
                    this.subjectLayoutItemList[k].listClass = templateTypeInfo.NAME_TO_INFO[this.templateType.split('+')[k]].style;
                    for (let i = 0; i < templateTypeInfo.NAME_TO_INFO[this.templateType.split('+')[k]].count; i++) {
                        this.subjectLayoutItemList[k].push({});
                    }
                    this.templateHeight = this.templateHeight + '_' + templateTypeInfo.NAME_TO_INFO[this.templateType.split('+')[k]].height;
                }
                this.templateHeight = this.templateHeight.slice(1);
                // 模块板式有最后一个'更多'的位置
                if (this.getModelCount() < this.programmeList.length) {
                    this.subjectLayoutItemList[this.lastRow][this.lastIndex] = {
                        id: '1',
                        layoutItemType: 'ALL',
                        name: '全部',
                        coverImage: {
                            height: '',
                            id: '',
                            name: '',
                            uri: '',
                            width: ''
                        }
                    };
                }
                // 重置节目列表
                this.programmeList.map(programme => {
                    delete programme.selected;
                });
            },
            getModelCount() {
                let num = 0;
                for (let k = 0; k < this.templateType.split('+').length; k++) {
                    num = num + templateTypeInfo.NAME_TO_INFO[this.templateType.split('+')[k]].count;
                }
                return num;
            },
            // 设置模板样式中的节目项
            setModelItem(row, index, imageModel, isAll, item) {
                imageModel = imageModel.split('-')[1] + '-' + imageModel.split('-')[2];
                this.imageSpec = templateTypeInfo.SIZE_TO_INFO[imageModel];
                if (isAll) {
                    this.size = [];
                    let spec = this.imageSpec.width + '*' + this.imageSpec.height;
                    this.size.push({
                        value: spec,
                        label: '当前尺寸：' + spec
                    });
                    this.imageUploadDialogVisible = true;
                    return;
                }
                this.currentRow = row;
                this.currentIndex = index;
                this.originProgramme = item;
                this.dialogTableVisible = true;
            },
            // 关闭上传图片对话框
            closeImageDialog(status) {
                this.imageUploadDialogVisible = status;
            },
            // 添加节目'全部'图片
            addProgrammeAllImage(newProgammeAllImage) {
                this.subjectLayoutItemList[this.lastRow][this.lastIndex].coverImage = newProgammeAllImage.posterImage;
            },
            // 设置专题某一项内容
            setCurrentSubjectItem(programmeItem) {
                this.subjectLayoutItemList[this.currentRow][this.currentIndex] = programmeItem;
                this.dialogTableVisible = false;
            },
            // 保存信息到store中
            saveBlock() {
                if (this.saveDisabled) {
                    return;
                }
                if (!this.title) {
                    this.$message({
                        message: '请填写模块名称',
                        type: 'warning'
                    });
                    return;
                }
                if (!this.currentSubject.id) {
                    this.$message({
                        message: '请选择专题',
                        type: 'warning'
                    });
                    return;
                }
                let allSetting = true;
                // 检查是否设置完成模块的每一项
                this.subjectLayoutItemList.map(rowArray => {
                    rowArray.map(programme => {
                        if (!programme.coverImage || !programme.coverImage.id) {
                            allSetting = false;
                        }
                    });
                });
                if (!allSetting) {
                    this.$message({
                        message: '请完整设置模块中的节目',
                        type: 'warning'
                    });
                    return;
                }
                // 定义模块布局模式
                let layoutTemplate = 'LT';
                for (let i = 0; i < this.subjectLayoutItemList.length; i++) {
                    layoutTemplate = layoutTemplate + '_' + this.subjectLayoutItemList[i].length;
                }
                // 组建模块专题对象
                let programmeModel = {
                    layoutTemplate: layoutTemplate,
                    renderType: 'PROGRAMME',
                    height: this.templateHeight,
                    subjectId: this.currentSubject.id,
                    title: this.title,
                    layoutItemMultiList: this.subjectLayoutItemList
                };
                // 保存到store中
                this.$store.commit('layout/setSubjectLayoutItem', {
                    navBarId: this.navBarId,
                    navBarSignCode: this.navBarSignCode,
                    model: this.$route.params.model,
                    subjectModel: programmeModel,
                    operate: this.$route.params.operate
                });
                this.saveDisabled = true;
                this.$message({
                    message: '设置模块专题成功',
                    type: 'success'
                });
                this.$router.push({
                    name: 'NavBarLayoutSetting',
                    params: {
                        navBarSignCode: this.$route.params.navBarSignCode,
                        navBarId: this.$route.params.navBarId
                    }
                });
            }
        }
    };
</script>

<style lang="scss" scoped>

    .vice-block {
        margin-top: 60px;
    }

    .el-table {
        margin: 0px;
    }

    .el-input, .el-select {
        width: 500px;
    }

    // 根据一行节目数量，确定模块样式
    .model-block {
        ul {
            display: flex;
            margin-top: 30px;
            justify-content: space-between;
            li {
                position: relative;
                margin-right: 30px;
                flex-grow: 1;
                cursor: pointer;
                background: $dynamicGray;
                border: 1px solid #fff;
                &:hover {
                    border: 1px solid $baseBlue;
                }
                div {
                    display: flex;
                    flex-direction: column;
                    justify-content: center;
                }
                .tip {
                    font-size: $normalFontSize;
                    color: $baseBlue;
                    cursor: pointer;
                }
                img {
                    display: block;
                    width: 100%;
                    height: 100%;
                }
                &:last-child {
                    margin-right: 0px;
                }
            }
        }

        ul.model-1-200 {
            li {
                width: 100%;
                padding-bottom: 12%;
            }
        }
        ul.model-2-225 {
            li {
                width: 48%;
                padding-top: 13%;
            }
        }

        ul.model-3-225 {
            li {
                width: 31%;
                padding-top: 13%;
            }
        }
        ul.model-4-225 {
            li {
                width: 23%;
                padding-top: 13%;
            }
        }
        ul.model-6-350 {
            li {
                width: 14%;
                padding-top: 20%;
            }
        }
        ul.model-6-134 {
            li {
                width: 14%;
                padding-top: 8%;
            }
        }
    }

    // 角标样式
    span.corner-mark {
        position: absolute;
        line-height: 30px;
        background: #5daf34;
        color: #fff;
        font-size: 14px;
        border-radius: 6px;
        text-align: center;
        img {
            width: 100%;
            height: auto;
        }
    }

    span.left-bottom {
        left: 10px;
        bottom: 10px;
        height: 30px;
        width: 100px;
    }

    span.left-top {
        left: 10px;
        top: 10px;
        background: transparent;
    }

    span.right-top {
        right: 10px;
        top: 10px;
        height: 30px;
        width: 60px;
    }

    span.right-bottom {
        right: 10px;
        bottom: 10px;
        height: 30px;
        width: 60px;
    }

    .save-btn {
        margin: 120px 0 80px 0;
    }
</style>
