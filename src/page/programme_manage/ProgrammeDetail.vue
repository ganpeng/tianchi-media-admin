<!--添加节目-->
<template>
    <div class="program-container">
        <h2 class="content-title">{{getPageName}}</h2>
        <div class="seperator-line"></div>
        <el-row>
            <programme-basic-info v-if="status === 1"></programme-basic-info>
            <el-col :span="24" v-if="status !== 1">
                <el-form :rules="rules" ref="createProgramForm" status-icon :model="programme" label-width="120px" class="form-block" @submit.native.prevent>
                    <el-col :span="12" style="border-right: 1px solid #252D3F;">
                        <h2 class="content-sub-title">节目基本信息</h2>
                        <el-col :span="18">
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
                                    type="date"
                                    placeholder="选择年">
                                </el-date-picker>
                            </el-form-item>
                            <el-form-item label="所属地区" prop="produceAreaList">
                                <div id="area-sort" class="my-tags">
                                    <draggable v-model="produceAreaList">
                                        <el-tag
                                            :key="index"
                                            v-for="(area, index) in areaLabel(produceAreaList)"
                                            closable
                                            :disable-transitions="false"
                                            @close="deleteAreaHandler(area.code)">
                                            {{area.name}}
                                        </el-tag>
                                    </draggable>
                                </div>
                                <area-search
                                    :handleSelect="selectAreaHandler"
                                ></area-search>
                            </el-form-item>
                            <el-form-item label="节目分类" prop="categoryList">
                                <div id="category-sort" class="my-tags">
                                    <draggable v-model="categoryList">
                                        <el-tag
                                            :key="index"
                                            v-for="(category, index) in categoryList"
                                            closable
                                            :disable-transitions="false"
                                            @close="deleteCategoryHandler(category.id)">
                                            {{category.name}}
                                        </el-tag>
                                    </draggable>
                                </div>
                                <category-search
                                    :handleSelect="selectCategoryHandler"
                                ></category-search>
                                <el-button class="btn-style-two" v-if="!readonly" type="primary" @click="gotoProgramTypePage" plain>新增</el-button>
                            </el-form-item>
                            <el-form-item label="节目类型" prop="typeList">
                                <div id="type-sort" class="my-tags">
                                    <draggable v-model="typeList">
                                        <el-tag
                                            :key="index"
                                            v-for="(type, index) in typeList"
                                            closable
                                            :disable-transitions="false"
                                            @close="deleteTypeHandler(type.id)">
                                            {{type.name}}
                                        </el-tag>
                                    </draggable>
                                </div>
                                <type-search
                                    :handleSelect="selectTypeHandler"
                                ></type-search>
                            </el-form-item>
                            <el-form-item label="关键字" prop="tagList">
                                <div id="tag-sort" class="my-tags">
                                    <draggable v-model="tagList">
                                        <el-tag
                                            :key="index"
                                            v-for="(tag, index) in tagList"
                                            closable
                                            :disable-transitions="false"
                                            @close="deleteTagHandler(tag)">
                                            {{tag}}
                                        </el-tag>
                                    </draggable>
                                </div>
                                <tag-search :handleSelect="selectTagHandler"></tag-search>
                                <el-button class="btn-style-two" v-if="!readonly" type="primary" plain @click="addprogrammeTagHandler">新增</el-button>
                            </el-form-item>
                            <el-form-item label="节目主演">
                                <label for="leadActor"></label>
                                <div class="my-tags">
                                    <draggable v-model="leadActor">
                                        <el-tag
                                            :key="index"
                                            v-for="(person, index) in leadActor"
                                            closable
                                            :disable-transitions="false"
                                            @close="deleteChiefActorHandler(person.id)">
                                            {{person.name}}
                                        </el-tag>
                                    </draggable>
                                </div>
                                <search-person
                                    :handleSelect="selectChiefActorHandler"
                                ></search-person>
                                <el-button class="btn-style-two" v-if="!readonly" type="primary" plain @click="createPersonDialogVisible = true">新增</el-button>
                            </el-form-item>
                            <el-form-item label="节目导演">
                                <label for="director"></label>
                                <div id="director-sort" class="my-tags">
                                    <draggable v-model="director">
                                        <el-tag
                                            :key="index"
                                            v-for="(person, index) in director"
                                            closable
                                            :disable-transitions="false"
                                            @close="deleteDirectorHandler(person.id)">
                                            {{person.name}}
                                        </el-tag>
                                    </draggable>
                                </div>
                                 <search-person
                                    :handleSelect="selectDirectorHandler"
                                ></search-person>
                                <el-button class="btn-style-two" v-if="!readonly" type="primary" icon="el-icon-plus" plain @click="createPersonDialogVisible = true">新增</el-button>
                            </el-form-item>
                            <el-form-item label="节目编剧">
                                <label for="scenarist"></label>
                                <div id="scenarist-sort" class="my-tags">
                                    <draggable v-model="scenarist">
                                        <el-tag
                                            :key="index"
                                            v-for="(person, index) in scenarist"
                                            closable
                                            :disable-transitions="false"
                                            @close="deleteScenaristHandler(person.id)">
                                            {{person.name}}
                                        </el-tag>
                                    </draggable>
                                </div>
                                 <search-person
                                    :handleSelect="selectScenaristHandler"
                                ></search-person>
                                <el-button class="btn-style-two" v-if="!readonly" type="primary" plain @click="createPersonDialogVisible = true">新增</el-button>
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
                                <el-button class="btn-style-two" v-if="!readonly" type="primary" plain @click="addSelectItemHandler('licenceList')">新增</el-button>
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
                                <el-button class="btn-style-two" v-if="!readonly" type="primary" plain @click="addSelectItemHandler('copyrightReserverList')">新增</el-button>
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
                                <el-button class="btn-style-two" v-if="!readonly" type="primary" plain @click="addSelectItemHandler('announcerList')">新增</el-button>
                            </el-form-item>
                            <el-form-item v-if="isMovie" label="规格" prop="specList">
                                <div class="my-tags">
                                    <draggable v-model="specList">
                                        <el-tag
                                            :key="index"
                                            v-for="(item, index) in specList"
                                            closable
                                            :disable-transitions="false"
                                            @close="deleteSpecHandler(item)">
                                            {{item}}
                                        </el-tag>
                                    </draggable>
                                </div>
                                <spec-search
                                    :handleSelect="selectSpecHandler"
                                ></spec-search>
                            </el-form-item>
                            <el-form-item v-show="isEducation" label="年级" prop="gradeList">
                                <div id="grade-sort" class="my-tags">
                                    <draggable v-model="gradeList">
                                        <el-tag
                                            :key="index"
                                            v-for="(item, index) in gradeList"
                                            closable
                                            :disable-transitions="false"
                                            @close="deleteGradeHandler(item)">
                                            {{item}}
                                        </el-tag>
                                    </draggable>
                                </div>
                                <grade-search
                                    :handleSelect="selectGradeHandler"
                                ></grade-search>
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
                                <el-button class="btn-style-two" v-if="!readonly" type="primary" plain @click="addSelectItemHandler('contestList')">新增</el-button>
                            </el-form-item>
                            <el-form-item label="播放平台">
                                <div id="platform-sort" class="my-tags">
                                    <draggable v-model="platformList">
                                        <el-tag
                                            :key="index"
                                            v-for="(item, index) in platformList"
                                            closable
                                            :disable-transitions="false"
                                            @close="deletePlatformHandler(item)">
                                            {{item}}
                                        </el-tag>
                                    </draggable>
                                </div>
                                <plat-form-search
                                    :handleSelect="selectPlatformHandler"
                                ></plat-form-search>
                                <el-button class="btn-style-two" v-if="!readonly" type="primary" plain @click="addSelectItemHandler('platformList')">新增</el-button>
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
                            <el-form-item label="播放量" prop="playCountBasic">
                                <el-input
                                    :disabled="readonly"
                                    :value="programme.playCountBasic"
                                    @input="inputHandler($event, 'playCountBasic')">
                                </el-input>
                            </el-form-item>
                        </el-col>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="节目海报">
                            <span class="little-tips">(240*350 六分位图必传)</span>
                        </el-form-item>
                        <el-col :span="24" id="upload-image">
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
                            </div>
                            <div class="image-list-wrapper">
                                <thumbnail
                                    :removeSign="!readonly"
                                    :imageList="programme.posterImageList"
                                    v-on:removeImage="_deletePosterImage">
                                </thumbnail>
                            </div>
                        </el-col>
                    </el-col>
                </el-form>
            </el-col>
        </el-row>
        <el-row>
            <div class="seperator-line"></div>
            <el-col :span="24">
                <div class="preview-sort clearfix">
                    <h4 class="content-sub-title">
                        节目视频
                        <span class="count"></span>
                        <span class="count">1个正片</span>
                    </h4>
                    <el-button
                        class="float-left btn-style-four contain-svg-icon"
                        v-if="!readonly" @click="showUploadDialog">
                        <svg-icon
                            icon-class="video"
                            class-name="svg-box">
                        </svg-icon>
                        关联视频
                    </el-button>
                    <el-button
                        class="float-left btn-style-four"
                        v-if="!readonly && video.list.length > 1"
                        type="primary"
                        @click="showSortDialog"
                        plain>视频排序</el-button>
                </div>
                <programme-table title="已添加视频列表" :status="status" :data-list="video.list"></programme-table>
            </el-col>
        </el-row>
        <div class="fixed-btn-container">
            <el-button class="btn-style-two" v-if="status === 0" type="primary" @click="_createProgramme">创建</el-button>
            <el-button class="btn-style-two" v-if="status === 2" type="primary" @click="_editProgramme">保存</el-button>
            <el-button class="btn-style-three" @click="goBack" plain>返回列表</el-button>
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
    import draggable from 'vuedraggable';
    import { mapMutations, mapGetters, mapActions } from 'vuex';
    import _ from 'lodash';
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

    //  新加
    import SearchPerson from '../../components/custom_components/custom/SearchPerson';
    import CategorySearch from './CategorySearch';
    import TypeSearch from './TypeSearch';
    import AreaSearch from './AreaSearch';
    import TagSearch from './TagSearch';
    import PlatFormSearch from './PlatFormSearch';
    import GradeSearch from './GradeSearch';
    import SpecSearch from './SpecSearch';

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
            ProgrammeBasicInfo,
            SearchPerson,
            CategorySearch,
            TypeSearch,
            AreaSearch,
            TagSearch,
            PlatFormSearch,
            GradeSearch,
            SpecSearch,
            draggable
        },
        props: {
            status: { // status 有三种状态，0代表创建 "create", 1代表显示 "display", 2代表编辑 "edit"
                type: Number
            }
        },
        mounted() {
            this.resetProgramme();
            this.getProgrammeTagList();
            this.getProgrammeCategory();
        },
        data() {
            return {
                sortMessage: '',
                isLoading: false,
                imageUploadDialogVisible: false,
                videoUploadDialogVisible: false,
                createPersonDialogVisible: false,
                sortDialogVisible: false,
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
                role: 'programme/role',
                video: 'programme/video',
                isTvPlay: 'programme/isTvPlay',
                isMovie: 'programme/isMovie',
                isEducation: 'programme/isEducation',
                isSports: 'programme/isSports',
                areaLabel: 'programme/areaLabel'
            }),
            //  拖拽排序的字段
            produceAreaList: {
                get() {
                    return this.programme.produceAreaList;
                },
                set(value) {
                    this.updateProgramme({key: 'produceAreaList', value});
                }
            },
            categoryList: {
                get() {
                    return this.programme.categoryList;
                },
                set(value) {
                    this.updateProgramme({key: 'categoryList', value});
                }
            },
            typeList: {
                get() {
                    return this.programme.typeList;
                },
                set(value) {
                    this.updateProgramme({key: 'typeList', value});
                }
            },
            tagList: {
                get() {
                    return this.programme.tagList;
                },
                set(value) {
                    this.updateProgramme({key: 'tagList', value});
                }
            },
            leadActor: {
                get() {
                    return this.programme.leadActor;
                },
                set(value) {
                    this.updateProgramme({key: 'leadActor', value});
                }
            },
            director: {
                get() {
                    return this.programme.director;
                },
                set(value) {
                    this.updateProgramme({key: 'director', value});
                }
            },
            scenarist: {
                get() {
                    return this.programme.scenarist;
                },
                set(value) {
                    this.updateProgramme({key: 'scenarist', value});
                }
            },
            gradeList: {
                get() {
                    return this.programme.gradeList;
                },
                set(value) {
                    this.updateProgramme({key: 'gradeList', value});
                }
            },
            platformList: {
                get() {
                    return this.programme.platformList;
                },
                set(value) {
                    this.updateProgramme({key: 'platformList', value});
                }
            },
            specList: {
                get() {
                    return this.programme.specList;
                },
                set(value) {
                    this.updateProgramme({key: 'specList', value});
                }
            },
            //  拖拽排序的字段结束
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
                        return '添加节目';
                    case 1:
                        return '节目详情';
                    case 2:
                        return '节目编辑';
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
                updateProgramme: 'programme/updateProgramme',
                deleteTempList: 'programme/deleteTempList',
                resetProgramme: 'programme/resetProgramme',
                addPosterImage: 'programme/addPosterImage',
                deletePosterImage: 'programme/deletePosterImage',
                setCoverImage: 'programme/setCoverImage',
                setVideoList: 'programme/setVideoList',
                // 视频video
                updateSearchFields: 'video/updateSearchFields',
                //  新的人物实时搜索
                addPersonByRole: 'programme/addPersonByRole',
                deletePersonById: 'programme/deletePersonById',
                //  新的分类类型
                addCategoryToList: 'programme/addCategoryToList',
                addTypeToList: 'programme/addTypeToList',
                deleteCategoryOrTypeById: 'programme/deleteCategoryOrTypeById',
                //  新的地区搜索
                addAreaToList: 'programme/addAreaToList',
                deleteAreaByCode: 'programme/deleteAreaByCode',
                //  新的关键字搜索
                addTagToList: 'programme/addTagToList',
                deleteTagByName: 'programme/deleteTagByName',
                //  新的播放平台搜索
                addPlatformToList: 'programme/addPlatformToList',
                deletePlatformByName: 'programme/deletePlatformByName',
                //  新的年级搜索
                addGradeToList: 'programme/addGradeToList',
                deleteGradeByName: 'programme/deleteGradeByName',
                //  新的规格搜索
                addSpecToList: 'programme/addSpecToList',
                deleteSpecByName: 'programme/deleteSpecByName'
            }),
            ...mapActions({
                // 新加
                updateProgrammeById: 'programme/updateProgrammeById',
                createMultProgrammeVideo: 'programme/createMultProgrammeVideo',
                getDict: 'programme/getDict',
                // 新加结束
                createProgramme: 'programme/createProgramme',
                getProgrammeCategory: 'programme/getProgrammeCategory',
                getProgrammeVideoListById: 'programme/getProgrammeVideoListById',
                getProgrammeTagList: 'programme/getProgrammeTagList',
                deleteProgramme: 'programme/deleteProgramme'
            }),
            //  人物搜索
            selectChiefActorHandler(person) {
                this.addPersonByRole({role: 'leadActor', person});
            },
            deleteChiefActorHandler(id) {
                this.deletePersonById({id, key: 'leadActor'});
            },
            selectDirectorHandler(person) {
                this.addPersonByRole({role: 'director', person});
            },
            deleteDirectorHandler(id) {
                this.deletePersonById({id, key: 'director'});
            },
            selectScenaristHandler(person) {
                this.addPersonByRole({role: 'scenarist', person});
            },
            deleteScenaristHandler(id) {
                this.deletePersonById({id, key: 'scenarist'});
            },
            //  人物搜索结束
            //  类型和分类搜索
            selectCategoryHandler(category) {
                this.addCategoryToList({category});
            },
            deleteCategoryHandler(id) {
                this.deleteCategoryOrTypeById({id, key: 'categoryList'});
            },
            selectTypeHandler(type) {
                this.addTypeToList(type);
            },
            deleteTypeHandler(id) {
                this.deleteCategoryOrTypeById({id, key: 'typeList'});
            },
            //  类型和分类搜索结束
            // 地区开始
            selectAreaHandler(area) {
                this.addAreaToList({area});
            },
            deleteAreaHandler(code) {
                this.deleteAreaByCode({code});
            },
            //  地区结束
            // 关键字搜索开始
            selectTagHandler(tag) {
                this.addTagToList({tag});
            },
            deleteTagHandler(tag) {
                this.deleteTagByName({tag});
            },
            //  关键字搜索结束
            //  播放平台搜索开始
            selectPlatformHandler(platform) {
                this.addPlatformToList({platform});
            },
            deletePlatformHandler(platform) {
                this.deletePlatformByName({platform});
            },
            //  播放平台搜索结束
            //  年级搜索开始
            selectGradeHandler(grade) {
                this.addGradeToList({grade});
            },
            deleteGradeHandler(grade) {
                this.deleteGradeByName({grade});
            },
            //  年级搜索结束
            //  规格搜索开始
            selectSpecHandler(spec) {
                this.addSpecToList({spec});
            },
            deleteSpecHandler(spec) {
                this.deleteSpecByName({spec});
            },
            //  规格搜索结束
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
                                                                this.$message.error(`视频保存失败: ${videoRes.message}`);
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
                                                message: `节目保存失败: ${res.message}`
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
                                                                let message = `视频保存失败: ${videoRes.message}`;
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
                                                message: `节目保存失败: ${res.message}`
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
                            let index = this.global.platformList.findIndex((item) => item.value === value);
                            if (index >= 0) {
                                return `新播放平台${value}已经存在`;
                            } else {
                                return true;
                            }
                        } else if (key === 'programmeTagList') {
                            let index = this.global.programmeTagList.findIndex((item) => item === value);
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
            getVideoListName(list) {
                return list.map((id) => {
                    return this.video.tempList.find((video) => video.storageVideoId === id);
                }).map((video) => {
                    return video && video.originName ? video.originName : '';
                }).join(', ');
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
.content-sub-title {
    .count {
        font-size: 14px;
        color: #6F7480;
    }
}
.preview-sort {
    margin-bottom: 20px;
}
.image-list-wrapper {
    margin-top: 20px;
    padding-left: 20px;
}
.little-tips {
    font-size: 12px;
    color: #909399;
}
</style>
