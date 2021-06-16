<!--添加节目-->
<template>
    <div class="program-container">
        <h2 class="content-title">{{getPageName}}</h2>
        <div class="seperator-line"></div>
        <programme-basic-info v-if="status === 1"></programme-basic-info>
        <el-row>
            <el-col :span="24" v-if="status !== 1" style="margin: 20px 0;">
                <el-form :rules="rules" ref="createProgramForm" status-icon :model="programme" label-width="120px" class="my-form" @submit.native.prevent>
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
                                    :maxlength="15"
                                    :value="programme.desc"
                                    :disabled="readonly"
                                    @input="inputHandler($event, 'desc')"
                                ></el-input>
                            </el-form-item>
                            <el-form-item label="节目简介" prop="description">
                                <div class="desc-wrapper">
                                    <el-input
                                        type="textarea"
                                        :disabled="readonly"
                                        @input="inputHandler($event, 'description')"
                                        :maxlength="300"
                                        placeholder="请输入内容"
                                        :value="programme.description">
                                    </el-input>
                                    <span class="desc-prompt">已输入{{programme.description.length}}/300字</span>
                                </div>
                            </el-form-item>
                            <el-form-item label="上映时间" prop="releaseAt">
                                <el-date-picker
                                    :disabled="readonly"
                                    :value="programme.releaseAt"
                                    @input="inputHandler($event, 'releaseAt')"
                                    type="date"
                                    placeholder="请选择上映时间">
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
                            <el-form-item label="版式类型" prop="programmeTemplate">
                                <el-select
                                    :disabled="readonly"
                                    :value="programme.programmeTemplate"
                                    clearable
                                    placeholder="请选择"
                                    @input="inputHandler($event, 'programmeTemplate')"
                                >
                                    <el-option
                                        v-for="item in programmeTemplateOptions"
                                        :key="item.value"
                                        :label="item.label"
                                        :value="item.value">
                                    </el-option>
                                </el-select>
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
                                <el-button class="btn-style-four min" v-if="!readonly" type="primary" @click="addprogrammeTagHandler">新增</el-button>
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
                                <el-button class="btn-style-four min" v-if="!readonly" type="primary" @click="createPersonDialogVisible = true">新增</el-button>
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
                                <el-button class="btn-style-four min" v-if="!readonly" type="primary" @click="createPersonDialogVisible = true">新增</el-button>
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
                                <el-button class="btn-style-four min" v-if="!readonly" type="primary" @click="createPersonDialogVisible = true">新增</el-button>
                            </el-form-item>
                            <el-form-item label="版权起始日期" prop="copyrightRange">
                                <el-date-picker
                                    :value="programme.copyrightRange"
                                    :disabled="readonly"
                                    type="daterange"
                                    unlink-panels
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
                                <el-button class="btn-style-four min" v-if="!readonly" type="primary" @click="addSelectItemHandler('licenceList')">新增</el-button>
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
                                <el-button class="btn-style-four min" v-if="!readonly" type="primary" @click="addSelectItemHandler('copyrightReserverList')">新增</el-button>
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
                                <el-button class="btn-style-four min" v-if="!readonly" type="primary" @click="addSelectItemHandler('announcerList')">新增</el-button>
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
                                <el-button class="btn-style-four min" v-if="!readonly" type="primary" @click="addSelectItemHandler('contestList')">新增</el-button>
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
                                <el-button class="btn-style-four min" v-if="!readonly" type="primary" @click="addSelectItemHandler('platformList')">新增</el-button>
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
                        <h2 class="content-sub-title">&nbsp;</h2>
                        <el-form-item label="适用客户端" prop="applicableClientList">
                            <el-checkbox :value="clientChecked('APP')" @change="clientCheckedHandler($event, 'APP')">APP</el-checkbox>
                            <el-checkbox :value="clientChecked('TV')" @change="clientCheckedHandler($event, 'TV')">TV</el-checkbox>
                        </el-form-item>
                        <el-form-item label="节目角标">
                            <div v-if="showMark" class="mark-container">
                                <div class="mark-item">
                                    右上角：
                                    <el-select
                                        @input="customMarkSelectHandler"
                                        :value="rightTop"
                                        value-key="id"
                                        clearable
                                        class="mark-select"
                                        placeholder="请选择">
                                        <el-option
                                            v-for="item in filterCustomMarkOptions"
                                            :key="item.id"
                                            :label="item.caption"
                                            :value="item">
                                        </el-option>
                                    </el-select>
                                </div>
                                <div class="mark-item">
                                    右下角：
                                    <el-select
                                        @input="rightBottomMarkSelectHandler"
                                        :value="rightBottom"
                                        clearable
                                        class="mark-select"
                                        placeholder="请选择">
                                        <el-option
                                            v-for="(item, index) in rightBottomCustomMarkOptions"
                                            :key="index"
                                            :label="item.label"
                                            :value="item.value">
                                        </el-option>
                                    </el-select>
                                </div>
                            </div>
                        </el-form-item>
                        <el-form-item label="节目状态" prop="visible">
                            <el-radio @input="visibleHandler(true, 'visible')" :value="programme.visible" :label="true">上架</el-radio>
                            <el-radio @input="visibleHandler(false, 'visible')" :value="programme.visible" :label="false">下架</el-radio>
                        </el-form-item>
                        <el-form-item label="更新规则">
                            <el-col :span="18">
                                <el-input
                                    :disabled="readonly"
                                    :maxlength="40"
                                    @input="inputHandler($event, 'updateRule')"
                                    :value="programme.updateRule">
                                </el-input>
                            </el-col>
                        </el-form-item>
                        <el-form-item label="付费情况" prop="paymentType">
                            <el-select
                                :value="programme.paymentType"
                                clearable
                                placeholder="请选择"
                                @input="inputHandler($event, 'paymentType')"
                            >
                                <el-option
                                    v-for="item in paymentOptions"
                                    :key="item.value"
                                    :label="item.label"
                                    :value="item.value">
                                </el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item v-if="programme.paymentType === 'EXTRAS'" label="付费金额" prop="price">
                            <el-input
                                :disabled="readonly"
                                type="number"
                                placeholder="请填写金额，小数点后保留两位小数"
                                @input="inputHandler($event, 'price')"
                                :value="programme.price">
                            </el-input>
                        </el-form-item>
                        <!-- <div v-if="showTvImages" class="tv-images"> -->
                        <div class="tv-images">
                            <el-form-item label="节目海报">
                                <p class="little-tips">(260*380)六分位图必传</p>
                            </el-form-item>
                            <div class="wrapper clearfix">
                                <multi-image-uploader
                                    :imageList="tvImageList"
                                    :deleteImageHandler="deleteImageHandler"
                                    :imageUploadedHandler="imageUploadedHandler"
                                    :allowResolutions="allowResolutions"
                                    :validator="imageUploadValidator"
                                ></multi-image-uploader>
                            </div>
                        </div>
                        <!-- 新增加的移动端的图片 -->
                        <div class="app-images">
                            <el-form-item label="移动端图片">
                                <p class="little-tips">(384*561, 330*186)</p>
                            </el-form-item>
                            <div class="wrapper clearfix">
                                <multi-image-uploader
                                    id="appImageUploader"
                                    :imageList="appImageList"
                                    :deleteImageHandler="deleteAppImageHandler"
                                    :imageUploadedHandler="appImageUploadHandler"
                                    :allowResolutions="appAllowResolutions"
                                ></multi-image-uploader>
                            </div>
                        </div>
                    </el-col>
                </el-form>
            </el-col>
        </el-row>
        <div class="seperator-line"></div>
        <div class="programme-video-field">
            <h4 class="content-sub-title" style="margin-left:20px;">
                节目视频
                <span v-if="getFeature > 0" class="count">{{getFeature}}个正片</span><span v-if="getPreShow > 0" class="count">, {{getPreShow}}个预告片</span><span v-if="getExtras > 0" class="count">, {{getExtras}}个花絮</span><span v-if="getHighLight > 0" class="count">, {{getHighLight}}个看点</span>
            </h4>
            <div class="preview-sort clearfix">
                <el-button
                    class="float-left btn-style-four contain-svg-icon"
                    v-if="!readonly" @click="showUploadDialog">
                    <svg-icon
                        icon-class="connect_video"
                        class-name="svg-box">
                    </svg-icon>
                    关联视频
                </el-button>
                <el-button
                    class="float-left btn-style-four"
                    v-if="!readonly && video.list.length > 1"
                    type="primary"
                    @click="showSortDialog">
                    <svg-icon icon-class="sort">
                    </svg-icon>
                    视频排序
                </el-button>
            </div>
            <programme-table title="已添加视频列表" :status="status" :data-list="video.list"></programme-table>
        </div>
        <div class="fixed-btn-container">
            <el-button class="btn-style-two" v-if="status === 0" type="primary" @click="_createProgramme">创建</el-button>
            <el-button class="btn-style-two" v-if="status === 2" type="primary" @click="_editProgramme">保存</el-button>
            <el-button class="btn-style-two" v-if="status === 1" type="primary" @click="editProgramme">编辑</el-button>
            <el-button class="btn-style-three" @click="goBack" plain>返回列表</el-button>
        </div>
        <create-person-dialog :createPersonDialogVisible="createPersonDialogVisible" v-on:changePersonDialogStatus="closePersonDialog($event)"></create-person-dialog>
        <upload-programme-video-dialog :videoStatus="0" :videoUploadDialogVisible="videoUploadDialogVisible" v-on:changeVideoDialogStatus="closeVideoDialog($event)"></upload-programme-video-dialog>
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
    import CreatePersonDialog from './CreatePersonDialog';
    import ProgrammeTable from './ProgrammeTable';
    import SortDialog from 'sysComponents/custom_components/custom/SortDialog';
    import dimension from '@/util/config/dimension';
    import role from '@/util/config/role';
    import PersonSelect from './PersonSelect';
    import ProgrammeBasicInfo from './ProgrammeBasicInfo';
    import {checkScore, checkCategory, checkPositiveInteger, checkPrice} from '@/util/formValidate';
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
    import MultiImageUploader from 'sysComponents/custom_components/custom/MultiImageUploader';

    export default {
        name: 'ProgrammeDetail',
        components: {
            CreatePersonDialog,
            ProgrammeTable,
            UploadProgrammeVideoDialog,
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
            draggable,
            MultiImageUploader
        },
        props: {
            status: { // status 有三种状态，0代表创建 "create", 1代表显示 "display", 2代表编辑 "edit"
                type: Number
            }
        },
        mounted() {
            this.resetProgramme();
            this.getProgrammeTagList();
            this.$service.getCustomMarkList()
                .then((res) => {
                    if (res && res.code === 0) {
                        this.customMarkOptions = res.data;
                        this.showMark = true;
                    }
                });

            let content = document.querySelector('.content-wrapper');
            content.scrollTop = 0;
        },
        created() {
            let {id} = this.$route.params;
            if (id) {
                this.getProgrammeAndGetProgrammeCategory(id)
                    .then((res) => {
                        let categoryList = res[0].data ? res[0].data.categoryList.map((item) => item.id) : [];
                        this.getDict(categoryList);
                        this.getProgrammeVideoListById(id);
                        if (res[0] && res[0].code === 0) {
                            this.getFeatureVideoList({id: id, pageSize: res[0].data.featureVideoCount});
                        }
                    });
            } else {
                this.getProgrammeCategory();
            }
        },
        beforeRouteLeave(to, from, next) {
            let {name} = to;
            if (name !== 'DisplayProgramme' && name !== 'EditProgramme') {
                this.resetProgrammeSearchFields();
                this.resetProgrammePagination();
            }
            next();
        },
        data() {
            return {
                sortMessage: '',
                isLoading: false,
                videoUploadDialogVisible: false,
                createPersonDialogVisible: false,
                sortDialogVisible: false,
                subjectOptions: role.SUBJECT,
                paymentOptions: role.PAYMENT_OPTIONS,
                size: dimension.PROGRAMME_DIMENSION,
                customMarkOptions: [],
                showMark: false,
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
                    // description: [
                    //     { required: true, message: '请输入节目简介' }
                    // ],
                    price: [
                        { required: true, message: '请输入金额' },
                        { validator: checkPrice }
                    ],
                    paymentType: [
                        { required: true, message: '请选择付费情况' }
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
                    ],
                    programmeTemplate: [
                        { required: true, message: '请选择版式类型' }
                    ],
                    visible: [
                        { required: true, message: '请选择节目状态' }
                    ],
                    applicableClientList: [
                        { required: true, message: '请选择适用客户端' }
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
                isShow: 'programme/isShow',
                isEducation: 'programme/isEducation',
                isSports: 'programme/isSports',
                areaLabel: 'programme/areaLabel'
            }),
            // 角标下拉选项
            filterCustomMarkOptions() {
                if (this.withApp && !this.showTvImages) {
                    return this.customMarkOptions.filter((item) => _.get(item, 'appImage.uri'));
                }

                if (!this.withApp && this.showTvImages) {
                    return this.customMarkOptions.filter((item) => _.get(item, 'image.uri'));
                }

                if (this.withApp && this.showTvImages) {
                    return this.customMarkOptions;
                }

                return [];
            },
            //  右下角的角标处理逻辑
            rightBottomCustomMarkOptions() {
                let options = [];
                let hasFeature = this.video.list.filter((item) => item.type === 'FEATURE').length > 0;
                if (this.isShow) {
                    if (hasFeature) {
                        options.push({label: '更新至', value: 1});
                    } else {
                        options = options.filter((item) => item.value !== 1);
                    }
                } else {
                    if (this.programme.totalSets) {
                        options.push({label: '更新至', value: 1});
                    } else {
                        options = options.filter((item) => item.value !== 1);
                    }
                }

                if (this.programme.score) {
                    options.push({label: '评分', value: 2});
                } else {
                    options = options.filter((item) => item.value !== 2);
                }
                return options;
            },
            rightBottom() {
                let value = '';
                let leftBottom = _.get(this.programme, `cornerMark.leftBottom`);
                let rightBottom = _.get(this.programme, `cornerMark.rightBottom`);
                if (!_.isNull(leftBottom) && _.isNull(rightBottom)) {
                    value = 1;
                }

                if (_.isNull(leftBottom) && !_.isNull(rightBottom)) {
                    value = 2;
                }
                return value;
            },
            //  右下角角标处理逻辑结束
            programmeTemplateOptions() {
                return role.PROGRAMME_TEMPLATE_OPTIONS;
            },
            getFeature() {
                return this.video.list.filter((video) => {
                    return video.type === 'FEATURE';
                }).length;
            },
            getPreShow() {
                return this.video.list.filter((video) => {
                    return video.type === 'PRE_SHOW';
                }).length;
            },
            getExtras() {
                return this.video.list.filter((video) => {
                    return video.type === 'EXTRAS';
                }).length;
            },
            getHighLight() {
                return this.video.list.filter((video) => {
                    return video.type === 'HIGH_LIGHT';
                }).length;
            },
            allowResolutions() {
                return role.PROGRAMME_ALLOW_PICTURE_DIMENSIONS;
            },
            appAllowResolutions() {
                return role.APP_PROGRAMME_ALLOW_PICTURE_DIMENSIONS;
            },
            //  适用客户端
            clientChecked() {
                return (key) => {
                    let index = this.programme.applicableClientList.findIndex((item) => item === key);
                    return index > -1;
                };
            },
            showTvImages() {
                let index = this.programme.applicableClientList.findIndex((item) => item === 'TV');
                return index > -1;
            },
            withApp() {
                let index = this.programme.applicableClientList.findIndex((item) => item === 'APP');
                return index > -1;
            },
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
            leftTopDisabled() {
                return this.programme.platformList.length === 0;
            },
            leftBottomDisabled() {
                let hasFeature = this.video.list.filter((item) => item.type === 'FEATURE').length > 0;
                if (this.isShow) {
                    if (hasFeature) {
                        return false;
                    } else {
                        return true;
                    }
                } else {
                    return !this.programme.totalSets;
                }
            },
            rightTop() {
                return _.get(this.programme, 'cornerMark.rightTop');
            },
            tvImageList() {
                let list = this.programme.posterImageList.filter((posterImage) => {
                    let index = role.PROGRAMME_ALLOW_PICTURE_DIMENSIONS.findIndex((item) => {
                        return parseInt(item.width) === parseInt(posterImage.width) && parseInt(item.height) === parseInt(posterImage.height);
                    });
                    return index > -1;
                });
                return list;
            },
            appImageList() {
                let list = [];
                if (_.get(this.programme, 'coverImageForApp.id')) {
                    list.push(this.programme.coverImageForApp);
                }
                if (_.get(this.programme, 'horizontalCoverImageForApp.id')) {
                    list.push(this.programme.horizontalCoverImageForApp);
                }
                return list;
            }
        },
        methods: {
            ...mapMutations({
                addSelectItem: 'programme/addSelectItem',
                addProgrammeTag: 'programme/addProgrammeTag',
                updateProgramme: 'programme/updateProgramme',
                deleteTempList: 'programme/deleteTempList',
                resetProgramme: 'programme/resetProgramme',
                deletePosterImage: 'programme/deletePosterImage',
                setCoverImage: 'programme/setCoverImage',
                setVideoList: 'programme/setVideoList',
                resetProgrammeSearchFields: 'programme/resetProgrammeSearchFields',
                resetProgrammePagination: 'programme/resetProgrammePagination',
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
                deleteSpecByName: 'programme/deleteSpecByName',
                //  角标的操作
                updateProgrammeMark: 'programme/updateProgrammeMark',
                //  海报上传成功之后添加到海报列表中
                addImageToPosterImageList: 'programme/addImageToPosterImageList',
                deleteImageFromPosterImageListById: 'programme/deleteImageFromPosterImageListById',
                addImageToPosterImageListForApp: 'programme/addImageToPosterImageListForApp',
                deleteImageFromPosterImageListForAppById: 'programme/deleteImageFromPosterImageListForAppById',
                //  dev_v2.6 新增
                setImageForApp: 'programme/setImageForApp',
                clearImageForApp: 'programme/clearImageForApp'
            }),
            ...mapActions({
                // 新加
                updateProgrammeById: 'programme/updateProgrammeById',
                createMultProgrammeVideo: 'programme/createMultProgrammeVideo',
                editMultProgrammeVideo: 'programme/editMultProgrammeVideo',
                editEmptyProgrammeVideo: 'programme/editEmptyProgrammeVideo',
                getDict: 'programme/getDict',
                // 新加结束
                createProgramme: 'programme/createProgramme',
                getProgrammeCategory: 'programme/getProgrammeCategory',
                getProgrammeVideoListById: 'programme/getProgrammeVideoListById',
                getProgrammeTagList: 'programme/getProgrammeTagList',
                deleteProgramme: 'programme/deleteProgramme',

                getProgrammeAndGetProgrammeCategory: 'programme/getProgrammeAndGetProgrammeCategory',
                getFeatureVideoList: 'programme/getFeatureVideoList'
            }),
            getPrice(value) {
                return this.$util.bankersRounding(value / 100, 2);
            },
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
                this.clearvaidatorByProp('categoryList');
            },
            deleteCategoryHandler(id) {
                this.deleteCategoryOrTypeById({id, key: 'categoryList'});
                this.clearvaidatorByProp('categoryList');
            },
            selectTypeHandler(type) {
                this.addTypeToList(type);
                this.clearvaidatorByProp('typeList');
            },
            deleteTypeHandler(id) {
                this.deleteCategoryOrTypeById({id, key: 'typeList'});
                this.clearvaidatorByProp('typeList');
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
            //  清除提示
            clearvaidatorByProp(prop) {
                let _prop = _.get(this.programme, prop);
                if (_prop.length > 0) {
                    this.$refs.createProgramForm.clearValidate(prop);
                }
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
                                                    this.createMultProgrammeVideo(res.data)
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
            editProgramme() {
                let {id} = this.$route.params;
                this.$router.push({name: 'EditProgramme', params: {id}});
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
                                                    this.editMultProgrammeVideo()
                                                        .then((videoRes) => {
                                                            if (videoRes && videoRes.code === 0) {
                                                                this.deleteTempList();
                                                                this.getProgrammeVideoListById(id);
                                                                this.$message.success('保存成功');
                                                            } else {
                                                                let message = `视频保存失败: ${videoRes.message}`;
                                                                if (videoRes && videoRes.code === 3106) {
                                                                    message = `视频【${this.getVideoListName(videoRes.data)}】已经添加，不能重复添加`;
                                                                }
                                                                this.$message.error(message);
                                                            }
                                                            this.goBack();
                                                        });
                                                } else {
                                                    let message = this.sortMessage ? this.sortMessage : '请检查正片的集数/期号，必须按顺序填写，不能有部分填，部分没填的情况';
                                                    this.$message.error(message);
                                                }
                                            } else {
                                                this.editEmptyProgrammeVideo(id)
                                                    .then((videoRes) => {
                                                        if (videoRes && videoRes.code === 0) {
                                                            this.deleteTempList();
                                                            this.getProgrammeVideoListById(id);
                                                            this.$message({
                                                                type: 'success',
                                                                message: '保存成功'
                                                            });
                                                        } else {
                                                            let message = `视频保存失败: ${videoRes.message}`;
                                                            if (videoRes && videoRes.code === 3106) {
                                                                message = `视频【${this.getVideoListName(videoRes.data)}】已经添加，不能重复添加`;
                                                            }
                                                            this.$message.error(message);
                                                        }
                                                        this.goBack();
                                                    });
                                            }
                                        } else {
                                            if (res.code === 3110 || res.code === 3111) {
                                                this.$message.warning(this.$util.lowerFrameProgrammeErrorHandler(res));
                                            } else {
                                                this.$message({
                                                    type: 'error',
                                                    message: `节目保存失败: ${res.message}`
                                                });
                                            }
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
                this.$router.push({name: 'Category'});
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
            async visibleHandler(value, key) {
                try {
                    // let {id} = this.$route.params;
                    // if (this.status === 2) {
                    //     let {visible} = this.programme;
                    //     if (!value && visible) {
                    //         let res = await this.deleteProgramme(id);
                    //         if (res && res.code === 0) {
                    //             this.updateProgramme({key, value: !visible});
                    //         } else {
                    //             this.$message.warning(this.$util.lowerFrameProgrammeErrorHandler(res));
                    //             return false;
                    //         }
                    //     } else {
                    //         this.updateProgramme({key, value: !visible});
                    //     }
                    // } else {
                        this.updateProgramme({key, value});
                    // }
                } catch (err) {
                    console.log(err);
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
                const {posterImageList, visible} = this.programme;

                if (this.showTvImages) {
                    if (posterImageList && posterImageList.length < 1) {
                        this.$message({type: 'error', message: '推荐位六分位图必须上传且只能上传一张'});
                        return false;
                    }

                    //  260 * 380 或者 230 * 450 必须传一张
                    let sizeOne = posterImageList.findIndex((img) => {
                        return (parseInt(img.width) === 260 && parseInt(img.height) === 380) ||
                            (parseInt(img.width) === 240 && parseInt(img.height) === 350);
                    });

                    if (sizeOne < 0) {
                        this.$message({type: 'error', message: '推荐位六分位图必须上传且只能上传一张'});
                        return false;
                    }

                    // 设置默认图
                    this.setCoverImage();
                    if (_.isEmpty(this.programme.coverImage)) {
                        this.$message({type: 'error', message: '请选择默认的节目海报'});
                        return false;
                    }

                    if (visible === null) {
                        this.$message.error('请选择上下架状态');
                        return false;
                    }

                    if (visible && this.video.list.length === 0) {
                        this.$message.error('上架节目的关联视频不能为空');
                        return false;
                    }

                    if (visible && this.video.list.filter((item) => item.type === 'FEATURE').length === 0) {
                        this.$message.error('上架节目的关联视频正片不能为空');
                        return false;
                    }
                }
                next();
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
            },
            //  图片上传成功之后每次的回调
            imageUploadedHandler(image) {
                this.addImageToPosterImageList({image});
            },
            appImageUploadHandler(image) {
                this.setImageForApp({image});
                // this.addImageToPosterImageListForApp({image});
            },
            deleteImageHandler(id) {
                this.deleteImageFromPosterImageListById({id});
            },
            deleteAppImageHandler(id) {
                this.clearImageForApp({id});
                // this.deleteImageFromPosterImageListForAppById({id});
            },
            imageUploadValidator(fileList) {
                let onlyFileListOne = fileList.filter((item) => {
                    let {width, height} = item.demension;
                    return parseInt(width) === 260 && parseInt(height) === 380;
                });

                let onlyFileListTwo = fileList.filter((item) => {
                    let {width, height} = item.demension;
                    return parseInt(width) === 240 && parseInt(height) === 350;
                });

                if (onlyFileListOne.length > 1) {
                    this.$message.error('六分位图只能上传一张');
                    return false;
                }

                if (onlyFileListTwo.length > 1) {
                    this.$message.error('旧版六分位图只能上传一张');
                    return false;
                }
                return true;
            },
            appImageUploadValidator(fileList) {
                let onlyFileListOne = fileList.filter((item) => {
                    let {width, height} = item.demension;
                    return parseInt(width) === 351 && parseInt(height) === 507;
                });

                let onlyFileListTwo = fileList.filter((item) => {
                    let {width, height} = item.demension;
                    return parseInt(width) === 1089 && parseInt(height) === 612;
                });

                if (onlyFileListOne.length > 1) {
                    this.$message.error('“351*507尺寸图片只能上传一张');
                    return false;
                }

                if (onlyFileListTwo.length > 1) {
                    this.$message.error('1089*612尺寸图只能上传一张');
                    return false;
                }
                return true;
            },
            markChangeHandler(checked, key) {
                this.updateProgrammeMark({checked, key});
            },
            customMarkSelectHandler(rightTop) {
                let cornerMark = Object.assign({}, _.cloneDeep(this.programme.cornerMark), {rightTop});
                if (_.isEmpty(rightTop)) {
                    delete cornerMark.rightTop;
                }
                this.updateProgramme({key: 'cornerMark', value: cornerMark});
            },
            rightBottomMarkSelectHandler(value) {
                if (value === 1) {
                    this.updateProgrammeMark({checked: true, key: 'leftBottom'});
                    this.updateProgrammeMark({checked: false, key: 'rightBottom'});
                } else if (value === 2) {
                    this.updateProgrammeMark({checked: false, key: 'leftBottom'});
                    this.updateProgrammeMark({checked: true, key: 'rightBottom'});
                } else {
                    this.updateProgrammeMark({checked: false, key: 'leftBottom'});
                    this.updateProgrammeMark({checked: false, key: 'rightBottom'});
                }
            },
            //  适用客户端处理方法
            clientCheckedHandler(value, key) {
                let applicableClientList = _.cloneDeep(this.programme.applicableClientList);
                if (value) {
                    applicableClientList.push(key);
                } else {
                    applicableClientList = applicableClientList.filter((item) => item !== key);
                }
                applicableClientList = _.uniq(applicableClientList);
                this.updateProgramme({key: 'applicableClientList', value: applicableClientList});
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
.wrapper {
    margin-left: 42px;
}
.mark-container {
    display: flex;
    flex-wrap: wrap;
    .mark-item {
        font-size: 16px;
        color: #A8ABB3;
        font-weight: 400;
        width: 45%;
        .el-checkbox {
            padding: 0;
        }
        .el-select {
            width: 160px;
        }
    }
    label.el-checkbox {
        .el-checkbox__label {
            color: #A8ABB3;
        }
    }
    label.el-checkbox.is-disabled {
        span.el-checkbox__label {
            color: #A8ABB3;
        }
        opacity: 0.3;
    }
}
.on-off-the-shelf {
    display: flex;
    .on-off-the-shelf-time {
        margin: 0 10px;
    }
}
</style>
<style lang="scss">
.mark-container {
    .mark-select {
        &.el-select {
            .el-input {
                width: 160px;
            }
        }
    }
}
.el-checkbox__label {
    color: #A8ABB3;
    font-size: 16px;
    font-weight: 400;
}
</style>
