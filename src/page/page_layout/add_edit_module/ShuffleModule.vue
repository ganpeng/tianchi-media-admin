<template>
    <div class="shuffle-module-container">
        <h2 class="content-title">{{title}}</h2>
        <div class="seperator-line"></div>
        <div class="form-container">
            <el-form :model="layoutBlock"
                    :rules="inputRules"
                    status-icon
                    ref="shuffleModuleForm"
                    label-width="120px"
                    @submit.native.prevent
                    class="form-block my-form">
                <el-col :span="8">
                    <el-form-item v-if="layoutBlock.layoutTemplate === 'LT_3_3'" label="模块名称">
                        <el-input
                            :value="layoutBlock.title"
                            @input="inputHandler($event, 'title')"
                            placeholder="请输入模块名称"
                        ></el-input>
                    </el-form-item>
                    <el-form-item v-else label="模块名称" prop="title">
                        <el-input
                            :value="layoutBlock.title"
                            @input="inputHandler($event, 'title')"
                            placeholder="请输入模块名称"
                        ></el-input>
                    </el-form-item>
                    <el-form-item label="名称icon">
                        <single-image-uploader
                            :uri="layoutBlock.iconImage ? layoutBlock.iconImage.uri : ''"
                            :showDelete="false"
                            :uploadSuccessHandler="iconImageuploadSuccessHandler"
                            :allowResolutions="[{width: 82, height: 82}]"
                        ></single-image-uploader>
                    </el-form-item>
                </el-col>
                <el-col :span="24">
                    <el-col :span="12">
                        <el-form-item class="template-select" label="模块板式" prop="layoutTemplate">
                            <el-select
                                :value="layoutBlock.layoutTemplate"
                                @input="templateInputHandler($event)"
                                clearable
                                placeholder="请选择模块板式">
                                <el-option
                                    v-for="item in shuffleOptions"
                                    :key="item.value"
                                    :label="item.name"
                                    :value="item.value">
                                    <div
                                        @mouseover="optionMouseoverHandler(item)"
                                        @mouseout="optionMouseoutHandler()"
                                    >{{item.name}}</div>
                                </el-option>
                            </el-select>
                            <div v-if="templateIcon" :class="['option-template', templateTitle === 'sn' ? 'is-sn' : '']">
                                <h4>{{templateTitle}}</h4>
                                <svg-icon
                                    :icon-class="templateIcon"
                                ></svg-icon>
                            </div>
                        </el-form-item>
                    </el-col>
                    <el-col :span="24" style="margin-bottom: 180px;">
                        <el-form-item label=" ">
                            <mixed114
                                :isEdit="true"
                                :index="index"
                                v-if="layoutBlock.layoutTemplate === 'LT_1_1_4'"
                            ></mixed114>
                            <mixed22
                                :isEdit="true"
                                :index="index"
                                v-if="layoutBlock.layoutTemplate === 'LT_SN'"
                            ></mixed22>
                            <mixed23
                                :isEdit="true"
                                :index="index"
                                v-if="layoutBlock.layoutTemplate === 'LT_2_3'"
                            ></mixed23>
                            <mixed26
                                :isEdit="true"
                                :index="index"
                                v-if="layoutBlock.layoutTemplate === 'LT_2_6'"
                            ></mixed26>
                            <mixed32
                                :isEdit="true"
                                :index="index"
                                v-if="layoutBlock.layoutTemplate === 'LT_3_2'"
                            ></mixed32>
                            <mixed33
                                :isEdit="true"
                                :index="index"
                                v-if="layoutBlock.layoutTemplate === 'LT_3_3'"
                            ></mixed33>
                            <mixed4
                                :isEdit="true"
                                :index="index"
                                v-if="layoutBlock.layoutTemplate === 'LT_4'"
                            ></mixed4>
                            <mixed66
                                :isEdit="true"
                                :index="index"
                                v-if="layoutBlock.layoutTemplate === 'LT_6_6'"
                            ></mixed66>
                            <mixeds6
                                :isEdit="true"
                                :index="index"
                                v-if="layoutBlock.layoutTemplate === 'LT_S6'"
                            ></mixeds6>
                            <mixedsn
                                :isEdit="true"
                                :index="index"
                                v-if="layoutBlock.layoutTemplate === 'LT_SN'"
                            ></mixedsn>
                        </el-form-item>
                    </el-col>
                </el-col>
            </el-form>
        </div>
        <div class="fixed-btn-container">
            <el-button class="btn-style-two" type="primary" @click="saveHandler">保存</el-button>
        </div>
        <person-subject-dialog
            :allowResolutions="allowResolutions"
            :squareIndex="0"
            ref="personSubjectDialog"
        ></person-subject-dialog>
        <edit-programme
            :squareIndex="1"
            :allowResolutions="allowResolutions"
            ref="selectProgrammeDialog">
        </edit-programme>
    </div>
</template>
<script>
import {mapGetters, mapMutations, mapActions} from 'vuex';
import _ from 'lodash';
import SingleImageUploader from 'sysComponents/custom_components/custom/SingleImageUploader';
import PersonSubjectDialog from './PersonSubjectDialog';
import EditProgramme from './EditProgramme';

import Mixed114 from '../mixed_module/Mixed114';
import Mixed4 from '../mixed_module/Mixed4';
import Mixed22 from '../mixed_module/Mixed22';
import Mixed23 from '../mixed_module/Mixed23';
import Mixed26 from '../mixed_module/Mixed26';
import Mixed32 from '../mixed_module/Mixed32';
import Mixed33 from '../mixed_module/Mixed33';
import Mixed66 from '../mixed_module/Mixed66';
import Mixeds6 from '../mixed_module/Mixeds6';
import Mixedsn from '../mixed_module/Mixedsn';

const shuffleOptions = [
    {
        value: 'LT_2_3',
        name: '2+3',
        icon: 'template_23'
    },
    {
        value: 'LT_2_6',
        name: '2+6',
        icon: 'template_26'
    },
    {
        value: 'LT_3_2',
        name: '3+2',
        icon: 'template_32'
    },
    {
        value: 'LT_3_3',
        name: '3+3',
        icon: 'template_33'
    },
    {
        value: 'LT_6_6',
        name: '6+6',
        icon: 'template_66'
    },
    {
        value: 'LT_1_1_4',
        name: '1+1+4',
        icon: 'template_114'
    },
    {
        value: 'LT_4',
        name: '4',
        icon: 'template_4'
    },
    {
        value: 'LT_S6',
        name: 's6',
        icon: 'template_s6'
    },
    {
        value: 'LT_SN',
        name: 'sn',
        icon: 'template_sn'
    }
];

let defaultLayoutItem = {
    desc: '',
    id: '',
    layoutItemType: '',
    name: '',
    params: '',
    coverImage: {},
    coverImageBackground: {},
    cornerMark: {
        leftTop: {},
        leftBottom: {},
        rightTop: {},
        rightBottom: {}
    }
};

export default {
    name: 'ShuffleModule',
    components: {
        SingleImageUploader,
        PersonSubjectDialog,
        EditProgramme,
        Mixed26,
        Mixed32,
        Mixed33,
        Mixed66,
        Mixeds6,
        Mixed114,
        Mixed22,
        Mixed4,
        Mixed23,
        Mixedsn
    },
    data() {
        return {
            navbarId: '',
            index: 0,
            title: '',
            saveFlag: false, // 判断页面跳转之前如果没有点保存按钮的话，就删除新增的这个layoutItem
            allowResolutions: [],
            shuffleOptions,
            templateIcon: '',
            templateTitle: '',
            inputRules: {
                title: [
                    { required: true, message: '请输入混排模块名称' }
                ],
                layoutTemplate: [
                    { required: true, message: '请选择混排模块板式' }
                ]
            },

            //  2.3.0新增
            layoutBlockId: ''
        };
    },
    async created() {
        try {
            let {navbarId, index, operator} = this.$route.params;
            this.navbarId = navbarId;
            this.index = parseInt(index);

            await this.getLayoutByNavbarId(navbarId);

            if (operator === 'edit') {
                let {id} = this.$route.query;
                this.layoutBlockId = id;
                this.title = '编辑混排模块';
            } else {
                this.title = '添加混排模块';
                this.insertLayoutBlockByIndex({index, navbarId, renderType: 'SHUFFLE', layoutTemplate: ''});
            }
        } catch (err) {
            console.log(err);
        }
    },
    computed: {
        ...mapGetters({
            selectAll: 'pageLayout/selectAll',

            //  2.3.0 新增
            activeLayout: 'pageLayout/getActiveLayout'
        }),
        layoutBlock() {
            let layoutBlock = _.get(this.activeLayout, `${this.index}`);
            return layoutBlock || {};
        },
        styleBgImageStr() {
            return (squareIndex) => {
                let url = _.get(this.activeLayout, `${this.index}.layoutItemMultiList.${squareIndex}.coverImage.uri`);
                let bgStr = `background-image: url(${url})`;
                return bgStr;
            };
        }
    },
    methods: {
        ...mapMutations({
            //  2.3.0新增
            // updateLayoutBlockDataById: 'pageLayout/updateLayoutBlockDataById',
            updateLayoutBlockDataByIndex: 'pageLayout/updateLayoutBlockDataByIndex',
            insertLayoutBlockByIndex: 'pageLayout/insertLayoutBlockByIndex'
        }),
        ...mapActions({
            //  2.3.0 新增的部分
            getLayoutByNavbarId: 'pageLayout/getLayoutByNavbarId'
        }),
        inputHandler(value, key) {
            this.updateLayoutBlockDataByIndex({index: this.index, key, value});
        },
        templateInputHandler(value) {
            this.updateLayoutBlockDataByIndex({index: this.index, key: 'layoutTemplate', value});
            this.setLayoutItemMultiList(value);
        },
        iconImageuploadSuccessHandler(image) {
            this.updateLayoutBlockDataByIndex({index: this.index, key: 'iconImage', value: image});
        },
        async saveHandler() {
            try {
                let valid = await this.$refs.shuffleModuleForm.validate();
                if (valid) {
                    if (!this.selectAll(this.navbarId, this.index)) {
                    if (this.operator === 'edit') {
                        let layoutBlock = this.activeLayout.find((item) => item.id === this.layoutBlockId);
                        if (layoutBlock) {
                            let putLayoutBlockRes = await this.$service.putLayoutBlock(this.layoutBlockId, layoutBlock);
                            if (putLayoutBlockRes && putLayoutBlockRes.code === 0) {
                                this.$message.success('保存成功');
                                this.$router.push({ name: 'PageLayout', params: {navbarId: this.navbarId} });
                            }
                        }
                    } else {
                        this.updateLayoutBlockDataByIndex({index: this.index, key: 'sort', value: this.index});
                        let layoutBlock = _.get(this.activeLayout, `${this.index}`);
                        if (layoutBlock) {
                                let postLayoutBlockRes = await this.$service.postLayoutBlock(this.navbarId, layoutBlock);
                                if (postLayoutBlockRes && postLayoutBlockRes.code === 0) {
                                    this.$message.success('保存成功');
                                    this.$router.push({ name: 'PageLayout', params: {navbarId: this.navbarId} });
                                }
                        }
                    }
                    } else {
                        this.$message.error('专题色块必须全部选择');
                    }
                }
            } catch (err) {
                console.log(err);
            }
        },
        optionMouseoverHandler(item) {
            this.templateIcon = item.icon;
            this.templateTitle = item.name;
        },
        optionMouseoutHandler() {
            this.templateIcon = '';
            this.templateTitle = '';
        },
        setLayoutItemMultiList(value) {
            switch (value) {
                case 'LT_2_3':
                    this.updateLayoutBlockDataByIndex({
                        index: this.index,
                        key: 'layoutItemMultiList',
                        value: _.times(5, () => _.cloneDeep(defaultLayoutItem))
                    });
                    break;
                case 'LT_2_6':
                    this.updateLayoutBlockDataByIndex({
                        index: this.index,
                        key: 'layoutItemMultiList',
                        value: _.times(8, () => _.cloneDeep(defaultLayoutItem))
                    });
                    break;
                case 'LT_3_2':
                    this.updateLayoutBlockDataByIndex({
                        index: this.index,
                        key: 'layoutItemMultiList',
                        value: _.times(5, () => _.cloneDeep(defaultLayoutItem))
                    });
                    break;
                case 'LT_3_3':
                    this.updateLayoutBlockDataByIndex({
                        index: this.index,
                        key: 'layoutItemMultiList',
                        value: _.times(6, () => _.cloneDeep(defaultLayoutItem))
                    });
                    break;
                case 'LT_6_6':
                    this.updateLayoutBlockDataByIndex({
                        index: this.index,
                        key: 'layoutItemMultiList',
                        value: _.times(12, () => _.cloneDeep(defaultLayoutItem))
                    });
                    break;
                case 'LT_1_1_4':
                    this.updateLayoutBlockDataByIndex({
                        index: this.index,
                        key: 'layoutItemMultiList',
                        value: _.times(6, () => _.cloneDeep(defaultLayoutItem))
                    });
                    break;
                case 'LT_4':
                    this.updateLayoutBlockDataByIndex({
                        index: this.index,
                        key: 'layoutItemMultiList',
                        value: _.times(4, () => _.cloneDeep(defaultLayoutItem))
                    });
                    break;
                case 'LT_S6':
                    this.updateLayoutBlockDataByIndex({
                        index: this.index,
                        key: 'layoutItemMultiList',
                        value: _.times(6, () => _.cloneDeep(defaultLayoutItem))
                    });
                    break;
                case 'LT_SN':
                    this.updateLayoutBlockDataByIndex({
                        index: this.index,
                        key: 'layoutItemMultiList',
                        value: []
                    });
                    break;
                default:
                    throw new Error('模版类型错误');
            }
        }
    }
};
</script>
<style lang="scss" scoped>
@mixin paddingBg($paddingNum) {
    position: relative;
    height: 0;
    padding-bottom: $paddingNum;
    background-color: #2A3040;
    background-size: 100% 100%;
    background-repeat: no-repeat;
    background-position: center center;
    border-radius: 8px;
}
.special-square-contianer {
    display: flex;
    .left-field {
        width: 32.0733%;
        height: 100px;
        margin-right: 1.4891%;
        @include paddingBg(34.3642%);
    }
    .right-field {
        width: 66.4375%;
        height: 100px;
        @include paddingBg(34.3642%);
    }
}

.template-select {
    position: relative;
    .option-template {
        width: 300px;
        height: 180px;
        position: absolute;
        top: 0;
        left: 310px;
        z-index: 100;
        background: #414A5D;
        padding: 20px;
        border-radius: 8px;
        z-index: 1000;
        h4 {
            height: 12px;
            line-height: 12px;
            color: #fff;
        }
        .svg-icon {
            width: 100%;
            height: auto;
        }
        &.is-sn {
            .svg-icon {
                width: 84px;
                height: auto;
            }
        }
    }
}
</style>
