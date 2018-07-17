<!--内容管理-栏目管理-节目模块设置-->
<template>
    <div class="text-left">
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>内容管理</el-breadcrumb-item>
            <el-breadcrumb-item>栏目管理</el-breadcrumb-item>
            <el-breadcrumb-item
                :to="'/nav-bar-manage/layout-setting/' + currentNavBarInfo.signCode + '/' + currentNavBarInfo.id">
                {{currentNavBarInfo.name}}页面设置
            </el-breadcrumb-item>
            <el-breadcrumb-item>节目模块设置</el-breadcrumb-item>
        </el-breadcrumb>
        <h3 class="text-left">1.请输入节目模块名称：</h3>
        <el-input
            placeholder="请输入模块名称，30个字符以内"
            v-model="title"
            clearable>
        </el-input>
        <h3 class="text-left">2.{{mode === 'EDIT' ? '当前推荐的专题' : '请选择要推荐的节目专题'}}：</h3>
        <select-single-subject
            v-show="mode === 'NORMAL'"
            ref="selectSingleSubject"
            mode="PROGRAMME"
            v-on:resetSubjectInfo='resetSubjectInfo'
            v-on:setSubject="setSubject">
        </select-single-subject>
        <template v-if="mode === 'EDIT'">
            <el-table
                :data="currentSubjectList"
                border
                style="width: 100%">
                <el-table-column
                    prop="code"
                    width="60px"
                    label="编号">
                    <template slot-scope="scope">
                        <label>{{scope.row.code}}</label>
                    </template>
                </el-table-column>
                <el-table-column
                    prop="name"
                    label="名称">
                </el-table-column>
                <el-table-column
                    label="包含节目/人物数">
                    <template slot-scope="scope">
                        <label>{{scope.row.subjectItemList === null ? 0 : scope.row.subjectItemList.length}}</label>
                    </template>
                </el-table-column>
                <el-table-column
                    prop="description"
                    label="简介">
                    <template slot-scope="scope">
                        <label>{{scope.row.description}}</label>
                        <el-popover
                            placement="right"
                            :title="scope.row.name + '简介'"
                            width="250"
                            trigger="hover"
                            :content="scope.row.description">
                            <el-button slot="reference" type="text" class="more">更多</el-button>
                        </el-popover>
                    </template>
                </el-table-column>
                <el-table-column
                    prop="tagList"
                    label="专题标签">
                    <template slot-scope="scope">
                        <label>{{scope.row.tagList.join(',')}}</label>
                    </template>
                </el-table-column>
                <el-table-column
                    prop="owner"
                    label="专题创建者">
                </el-table-column>
                <el-table-column
                    prop="category"
                    label="专题类型">
                    <template slot-scope="scope">
                        <label>{{scope.row.category === 'FIGURE'?'人物' : '节目'}}</label>
                    </template>
                </el-table-column>
                <el-table-column
                    prop="type"
                    label="节目专题类型">
                    <template slot-scope="scope">
                        <label>{{scope.row.type ?scope.row.type : '------' }}</label>
                    </template>
                </el-table-column>
                <el-table-column
                    label="创建时间">
                    <template slot-scope="scope">
                        {{scope.row.createdAt | formatDate('yyyy-MM-DD')}}
                    </template>
                </el-table-column>
                <el-table-column
                    label="状态">
                    <template slot-scope="scope">
                        {{scope.row.visible ? '已上架' : '已下架'}}
                    </template>
                </el-table-column>
            </el-table>
        </template>
        <h3 class="text-left">3.请选择模块板式：</h3>
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
                    @click="setModelItem(rowIndex,index,('model-' + row.length),item.layoutItemType === 'ALL',item)">
                    <div class="ab-center text-center">
                        <img :src="item.coverImage ? item.coverImage.uri : '' | imageUrl"
                             :alt="item.coverImage.name"
                             v-if="item.coverImage && item.coverImage.id">
                        <label class="all-tip"
                               v-if="item.layoutItemType === 'ALL' && !item.coverImage.id">此处为“更多“入口，点击上传图片</label>
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
        <div class="text-center save-btn">
            <el-button type="success" @click="switchMode" v-if="mode === 'EDIT'">更换专题</el-button>
            <el-button type="success" @click="saveBlock">保 存</el-button>
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
    import templateTypeInfo from '@/util/config/template_type';
    import {LAYOUT_IMAGE_DIMENSION, PROGRAMME_DIMENSION} from '@/util/config/dimension';
    import UploadImage from 'sysComponents/custom_components/global/UploadImage';
    import _ from 'lodash';

    export default {
        name: 'ModelAppendProgrammeSubject',
        components: {
            SelectSingleSubject,
            SetSubjectProgramme,
            UploadImage
        },
        data() {
            return {
                // 以'_'分割，设置每层的样式高度
                templateHeight: '',
                size: PROGRAMME_DIMENSION,
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
                        this.$refs.selectSingleSubject.initSubjectList(this.recommendSubjectIdList);
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
                this.$refs.selectSingleSubject.initSubjectList(this.recommendSubjectIdList);
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
                if (isAll) {
                    this.imageUploadDialogVisible = true;
                    return;
                }
                this.imageSpec = LAYOUT_IMAGE_DIMENSION[imageModel].coverImage;
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

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="less" scoped>

    h3 {
        margin-top: 30px;
        margin-bottom: 30px;
        font-size: 18px;
    }

    .el-input {
        width: 500px;
    }

    .el-select {
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
                background: #5daf34;
                cursor: pointer;
                div {
                    display: flex;
                    flex-direction: column;
                    justify-content: center;
                }
                .all-tip {
                    font-size: 20px;
                    color: #fff;
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
        margin: 60px 0 40px 0;
    }
</style>
