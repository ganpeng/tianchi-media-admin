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
                <el-col :span="8">
                    <div class="block-title">节目基本信息</div>
                    <el-form ref="createProgramForm" status-icon :model="programme" label-width="100px" class="form-block">
                        <el-form-item label="全平台通用ID">
                            <el-input :value="123455" readonly></el-input>
                        </el-form-item>
                        <el-form-item label="节目名称" prop="name">
                            <el-input
                                :disabled="readonly"
                                @input="inputHandler($event, 'name')"
                                :value="programme.name">
                            </el-input>
                        </el-form-item>
                        <el-form-item label="节目看点">
                            <el-input :value="'非常好看'"></el-input>
                        </el-form-item>
                        <el-form-item label="节目来源">
                            <el-input :value="'内容中心'" readonly></el-input>
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
                        <el-form-item label="上映时间" prop="announceAt">
                            <el-date-picker
                                :disabled="readonly"
                                :value="programme.announceAt"
                                @input="inputHandler($event, 'announceAt')"
                                type="year"
                                placeholder="选择年">
                            </el-date-picker>
                        </el-form-item>
                        <el-form-item label="所属地区" prop="releaseArea">
                            <el-select
                                :value="programme.releaseArea"
                                @change="inputHandler($event, 'releaseArea')"
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
                            <el-button type="primary" @click="gotoProgramTypePage" plain>管理分类和类型</el-button>
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
                                    v-for="item in keyWordsOptions"
                                    :key="item.value"
                                    :label="item.label"
                                    :value="item.value">
                                </el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item label="节目主演" prop="leadActor">
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
                            <el-button type="primary" plain @click="createPersonDialogVisible = true">新增人物</el-button>
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
                            <el-button type="primary" plain @click="createPersonDialogVisible = true">新增人物</el-button>
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
                        <el-form-item label="版权商" prop="copyrightReserver">
                            <el-select
                                :disabled="readonly"
                                :value="programme.copyrightReserver"
                                placeholder="请选择"
                                @input="inputHandler($event, 'copyrightReserver')"
                            >
                                <el-option
                                    v-for="item in copyRightDealerOptions"
                                    :key="item.value"
                                    :label="item.label"
                                    :value="item.value">
                                </el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item label="运营商" prop="businessOperator">
                            <el-select
                                :disabled="readonly"
                                :value="programme.businessOperator"
                                placeholder="请选择"
                                @input="inputHandler($event, 'businessOperator')"
                            >
                                <el-option
                                    v-for="item in operatorOptions"
                                    :key="item.value"
                                    :label="item.label"
                                    :value="item.value">
                                </el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item label="总集数" prop="featureVideoCount">
                            <el-input
                                :disabled="readonly"
                                :value="programme.featureVideoCount"
                                @input="inputHandler($event, 'featureVideoCount')" >
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
                            <el-input :value="12"
                                readonly>
                            </el-input>
                        </el-form-item>
                        <el-form-item label="节目图片">
                            <el-button type="primary" @click="uploadImageHandler">添加节目图片<i class="el-icon-upload el-icon--right"></i></el-button>
                            <ul class="cover-list">
                                <li v-for="(img, index) in programme.posterImages" :key="index" class="img-item">
                                    <img :src="img.uri" alt="">
                                    <div v-if="!readonly" class="delete-layer">
                                        <i
                                            @click="_deletePosterImage(img.id)"
                                            class="el-icon-delete">
                                        </i>
                                    </div>
                                </li>
                            </ul>
                        </el-form-item>
                    </el-form>
                </el-col>
            </el-col>
            <el-col :span="24">
                <div class="block-title">节目视频</div>
                <el-button v-if="!readonly" type="primary" @click="videoUploadDialogVisible = true">添加视频<i class="el-icon-upload el-icon--right"></i></el-button>
                <programme-table title="待添加视频列表" :tableStatus="0" :status="3" :data-list="unSavedVideoList"></programme-table>
                <programme-table title="已添加视频列表" :tableStatus="1" :status="3" :data-list="programmeVideoList"></programme-table>
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
            <el-button v-if="status === 2" type="primary" @click="_editProgramme">编辑</el-button>
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
    </div>
</template>
<script>
    import { mapMutations, mapGetters, mapActions } from 'vuex';
    import CreatePersonDialog from './CreatePersonDialog';
    import ProgrammeTable from './ProgrammeTable';
    import UploadImage from 'sysComponents/custom_components/global/UploadImage';
    import dimension from '@/util/config/dimension';
    import UploadProgrammeVideoDialog from './UploadProgrammeVideoDialog';

    export default {
        name: 'ProgrammeDetail',
        components: {
            UploadImage,
            CreatePersonDialog,
            ProgrammeTable,
            UploadProgrammeVideoDialog
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
                keyWordsOptions: [
                    {
                        value: '好看',
                        label: '好看'
                    },
                    {
                        value: '精彩',
                        label: '精彩'
                    },
                    {
                        value: '不错',
                        label: '不错'
                    },
                    {
                        value: '非常好',
                        label: '非常好'
                    }
                ],
                copyRightDealerOptions: [
                    {
                        value: '1',
                        label: 'cibn'
                    },
                    {
                        value: '2',
                        label: '另一个'
                    },
                    {
                        value: '3',
                        label: '其他'
                    }
                ],
                operatorOptions: [
                    {
                        value: '1',
                        label: '爱奇艺'
                    },
                    {
                        value: '2',
                        label: '腾讯'
                    },
                    {
                        value: '3',
                        label: '乐视'
                    }
                ],
                size: dimension.PROGRAMME_DIMENSION
            };
        },
        computed: {
            ...mapGetters({
                programme: 'programme/currentProgramme',
                categroyList: 'programme/categroyList',
                currentVideoIdList: 'programme/currentVideoIdList',
                programmeVideoList: 'programme/programmeVideoList',
                pagination: 'programme/programmeVideoPagination',
                serializeCategory: 'programme/serializeCategory',
                serializeTypeList: 'programme/serializeTypeList',
                leadActorValue: 'programme/leadActorValue',
                directorValue: 'programme/directorValue',
                unSavedVideoList: 'programmeVideo/unSavedVideoList'
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
                updateDirectorResult: 'programme/updateDirectorResult'
            }),
            ...mapActions({
                createProgramme: 'programme/createProgramme',
                updateProgramme: 'programme/updateProgramme',
                getPersonList: 'person/getPersonList',
                getProgrammeCategory: 'programme/getProgrammeCategory',
                createMultProgrammeVideo: 'programmeVideo/createMultProgrammeVideo',
                getProgrammeVideoListById: 'programme/getProgrammeVideoListById'
            }),
            _createProgramme() {
                this.createProgramme()
                    .then((res) => {
                        this.createMultProgrammeVideo(res.data.id)
                            .then((...res) => {
                                this.$router.push({ name: 'ProgrammeList' });
                            });
                    });
            },
            _editProgramme() {
                let {id} = this.$route.params;
                this.updateProgramme(id)
                    .then((res) => {
                        this.createMultProgrammeVideo(id)
                            .then((...res) => {
                                this.$router.push({ name: 'ProgrammeList' });
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
            }
        }
    };
</script>
<style lang="less" scoped>
</style>
