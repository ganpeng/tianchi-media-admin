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
                                :readonly="readonly"
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
                                :readonly="readonly"
                                @input="inputHandler($event, 'description')"
                                :autosize="{ minRows: 4, maxRows: 40}"
                                placeholder="请输入内容"
                                :value="programme.description">
                            </el-input>
                        </el-form-item>
                        <el-form-item label="上映时间" prop="announceAt">
                            <el-date-picker
                                :readonly="readonly"
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
                            <multiselect
                                id="category"
                                class="multiselect-container"
                                :value="programme.category"
                                label="name"
                                track-by="name"
                                placeholder=""
                                :options="categroyList"
                                :close-on-select="true"
                                open-direction="bottom"
                                :hideSelected="true"
                                selectLabel=""
                                :disabled="readonly"
                                @input="updateCategoryValue">
                                <template slot="tag" slot-scope="props">
                                    <span> {{ props.option.name}} </span>
                                    <span class="custom__remove" @click="props.remove(props.option)"><i class="el-icon-close"></i></span>
                                </template>
                            </multiselect>
                            <el-button type="primary" @click="gotoProgramTypePage" plain>管理分类和类型</el-button>
                        </el-form-item>
                        <el-form-item label="节目类型" prop="typeList">
                            <multiselect
                                id="category"
                                class="multiselect-container"
                                :value="programme.typeList"
                                label="name"
                                track-by="name"
                                placeholder=""
                                :options="programme.currentTypeList"
                                :close-on-select="true"
                                :multiple="true"
                                open-direction="bottom"
                                :preselect-first="true"
                                :hideSelected="true"
                                selectLabel=""
                                :disabled="readonly"
                                @input="updateTypeListValue">
                                <template slot="tag" slot-scope="props">
                                    <span> {{ props.option.name}} </span>
                                    <span class="custom__remove" @click="props.remove(props.option)"><i class="el-icon-close"></i></span>
                                </template>
                            </multiselect>
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
                            <multiselect
                                id="lead"
                                class="multiselect-container"
                                :value="programme.leadActor"
                                label="name"
                                track-by="name"
                                placeholder=""
                                :options="programme.leadActorResult"
                                :multiple="true"
                                :searchable="true"
                                :loading="isLoading"
                                :close-on-select="true"
                                :max-height="600"
                                open-direction="bottom"
                                :show-no-results="true"
                                :hideSelected="true"
                                selectLabel=""
                                @input="updateLeadActorValue"
                                :disabled="readonly"
                                @search-change="findLeadActor">
                                <template slot="tag" slot-scope="props">
                                    <span> {{ props.option.name}} </span>
                                    <span class="custom__remove" @click="props.remove(props.option)"><i class="el-icon-close"></i></span>
                                </template>
                                <span slot="noResult">您搜索的人物不存在</span>
                            </multiselect>
                            <el-button type="primary" plain @click="createPersonDialogVisible = true">新增人物</el-button>
                        </el-form-item>
                        <el-form-item label="节目导演" prop="director">
                            <label for="director"></label>
                            <multiselect
                                id="director"
                                class="multiselect-container"
                                :value="programme.director"
                                label="name"
                                track-by="name"
                                placeholder=""
                                :options="programme.directorResult"
                                :multiple="true"
                                :searchable="true"
                                :loading="isLoading"
                                :close-on-select="true"
                                :max-height="600"
                                open-direction="bottom"
                                :show-no-results="true"
                                :hideSelected="true"
                                selectLabel=""
                                @input="updateDirectorValue"
                                :disabled="readonly"
                                @search-change="findDirector">
                                <template slot="tag" slot-scope="props">
                                    <span> {{ props.option.name}} </span>
                                    <span class="custom__remove" @click="props.remove(props.option)"><i class="el-icon-close"></i></span>
                                </template>
                                <span slot="noResult">您搜索的人物不存在</span>
                            </multiselect>
                            <el-button type="primary" plain @click="createPersonDialogVisible = true">新增人物</el-button>
                        </el-form-item>
                        <el-form-item label="版权起始日期" prop="copyrightRange">
                            <el-date-picker
                                :value="programme.copyrightRange"
                                :readonly="readonly"
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
                                :readonly="readonly"
                                :value="programme.featureVideoCount"
                                @input="inputHandler($event, 'featureVideoCount')" >
                            </el-input>
                        </el-form-item>
                        <el-form-item label="显示播放量" prop="playCountBasic">
                            <el-input
                                :readonly="readonly"
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
                <programme-table :status="3" :data-list="programmeVideoList"></programme-table>
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
    import Multiselect from 'vue-multiselect';
    import { mapMutations, mapGetters, mapActions } from 'vuex';
    import CreatePersonDialog from './CreatePersonDialog';
    import ProgrammeTable from './ProgrammeTable';
    import UploadImage from 'sysComponents/custom_components/global/UploadImage';
    import dimension from '@/util/config/dimension';
    import UploadProgrammeVideoDialog from './UploadProgrammeVideoDialog';

    export default {
        name: 'ProgrammeDetail',
        components: {
            Multiselect,
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
            this.getProgrammeCategory();
        },
        data() {
            return {
                selectedCountries: [],
                countries: [],
                isLoading: false,
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
                programmeVideoPagination: 'programme/programmeVideoPagination'
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
                setProgrammeId: 'programmeVideo/setProgrammeId'
            }),
            ...mapActions({
                createProgramme: 'programme/createProgramme',
                updateProgramme: 'programme/updateProgramme',
                getPersonList: 'person/getPersonList',
                getProgrammeCategory: 'programme/getProgrammeCategory',
                createMultProgrammeVideo: 'programmeVideo/createMultProgrammeVideo'
            }),
            _createProgramme() {
                this.createProgramme()
                    .then((res) => {
                        this.setProgrammeId({programmeId: res.data.id});
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
                        this.setProgrammeId({programmeId: id});
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
                    this.isLoading = true;
                    this.getPersonList({name, isProgramme: true})
                        .then((res) => {
                            this.updateCurrentProgramme({'directorResult': res.data.list});
                        }).finally(() => {
                            this.isLoading = false;
                        });
                }
            },
            updateDirectorValue(value) {
                this.updateCurrentProgramme({'director': value});
            },
            updateLeadActorValue(value) {
                this.updateCurrentProgramme({'leadActor': value});
            },
            updateCategoryValue(value) {
                this.updateCurrentProgramme({'category': value});
                let currentTypeList = this.categroyList.find((category) => category.id === value.id).programmeTypeList;
                this.updateCurrentProgramme({currentTypeList});
                this.updateCurrentProgramme({'typeList': []});
            },
            updateTypeListValue(value) {
                this.updateCurrentProgramme({'typeList': value});
            },
            findLeadActor(name) {
                if (name) {
                    this.isLoading = true;
                    this.getPersonList({name, isProgramme: true})
                        .then((res) => {
                            this.updateCurrentProgramme({'leadActorResult': res.data.list});
                        }).finally(() => {
                            this.isLoading = false;
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
            }
        }
    };
</script>
<style src="vue-multiselect/dist/vue-multiselect.min.css"></style>
<style lang="less" scoped>
.multiselect-container {
    width: 194px;
    display: inline-block;
}
</style>
<style>
.multiselect__tags {
    padding: 0 0 0 5px!important;
}
.multiselect__input, .multiselect__single {
    line-height: 40px;
}
.multiselect__option--highlight {
    background: gray;
}
.multiselect__input, .multiselect__single {
    margin-bottom: 0;
}
</style>
