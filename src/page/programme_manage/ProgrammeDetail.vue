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
                            <el-form-item label="全平台通用ID">
                                <el-input :value="123455" disabled></el-input>
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
                                        v-for="item in areaOptions"
                                        :key="item.value"
                                        :label="item.label"
                                        :value="item.value">
                                    </el-option>
                                </el-select>
                            </el-form-item>
                            <el-form-item label="节目分类" prop="category">
                                <el-select
                                    :value="serializeCategory"
                                    @change="categoryChangeHandler"
                                    :disabled="readonly"
                                    placeholder="请选择">
                                    <el-option
                                        v-for="item in categroyList"
                                        :key="item.id"
                                        :label="item.name"
                                        :value="item.id">
                                    </el-option>
                                </el-select>
                                <el-button v-if="!readonly" type="primary" @click="gotoProgramTypePage" plain>管理分类和类型</el-button>
                            </el-form-item>
                            <el-form-item label="节目类型" prop="typeList">
                                <el-select
                                    :value="serializeTypeList"
                                    multiple
                                    :disabled="readonly"
                                    @change="typeListChangeHandler"
                                    placeholder="请选择">
                                    <el-option
                                        v-for="item in programme.currentTypeList"
                                        :key="item.id"
                                        :label="item.name"
                                        :value="item.id">
                                    </el-option>
                                </el-select>
                            </el-form-item>
                            <el-form-item label="关键字" prop="tagList">
                                <el-select
                                    :value="programme.tagList"
                                    multiple
                                    placeholder="请选择"
                                    @change="inputHandler($event, 'tagList')"
                                    :disabled="readonly"
                                >
                                    <el-option
                                        v-for="item in programmeTagList"
                                        :key="item.value"
                                        :label="item.label"
                                        :value="item.value">
                                    </el-option>
                                </el-select>
                                <el-button v-if="!readonly" type="primary" plain @click="addTag">新增关键字</el-button>
                            </el-form-item>
                            <el-form-item label="节目主演" prop="leadActorValue">
                                <label for="leadActor"></label>
                                <el-select
                                    :value="leadActorValue"
                                    multiple
                                    filterable
                                    remote
                                    :disabled="readonly"
                                    placeholder="请输入人物名称"
                                    @change="updateLeadActorValue"
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
                                    :value="directorValue"
                                    multiple
                                    filterable
                                    remote
                                    :disabled="readonly"
                                    placeholder="请输入人物名称"
                                    @change="updateDirectorValue"
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
                                    placeholder="请选择"
                                    @input="inputHandler($event, 'licence')"
                                >
                                    <el-option
                                        v-for="item in copyRightDealerOptions"
                                        :key="item.value"
                                        :label="item.label"
                                        :value="item.value">
                                    </el-option>
                                </el-select>
                            </el-form-item>
                            <el-form-item label="版权方" prop="copyrightReserver">
                                <el-select
                                    :disabled="readonly"
                                    :value="programme.copyrightReserver"
                                    placeholder="请选择"
                                    @input="inputHandler($event, 'copyrightReserver')"
                                >
                                    <el-option
                                        v-for="item in operatorOptions"
                                        :key="item.value"
                                        :label="item.label"
                                        :value="item.value">
                                    </el-option>
                                </el-select>
                            </el-form-item>
                            <el-form-item
                                v-if="isShow"
                                label="出品频道" prop="producer">
                                <el-select
                                    :disabled="readonly"
                                    :value="programme.producer"
                                    placeholder="请选择"
                                    @input="inputHandler($event, 'producer')"
                                >
                                    <el-option
                                        v-for="item in operatorOptions"
                                        :key="item.value"
                                        :label="item.label"
                                        :value="item.value">
                                    </el-option>
                                </el-select>
                            </el-form-item>
                            <el-form-item
                                v-if="isMovie"
                                label="规格" prop="spec">
                                <el-select
                                    :disabled="readonly"
                                    :value="programme.spec"
                                    placeholder="请选择"
                                    multiple
                                    @input="inputHandler($event, 'spec')"
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
                            <el-form-item v-if="isTvPlay" label="总集数" prop="featureVideoCount">
                                <el-input
                                    type="number"
                                    :disabled="readonly"
                                    :value="programme.featureVideoCount"
                                    @input="inputHandler($event, 'featureVideoCount')" >
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
                                    :value="12"
                                    disabled>
                                </el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="24">
                            <el-form-item label="节目图片">
                                <el-button v-if="!readonly" type="primary" @click="uploadImageHandler">添加节目图片<i class="el-icon-upload el-icon--right"></i></el-button>
                                <ul class="cover-list">
                                    <li v-for="(img, index) in programme.posterImageList" :key="index" class="img-item">
                                        <div @click="displayImage(index)">
                                            <img :src="img.uri | imageUrl" alt="">
                                            <div v-if="!readonly" class="delete-layer">
                                        </div>
                                        </div>
                                        <i
                                            v-if="!readonly"
                                            @click="_deletePosterImage(img.id)"
                                            class="el-icon-delete delete-btn">
                                        </i>
                                        <i
                                            v-if="!readonly"
                                            @click="checkPosterImage({id: img.id})"
                                            :class='[img.checked ? "el-icon-circle-check" : "el-icon-circle-check-outline", "select-btn"]'>
                                        </i>
                                    </li>
                                </ul>
                            </el-form-item>
                        </el-col>
                    </el-form>
                </el-col>
            <el-col :span="24">
                <div class="block-title">节目视频</div>
                <el-button v-if="!readonly" type="primary" @click="videoUploadDialogVisible = true">添加视频<i class="el-icon-upload el-icon--right"></i></el-button>
                <programme-table title="待添加视频列表" :tableStatus="0" :status="status" :data-list="unSavedVideoList"></programme-table>
                <programme-table title="已添加视频列表" :tableStatus="1" :status="status" :data-list="programmeVideoList"></programme-table>
                <el-pagination
                    @size-change="handleSizeChange"
                    @current-change="handleCurrentChange"
                    :current-page="pagination.pageNum"
                    :page-sizes="[5, 10, 20, 30, 50]"
                    :page-size="pagination.pageSize"
                    layout="total, sizes, prev, pager, next, jumper"
                    :total="pagination.total">
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
            this.resetVideoList();
            this.getProgrammeCategory();
            this.getProgrammeTagList();
        },
        data() {
            return {
                selectedCountries: [],
                countries: [],
                isLeadActorLoading: false,
                isDirectorLoading: false,
                imageUploadDialogVisible: false,
                dialogVisible: false,
                videoUploadDialogVisible: false,
                createPersonDialogVisible: false,
                areaOptions: this.$util.countryList(),
                copyRightDealerOptions: role.COPYRIGHT_RESERVER,
                operatorOptions: role.BUSINESS_OPERATOR,
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
                    category: [
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
                programme: 'programme/currentProgramme',
                categroyList: 'programme/categroyList',
                programmeTagList: 'programme/programmeTagList',
                currentVideoIdList: 'programme/currentVideoIdList',
                programmeVideoList: 'programme/programmeVideoList',
                pagination: 'programme/programmeVideoPagination',
                serializeCategory: 'programme/serializeCategory',
                serializeTypeList: 'programme/serializeTypeList',
                leadActorValue: 'programme/leadActorValue',
                directorValue: 'programme/directorValue',
                unSavedVideoList: 'programmeVideo/unSavedVideoList',
                isTvPlay: 'programme/isTvPlay',
                isMovie: 'programme/isMovie',
                isEducation: 'programme/isEducation',
                isShow: 'programme/isShow'
            }),
            readonly() {
                return parseInt(this.status) === 1;
            }
        },
        methods: {
            ...mapMutations({
                updateCurrentProgramme: 'programme/updateCurrentProgramme',
                resetProgramme: 'programme/resetProgramme',
                setSearchStr: 'person/setSearchStr',
                addPosterImage: 'programme/addPosterImage',
                deletePosterImage: 'programme/deletePosterImage',
                resetVideoList: 'programmeVideo/resetVideoList',
                setVideoPagination: 'programme/setVideoPagination',
                updateCategoryValue: 'programme/updateCategoryValue',
                updateTypeList: 'programme/updateTypeList',
                updateLeadActor: 'programme/updateLeadActor',
                updateDirector: 'programme/updateDirector',
                updateLeadActorResult: 'programme/updateLeadActorResult',
                updateDirectorResult: 'programme/updateDirectorResult',
                addProgrammeTag: 'programme/addProgrammeTag',
                checkPosterImage: 'programme/checkPosterImage',
                deleteVideoList: 'programmeVideo/deleteVideoList',
                setCoverImage: 'programme/setCoverImage'
            }),
            ...mapActions({
                createProgramme: 'programme/createProgramme',
                updateProgramme: 'programme/updateProgramme',
                getPersonList: 'person/getPersonList',
                getProgrammeCategory: 'programme/getProgrammeCategory',
                createMultProgrammeVideo: 'programmeVideo/createMultProgrammeVideo',
                getProgrammeVideoListById: 'programme/getProgrammeVideoListById',
                getProgrammeTagList: 'programme/getProgrammeTagList',
                deleteProgramme: 'programme/deleteProgramme'
            }),
            _createProgramme() {
                this.$refs.createProgramForm.validate(value => {
                    if (value) {
                        this.checkImage(() => {
                            this.createProgramme()
                                .then((res) => {
                                    let {id} = res.data;
                                    if (res && res.code === 0) {
                                        this.createMultProgrammeVideo(id)
                                            .then((...resList) => {
                                                this.deleteVideoList({list: resList});
                                                this.getProgrammeVideoListById(id);
                                                this.$message({
                                                    type: 'success',
                                                    message: '保存成功'
                                                });
                                            });
                                    } else {
                                        this.$message({
                                            type: 'error',
                                            message: '节目保存失败'
                                        });
                                    }
                                });
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
                            this.updateProgramme(id)
                                .then((res) => {
                                    if (res && res.code === 0) {
                                        this.createMultProgrammeVideo(id)
                                            .then((...resList) => {
                                                this.deleteVideoList({list: resList});
                                                this.getProgrammeVideoListById(id);
                                                this.$message({
                                                    type: 'success',
                                                    message: '保存成功'
                                                });
                                            });
                                    } else {
                                        this.$message({
                                            type: 'error',
                                            message: '节目保存失败'
                                        });
                                    }
                                });
                        });
                    } else {
                        return false;
                    }
                });
            },
            _deleteProgramme() {
                let {id} = this.$route.params;
                this.$confirm(`您确定要${this.programme.visible ? '上架节目' : '下架节目'}吗, 是否继续?`, '提示', {
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
            onSubmit() {
                this.$refs.createProgramForm.validate(value => {
                    if (value) {
                    } else {
                        return false;
                    }
                });
            },
            closeImageDialog(status) {
                this.imageUploadDialogVisible = status;
            },
            closePersonDialog(status) {
                this.createPersonDialogVisible = status;
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
                this.updateCurrentProgramme({[key]: value});
            },
            findDirector(name) {
                if (name) {
                    this.isDirectorLoading = true;
                    this.getPersonList({name, isProgramme: true})
                        .then((res) => {
                            this.updateDirectorResult({'directorResult': res.data.list});
                        }).finally(() => {
                            this.isDirectorLoading = false;
                        });
                }
            },
            updateDirectorValue(value) {
                this.updateDirector({directorIdList: value});
            },
            updateLeadActorValue(value) {
                this.updateLeadActor({leadActorIdList: value});
            },
            findLeadActor(name) {
                if (name) {
                    this.isLeadActorLoading = true;
                    this.getPersonList({name, isProgramme: true})
                        .then((res) => {
                            this.updateLeadActorResult({'leadActorResult': res.data.list});
                        }).finally(() => {
                            this.isLeadActorLoading = false;
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
            handleSizeChange(pageSize) {
                let {id} = this.$route.params;
                this.setVideoPagination({pageSize});
                this.getProgrammeVideoListById(id);
            },
            handleCurrentChange(pageNum) {
                let {id} = this.$route.params;
                this.setVideoPagination({pageNum});
                this.getProgrammeVideoListById(id);
            },
            categoryChangeHandler(id) {
                this.updateCategoryValue({id});
                this.updateCurrentProgramme({'typeList': []});
            },
            typeListChangeHandler(value) {
                this.updateTypeList({type: value});
            },
            addTag() {
                this.$prompt('请输入新关键字', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    inputPattern: /\S/,
                    inputErrorMessage: '关键字不能为空'
                }).then(({ value }) => {
                    this.addProgrammeTag({tag: value});
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
            displayImage(index) {
                this.previewImage.display = true;
                this.previewImage.list = this.programme.posterImageList;
                this.previewImage.activeIndex = index;
            },
            checkImage(next) {
                const {posterImageList, coverImage} = this.programme;
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

                if (_.isEmpty(coverImage)) {
                    this.$message({type: 'error', message: '请选择默认的节目海报'});
                    return false;
                }

                next();
            }
        }
    };
</script>
<style lang="less" scoped>
</style>
