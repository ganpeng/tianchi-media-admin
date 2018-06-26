<!--添加节目-->
<template>
    <div class="program-container">
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>内容管理</el-breadcrumb-item>
            <el-breadcrumb-item>节目资源管理</el-breadcrumb-item>
            <el-breadcrumb-item>新增节目</el-breadcrumb-item>
        </el-breadcrumb>
        <el-row>
            <el-col :span="24">
                    <div class="block-title">节目基本信息</div>
                    <el-form :rules="rules" ref="createProgramForm" status-icon :model="programme" label-width="120px" class="form-block">
                        <el-col :span="8">
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
                                        :value="item.name">
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
                                <el-button v-if="!readonly" type="primary" @click="gotoProgramTypePage" plain>管理分类和类型</el-button>
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
                                        v-for="item in global.programmeTagList"
                                        :key="item"
                                        :label="item"
                                        :value="item">
                                    </el-option>
                                </el-select>
                                <el-button v-if="!readonly" type="primary" plain @click="addSelectItemHandler('programmeTagList')">新增关键字</el-button>
                            </el-form-item>
                            <el-form-item label="节目主演" prop="leadActorValue">
                                <label for="leadActor"></label>
                                <el-select
                                    :value="role('leadActor')"
                                    multiple
                                    filterable
                                    remote
                                    :disabled="readonly"
                                    placeholder="请输入人物名称"
                                    @change="updatePersonHandler($event, 'leadActor')"
                                    :remote-method="findLeadActor"
                                    :loading="isLeadActorLoading">
                                    <el-option
                                        v-for="item in programme.leadActorResult"
                                        :key="item.id"
                                        :label="item.name"
                                        :value="item.id">
                                    </el-option>
                                </el-select>
                                <el-button v-if="!readonly" type="primary" plain @click="createPersonDialogVisible = true">新增人物</el-button>
                            </el-form-item>
                            <el-form-item label="节目导演" prop="director">
                                <el-select
                                    :value="role('director')"
                                    multiple
                                    filterable
                                    remote
                                    :disabled="readonly"
                                    placeholder="请输入人物名称"
                                    @change="updatePersonHandler($event, 'director')"
                                    :remote-method="findDirector"
                                    :loading="isDirectorLoading">
                                    <el-option
                                        v-for="item in programme.directorResult"
                                        :key="item.id"
                                        :label="item.name"
                                        :value="item.id">
                                    </el-option>
                                </el-select>
                                <el-button v-if="!readonly" type="primary" plain @click="createPersonDialogVisible = true">新增人物</el-button>
                            </el-form-item>

                            <el-form-item label="节目编剧" prop="scenarist">
                                <el-select
                                    :value="role('scenarist')"
                                    multiple
                                    filterable
                                    remote
                                    :disabled="readonly"
                                    placeholder="请输入人物名称"
                                    @change="updatePersonHandler($event, 'scenarist')"
                                    :remote-method="findScenarist"
                                    :loading="isScenaristLoading">
                                    <el-option
                                        v-for="item in programme.scenaristResult"
                                        :key="item.id"
                                        :label="item.name"
                                        :value="item.id">
                                    </el-option>
                                </el-select>
                                <el-button v-if="!readonly" type="primary" plain @click="createPersonDialogVisible = true">新增人物</el-button>
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
                                    placeholder="请选择"
                                    @input="inputHandler($event, 'licence')"
                                >
                                    <el-option
                                        v-for="item in global.licenceList"
                                        :key="item"
                                        :label="item"
                                        :value="item">
                                    </el-option>
                                </el-select>
                                <el-button v-if="!readonly" type="primary" plain @click="addSelectItemHandler('licenceList')">新增牌照方</el-button>
                            </el-form-item>
                            <el-form-item label="版权方" prop="copyrightReserved">
                                <el-select
                                    :disabled="readonly"
                                    filterable
                                    :value="programme.copyrightReserved"
                                    placeholder="请选择"
                                    @input="inputHandler($event, 'copyrightReserved')"
                                >
                                    <el-option
                                        v-for="item in global.copyrightReserverList"
                                        :key="item"
                                        :label="item"
                                        :value="item">
                                    </el-option>
                                </el-select>
                                <el-button v-if="!readonly" type="primary" plain @click="addSelectItemHandler('copyrightReserverList')">新增版权方</el-button>
                            </el-form-item>
                            <el-form-item label="发行方" prop="announcer">
                                <el-select
                                    :disabled="readonly"
                                    filterable
                                    :value="programme.announcer"
                                    placeholder="请选择"
                                    @input="inputHandler($event, 'announcer')"
                                >
                                    <el-option
                                        v-for="item in global.announcerList"
                                        :key="item"
                                        :label="item"
                                        :value="item">
                                    </el-option>
                                </el-select>
                                <el-button v-if="!readonly" type="primary" plain @click="addSelectItemHandler('announcerList')">新增发行方</el-button>
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
                                    placeholder="请选择"
                                    @input="inputHandler($event, 'contest')"
                                >
                                    <el-option
                                        v-for="item in global.contestList"
                                        :key="item"
                                        :label="item"
                                        :value="item">
                                    </el-option>
                                </el-select>
                                <el-button v-if="!readonly" type="primary" plain @click="addSelectItemHandler('contestList')">新增赛事</el-button>
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
                                        v-for="item in global.platformList"
                                        :key="item"
                                        :label="item"
                                        :value="item">
                                    </el-option>
                                </el-select>
                                <el-button v-if="!readonly" type="primary" plain @click="addSelectItemHandler('platformList')">新增播放平台</el-button>
                            </el-form-item>
                            <el-form-item
                                :rules="isTvPlay ? [{ required: true, message: '请输入总集数' }] : []"
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
                            <el-form-item label="实际播放量">
                                <el-input
                                    :value="programme.playCountReal"
                                    disabled>
                                </el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="24">
                            <el-form-item label="节目图片">
                                <el-button v-if="!readonly" type="primary" @click="uploadImageHandler">添加节目图片<i class="el-icon-upload el-icon--right"></i></el-button>
                                <ul class="cover-list">
                                    <li v-for="(img, index) in programme.posterImageList" :key="index">
                                        <div
                                            class="image-box"
                                            :style="{'background-image': 'url(' + appendImagePrefix(img.uri) + ')'}"
                                            @click="displayImage(index)">
                                        </div>
                                        <i
                                            v-if="!readonly"
                                            @click="_deletePosterImage(img.id)"
                                            class="el-icon-delete delete-btn">
                                        </i>
                                    </li>
                                </ul>
                            </el-form-item>
                        </el-col>
                    </el-form>
                </el-col>
            <el-col :span="24">
                <div class="block-title">节目视频</div>
                <el-button v-if="!readonly" type="primary" @click="showUploadDialog">添加视频<i class="el-icon-upload el-icon--right"></i></el-button>
                <programme-table title="待添加视频列表" :tableStatus="0" :status="status" :data-list="video.tempList"></programme-table>
                <programme-table title="已添加视频列表" :tableStatus="1" :status="status" :data-list="video.list"></programme-table>
                <el-pagination
                    @size-change="handlePaginationChange($event, 'pageSize')"
                    @current-change="handlePaginationChange($event, 'pageNum')"
                    :current-page="video.pagination.pageNum"
                    :page-sizes="[5, 10, 20, 30, 50]"
                    :page-size="video.pagination.pageSize"
                    layout="total, sizes, prev, pager, next, jumper"
                    :total="video.pagination.total">
                </el-pagination>
            </el-col>
        </el-row>
        <div class="group">
            <el-button v-if="status === 0" type="primary" @click="_createProgramme">创建</el-button>
            <el-button v-if="status === 2" type="primary" @click="_editProgramme">保存</el-button>
            <el-button v-if="status === 2" type="primary" @click="_deleteProgramme">
                {{programme.visible ? '节目下架' : '节目上架'}}
            </el-button>
            <el-button type="primary" @click="goBack">返回列表页</el-button>
        </div>
        <upload-image
            title="上传节目图片"
            :size="size"
            :successHandler="addPosterImage"
            :imageUploadDialogVisible="imageUploadDialogVisible"
            v-on:changeImageDialogStatus="closeImageDialog($event)">
        </upload-image>
        <create-person-dialog :createPersonDialogVisible="createPersonDialogVisible" v-on:changePersonDialogStatus="closePersonDialog($event)"></create-person-dialog>
        <upload-programme-video-dialog :videoStatus="0" :videoUploadDialogVisible="videoUploadDialogVisible" v-on:changeVideoDialogStatus="closeVideoDialog($event)"></upload-programme-video-dialog>
        <preview-multiple-images :previewMultipleImages="previewImage"></preview-multiple-images>
    </div>
</template>
<script>
    import { mapMutations, mapGetters, mapActions } from 'vuex';
    import _ from 'lodash';
    import store from 'store';
    import PreviewMultipleImages from 'sysComponents/custom_components/global/PreviewMultipleImages';
    import CreatePersonDialog from './CreatePersonDialog';
    import ProgrammeTable from './ProgrammeTable';
    import UploadImage from 'sysComponents/custom_components/global/UploadImage';
    import dimension from '@/util/config/dimension';
    import role from '@/util/config/role';
    import {checkScore, checkCategory} from '@/util/formValidate';
    import UploadProgrammeVideoDialog from './UploadProgrammeVideoDialog';

    export default {
        name: 'ProgrammeDetail',
        components: {
            UploadImage,
            CreatePersonDialog,
            ProgrammeTable,
            UploadProgrammeVideoDialog,
            PreviewMultipleImages
        },
        props: {
            status: { // status 有三种状态，0代表创建 "create", 1代表显示 "display", 2代表编辑 "edit"
                type: Number
            }
        },
        created() {
            this.resetProgramme();
            this.getProgrammeCategory();
            this.getProgrammeTagList();
            this.getProgrammeAnnouncerList();
            this.getProgrammeContestList();
            // this.getProgrammeCopyrightList();
            this.getProgrammeLicenceList();
            this.getProgrammePlatformList();
        },
        data() {
            return {
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
                    programmeTagList: '关键字',
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
            }
        },
        methods: {
            ...mapMutations({
                addSelectItem: 'programme/addSelectItem',
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
                // 视频video
                updateSearchFields: 'video/updateSearchFields'
            }),
            ...mapActions({
                // 新加
                updateProgrammeById: 'programme/updateProgrammeById',
                createMultProgrammeVideo: 'programme/createMultProgrammeVideo',
                // 新加结束
                createProgramme: 'programme/createProgramme',
                getPersonList: 'person/getPersonList',
                getProgrammeCategory: 'programme/getProgrammeCategory',
                getProgrammeVideoListById: 'programme/getProgrammeVideoListById',
                getProgrammeTagList: 'programme/getProgrammeTagList',
                getProgrammeAnnouncerList: 'programme/getProgrammeAnnouncerList',
                getProgrammeContestList: 'programme/getProgrammeContestList',
                getProgrammeCopyrightList: 'programme/getProgrammeCopyrightList',
                getProgrammeLicenceList: 'programme/getProgrammeLicenceList',
                getProgrammePlatformList: 'programme/getProgrammePlatformList',
                deleteProgramme: 'programme/deleteProgramme'
            }),
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
                                            this.createMultProgrammeVideo(id)
                                                .then((...resList) => {
                                                    this.deleteTempList();
                                                    this.getProgrammeVideoListById(id);
                                                    this.$message({
                                                        type: 'success',
                                                        message: '保存成功'
                                                    });
                                                    this.goBack();
                                                });
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
                                            this.createMultProgrammeVideo(id)
                                                .then((...resList) => {
                                                    this.deleteTempList();
                                                    this.getProgrammeVideoListById(id);
                                                    this.$message({
                                                        type: 'success',
                                                        message: '保存成功'
                                                    });
                                                    this.goBack();
                                                });
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
            closeImageDialog(status) {
                this.imageUploadDialogVisible = status;
            },
            closePersonDialog(status) {
                this.createPersonDialogVisible = status;
            },
            showUploadDialog() {
                this.videoUploadDialogVisible = status;
                this.updateSearchFields({key: 'status', value: 'SUCCESS'});
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
                }
            },
            findDirector(name) {
                if (name) {
                    this.isDirectorLoading = true;
                    this.getPersonList({name, isProgramme: true})
                        .then((res) => {
                            this.updatePersonResult({key: 'directorResult', value: res.data.list});
                        }).finally(() => {
                            this.isDirectorLoading = false;
                        });
                }
            },
            findLeadActor(name) {
                if (name) {
                    this.isLeadActorLoading = true;
                    this.getPersonList({name, isProgramme: true})
                        .then((res) => {
                            this.updatePersonResult({key: 'leadActorResult', value: res.data.list});
                        }).finally(() => {
                            this.isLeadActorLoading = false;
                        });
                }
            },
            findScenarist(name) {
                if (name) {
                    this.isScenaristLoading = true;
                    this.getPersonList({name, isProgramme: true})
                        .then((res) => {
                            this.updatePersonResult({key: 'scenaristResult', value: res.data.list});
                        }).finally(() => {
                            this.isScenaristLoading = false;
                        });
                }
            },
            uploadImageHandler() {
                if (!this.readonly) {
                    this.imageUploadDialogVisible = true;
                }
            },
            _deletePosterImage(id) {
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
            addSelectItemHandler(key) {
                this.$prompt(`请输入新${this.selectItemObj[key]}`, '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    inputPattern: /\S/,
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
            updatePersonHandler(idList, key) {
                this.updatePerson({key, idList});
            },
            handlePaginationChange(value, key) {
                let {id} = this.$route.params;
                this.updateVideoPagination({key, value});
                this.getProgrammeVideoListById(id);
            }
        }
    };
</script>
<style lang="less" scoped>
.cover-list {
    display: flex;
    margin-top: 30px;
    justify-content: left;
    flex-wrap: wrap;
    li {
        display: flex;
        position: relative;
        margin-right: 30px;
        flex-direction: column;
        justify-content: space-around;
        height: 230px;
        .image-box {
            height: 150px;
            width: 150px;
            background-size: contain;
            background-repeat: no-repeat;
            background-position: center;
            cursor: zoom-in;
        }
        label {
            text-align: center;
            font-size: 16px;
        }
        i {
            position: absolute;
            top: 20px;
            color: red;
            cursor: pointer;
            font-size: 2em;
        }
        .delete-btn {
            right: 20px;
            display: none;
        }
        &:hover {
            i {
                display: block;
            }
        }
    }
}
</style>
