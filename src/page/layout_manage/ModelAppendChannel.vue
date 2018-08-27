<template>
    <div class="set-channel-container">
        <custom-breadcrumb
            v-bind:breadcrumbList="[
            {name:'内容管理'},
            {name:'栏目管理'},
            {name:'频道页面设置'},
            {name:'频道模块设置'}]">
        </custom-breadcrumb>
        <el-form
            label-width="100px"
            :model="modelForm"
            status-icon
            class="form"
            :rules="modelFormRules"
            @submit.native.prevent
            ref="modelForm"
            >
            <el-col :span="8">
                <el-form-item label="模块名称" prop="title">
                    <el-input
                        v-model="modelForm.title"
                        clearable
                        placeholder="请输入模块名称">
                    </el-input>
                </el-form-item>
                <el-form-item label="模块板式" prop="templateType">
                        <el-select
                            v-model="modelForm.templateType"
                            clearable
                            class="float-left"
                            placeholder="请选择模块板式"
                            @change="setBlockModel"
                            prop="templateType">
                            <el-option
                                v-for="item in templateTypeOptions"
                                :key="item.id"
                                :label="item.name"
                                :value="item.name">
                            </el-option>
                        </el-select>
                </el-form-item>
            </el-col>
            <el-col :span="24">
                <div class="model-block">
                    <ul v-for="(row,rowIndex) in layoutItemList" :key="rowIndex" :class="row.listClass">
                        <li v-for="(item,index) in row"
                            :key="index"
                            @click="setModelItem(rowIndex, index, row.listClass)">
                            <div class="ab-center text-center">
                                <img :src="item.coverImage ? item.coverImage.uri : '' | imageUrl"
                                    :alt="item.coverImage.name"
                                    v-if="item.coverImage && item.coverImage.id">
                                <label class="tip" v-else>点击设置模块推荐位内的频道</label>
                            </div>
                        </li>
                    </ul>
                </div>
            </el-col>
            <el-col :span="24" class="text-center">
                <el-button class="model-btn page-main-btn" type="primary" @click="saveChannelModel">确定</el-button>
            </el-col>
        </el-form>
        <el-dialog
            title=""
            :visible.sync="setChannelDialogVisible">
            <select-channel
                :size="size"
                ref="selectChannel"
                :existList="layoutItemList"
                :currentRow="currentRow"
                :currentIndex="currentIndex"
                v-on:closeSetChannelDialog="closeSetChannelDialog"
                :successHandler="setChannelBlock"
                ></select-channel>
        </el-dialog>
    </div>
</template>
<script>
import {mapMutations, mapGetters} from 'vuex';
import {LAYOUT_IMAGE_DIMENSION} from '@/util/config/dimension';
import templateType from '@/util/config/template_type';
import SelectChannel from './SelectChannel';
export default {
    name: 'ModelAppendChannel',
    components: {
        SelectChannel
    },
    data() {
        return {
            templateTypeOptions: templateType.TYPE,
            layoutItemList: [],
            setChannelDialogVisible: false,
            modelForm: {
                title: '',
                templateType: ''
            },
            modelFormRules: {
                title: [
                    { required: true, message: '请输入模块名称' }
                ],
                templateType: [
                    { required: true, message: '请输入模块板式' }
                ]
            },
            size: [],
            templateHeight: '',
            //  一些临时的变量
            currentRow: 0,
            currentIndex: 0
        };
    },
    created() {
        let {navBarId, navBarSignCode, model, operate} = this.$route.params;
        if (operate === 'edit') {
            let liveChannelObj = this.getCurrentLayout({navBarSignCode, navBarId});
            let {layoutBlockList} = liveChannelObj;
            let currentModel = layoutBlockList[model];
            if (currentModel) {
                this.modelForm.title = currentModel.title;
                this.layoutItemList = currentModel.layoutItemMultiList;
                this.modelForm.templateType = this.generatorTemplate(currentModel.layoutTemplate, currentModel.height);
                this.setModelClass();
            }
        }
    },
    computed: {
        ...mapGetters({
            getCurrentLayout: 'layout/getCurrentLayout'
        })
    },
    methods: {
        ...mapMutations({
            setSubjectLayoutItem: 'layout/setSubjectLayoutItem'
        }),
        //  生成模版
        generatorTemplate(layoutTemplate, height) {
            let template = layoutTemplate.split('LT_')[1].split('_').join('+');
            if (template === '6+6' && parseInt(height.split('_')[0]) === 134) {
                return 's6+s6';
            } else if (template === '6' && parseInt(height.split('_')[0]) === 134) {
                return 's6';
            } else {
                return template;
            }
        },
        setBlockModel() {
            this.layoutItemList = [];
            if (this.modelForm.templateType) {
                for (let k = 0; k < this.modelForm.templateType.split('+').length; k++) {
                    this.layoutItemList[k] = [];
                    for (let i = 0; i < templateType.SIZE[this.modelForm.templateType.split('+')[k]].count; i++) {
                        this.layoutItemList[k].push({});
                    }
                }
                this.setModelClass();
            }
        },
        setModelClass() {
            this.initTemplateHeight();
            let templateHeightArray = this.templateHeight.split('_');
            let templateTypeArray = this.modelForm.templateType.split('+');
            for (let k = 0; k < this.modelForm.templateType.split('+').length; k++) {
                this.layoutItemList[k].listClass = 'model-' + templateTypeArray[k] + '-' + templateHeightArray[k];
            }
        },
        // 根据选择的模板设置模板的高度
        initTemplateHeight() {
            this.templateHeight = '';
            let array = this.modelForm.templateType.split('+');
            for (let i = 0; i < array.length; i++) {
                this.templateHeight = this.templateHeight + '_' + LAYOUT_IMAGE_DIMENSION['model-' + array[i]].coverImage.height;
            }
            this.templateHeight = this.templateHeight.slice(1);
        },

        // 设置模板样式中的节目项
        setModelItem(row, index, imageModel) {
            let newModel = this.fixedModel(imageModel);
            let {width, height} = LAYOUT_IMAGE_DIMENSION[newModel].coverImage;
            this.size = [{
                value: `${width}*${height}`,
                label: `当前块尺寸: ${width}*${height}`
            }];
            this.currentRow = parseInt(row);
            this.currentIndex = parseInt(index);
            this.showSetChannelDialog();
            this.$nextTick(() => {
                this.$refs.selectChannel.getExistChannel();
            });
        },
        fixedModel(imageModel) {
            let arr = imageModel.split('-');
            if (`${arr[0]}-${arr[1]}` === 'model-6' && parseInt(arr[2]) === 134) {
                return 'model-6s';
            } else {
                return `${arr[0]}-${arr[1]}`;
            }
        },
        showSetChannelDialog() {
            this.setChannelDialogVisible = true;
        },
        closeSetChannelDialog() {
            this.setChannelDialogVisible = false;
        },
        setChannelBlock(data) {
            let {itemClass} = this.layoutItemList[this.currentRow][this.currentIndex];
            data.itemClass = itemClass;
            this.layoutItemList[this.currentRow][this.currentIndex] = data;
        },
        checkBlockSeted() {
            let resultList = [];
            this.layoutItemList.forEach((item) => {
                resultList = resultList.concat(item);
            });
            let flag = resultList.findIndex((item) => !item.coverImage || !item.coverImage.id);
            return flag > -1;
        },
        saveChannelModel() {
            this.$refs.modelForm.validate(valid => {
                if (valid) {
                    if (this.checkBlockSeted()) {
                        this.$message.error('请选择色块频道');
                        return false;
                    } else {
                        let {navBarId, navBarSignCode, model, operate} = this.$route.params;
                        let {title, templateType} = this.modelForm;
                        let layoutTemplate = 'LT_' + templateType.replace(/\+/g, '_').replace(/s/g, '');
                        let channelModel = {
                            title,
                            subjectId: 'channel_12345',
                            layoutTemplate: layoutTemplate,
                            renderType: 'CHANNEL',
                            height: this.templateHeight,
                            layoutItemMultiList: this.layoutItemList
                        };
                        this.setSubjectLayoutItem({navBarId, navBarSignCode, model, operate, subjectModel: channelModel});
                        this.$router.push(`/nav-bar-manage/layout-setting/LIVE_CHANNEL/${navBarId}`);
                    }
                }
            });
        }
    }
};
</script>
<style lang="scss" scoped>

    .form {
        margin-top: 20px;
    }
    .model-btn {
        margin-top: 40px;
    }

    .model-block {
        ul {
            display: flex;
            margin-top: 30px;
            justify-content: space-between;
            li {
                position: relative;
                margin-right: 30px;
                flex-grow: 1;
                // background: #5daf34;
                background: $dynamicGray;
                border: 1px solid #fff;
                cursor: pointer;
                &:hover {
                    border: 1px solid $baseBlue;
                }
                .tip {
                    font-size: $normalFontSize;
                    color: $baseBlue;
                    cursor: pointer;
                }
                div {
                    display: flex;
                    flex-direction: column;
                    justify-content: center;
                }
                .all-tip {
                    font-size: 20px;
                    color: #fff;
                }
                img {
                    display: block;
                    width: 100%;
                    height: 100%;
                }
                &:last-child {
                    margin-right: 0px;
                }
            }
        }
        ul.model-1-200 {
            li {
                width: 100%;
                padding-bottom: 12%;
            }
        }
        ul.model-2-225 {
            li {
                width: 48%;
                padding-top: 13%;
            }
        }

        ul.model-3-225 {
            li {
                width: 31%;
                padding-top: 13%;
            }
        }
        ul.model-4-225 {
            li {
                width: 23%;
                padding-top: 13%;
            }
        }
        ul.model-6-350 {
            li {
                width: 14%;
                padding-top: 20%;
            }
        }
        ul.model-s6-134 {
            li {
                width: 14%;
                padding-top: 8%;
            }
        }
    }

    .item-operate {
        position: absolute;
        right: 40px;
        top: 14px;
        .el-tooltip {
            margin-right: 26px;
        }
        i {
            margin-right: 16px;
            font-size: 24px;
            color: white;
            cursor: pointer;
        }
    }

    .save-btn {
        margin: 60px 0 40px 0;
    }
</style>
