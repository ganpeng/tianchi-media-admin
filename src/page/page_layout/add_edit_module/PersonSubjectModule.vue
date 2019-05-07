<template>
    <div class="person-module-container">
        <h2 class="content-title">{{title}}</h2>
        <div class="seperator-line"></div>
        <div class="form-container">
            <el-form :model="layoutBlock"
                    :rules="inputRules"
                    status-icon
                    ref="personSubjectModuleForm"
                    label-width="120px"
                    @submit.native.prevent
                    class="form-block my-form">
                <el-col :span="8">
                    <el-form-item label="人物专题名称" prop="title">
                        <el-input
                            :value="layoutBlock.title"
                            @input="inputHandler($event, 'title')"
                            placeholder="请输入人物专题名称"
                        ></el-input>
                    </el-form-item>
                    <el-form-item label="名称icon">
                        <single-image-uploader
                            id="personSubjectIconUploader"
                            :showDelete="false"
                            :uri="layoutBlock.iconImage ? layoutBlock.iconImage.uri : ''"
                            :uploadSuccessHandler="iconImageuploadSuccessHandler"
                            :allowResolutions="[{width: 82, height: 82}]"
                        ></single-image-uploader>
                    </el-form-item>
                </el-col>
                <el-col :span="24">
                    <el-col :span="12">
                        <el-form-item label="选择人物专题" required>
                            <div class="person-subject-square-container">
                                <div :style="styleBgImageStr(0)" @click="selectPersonSubject(0)" class="field"></div>
                                <div :style="styleBgImageStr(1)" @click="selectPersonSubject(1)" class="field"></div>
                                <div :style="styleBgImageStr(2)" @click="selectPersonSubject(2)" class="field"></div>
                                <div :style="styleBgImageStr(3)" @click="selectPersonSubject(3)" class="field"></div>
                                <div :style="styleBgImageStr(4)" @click="selectPersonSubject(4)" class="field"></div>
                                <div :style="styleBgImageStr(5)" @click="selectPersonSubject(5)" class="field"></div>
                            </div>
                        </el-form-item>
                    </el-col>
                </el-col>
            </el-form>
        </div>
        <div class="fixed-btn-container">
            <el-button class="btn-style-two" type="primary" @click="saveHandler">保存</el-button>
        </div>
        <one-step-person-subject-dialog
            :allowResolutions="allowResolutions"
            :squareIndex="squareIndex"
            ref="personSubjectDialog"
        ></one-step-person-subject-dialog>
    </div>
</template>
<script>
import {mapGetters, mapMutations, mapActions} from 'vuex';
import _ from 'lodash';
import SingleImageUploader from 'sysComponents/custom_components/custom/SingleImageUploader';
import OneStepPersonSubjectDialog from './OneStepPersonSubjectDialog';
export default {
    name: 'PersonSubjectModule',
    components: {
        SingleImageUploader,
        OneStepPersonSubjectDialog
    },
    data() {
        return {
            navbarId: '',
            index: '',
            title: '',
            allowResolutions: [],
            squareIndex: 0,
            inputRules: {
                title: [
                    { required: true, message: '请输入专题模块名称' }
                ]
            },

            //  2.3.0新增
            layoutBlockId: ''
        };
    },
    async created() {
        try {
            let {id} = this.$route.query;
            let {navbarId, index, operator} = this.$route.params;
            this.navbarId = navbarId;
            this.index = index;
            this.layoutBlockId = id;

            if (operator === 'edit') {
                await this.getLayoutByNavbarId(navbarId);
                this.title = '编辑人物专题模块';
            } else {
                this.title = '新增人物专题模块';
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
            updateLayoutBlockDataById: 'pageLayout/updateLayoutBlockDataById'
        }),
        ...mapActions({
            //  2.3.0 新增的部分
            getLayoutByNavbarId: 'pageLayout/getLayoutByNavbarId'
        }),
        inputHandler(value, key) {
            this.updateLayoutBlockDataById({layoutBlockId: this.layoutBlockId, key, value});
        },
        iconImageuploadSuccessHandler(image) {
            this.updateLayoutBlockDataById({layoutBlockId: this.layoutBlockId, key: 'iconImage', value: image});
        },
        async saveHandler() {
            try {
                let valid = await this.$refs.personSubjectModuleForm.validate();
                if (valid) {
                    if (!this.selectAll(this.navbarId, this.index)) {
                        let {id} = this.$route.query;
                        if (id) {
                            let layoutBlock = this.activeLayout.find((item) => item.id === id);
                            if (layoutBlock) {
                                let putLayoutBlockRes = await this.$service.putLayoutBlock(id, layoutBlock);
                                if (putLayoutBlockRes && putLayoutBlockRes.code === 0) {
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
        selectPersonSubject(squareIndex) {
            this.allowResolutions = [{width: 260, height: 600}];
            this.squareIndex = squareIndex;
            this.$refs.personSubjectDialog.showDialog('FIGURE_SUBJECT');
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

.person-subject-square-container {
    display: flex;
    .field {
        flex: 1;
        cursor: pointer;
        border: 1px solid #2A3040;
        @include paddingBg(34.0909%);
        &:hover {
            border-color: $mainColor;
        }
    }
    .field + .field {
        margin-left: 2%;
    }
}
</style>
