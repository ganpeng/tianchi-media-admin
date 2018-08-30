<!--添加节目-->
<template>
    <div class="program-container">
        <custom-breadcrumb
            v-bind:breadcrumbList="[
            {name:'节目资源管理'},
            {name:getPageName}]">
        </custom-breadcrumb>
        <div class="text-right">
            <el-button class="page-main-btn" v-if="status === 0" type="primary" @click="_createProgramme">创建</el-button>
            <el-button class="page-main-btn" v-if="status === 2" type="primary" @click="_editProgramme">保存</el-button>
            <el-button class="page-main-btn" v-if="status === 2 && !programme.visible" type="danger" @click="_realDeleteProgramme">节目删除</el-button>
            <el-button class="page-main-btn" @click="goBack" plain>返回列表页</el-button>
        </div>
        <el-row>
            <programme-basic-info v-if="status === 1"></programme-basic-info>
            <el-col :span="24" v-if="status !== 1">
                <div class="block-title">节目基本信息</div>
                <el-form :rules="rules" ref="createProgramForm" status-icon :model="programme" label-width="120px" class="form-block" @submit.native.prevent>
                    <el-col :span="9">
                        <el-form-item
                            v-if="status !== 0"
                        label="全平台通用ID">
                            <el-input :value="programme.code" disabled></el-input>
                        </el-form-item>
                        <el-form-item label="节目来源">
                            <el-input
                                :value="'内容中心'"
                                disabled
                            ></el-input>
                        </el-form-item>
                        <el-form-item label="节目名称" prop="name">
                            <el-input
                                :disabled="readonly"
                                @input="inputHandler($event, 'name')"
                                :value="programme.name">
                            </el-input>
                        </el-form-item>
                        <el-form-item label="内部节目名称" prop="innerName">
                            <el-input
                                :disabled="readonly"
                                @input="inputHandler($event, 'innerName')"
                                :value="programme.innerName">
                            </el-input>
                        </el-form-item>
                        <el-form-item label="节目看点" prop="desc">
                            <el-input
                                :value="programme.desc"
                                :disabled="readonly"
                                @input="inputHandler($event, 'desc')"
                            ></el-input>
                        </el-form-item>
                        <el-form-item label="节目简介" prop="description">
                            <el-input
                                type="textarea"
                                :disabled="readonly"
                                @input="inputHandler($event, 'description')"
                                :autosize="{ minRows: 4, maxRows: 40}"
                                placeholder="请输入内容"
                                :value="programme.description">
                            </el-input>
                        </el-form-item>
                        <el-form-item label="上映时间" prop="releaseAt">
                            <el-date-picker
                                :disabled="readonly"
                                :value="programme.releaseAt"
                                @input="inputHandler($event, 'releaseAt')"
                                type="year"
                                placeholder="选择年">
                            </el-date-picker>
                        </el-form-item>
                        <el-form-item label="所属地区" prop="produceAreaList">
                            <el-select
                                :value="programme.produceAreaList"
                                @change="inputHandler($event, 'produceAreaList')"
                                multiple
                                clearable
                                filterable
                                placeholder="请选择"
                                :disabled="readonly"
                            >
                                <el-option
                                    v-for="(item, index) in areaOptions"
                                    :key="index"
                                    :label="item.name"
                                    :value="item.code">
                                </el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item label="节目分类" prop="categoryList">
                            <el-select
                                :value="programme.categoryList"
                                multiple
                                @input="inputHandler($event, 'categoryList')"
                                :disabled="readonly"
                                placeholder="请选择">
                                <el-option
                                    v-for="(item, index) in global.categoryList"
                                    :key="index"
                                    :label="item.name"
                                    :value="item.id">
                                </el-option>
                            </el-select>
                            <el-button class="page-main-btn btn-style" v-if="!readonly" type="primary" icon="el-icon-setting" @click="gotoProgramTypePage" plain>管理分类和类型</el-button>
                        </el-form-item>
                        <el-form-item label="节目类型" prop="typeList">
                            <el-select
                                :value="programme.typeList"
                                multiple
                                :disabled="readonly"
                                @input="inputHandler($event, 'typeList')"
                                placeholder="请选择">
                                <el-option
                                    v-for="(item, index) in typeListOptions"
                                    :key="index"
                                    :label="item.name"
                                    :value="item.id">
                                </el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item label="关键字" prop="tagList">
                            <el-select
                                :value="programme.tagList"
                                multiple
                                filterable
                                placeholder="请选择"
                                @change="inputHandler($event, 'tagList')"
                                :disabled="readonly"
                            >
                                <el-option
                                    v-for="(item, index) in global.programmeTagList"
                                    :key="index"
                                    :label="item"
                                    :value="item">
                                </el-option>
                            </el-select>
                            <el-button class="page-main-btn btn-style" v-if="!readonly" type="primary" icon="el-icon-plus" plain @click="addprogrammeTagHandler">新增关键字</el-button>
                        </el-form-item>
                        <el-form-item label="节目主演">
                            <label for="leadActor"></label>
                            <person-select
                                :disabled="readonly"
                                :value="programme.leadActor"
                                :searchResult="programme.leadActorResult"
                                :changeSuccessHandler="leadActorChangeHandler"
                                :searchSuccessHandler="leadActorSuccessHandler"
                            ></person-select>
                            <el-button class="page-main-btn btn-style" v-if="!readonly" type="primary" icon="el-icon-plus" plain @click="createPersonDialogVisible = true">新增人物</el-button>
                        </el-form-item>
                        <el-form-item label="节目导演">
                            <label for="director"></label>
                            <person-select
                                :disabled="readonly"
                                :value="programme.director"
                                :searchResult="programme.directorResult"
                                :changeSuccessHandler="directorChangeHandler"
                                :searchSuccessHandler="directorSuccessHandler"
                            ></person-select>
                            <el-button class="page-main-btn btn-style" v-if="!readonly" type="primary" icon="el-icon-plus" plain @click="createPersonDialogVisible = true">新增人物</el-button>
                        </el-form-item>
                        <el-form-item label="节目编剧">
                            <label for="scenarist"></label>
                            <person-select
                                :disabled="readonly"
                                :value="programme.scenarist"
                                :searchResult="programme.scenaristResult"
                                :changeSuccessHandler="scenaristChangeHandler"
                                :searchSuccessHandler="scenaristSuccessHandler"
                            ></person-select>
                            <el-button class="page-main-btn btn-style" v-if="!readonly" type="primary" icon="el-icon-plus" plain @click="createPersonDialogVisible = true">新增人物</el-button>
                        </el-form-item>
                        <el-form-item label="版权起始日期" prop="copyrightRange">
                            <el-date-picker
                                :value="programme.copyrightRange"
                                :disabled="readonly"
                                type="daterange"
                                @input="inputHandler($event, 'copyrightRange')"
                                range-separator="至"
                                start-placeholder="开始日期"
                                end-placeholder="结束日期">
                            </el-date-picker>
                        </el-form-item>
                        <el-form-item label="牌照方" prop="licence">
                            <el-select
                                :disabled="readonly"
                                :value="programme.licence"
                                filterable
                                clearable
                                placeholder="请选择"
                                @input="inputHandler($event, 'licence')"
                            >
                                <el-option
                                    v-for="(item, index) in global.licenceList"
                                    :key="index"
                                    :label="item.value"
                                    :value="item.value">
                                </el-option>
                            </el-select>
                            <el-button class="page-main-btn btn-style" v-if="!readonly" type="primary" icon="el-icon-plus" plain @click="addSelectItemHandler('licenceList')">新增牌照方</el-button>
                        </el-form-item>
                        <el-form-item label="版权方" prop="copyrightReserved">
                            <el-select
                                :disabled="readonly"
                                filterable
                                clearable
                                :value="programme.copyrightReserved"
                                placeholder="请选择"
                                @input="inputHandler($event, 'copyrightReserved')"
                            >
                                <el-option
                                    v-for="(item, index) in global.copyrightReserverList"
                                    :key="index"
                                    :label="item.value"
                                    :value="item.value">
                                </el-option>
                            </el-select>
                            <el-button class="page-main-btn btn-style" v-if="!readonly" type="primary" icon="el-icon-plus" plain @click="addSelectItemHandler('copyrightReserverList')">新增版权方</el-button>
                        </el-form-item>
                        <el-form-item label="发行方" prop="announcer">
                            <el-select
                                :disabled="readonly"
                                filterable
                                clearable
                                :value="programme.announcer"
                                placeholder="请选择"
                                @input="inputHandler($event, 'announcer')"
                            >
                                <el-option
                                    v-for="(item, index) in global.announcerList"
                                    :key="index"
                                    :label="item.value"
                                    :value="item.value">
                                </el-option>
                            </el-select>
                            <el-button class="page-main-btn btn-style" v-if="!readonly" type="primary" icon="el-icon-plus" plain @click="addSelectItemHandler('announcerList')">新增发行方</el-button>
                        </el-form-item>
                        <el-form-item
                            v-if="isMovie"
                            label="规格" prop="specList">
                            <el-select
                                :disabled="readonly"
                                :value="programme.specList"
                                placeholder="请选择"
                                multiple
                                @input="inputHandler($event, 'specList')"
                            >
                                <el-option
                                    v-for="item in specOptions"
                                    :key="item.value"
                                    :label="item.label"
                                    :value="item.value">
                                </el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item
                            v-if="isEducation"
                            label="年级" prop="grade">
                            <el-select
                                :disabled="readonly"
                                :value="programme.grade"
                                clearable
                                placeholder="请选择"
                                @input="inputHandler($event, 'grade')"
                            >
                                <el-option
                                    v-for="item in gradeOptions"
                                    :key="item.value"
                                    :label="item.label"
                                    :value="item.value">
                                </el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item
                            v-if="isEducation"
                            label="科目" prop="subject">
                            <el-select
                                :disabled="readonly"
                                :value="programme.subject"
                                clearable
                                placeholder="请选择"
                                @input="inputHandler($event, 'subject')"
                            >
                                <el-option
                                    v-for="item in subjectOptions"
                                    :key="item.value"
                                    :label="item.label"
                                    :value="item.value">
                                </el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item
                            v-if="isSports"
                            label="赛事">
                            <el-select
                                :disabled="readonly"
                                :value="programme.contest"
                                clearable
                                placeholder="请选择"
                                @input="inputHandler($event, 'contest')"
                            >
                                <el-option
                                    v-for="(item, index) in global.contestList"
                                    :key="index"
                                    :label="item.value"
                                    :value="item.value">
                                </el-option>
                            </el-select>
                            <el-button class="page-main-btn btn-style" v-if="!readonly" type="primary" icon="el-icon-plus" plain @click="addSelectItemHandler('contestList')">新增赛事</el-button>
                        </el-form-item>
                        <el-form-item
                            label="播放平台">
                            <el-select
                                :disabled="readonly"
                                :value="programme.platformList"
                                multiple
                                placeholder="请选择"
                                @input="inputHandler($event, 'platformList')"
                            >
                                <el-option
                                    v-for="(item, index) in global.platformList"
                                    :key="index"
                                    :label="item.value"
                                    :value="item.value">
                                </el-option>
                            </el-select>
                            <el-button class="page-main-btn btn-style" v-if="!readonly" type="primary" icon="el-icon-plus" plain @click="addSelectItemHandler('platformList')">新增播放平台</el-button>
                        </el-form-item>
                        <el-form-item
                            :rules="isTvPlay ? [{ required: true, message: '请输入总集数' }, {validator: checkPositiveInteger}] : [{validator: checkPositiveInteger}]"
                            label="总集数" prop="totalSets">
                            <el-input
                                type="number"
                                :disabled="readonly"
                                :value="programme.totalSets"
                                @input="inputHandler($event, 'totalSets')" >
                            </el-input>
                        </el-form-item>
                        <el-form-item label="评分" prop="score">
                            <el-input
                                type="number"
                                :disabled="readonly"
                                :value="programme.score"
                                @input="inputHandler($event, 'score')">
                            </el-input>
                        </el-form-item>
                        <el-form-item label="显示播放量" prop="playCountBasic">
                            <el-input
                                :disabled="readonly"
                                :value="programme.playCountBasic"
                                @input="inputHandler($event, 'playCountBasic')">
                            </el-input>
                        </el-form-item>
                    </el-col>
                </el-form>
            </el-col>
            <el-col :span="24">
                <div class="vice-block">
                    <h3 class="block-vice-title">节目图片</h3>
                </div>
                <div class="text-left clearfix" style="padding-left:20px;">
                    <el-button
                        class="float-left page-main-btn create-blue-btn contain-svg-icon"
                        v-if="!readonly"
                        @click="uploadImageHandler">
                        <svg-icon
                            icon-class="image"
                            class-name="svg-box">
                        </svg-icon>
                        添加节目图片
                    </el-button>
                    <span v-if="!readonly" class="float-left text-info">节目横版海报图: 807*455,节目纵版海报图: 240*350都必须上传</span>
                </div>
                <div class="image-list-wrapper">
                    <thumbnail
                        :removeSign="!readonly"
                        :imageList="programme.posterImageList"
                        v-on:removeImage="_deletePosterImage">
                    </thumbnail>
                </div>
            </el-col>
            <el-col :span="24">
                <div class="vice-block">
                    <h3 class="block-vice-title">节目视频</h3>
                </div>
                <div class="preview-sort clearfix">
                    <el-button
                        class="float-right page-main-btn create-blue-btn contain-svg-icon"
                        v-if="!readonly" @click="showUploadDialog">
                        <svg-icon
                            icon-class="video"
                            class-name="svg-box">
                        </svg-icon>
                        关联视频
                    </el-button>
                    <el-button class="float-left sort-btn page-main-btn btn-style" v-if="!readonly && video.list.length > 1" type="primary" @click="showSortDialog" plain>点击视频排序</el-button>
                </div>
                <programme-table title="已添加视频列表" :status="status" :data-list="video.list"></programme-table>
            </el-col>
        </el-row>
        <div class="group">
            <el-button class="page-margin-btn page-main-btn" v-if="status === 0" type="primary" @click="_createProgramme">创建</el-button>
            <el-button class="page-margin-btn page-main-btn" v-if="status === 2" type="primary" @click="_editProgramme">保存</el-button>
            <el-button class="page-margin-btn page-main-btn" v-if="status === 2 && !programme.visible" type="danger" @click="_realDeleteProgramme">节目删除</el-button>
            <el-button class="page-margin-btn page-main-btn" @click="goBack" plain>返回列表页</el-button>
        </div>
        <upload-image
            title="上传节目图片"
            :size="filterSize"
            :successHandler="_addPosterImage"
            :imageUploadDialogVisible="imageUploadDialogVisible"
            v-on:changeImageDialogStatus="closeImageDialog($event)">
        </upload-image>
        <create-person-dialog :createPersonDialogVisible="createPersonDialogVisible" v-on:changePersonDialogStatus="closePersonDialog($event)"></create-person-dialog>
        <upload-programme-video-dialog :videoStatus="0" :videoUploadDialogVisible="videoUploadDialogVisible" v-on:changeVideoDialogStatus="closeVideoDialog($event)"></upload-programme-video-dialog>
        <preview-multiple-images :previewMultipleImages="previewImage"></preview-multiple-images>
        <sort-dialog
            v-if="sortDialogVisible"
            title="视频排序"
            :sourceList="copyVideoList"
            sortKey="order"
            uniqueKey="id"
            displayKey="originName"
            v-on:closeDialog="sortDialogVisible = false"
            v-on:setSortedList="setSortedList">
        </sort-dialog>
    </div>
</template>
<script>
    import { mapMutations, mapGetters, mapActions } from 'vuex';
    import _ from 'lodash';
    import store from 'store';
    import PreviewMultipleImages from 'sysComponents/custom_components/custom/PreviewMultipleImages';
    import CreatePersonDialog from './CreatePersonDialog';
    import ProgrammeTable from './ProgrammeTable';
    import UploadImage from 'sysComponents/custom_components/custom/UploadImage';
    import SortDialog from 'sysComponents/custom_components/custom/SortDialog';
    import dimension from '@/util/config/dimension';
    import role from '@/util/config/role';
    import PersonSelect from './PersonSelect';
    import ProgrammeBasicInfo from './ProgrammeBasicInfo';
    import Thumbnail from '../../components/custom_components/custom/Thumbnail';
    import {checkScore, checkCategory, checkPositiveInteger} from '@/util/formValidate';
    import UploadProgrammeVideoDialog from './UploadProgrammeVideoDialog';
    const platformList = [ '中央电视台', '浙江卫视', '东方卫视', '江苏卫视', '湖南卫视', '安徽卫视', '北京卫视', '腾讯', '爱奇艺', '优酷', '搜狐', '芒果' ];

    export default {
        name: 'ProgrammeDetail',
        components: {
            UploadImage,
            Thumbnail,
            CreatePersonDialog,
            ProgrammeTable,
            UploadProgrammeVideoDialog,
            PreviewMultipleImages,
            PersonSelect,
            SortDialog,
            ProgrammeBasicInfo
        },
        props: {
            status: { // status 有三种状态，0代表创建 "create", 1代表显示 "display", 2代表编辑 "edit"
                type: Number
            }
        },
        created() {
            this.resetProgramme();
            this.getProgrammeTagList();
            this.getProgrammeCategory();
        },
        data() {
            return {
                sortMessage: '',
                isLoading: false,
                selectedCountries: [],
                countries: [],
                isLeadActorLoading: false,
                isDirectorLoading: false,
                isScenaristLoading: false,
                imageUploadDialogVisible: false,
                dialogVisible: false,
                videoUploadDialogVisible: false,
                createPersonDialogVisible: false,
                sortDialogVisible: false,
                areaOptions: store.get('areaList'),
                gradeOptions: role.GRADE,
                specOptions: role.SPEC,
                subjectOptions: role.SUBJECT,
                size: dimension.PROGRAMME_DIMENSION,
                previewImage: {
                    display: false,
                    autoplay: false,
                    activeIndex: 0,
                    list: []
                },
                selectItemObj: {
                    licenceList: '牌照方',
                    copyrightReserverList: '版权方',
                    announcerList: '发行方',
                    contestList: '赛事',
                    platformList: '播放平台'
                },
                rules: {
                    name: [
                        { required: true, message: '请输入节目名称' }
                    ],
                    innerName: [
                        { required: true, message: '请输入内部节目名称' }
                    ],
                    score: [
                        { validator: checkScore }
                    ],
                    categoryList: [
                        { required: true, message: '请选择节目分类' },
                        { validator: checkCategory }
                    ],
                    typeList: [
                        { required: true, message: '请选择节目类型' }
                    ]
                }
            };
        },
        computed: {
            ...mapGetters({
                global: 'programme/global',
                programme: 'programme/programme',
                typeListOptions: 'programme/typeListOptions',
                role: 'programme/role',
                video: 'programme/video',
                isTvPlay: 'programme/isTvPlay',
                isMovie: 'programme/isMovie',
                isEducation: 'programme/isEducation',
                isShow: 'programme/isShow',
                isSports: 'programme/isSports'
            }),
            readonly() {
                return parseInt(this.status) === 1;
            },
            checkPositiveInteger() {
                return checkPositiveInteger('总集数只能是大于1的正整数');
            },
            copyVideoList() {
                return _.cloneDeep(this.video.list);
            },
            getPageName() {
                switch (this.status) {
                    case 0:
                        return '新增节目';
                    case 1:
                        return '节目列表-详情';
                    case 2:
                        return '节目列表-编辑';
                    default:
                        return '';
                }
            },
            filterSize() {
                const {posterImageList} = this.programme;
                let sizeOneIndex = posterImageList.findIndex((img) => {
                    return parseInt(img.width) === 240 && parseInt(img.height) === 350;
                });
                let sizeTwoIndex = posterImageList.findIndex((img) => {
                    return parseInt(img.width) === 807 && parseInt(img.height) === 455;
                });
                let size = [];

                for (let i = 0; i < this.size.length; i++) {
                    let value = this.size[i].value;
                    let [width, height] = value.split('*');
                    if (
                        (parseInt(width) === 240 && parseInt(height) === 350 && sizeOneIndex >= 0) ||
                        (parseInt(width) === 807 && parseInt(height) === 455 && sizeTwoIndex >= 0)
                    ) {
                        continue;
                    } else {
                        size.push(this.size[i]);
                    }
                }

                return size;
            }
        },
        methods: {
            ...mapMutations({
                addSelectItem: 'programme/addSelectItem',
                addProgrammeTag: 'programme/addProgrammeTag',
                updateGlobal: 'programme/updateGlobal',
                updateProgramme: 'programme/updateProgramme',
                updatePersonResult: 'programme/updatePersonResult',
                updatePerson: 'programme/updatePerson',
                updateVideoPagination: 'programme/updateVideoPagination',
                deleteTempList: 'programme/deleteTempList',
                resetProgramme: 'programme/resetProgramme',
                addPosterImage: 'programme/addPosterImage',
                deletePosterImage: 'programme/deletePosterImage',
                setCoverImage: 'programme/setCoverImage',
                setVideoList: 'programme/setVideoList',
                // 视频video
                updateSearchFields: 'video/updateSearchFields'
            }),
            ...mapActions({
                // 新加
                updateProgrammeById: 'programme/updateProgrammeById',
                createMultProgrammeVideo: 'programme/createMultProgrammeVideo',
                getDict: 'programme/getDict',
                realDeleteProgramme: 'programme/realDeleteProgramme',
                // 新加结束
                createProgramme: 'programme/createProgramme',
                getPersonList: 'person/getPersonList',
                getProgrammeCategory: 'programme/getProgrammeCategory',
                getProgrammeVideoListById: 'programme/getProgrammeVideoListById',
                getProgrammeTagList: 'programme/getProgrammeTagList',
                deleteProgramme: 'programme/deleteProgramme'
            }),
            _addPosterImage({posterImage}) {
                const {posterImageList} = this.programme;
                let sizeOneImages = posterImageList.filter((img) => {
                    return parseInt(img.width) === 240 && parseInt(img.height) === 350;
                });

                let sizeTwoImages = posterImageList.filter((img) => {
                    return parseInt(img.width) === 807 && parseInt(img.height) === 455;
                });
                if (parseInt(posterImage.width) === 240) {
                    if (sizeOneImages.length > 0) {
                        let errorMessage = '推荐位六分位图只能上传一张';
                        this.$message.error(errorMessage);
                        throw new Error(errorMessage);
                    }
                }

                if (parseInt(posterImage.width) === 807) {
                    if (sizeTwoImages.length > 0) {
                        let errorMessage = '横版海报图必须上传且只能上传一张';
                        this.$message.error(errorMessage);
                        throw new Error(errorMessage);
                    }
                }

                this.addPosterImage({posterImage});
            },
            _createProgramme() {
                this.$refs.createProgramForm.validate(value => {
                    if (value) {
                        this.checkImage(() => {
                            if (!this.isLoading) {
                                this.isLoading = true;
                                this.createProgramme()
                                    .then((res) => {
                                        if (res && res.code === 0) {
                                            let id = res.data.id;
                                            if (this.video.list.length > 0) {
                                                if (this.checkVideoList(this.video.list)) {
                                                    this.createMultProgrammeVideo({programme: res.data})
                                                        .then((videoRes) => {
                                                            if (videoRes && videoRes.code === 0) {
                                                                this.deleteTempList();
                                                                this.getProgrammeVideoListById(id);
                                                                this.$message.success('保存成功');
                                                            } else {
                                                                this.$message.error('视频保存失败');
                                                            }
                                                            this.goBack();
                                                        });
                                                }
                                            } else {
                                                this.$message.success('保存成功');
                                                this.goBack();
                                            }
                                        } else {
                                            this.$message({
                                                type: 'error',
                                                message: '节目保存失败'
                                            });
                                        }
                                    }).finally(() => {
                                        this.isLoading = false;
                                    });
                            }
                        });
                    } else {
                        return false;
                    }
                });
            },
            _editProgramme() {
                let {id} = this.$route.params;
                this.$refs.createProgramForm.validate(value => {
                    if (value) {
                        this.checkImage(() => {
                            if (!this.isLoading) {
                                this.isLoading = true;
                                this.updateProgrammeById(id)
                                    .then((res) => {
                                        if (res && res.code === 0) {
                                            if (this.video.list.length > 0) {
                                                if (this.checkVideoList(this.video.list)) {
                                                    this.createMultProgrammeVideo({programme: res.data})
                                                        .then((videoRes) => {
                                                            if (videoRes && videoRes.code === 0) {
                                                                this.deleteTempList();
                                                                this.getProgrammeVideoListById(id);
                                                                this.$message({
                                                                    type: 'success',
                                                                    message: '保存成功'
                                                                });
                                                                this.goBack();
                                                            } else {
                                                                let message = '视频保存失败';
                                                                if (videoRes && videoRes.code === 3106) {
                                                                    message = `视频【${this.getVideoListName(videoRes.data)}】已经添加，不能重复添加`;
                                                                }
                                                                this.$message({
                                                                    type: 'error',
                                                                    message
                                                                });
                                                            }
                                                        });
                                                } else {
                                                    let message = this.sortMessage ? this.sortMessage : '请检查正片的集数/期号，必须按顺序填写，不能有部分填，部分没填的情况';
                                                    this.$message.error(message);
                                                }
                                            } else {
                                                this.$message({
                                                    type: 'success',
                                                    message: '保存成功'
                                                });
                                                this.goBack();
                                            }
                                        } else {
                                            this.$message({
                                                type: 'error',
                                                message: '节目保存失败'
                                            });
                                        }
                                    }).finally(() => {
                                        this.isLoading = false;
                                    });
                            }
                        });
                    } else {
                        return false;
                    }
                });
            },
            checkVideoList(list) {
                let featureList = list.filter((video) => {
                    return video.type === 'FEATURE';
                });
                if (featureList.length > 0) {
                    let hasSortList = featureList.filter((video) => {
                        if (video.sort) {
                            return video;
                        }
                    });
                    let noSortList = featureList.filter((video) => {
                        if (!video.sort) {
                            return video;
                        }
                    });

                    if (hasSortList.length > 0 && noSortList.length > 0) {
                        return false;
                    }

                    let hasShowSortList = hasSortList.filter((item) => {
                        if (/^20/.test(item.sort) && (item.sort + '').length === 8) {
                            return item;
                        }
                    });

                    let noShowSortList = hasSortList.filter((item) => {
                        if (!(/^20/.test(item.sort) && (item.sort + '').length === 8)) {
                            return item;
                        }
                    });

                    if (hasShowSortList.length > 0 && noShowSortList.length > 0) {
                        this.sortMessage = '正片的集数/期号格式必须统一，不能有多种类型';
                        return false;
                    } else {
                        this.sortMessage = '';
                    }

                    if (hasShowSortList.length > 0) {
                        return true;
                    } else {
                        let sortedHasSortList = hasSortList.sort((prev, curr) => {
                            return curr.sort - prev.sort;
                        });

                        if (sortedHasSortList.length > 1) {
                            let flag = true;
                            for (let i = 0; i < sortedHasSortList.length - 1; i++) {
                                flag = sortedHasSortList[i].sort - sortedHasSortList[i + 1].sort === 1;
                                if (!flag) {
                                    break;
                                }
                            }
                            return flag && parseInt(sortedHasSortList[sortedHasSortList.length - 1].sort) === 1;
                        } else if (sortedHasSortList.length === 1) {
                            return parseInt(sortedHasSortList[0].sort) === 1;
                        } else {
                            return true;
                        }
                    }
                } else {
                    return true;
                }
            },
            _deleteProgramme() {
                let {id} = this.$route.params;
                this.$confirm(`您确定要${this.programme.visible ? '下架节目' : '上架节目'}吗, 是否继续?`, '提示', {
                        confirmButtonText: '确定',
                        cancelButtonText: '取消',
                        type: 'error'
                    }).then(() => {
                        this.deleteProgramme(id);
                    }).catch(() => {
                        this.$message({
                            type: 'info',
                            message: '已取消删除'
                        });
                    });
            },
            _realDeleteProgramme() {
                let {id} = this.$route.params;
                this.$confirm(`您确定要删除该吗, 是否继续?`, '提示', {
                        confirmButtonText: '确定',
                        cancelButtonText: '取消',
                        type: 'error'
                    }).then(() => {
                        this.realDeleteProgramme(id)
                            .then((res) => {
                                if (res && res.code === 0) {
                                    this.$message.success({ message: '节目删除成功' });
                                    this.$router.push({ name: 'ProgrammeList' });
                                } else {
                                    this.$message.error({ message: '节目删除失败' });
                                }
                            });
                    }).catch(() => {
                        this.$message({
                            type: 'info',
                            message: '已取消删除'
                        });
                    });
            },
            showSortDialog() {
                this.sortDialogVisible = true;
            },
            closeSortDialog() {
                this.sortDialogVisible = false;
            },
            closeImageDialog(status) {
                this.imageUploadDialogVisible = status;
            },
            closePersonDialog(status) {
                this.createPersonDialogVisible = status;
            },
            showUploadDialog() {
                this.videoUploadDialogVisible = status;
                this.updateSearchFields({key: 'status', value: 'SUCCESS'});
                this.updateSearchFields({key: 'videoType', value: null}); // 临时修改，获取所有类型视频
            },
            closeVideoDialog(status) {
                this.videoUploadDialogVisible = status;
            },
            gotoProgramTypePage() {
                this.$router.push({name: 'ProgrammeTypeManage'});
            },
            goBack() {
                this.$router.push({name: 'ProgrammeList'});
            },
            inputHandler(value, key) {
                this.updateProgramme({key, value});
                if (key === 'categoryList') {
                    this.updateProgramme({key: 'typeList', value: []});
                    this.getDict(value);
                }
            },
            uploadImageHandler() {
                if (!this.readonly) {
                    this.imageUploadDialogVisible = true;
                }
            },
            _deletePosterImage(index, id) {
                this.$confirm('此操作将删除该文件, 是否继续?', '提示', {
                        confirmButtonText: '确定',
                        cancelButtonText: '取消',
                        type: 'error'
                    }).then(() => {
                        this.deletePosterImage({id});
                    }).catch(() => {
                        this.$message({
                            type: 'info',
                            message: '已取消删除'
                        });
                    });
            },
            addprogrammeTagHandler() {
                this.$prompt(`请输入新关键字`, '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    inputPattern: /\S/,
                    inputValidator: (value) => {
                        let index = this.global.programmeTagList.findIndex((item) => item === value);
                        if (index >= 0) {
                            return `新关键字${value}已经存在`;
                        } else {
                            return true;
                        }
                    },
                    inputErrorMessage: `关键字不能为空`
                }).then(({value}) => {
                    this.addProgrammeTag({value});
                    this.$message({
                        type: 'success',
                        message: `新关键字${value}添加成功`
                    });
                }).catch(() => {
                    this.$message({
                        type: 'info',
                        message: '取消输入'
                    });
                });
            },
            addSelectItemHandler(key) {
                this.$prompt(`请输入新${this.selectItemObj[key]}`, '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    inputPattern: /\S/,
                    inputValidator: (value) => {
                        if (key === 'platformList') {
                            let existing = platformList.findIndex((item) => item === value);
                            let index = this.global.platformList.findIndex((item) => item.value === value);
                            if (!existing) {
                                return `播出平台只能填写[${platformList.join(', ')}]中的`;
                            }
                            if (index >= 0) {
                                return `新播放平台${value}已经存在`;
                            } else {
                                return true;
                            }
                        } else if (key === 'programmeTagList') {
                            let index = this.global.programmeTagList.findIndex((item) => item === value);
                            console.log(index);
                            if (index >= 0) {
                                return `新关键字${value}已经存在`;
                            } else {
                                return true;
                            }
                        } else {
                            return this.selectItemValidator(key, value);
                        }
                    },
                    inputErrorMessage: `${this.selectItemObj[key]}不能为空`
                }).then(({ value }) => {
                    this.addSelectItem({key, value});
                    this.$message({
                        type: 'success',
                        message: `新${this.selectItemObj[key]}${value}添加成功`
                    });
                }).catch(() => {
                    this.$message({
                        type: 'info',
                        message: '取消输入'
                    });
                });
            },
            selectItemValidator(key, value) {
                let list = this.global[key];
                let index = list.findIndex((item) => item.value === value);
                if (index >= 0) {
                    return `新${value}已经存在`;
                } else {
                    return true;
                }
            },
            displayImage(index) {
                this.previewImage.display = true;
                this.previewImage.list = this.programme.posterImageList;
                this.previewImage.activeIndex = index;
            },
            checkImage(next) {
                const {posterImageList} = this.programme;
                if (posterImageList && posterImageList.length < 2) {
                    this.$message({type: 'error', message: '推荐位六分位图和横版海报图必须上传且只能上传一张'});
                    return false;
                }

                let sizeOne = posterImageList.findIndex((img) => {
                    return parseInt(img.width) === 240 && parseInt(img.height) === 350;
                });
                let sizeTwo = posterImageList.findIndex((img) => {
                    return parseInt(img.width) === 807 && parseInt(img.height) === 455;
                });

                if (sizeOne < 0) {
                    this.$message({type: 'error', message: '推荐位六分位图必须上传且只能上传一张'});
                    return false;
                }

                if (sizeTwo < 0) {
                    this.$message({type: 'error', message: '横版海报图必须上传且只能上传一张'});
                    return false;
                }

                // 设置默认图
                this.setCoverImage();
                if (_.isEmpty(this.programme.coverImage)) {
                    this.$message({type: 'error', message: '请选择默认的节目海报'});
                    return false;
                }
                next();
            },
            appendImagePrefix(uri) {
                let baseUri = window.localStorage.getItem('imageBaseUri');
                return baseUri + uri;
            },
            handlePaginationChange(value, key) {
                let {id} = this.$route.params;
                this.updateVideoPagination({key, value});
                this.getProgrammeVideoListById(id);
            },
            getVideoListName(list) {
                return list.map((id) => {
                    return this.video.tempList.find((video) => video.storageVideoId === id);
                }).map((video) => {
                    return video && video.originName ? video.originName : '';
                }).join(', ');
            },
            // 人物的即时搜索
            leadActorSuccessHandler(list) {
                this.updatePersonResult({key: 'leadActorResult', value: list});
            },
            leadActorChangeHandler(value) {
                this.updatePerson({key: 'leadActor', idList: value});
            },
            directorSuccessHandler(list) {
                this.updatePersonResult({key: 'directorResult', value: list});
            },
            directorChangeHandler(value) {
                this.updatePerson({key: 'director', idList: value});
            },
            scenaristSuccessHandler(list) {
                this.updatePersonResult({key: 'scenaristResult', value: list});
            },
            scenaristChangeHandler(value) {
                this.updatePerson({key: 'scenarist', idList: value});
            },
            //  人物即时搜索方法结束
            setSortedList(list) {
                this.setVideoList({list});
                this.closeSortDialog();
            }
        }
    };
</script>
<style lang="less" scoped>
.sort-btn {
    padding-left: 20px;
}
.text-info {
    line-height: 38px;
    margin-left: 10px;
}
.btn-style {
    background-color: transparent;
}
.image-list-wrapper {
    margin-top: 20px;
    padding-left: 20px;
}
</style>
