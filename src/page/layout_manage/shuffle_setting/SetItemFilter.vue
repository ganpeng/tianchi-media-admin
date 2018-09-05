<!--内容管理-栏目管理-设置混排内的筛选组件-->
<template>
    <div class="text-center">
        <h3 class="text-left">1.请设置筛选条件：</h3>
        <el-select v-model="categorySignCode" clearable placeholder="请选择栏目类别" @change="setCategory">
            <el-option
                v-for="item in categoryOptions"
                :key="item.id"
                :label="item.name"
                :value="item.signCode">
            </el-option>
        </el-select>
        <el-form :inline="true" class="text-left filters">
            <el-form-item :label="item.name" v-for="(item, index) in classDictionary[categorySignCode]" :key="index">
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
        </el-form>
        <h3 class="text-left">2.请设置筛选项推荐图片：</h3>
        <div v-if="coverImage && coverImage.uri"
             :style="{ 'background-image': 'url(' + appendImagePrefix(coverImage.uri) + ')'}"
             class="image-box">
        </div>
        <div class="add-box">
            <el-button class="create-blue-btn contain-svg-icon" @click="imageUploadDialogVisible = true">
                <svg-icon icon-class="image"></svg-icon>
                添加图片
            </el-button>
        </div>
        <div class="text-right">
            <el-button type="primary" @click="complete">确 定</el-button>
        </div>
        <upload-image
            :size='size'
            title="上传筛选推荐项封面图片"
            :successHandler="addPosterImage"
            :imageUploadDialogVisible="imageUploadDialogVisible"
            v-on:changeImageDialogStatus="closeImageDialog($event)">
        </upload-image>
    </div>
</template>

<script>
    import UploadImage from 'sysComponents/custom_components/custom/UploadImage';
    import dict from '@/util/config/dictionary';
    import CATALOGUE_CONFIG_MAP from '@/util/config/catalogue';

    export default {
        name: 'SetItemFilter',
        /** imageSpec 当前选择的节目中适合当前板式的图片集合
         *  originState 需要回填的筛选项的信息
         * */
        props: ['imageSpec', 'originState'],
        components: {
            UploadImage
        },
        data() {
            return {
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
                // 包含网络综艺、卫视综艺的频道
                platformObject: {
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
            this.init();
        },
        methods: {
            init() {
                this.initImageSize();
                this.initTime();
                this.initArea();
                this.initSpec();
                this.initPlatform();
                this.initGrade();
                this.initSubject();
                if (this.originState && this.originState.coverImage) {
                    this.coverImage = this.originState.coverImage;
                    this.categorySignCode = this.originState.layoutItemType.replace('_PROGRAMME_CATEGORY', '');
                    let params = JSON.parse(this.originState.params);
                    for (let key in params) {
                        this.selectValue[key] = params[key];
                    }
                }
                this.$service.getProgrammeCategory().then(response => {
                    if (response && response.code === 0) {
                        this.categoryOptions = response.data;
                        this.categoryOptions.map(category => {
                            for (let i = 0; i < CATALOGUE_CONFIG_MAP.ENTERTAINMENT.categorySignCode.length; i++) {
                                if (category.signCode === CATALOGUE_CONFIG_MAP.ENTERTAINMENT.categorySignCode[i]) {
                                    this.entertainmentList.push(category);
                                }
                            }
                        });
                        for (let i = 0; i < this.categoryOptions.length; i++) {
                            if (this.categoryOptions[i].name === '党建') {
                                this.categoryOptions.splice(i, 1);
                            }
                        }
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
             *  网站'PLATFORM'（网络综艺 TV_SHOW_NETWORK、卫视综艺 TV_SHOW_SATELLITE）
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
            addPosterImage(coverImage) {
                this.coverImage = coverImage.posterImage;
            },
            complete() {
                // 检测推荐筛选项的封面
                if (!this.coverImage.id) {
                    this.$message({
                        message: '请设置推荐筛选项的封面',
                        type: 'warning'
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
                // 选中的二级分类的typeId所对应的typeName
                this.typeOptions.map(type => {
                    if (type.id === this.selectValue.typeId) {
                        params.typeName = type.name;
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
                this.$emit('setShuffleItem', filterItem);
                this.$message({
                    message: '成功设置混排模块的筛选项',
                    type: 'success'
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

    .image-box {
        height: 150px;
        width: 500px;
        background-size: contain;
        background-repeat: no-repeat;
        background-position: center;
    }

    .filters {
        margin-top: 30px;
    }

    img {
        display: block;
        max-height: 180px;
        max-width: 300px;
    }

    label {
        text-align: center;
        font-size: 16px;
    }

    .add-box {
        margin-bottom: 30px;
    }
</style>
