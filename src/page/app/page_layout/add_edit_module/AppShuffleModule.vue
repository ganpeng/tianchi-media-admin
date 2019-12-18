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
                            <mixed1
                                :isEdit="true"
                                :index="index"
                                v-if="layoutBlock.layoutTemplate === 'M_LT_1'"
                            ></mixed1>
                            <mixed22
                                :isEdit="true"
                                :index="index"
                                v-if="layoutBlock.layoutTemplate === 'M_LT_2_2'"
                            ></mixed22>
                            <mixed33
                                :isEdit="true"
                                :index="index"
                                v-if="layoutBlock.layoutTemplate === 'M_LT_3_3'"
                            ></mixed33>
                        </el-form-item>
                    </el-col>
                </el-col>
            </el-form>
        </div>
        <div class="fixed-btn-container">
            <el-button class="btn-style-two" type="primary" @click="saveHandler">保存</el-button>
        </div>
        <add-programme
            :squareIndex="1"
            :allowResolutions="allowResolutions"
            ref="selectProgrammeDialog">
        </add-programme>
    </div>
</template>
<script>
import {mapGetters, mapMutations, mapActions} from 'vuex';
import _ from 'lodash';
import SingleImageUploader from 'sysComponents/custom_components/custom/SingleImageUploader';
import AddProgramme from './AddProgramme';

import Mixed1 from '../mixed_module/Mixed1';
import Mixed22 from '../mixed_module/Mixed22';
import Mixed33 from '../mixed_module/Mixed33';

const shuffleOptions = [
    {
        value: 'M_LT_1',
        name: '1',
        icon: 'app_template_4'
    },
    {
        value: 'M_LT_2_2',
        name: '22',
        icon: 'app_template_22'
    },
    {
        value: 'M_LT_3_3',
        name: '33',
        icon: 'app_template_33'
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
    name: 'AppShuffleModule',
    components: {
        SingleImageUploader,
        AddProgramme,
        Mixed1,
        Mixed22,
        Mixed33
    },
    data() {
        return {
            navbarId: '',
            index: 0,
            operator: '',
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
            this.operator = operator;

            await this.getAppLayoutByNavbarId(navbarId);

            if (this.operator === 'edit') {
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
            selectAll: 'appPageLayout/selectAll',
            //  2.3.0 新增
            activeLayout: 'appPageLayout/activeLayout'
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
            updateLayoutBlockDataByIndex: 'appPageLayout/updateLayoutBlockDataByIndex',
            insertLayoutBlockByIndex: 'appPageLayout/insertLayoutBlockByIndex'
        }),
        ...mapActions({
            //  2.3.0 新增的部分
            getAppLayoutByNavbarId: 'appPageLayout/getAppLayoutByNavbarId'
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
                                let putLayoutBlockRes = await this.$service.putAppLayoutBlock(this.layoutBlockId, layoutBlock);
                                if (putLayoutBlockRes && putLayoutBlockRes.code === 0) {
                                    this.$message.success('保存成功');
                                    this.$router.push({ name: 'AppPageLayout', params: {navbarId: this.navbarId} });
                                }
                            }
                        } else {
                            this.updateLayoutBlockDataByIndex({index: this.index, key: 'sort', value: this.index});
                            let layoutBlock = _.get(this.activeLayout, `${this.index}`);
                            if (layoutBlock) {
                                    let postLayoutBlockRes = await this.$service.postAppLayoutBlock(this.navbarId, layoutBlock);
                                    if (postLayoutBlockRes && postLayoutBlockRes.code === 0) {
                                        this.$message.success('保存成功');
                                        this.$router.push({ name: 'AppPageLayout', params: {navbarId: this.navbarId} });
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
                case 'M_LT_1':
                    this.updateLayoutBlockDataByIndex({
                        index: this.index,
                        key: 'layoutItemMultiList',
                        value: _.times(1, () => _.cloneDeep(defaultLayoutItem))
                    });
                    break;
                case 'M_LT_2_2':
                    this.updateLayoutBlockDataByIndex({
                        index: this.index,
                        key: 'layoutItemMultiList',
                        value: _.times(4, () => _.cloneDeep(defaultLayoutItem))
                    });
                    break;
                case 'M_LT_3_3':
                    this.updateLayoutBlockDataByIndex({
                        index: this.index,
                        key: 'layoutItemMultiList',
                        value: _.times(6, () => _.cloneDeep(defaultLayoutItem))
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
