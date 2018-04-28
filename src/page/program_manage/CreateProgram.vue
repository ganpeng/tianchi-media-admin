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
                    <el-form ref="createProgramForm" :rules="programRules" status-icon :model="program" label-width="100px" class="form-block">
                        <el-form-item label="全平台通用ID">
                            <el-input v-model="program.id" readonly></el-input>
                        </el-form-item>
                        <el-form-item label="节目名称" prop="name">
                            <el-input v-model="program.name"></el-input>
                        </el-form-item>
                        <el-form-item label="节目看点" prop="point">
                            <el-input v-model="program.point"></el-input>
                        </el-form-item>
                        <el-form-item label="节目状态" prop="status">
                            <el-input v-model="program.status" readonly></el-input>
                        </el-form-item>
                        <el-form-item label="节目来源" prop="source">
                            <el-input v-model="program.source" readonly></el-input>
                        </el-form-item>
                        <el-form-item label="节目简介" prop="profile">
                            <el-input
                                type="textarea"
                                :autosize="{ minRows: 4, maxRows: 40}"
                                placeholder="请输入内容"
                                v-model="program.profile">
                            </el-input>
                        </el-form-item>
                        <el-form-item label="上映时间" prop="releaseTime">
                            <el-date-picker
                                v-model="program.releaseTime"
                                type="year"
                                placeholder="选择年">
                            </el-date-picker>
                        </el-form-item>
                        <el-form-item label="所属地区" prop="area">
                            <el-select v-model="program.area" clearable filterable placeholder="请选择">
                                <el-option
                                    v-for="item in areaOptions"
                                    :key="item.value"
                                    :label="item.label"
                                    :value="item.value">
                                </el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item label="节目分类" prop="programClassification">
                            <el-select v-model="program.programClassification" placeholder="请选择">
                                <el-option
                                    v-for="item in programOptions"
                                    :key="item.value"
                                    :label="item.label"
                                    :value="item.value">
                                </el-option>
                            </el-select>
                            <el-button type="primary" @click="gotoProgramTypePage" plain>管理分类和类型</el-button>
                        </el-form-item>
                        <el-form-item label="节目类型" prop="programType">
                            <el-select v-model="program.programType" multiple placeholder="请选择">
                                <el-option
                                    v-for="item in typeOptions"
                                    :key="item.value"
                                    :label="item.label"
                                    :value="item.value">
                                </el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item label="关键字" prop="keyWords">
                            <el-select v-model="program.keyWords" multiple placeholder="请选择">
                                <el-option
                                    v-for="item in keyWordsOptions"
                                    :key="item.value"
                                    :label="item.label"
                                    :value="item.value">
                                </el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item label="节目主演" prop="leadActor">
                            <el-select v-model="program.leadActor" multiple placeholder="请选择">
                                <el-option
                                    v-for="item in leadOptions"
                                    :key="item.value"
                                    :label="item.label"
                                    :value="item.value">
                                </el-option>
                            </el-select>
                            <el-button type="primary" plain @click="createPersonDialogVisible = true">新增人物</el-button>
                        </el-form-item>
                        <el-form-item label="节目导演" prop="programType">
                            <el-select v-model="program.programType" multiple placeholder="请选择">
                                <el-option
                                    v-for="item in directorOptions"
                                    :key="item.value"
                                    :label="item.label"
                                    :value="item.value">
                                </el-option>
                            </el-select>
                            <el-button type="primary" plain @click="createPersonDialogVisible = true">新增人物</el-button>
                        </el-form-item>
                        <el-form-item label="版权起始日期" prop="copyRightDateRange">
                            <el-date-picker
                                v-model="program.copyRightDateRange"
                                type="daterange"
                                range-separator="至"
                                start-placeholder="开始日期"
                                end-placeholder="结束日期">
                            </el-date-picker>
                        </el-form-item>
                        <el-form-item label="版权商" prop="copyRightDealer">
                            <el-select v-model="program.copyRightDealer" placeholder="请选择">
                                <el-option
                                    v-for="item in copyRightDealerOptions"
                                    :key="item.value"
                                    :label="item.label"
                                    :value="item.value">
                                </el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item label="运营商" prop="operator">
                            <el-select v-model="program.operator" placeholder="请选择">
                                <el-option
                                    v-for="item in operatorOptions"
                                    :key="item.value"
                                    :label="item.label"
                                    :value="item.value">
                                </el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item label="总集数" prop="episodes">
                            <el-input v-model="program.episodes" readonly></el-input>
                        </el-form-item>
                        <el-form-item label="实际播放量" prop="truePlayback">
                            <el-input v-model="program.truePlayback" readonly></el-input>
                        </el-form-item>
                        <el-form-item label="展示播放量" prop="displayPlayback">
                            <el-input v-model="program.displayPlayback"></el-input>
                        </el-form-item>
                        <el-form-item label="节目图片">
                            <el-button type="primary" @click="imageUploadDialogVisible = true">添加节目图片<i class="el-icon-upload el-icon--right"></i></el-button>
                        </el-form-item>
                    </el-form>
                </el-col>
            </el-col>
            <el-col :span="24">
                <div class="block-title">节目视频</div>
                <program-table :status="3" :data-list="testData"></program-table>
            </el-col>
        </el-row>

        <div class="group">
            <el-button type="primary" @click="onSubmit">创建</el-button>
        </div>
        <upload-program-image-dialog title="上传节目图片" :imageUploadDialogVisible="imageUploadDialogVisible" v-on:changeImageDialogStatus="closeImageDialog($event)"></upload-program-image-dialog>
        <create-person-dialog :createPersonDialogVisible="createPersonDialogVisible" v-on:changePersonDialogStatus="closePersonDialog($event)"></create-person-dialog>
    </div>
</template>
<script>
    import UploadProgramImageDialog from './UploadProgramImageDialog';
    import CreatePersonDialog from './CreatePersonDialog';
    import ProgramTable from './ProgramTable';

    export default {
        name: 'CreateProgram',
        components: {
            UploadProgramImageDialog,
            CreatePersonDialog,
            ProgramTable
        },
        data() {
            return {
                program: {
                    id: '2018040513444522777',
                    name: '',
                    area: '',
                    point: '',
                    copyRightDateRange: [],
                    copyRightDealer: '',
                    operator: '',
                    status: '注入成功',
                    source: '媒资系统注入',
                    programClassification: '',
                    programType: [],
                    leadActor: [],
                    director: [],
                    keyWords: [],
                    releaseTime: '',
                    programImageList: [],
                    profile: '',
                    episodes: '30',
                    truePlayback: 30,
                    displayPlayback: 30000
                },
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
                ],
                programRules: {
                    name: [
                        { required: true, message: '请输入节目名称', trigger: 'change' }
                    ],
                    area: [
                        { required: true, message: '请选择地区', trigger: 'change' }
                    ],
                    point: [
                        { required: true, message: '请输入节目看点', trigger: 'change' }
                    ],
                    releaseTime: [
                        { required: true, message: '请选择上映日期', trigger: 'change' }
                    ],
                    profile: [
                        { required: true, message: '请输入节目简介', trigger: 'change' }
                    ],
                    programType: [
                        { required: true, message: '请选择节目类型', trigger: 'change' }
                    ],
                    leadActor: [
                        { required: true, message: '请选择节目主演', trigger: 'change' }
                    ],
                    director: [
                        { required: true, message: '请选择节目导演', trigger: 'change' }
                    ],
                    newTag: [
                        { required: true, message: '请选择是否有new标签', trigger: 'change' }
                    ]
                }
            };
        },
        methods: {
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
                this.$router.push({name: 'ProgramTypeManage'});
            },
            handleClick(row) {
            }
        }
    };
</script>
<style lang="less" scoped>
</style>
