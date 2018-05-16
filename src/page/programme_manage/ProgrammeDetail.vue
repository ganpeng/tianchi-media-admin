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
                            <el-input :value="programme.name"></el-input>
                        </el-form-item>
                        <el-form-item label="节目看点">
                            <el-input :value="'非常好看'"></el-input>
                        </el-form-item>
                        <el-form-item label="节目状态">
                            <el-input :value="'状态很好'" readonly></el-input>
                        </el-form-item>
                        <el-form-item label="节目来源">
                            <el-input :value="'节目来源'" readonly></el-input>
                        </el-form-item>
                        <el-form-item label="节目简介" prop="description">
                            <el-input
                                type="textarea"
                                :autosize="{ minRows: 4, maxRows: 40}"
                                placeholder="请输入内容"
                                :value="programme.description">
                            </el-input>
                        </el-form-item>
                        <el-form-item label="上映时间" prop="announceAt">
                            <el-date-picker
                                :value="programme.announceAt"
                                type="year"
                                placeholder="选择年">
                            </el-date-picker>
                        </el-form-item>
                        <el-form-item label="所属地区" prop="releaseArea">
                            <el-select
                                :value="programme.releaseArea"
                                clearable
                                filterable
                                placeholder="请选择"
                            >
                                <el-option
                                    v-for="item in areaOptions"
                                    :key="item.value"
                                    :label="item.label"
                                    :value="item.value">
                                </el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item label="节目分类" prop="programmeCategory">
                            <el-select :value="programme.programmeCategory" placeholder="请选择">
                                <el-option
                                    v-for="item in programOptions"
                                    :key="item.value"
                                    :label="item.label"
                                    :value="item.value">
                                </el-option>
                            </el-select>
                            <el-button type="primary" @click="gotoProgramTypePage" plain>管理分类和类型</el-button>
                        </el-form-item>
                        <el-form-item label="节目类型" prop="programmeType">
                            <el-select :value="programme.programmeType" multiple placeholder="请选择">
                                <el-option
                                    v-for="item in typeOptions"
                                    :key="item.value"
                                    :label="item.label"
                                    :value="item.value">
                                </el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item label="关键字" prop="tagList">
                            <el-select :value="programme.tagList" multiple placeholder="请选择">
                                <el-option
                                    v-for="item in keyWordsOptions"
                                    :key="item.value"
                                    :label="item.label"
                                    :value="item.value">
                                </el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item label="节目主演" prop="leadActor">
                            <el-select v-model="programme.leadActor" multiple placeholder="请选择">
                                <el-option
                                    v-for="item in leadOptions"
                                    :key="item.value"
                                    :label="item.label"
                                    :value="item.value">
                                </el-option>
                            </el-select>
                            <el-button type="primary" plain @click="createPersonDialogVisible = true">新增人物</el-button>
                        </el-form-item>
                        <el-form-item label="节目导演" prop="director">
                            <el-select :value="programme.director" multiple placeholder="请选择">
                                <el-option
                                    v-for="item in directorOptions"
                                    :key="item.value"
                                    :label="item.label"
                                    :value="item.value">
                                </el-option>
                            </el-select>
                            <el-button type="primary" plain @click="createPersonDialogVisible = true">新增人物</el-button>
                        </el-form-item>
                        <el-form-item label="版权起始日期" prop="copyrightRange">
                            <el-date-picker
                                :value="programme.copyrightRange"
                                type="daterange"
                                range-separator="至"
                                start-placeholder="开始日期"
                                end-placeholder="结束日期">
                            </el-date-picker>
                        </el-form-item>
                        <el-form-item label="版权商" prop="copyrightReserver">
                            <el-select :value="programme.copyrightReserver" placeholder="请选择">
                                <el-option
                                    v-for="item in copyRightDealerOptions"
                                    :key="item.value"
                                    :label="item.label"
                                    :value="item.value">
                                </el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item label="运营商" prop="businessOperator">
                            <el-select :value="programme.businessOperator" placeholder="请选择">
                                <el-option
                                    v-for="item in operatorOptions"
                                    :key="item.value"
                                    :label="item.label"
                                    :value="item.value">
                                </el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item label="总集数" prop="featureVideoCount">
                            <el-input :value="programme.featureVideoCount" readonly></el-input>
                        </el-form-item>
                        <el-form-item label="实际播放量" prop="playCountBasic">
                            <el-input :value="programme.playCountBasic" readonly></el-input>
                        </el-form-item>
                        <el-form-item label="展示播放量">
                            <el-input :value="12"></el-input>
                        </el-form-item>
                        <el-form-item label="节目图片">
                            <el-button type="primary" @click="imageUploadDialogVisible = true">添加节目图片<i class="el-icon-upload el-icon--right"></i></el-button>
                        </el-form-item>
                    </el-form>
                </el-col>
            </el-col>
            <el-col :span="24">
                <div class="block-title">节目视频</div>
                <programme-table :status="3" :data-list="testData"></programme-table>
            </el-col>
        </el-row>

        <div class="group">
            <el-button v-if="status === 0" type="primary" @click="_createProgramme">创建</el-button>
            <el-button v-if="status === 2" type="primary" @click="_editProgramme">编辑</el-button>
            <el-button type="primary" @click="goBack">返回列表页</el-button>
        </div>
        <upload-programme-image-dialog title="上传节目图片" :imageUploadDialogVisible="imageUploadDialogVisible" v-on:changeImageDialogStatus="closeImageDialog($event)"></upload-programme-image-dialog>
        <create-person-dialog :createPersonDialogVisible="createPersonDialogVisible" v-on:changePersonDialogStatus="closePersonDialog($event)"></create-person-dialog>
    </div>
</template>
<script>
    import { mapMutations, mapGetters, mapActions } from 'vuex';
    import UploadProgrammeImageDialog from './UploadProgrammeImageDialog';
    import CreatePersonDialog from './CreatePersonDialog';
    import ProgrammeTable from './ProgrammeTable';

    export default {
        name: 'ProgrammeDetail',
        components: {
            UploadProgrammeImageDialog,
            CreatePersonDialog,
            ProgrammeTable
        },
        props: {
            status: { // status 有三种状态，0代表创建 "create", 1代表显示 "display", 2代表编辑 "edit"
                type: Number
            }
        },
        created() {
            this.resetProgramme();
        },
        data() {
            return {
                imageUploadDialogVisible: false,
                dialogVisible: false,
                videoUploadDialogVisible: false,
                createPersonDialogVisible: false,
                areaOptions: this.$util.countryList,
                programOptions: [
                    {
                        value: '电视剧',
                        label: '电视剧'
                    },
                    {
                        value: '电影',
                        label: '电影'
                    },
                    {
                        value: '综艺',
                        label: '综艺'
                    }
                ],
                typeOptions: [
                    {
                        value: '战争',
                        label: '战争'
                    },
                    {
                        value: '警匪',
                        label: '警匪'
                    },
                    {
                        value: '爱情',
                        label: '爱情'
                    }
                ],
                leadOptions: [
                    {
                        value: '王力宏',
                        label: '王力宏'
                    },
                    {
                        value: '刘德华',
                        label: '刘德华'
                    },
                    {
                        value: '杰克逊',
                        label: '杰克逊'
                    }
                ],
                directorOptions: [
                    {
                        value: '张艺谋',
                        label: '张艺谋'
                    },
                    {
                        value: '管虎',
                        label: '管虎'
                    },
                    {
                        value: '斯皮尔伯格',
                        label: '斯皮尔伯格'
                    }
                ],
                keyWordsOptions: [
                    {
                        value: 'js',
                        label: 'js'
                    },
                    {
                        value: 'css',
                        label: 'css'
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
                testData: [
                    {
                        id: '2018040513444522777-1',
                        name: '战狼1',
                        sortNumber: '2',
                        description: '是第一部的延续',
                        positive: '老男孩第二集',
                        url: 'http://www.baidu.com',
                        contentType: '正片',
                        typeId: '高清',
                        needPay: '是',
                        duration: '1:20:30',
                        createdAt: '2018-04-05 9:00'
                    }
                ]
            };
        },
        computed: {
            ...mapGetters({
                programme: 'programme/currentProgramme'
            })
        },
        methods: {
            ...mapMutations({
                resetProgramme: 'programme/resetProgramme'
            }),
            ...mapActions({
                createProgramme: 'programme/createProgramme',
                updateProgramme: 'programme/updateProgramme'
            }),
            _createProgramme() {

            },
            _editProgramme() {

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
            gotoProgramTypePage() {
                this.$router.push({name: 'ProgrammeTypeManage'});
            },
            handleClick(row) {
            },
            goBack() {
                this.$router.push({name: 'ProgrammeList'});
            }
        }
    };
</script>
<style lang="less" scoped>
</style>
