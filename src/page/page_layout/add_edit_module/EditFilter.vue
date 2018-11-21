<!-- 设置筛选 -->
<template>
    <div class="text-center">
        <el-dialog
            title="设置为节目"
            class="my-dialog"
            width="80%"
            :visible.sync="dialogVisible"
            :show-close="true"
            :before-close="closeDialog"
            @open="dialogOpenHandler"
            :close-on-click-modal="false"
            :close-on-press-escape="false"
            :append-to-body="true">
            <el-form :inline="false" class="text-left filters" label-width="180px">
                <el-form-item label="1.设置筛选条件">
                    <el-select v-model="categorySignCode" clearable placeholder="请选择栏目类别" @change="setCategory">
                        <el-option
                            v-for="item in categoryOptions"
                            :key="item.id"
                            :label="item.name"
                            :value="item.signCode">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item :label="item.name" v-for="(item) in classDictionary[categorySignCode]" :key="item.name">
                    <!--二级分类-->
                    <el-select v-if="item.type === 'CLASS'"
                            v-model="selectValue.typeId" clearable placeholder='请选择二级分类'>
                        <el-option
                            v-for="item in typeOptions"
                            :key="item.id"
                            :label="item.name"
                            :value="item.id">
                        </el-option>
                    </el-select>
                    <!--地区-->
                    <el-select v-if="item.type === 'AREA'"
                            v-model="selectValue.areaGroup" clearable placeholder='请选择相应地区'>
                        <el-option
                            v-for="item in areaOptions"
                            :key="item"
                            :label="item"
                            :value="item">
                        </el-option>
                    </el-select>
                    <!--时间-->
                    <el-select v-if="item.type === 'TIME'"
                            v-model="selectValue.time" clearable placeholder='请选择相应时间'>
                        <el-option
                            v-for="item in timeOptions"
                            :key="item.id"
                            :label="item.name"
                            :value="item.name">
                        </el-option>
                    </el-select>
                    <!--节目规格-->
                    <el-select v-if="item.type === 'SPEC'"
                            v-model="selectValue.spec" clearable placeholder='请选择节目规格'>
                        <el-option
                            v-for="item in specOptions"
                            :key="item"
                            :label="item"
                            :value="item">
                        </el-option>
                    </el-select>
                    <!--网站-->
                    <el-select v-if="item.type === 'PLATFORM'"
                            v-model="selectValue.platform" clearable placeholder='请选择网站'>
                        <el-option
                            v-for="item in platformOptions"
                            :key="item.value"
                            :label="item.value"
                            :value="item.value">
                        </el-option>
                    </el-select>
                    <!--出品方-->
                    <el-select v-if="item.type === 'ANNOUNCER'"
                            v-model="selectValue.announcer" clearable placeholder='请选择出品方'>
                        <el-option
                            v-for="item in announcerOptions"
                            :key="item.value"
                            :label="item.value"
                            :value="item.value">
                        </el-option>
                    </el-select>
                    <!--赛事-->
                    <el-select v-if="item.type === 'CONTEST'"
                            v-model="selectValue.contest" clearable placeholder='请选择赛事'>
                        <el-option
                            v-for="item in contestOptions"
                            :key="item.value"
                            :label="item.value"
                            :value="item.value">
                        </el-option>
                    </el-select>
                    <!--人物-->
                    <el-select v-if="item.type === 'FIGURE'"
                            v-model="selectValue.figure" clearable placeholder='请选择人物'>
                        <el-option
                            v-for="item in figureOptions"
                            :key="item.value"
                            :label="item.value"
                            :value="item.value">
                        </el-option>
                    </el-select>
                    <!--年级-->
                    <el-select v-if="item.type === 'GRADE'"
                            v-model="selectValue.grade" clearable placeholder='请选择年级'>
                        <el-option
                            v-for="item in gradeOptions"
                            :key="item"
                            :label="item"
                            :value="item">
                        </el-option>
                    </el-select>
                    <!--科目-->
                    <el-select v-if="item.type === 'SUBJECT'"
                            v-model="selectValue.subject" clearable placeholder='请选择科目'>
                        <el-option
                            v-for="item in subjectOptions"
                            :key="item"
                            :label="item"
                            :value="item">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="2.设置筛选项推荐图片">
                    <single-image-uploader
                        id="programmeImageUploaderThree"
                        :uri="getImageByKey('coverImage') || ''"
                        :uploadSuccessHandler="addPosterImage"
                        :dimension="{width: 260, height: 260}"
                        :allowResolutions="[{width: 260, height: 260}]"
                    ></single-image-uploader>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer text-right margin-top-l">
                <!-- <el-button @click="closeDialog">取 消</el-button> -->
                <el-button  type="primary" @click="complete">确 定</el-button>
            </div>
        </el-dialog>
    </div>
</template>
<script>
    import _ from 'lodash';
    import {mapGetters, mapMutations} from 'vuex';
    import UploadImage from 'sysComponents/custom_components/custom/UploadImage';
    import dict from '@/util/config/dictionary';
    import CATALOGUE_CONFIG_MAP from '@/util/config/catalogue';
    import SingleImageUploader from 'sysComponents/custom_components/custom/SingleImageUploader';

    export default {
        name: 'EditFilter',
        /** imageSpec 当前选择的节目中适合当前板式的图片集合
         *  originState 需要回填的筛选项的信息
         * */
        props: ['imageSpec', 'squareIndex'],
        components: {
            UploadImage,
            SingleImageUploader
        },
        data() {
            return {
                //  弹框相关
                dialogVisible: false,
                //  弹框相关结束
                categorySignCode: '',
                categoryOptions: [],
                selectValue: {
                    // 二级分类
                    typeId: '',
                    // 地区
                    areaGroup: '',
                    // 时间
                    time: '',
                    // 节目规格
                    spec: '',
                    // 网站
                    platform: '',
                    // 出品方
                    announcer: '',
                    // 赛事
                    contest: '',
                    // 人物
                    figure: '',
                    // 年级
                    grade: '',
                    // 科目
                    subject: ''
                },
                typeOptions: [],
                areaOptions: [],
                timeOptions: [],
                specOptions: [],
                platformOptions: [],
                // 包含网视、网络综艺、卫视综艺的频道
                platformObject: {
                    NETWORK: [],
                    TV_SHOW_NETWORK: [],
                    TV_SHOW_SATELLITE: []
                },
                announcerOptions: [],
                contestOptions: [],
                figureOptions: [],
                gradeOptions: [],
                subjectOptions: [],
                classDictionary: dict.CLASS_FILTER_DICTIONARY,
                size: [],
                imageUploadDialogVisible: false,
                coverImage: {},
                entertainmentList: []
            };
        },
        mounted() {
            // this.init();
        },
        computed: {
            ...mapGetters({
                layout: 'pageLayout/layout'
            }),
            getImageByKey() {
                return (key) => {
                    let {navbarId, index} = this.$route.params;
                    return _.get(this.layout, `${navbarId}.data.${index}.layoutItemMultiList.${this.squareIndex}.${key}.uri`);
                };
            }
        },
        methods: {
            ...mapMutations({
                updateLayoutItemByIndex: 'pageLayout/updateLayoutItemByIndex',
                setLayoutItemByIndex: 'pageLayout/setLayoutItemByIndex'
            }),
            getOriginState() {
                let {navbarId, index} = this.$route.params;
                return _.get(this.layout, `${navbarId}.data.${index}.layoutItemMultiList.${this.squareIndex}`);
            },
            init() {
                // this.initImageSize();
                this.initTime();
                this.initArea();
                this.initSpec();
                this.initPlatform();
                this.initGrade();
                this.initSubject();
                // 回填相应的数据
                // console.log(this.getOriginState);
                if (this.getOriginState() && this.getOriginState().coverImage) {
                    this.coverImage = this.getOriginState().coverImage;
                    this.categorySignCode = this.getOriginState().layoutItemType.replace('_PROGRAMME_CATEGORY', '');
                    if (this.getOriginState().params) {
                        let params = JSON.parse(this.getOriginState().params);
                        for (let key in params) {
                            this.selectValue[key] = params[key];
                        }
                    }
                }
                this.$service.getProgrammeCategory().then(response => {
                    if (response && response.code === 0) {
                        this.categoryOptions = response.data;
                        // 设置娱乐项目的筛选列表
                        this.categoryOptions.map(category => {
                            for (let i = 0; i < CATALOGUE_CONFIG_MAP.ENTERTAINMENT.categorySignCode.length; i++) {
                                if (category.signCode === CATALOGUE_CONFIG_MAP.ENTERTAINMENT.categorySignCode[i]) {
                                    this.entertainmentList.push(category);
                                }
                            }
                        });
                        // 删除项目列表中的'党建'项目，混排筛选中不存在'党建'项目
                        for (let i = 0; i < this.categoryOptions.length; i++) {
                            if (this.categoryOptions[i].name === '党建') {
                                this.categoryOptions.splice(i, 1);
                            }
                        }
                        // 删除项目列表中的'幽默'项目，混排筛选中不存在'幽默'项目
                        for (let i = 0; i < this.categoryOptions.length; i++) {
                            if (this.categoryOptions[i].name === '幽默') {
                                this.categoryOptions.splice(i, 1);
                            }
                        }
                        // 设置二级分类的选项
                        if (this.categorySignCode) {
                            this.categoryOptions.map(category => {
                                if (category.signCode === this.categorySignCode) {
                                    this.typeOptions = category.programmeTypeList;
                                }
                            });
                        }
                    }
                });
            },
            initImageSize() {
                let spec = this.imageSpec.width + '*' + this.imageSpec.height;
                this.size.push({
                    value: spec,
                    label: '当前尺寸：' + spec
                });
            },
            // 当前年份往前一共三年以及'更早'
            initTime() {
                let currentYear = new Date().getFullYear();
                for (let i = 0; i < 3; i++) {
                    this.timeOptions.push({id: i + 1, name: currentYear - i});
                }
                this.timeOptions.push({id: 4, name: '更早'});
            },
            // 初始化地区，例如'欧美'等
            initArea() {
                this.$service.fetchAreaGroupNameList().then(response => {
                    if (response && response.code === 0) {
                        this.areaOptions = response.data;
                    }
                });
            },
            // 初始化节目规格
            initSpec() {
                this.$service.getProgrammeSpec().then(response => {
                    if (response && response.code === 0) {
                        this.specOptions = response.data;
                    }
                });
            },
            /** 出品方'ANNOUNCER'(纪实 RECORD)
             *  网站'PLATFORM'（网视 NETWORK、网络综艺 TV_SHOW_NETWORK、卫视综艺 TV_SHOW_SATELLITE）
             *  赛事'CONTEST'（体育 SPORTS）
             *  人物'FIGURE'（曲艺 TUNE_ART）
             */
            initPlatform() {
                // 纪实的出品方
                this.$service.getDict({categoryList: ['RECORD'], nameList: ['ANNOUNCER']}).then(response => {
                    if (response && response.code === 0 && response.data[0]) {
                        this.announcerOptions = response.data[0].optionList;
                    }
                });
                // 网视的网站
                this.$service.getDict({categoryList: ['NETWORK'], nameList: ['PLATFORM']}).then(response => {
                    if (response && response.code === 0 && response.data[0]) {
                        this.platformObject.NETWORK = response.data[0].optionList;
                        if (this.categorySignCode === 'NETWORK') {
                            this.platformOptions = this.platformObject.NETWORK;
                        }
                    }
                });
                // 网络综艺的网站
                this.$service.getDict({categoryList: ['TV_SHOW_NETWORK'], nameList: ['PLATFORM']}).then(response => {
                    if (response && response.code === 0 && response.data[0]) {
                        this.platformObject.TV_SHOW_NETWORK = response.data[0].optionList;
                        if (this.categorySignCode === 'TV_SHOW_NETWORK') {
                            this.platformOptions = this.platformObject.TV_SHOW_NETWORK;
                        }
                    }
                });
                // 卫视综艺的网站
                this.$service.getDict({categoryList: ['TV_SHOW_SATELLITE'], nameList: ['PLATFORM']}).then(response => {
                    if (response && response.code === 0 && response.data[0]) {
                        this.platformObject.TV_SHOW_SATELLITE = response.data[0].optionList;
                        if (this.categorySignCode === 'TV_SHOW_SATELLITE') {
                            this.platformOptions = this.platformObject.TV_SHOW_SATELLITE;
                        }
                    }
                });
                // 体育的赛事
                this.$service.getDict({categoryList: ['SPORTS'], nameList: ['CONTEST']}).then(response => {
                    if (response && response.code === 0 && response.data[0]) {
                        this.contestOptions = response.data[0].optionList;
                    }
                });
                // 曲艺的人物
                this.$service.getDict({categoryList: ['TUNE_ART'], nameList: ['FIGURE']}).then(response => {
                    if (response && response.code === 0 && response.data[0]) {
                        this.figureOptions = response.data[0].optionList;
                    }
                });
            },
            initGrade() {
                this.$service.getProgrammeGrade().then(response => {
                    if (response && response.code === 0) {
                        this.gradeOptions = response.data;
                    }
                });
            },
            initSubject() {
                this.$service.getProgrammeSubject().then(response => {
                    if (response && response.code === 0) {
                        this.subjectOptions = response.data;
                    }
                });
            },
            // 设置一级分类
            setCategory() {
                // 清空所选数据
                for (let key in this.selectValue) {
                    this.selectValue[key] = '';
                }
                // 初始化二级分类项
                this.categoryOptions.map(category => {
                    if (category.signCode === this.categorySignCode) {
                        this.typeOptions = category.programmeTypeList;
                    }
                });
                // 初始化频道项
                this.platformOptions = this.platformObject[this.categorySignCode];
            },
            appendImagePrefix(uri) {
                let baseUri = window.localStorage.getItem('imageBaseUri');
                return baseUri + uri;
            },
            // 关闭上传图片对话框
            closeImageDialog(status) {
                this.imageUploadDialogVisible = status;
            },
            // 添加封面图片
            addPosterImage(image) {
                // this.coverImage = coverImage.posterImage;
                let {navbarId, index} = this.$route.params;
                this.coverImage = image;
                this.updateLayoutItemByIndex({
                    index,
                    navbarId,
                    squareIndex: this.squareIndex,
                    key: 'coverImage',
                    value: image
                });
            },
            complete() {
                // 检测推荐筛选项的封面
                if (!this.coverImage.id) {
                    this.$message({
                        message: '请设置推荐筛选项的封面',
                        type: 'error'
                    });
                    return;
                }
                // 设置参数
                let params = {};
                // 一级分类的名称和signCode
                this.categoryOptions.map(category => {
                    if (category.signCode === this.categorySignCode) {
                        params.name = category.name;
                        params.signCode = category.signCode;
                    }
                });
                // 筛选项的key对应的value
                for (let key in this.selectValue) {
                    if (this.selectValue[key]) {
                        params[key] = this.selectValue[key];
                    }
                }
                // 选中的二级分类的typeId所对应的typeName,如果没有相应的typeId，则typeName置空
                if (!this.selectValue.typeId) {
                    delete params.typeName;
                    delete params.typeId;
                }
                this.typeOptions.map(type => {
                    if (type.id === this.selectValue.typeId) {
                        params.typeName = type.name;
                        params.typeId = this.selectValue.typeId;
                    }
                });
                // 设置娱乐下的一级分类的list
                params.entertainmentList = this.entertainmentList;
                // 组成筛选项信息
                let filterItem = {
                    id: '',
                    name: '',
                    params: JSON.stringify(params),
                    layoutItemType: this.categorySignCode + '_PROGRAMME_CATEGORY',
                    coverImage: this.coverImage
                };
                let {navbarId, index} = this.$route.params;
                this.setLayoutItemByIndex({
                    index,
                    navbarId,
                    squareIndex: this.squareIndex,
                    layoutItem: filterItem
                });
                // this.$emit('setShuffleItem', filterItem);
                this.$message({
                    message: '成功设置混排模块的筛选项',
                    type: 'success'
                });
                this.closeDialog();
            },
            //  弹出框相关的操作
            dialogOpenHandler() {
                this.init();
            },
            showDialog() {
                this.dialogVisible = true;
            },
            closeDialog() {
                this.dialogVisible = false;
                this.categorySignCode = '';
                this.categoryOptions = [];
                this.selectValue = {
                    // 二级分类
                    typeId: '',
                    // 地区
                    areaGroup: '',
                    // 时间
                    time: '',
                    // 节目规格
                    spec: '',
                    // 网站
                    platform: '',
                    // 出品方
                    announcer: '',
                    // 赛事
                    contest: '',
                    // 人物
                    figure: '',
                    // 年级
                    grade: '',
                    // 科目
                    subject: ''
                };
                this.typeOptions = [];
                this.areaOptions = [];
                this.timeOptions = [];
                this.specOptions = [];
                this.platformOptions = [];
                // 包含网视、网络综艺、卫视综艺的频道
                this.platformObject = {
                    NETWORK: [],
                    TV_SHOW_NETWORK: [],
                    TV_SHOW_SATELLITE: []
                };
                this.announcerOptions = [];
                this.contestOptions = [];
                this.figureOptions = [];
                this.gradeOptions = [];
                this.subjectOptions = [];
                this.classDictionary = dict.CLASS_FILTER_DICTIONARY;
                this.size = [];
                this.imageUploadDialogVisible = false;
                this.coverImage = {};
                this.entertainmentList = [];
            }
        }
    };
</script>
