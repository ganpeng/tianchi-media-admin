<template>
    <div class="category-fixed-module">
        <div v-if="!isEdit" class="btn-field text-right">
            <el-button @click="editFixedModuleHandler" class="btn-style-five">
                <svg-icon icon-class="edit"></svg-icon>
            </el-button>
        </div>
        <div class="content-field">
            <div class="top-field">
                <div class="wrapper">
                    <div :style="styleBgImageStr(0)" class="top-left-field">
                        <el-button v-if="isEdit" @click="selectFilter(0)" class="btn-style-two btn130">
                            选择筛选
                        </el-button>
                    </div>
                </div>
                <div class="wrapper">
                    <div :style="styleBgImageStr(1)" class="top-middle-field">
                        <el-button v-if="isEdit" @click="selectFilter(1)" class="btn-style-two btn130">
                            选择筛选
                        </el-button>
                    </div>
                </div>
                <div class="wrapper">
                    <div :style="styleBgImageStr(2)" class="top-right-field">
                        <el-button v-if="isEdit" @click="selectFilter(2)" class="btn-style-two btn130">
                            选择筛选
                        </el-button>
                    </div>
                </div>
            </div>
            <div class="bottom-field">
                <div class="wrapper">
                    <div :style="styleBgImageStr(3)" class="bottom-left-field">
                        <el-button v-if="isEdit" @click="selectFilter(3)" class="btn-style-two btn130">
                            选择筛选
                        </el-button>
                    </div>
                </div>
                <div class="wrapper">
                    <div :style="styleBgImageStr(4)" class="bottom-middle-field">
                        <el-button v-if="isEdit" @click="selectFilter(4)" class="btn-style-two btn130">
                            选择筛选
                        </el-button>
                    </div>
                </div>
                <div class="wrapper">
                    <div :style="styleBgImageStr(5)" class="bottom-right-field">
                        <el-button v-if="isEdit" @click="selectFilter(5)" class="btn-style-two btn130">
                            选择筛选
                        </el-button>
                    </div>
                </div>
            </div>
        </div>
        <div v-if="isEdit" class="fixed-btn-container">
            <el-button class="btn-style-two" type="primary" @click="saveHandler">保存</el-button>
        </div>
        <edit-filter :squareIndex="squareIndex" :allowResolutions="allowResolutions" ref="selectFilterDialog"></edit-filter>
    </div>
</template>
<script>
import {mapGetters, mapMutations} from 'vuex';
import EditFilter from '../add_edit_module/EditFilter';
import _ from 'lodash';
export default {
    name: 'CategoryFixedModule',
    components: {
        EditFilter
    },
    props: {
        isEdit: {
            type: Boolean,
            default: false
        }
    },
    computed: {
        ...mapGetters({
            layout: 'pageLayout/layout',
            selectAll: 'pageLayout/selectAll'
        }),
        getImageUriByKeyAndIndex() {
            return (key, squareIndex) => {
                let {navbarId} = this.$route.params;
                let uri = _.get(this.layout, `${navbarId}.data.0.layoutItemMultiList.${squareIndex}.${key}.uri`);
                return uri;
            };
        },
        styleBgImageStr() {
            return (squareIndex) => {
                let bgStr = `background-image: url(${this.getImageUriByKeyAndIndex('coverImage', squareIndex)})`;
                return bgStr;
            };
        }
    },
    data() {
        return {
            squareIndex: 0,
            allowResolutions: []
        };
    },
    methods: {
        ...mapMutations({
            saveLayoutToStore: 'pageLayout/saveLayoutToStore'
        }),
        editFixedModuleHandler() {
            let {navbarId} = this.$route.params;
            this.$router.push({ name: 'EditFixedModule', params: {navbarId, index: 0} });
        },
        selectFilter(squareIndex) {
            this.squareIndex = squareIndex;
            this.setAllowResolutions(this.squareIndex);
            this.$refs.selectFilterDialog.showDialog('FILTER');
        },
        saveHandler() {
            let {navbarId} = this.$route.params;
            if (!this.selectAll(navbarId, 0)) {
                this.saveLayoutToStore(navbarId);
                this.$message.success('保存成功');
                this.$router.push({ name: 'PageLayout', params: {navbarId} });
            } else {
                this.$message.error('色块必须全部选择');
            }
        },
        setAllowResolutions(squareIndex) {
            switch (squareIndex) {
                case 0:
                case 1:
                case 2:
                case 3:
                case 4:
                case 5:
                    this.allowResolutions = [{width: 560, height: 222}];
                    break;
                default:
                    throw new Error('未知的索引');
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

@mixin toggleBtn() {
    .el-button {
        display: none;
    }
    &:hover {
        .el-button {
            display: block;
        }
    }
}

.category-fixed-module {
    margin-top: 20px;
    .btn-field {
        margin: 40px 0 10px 0;
        display: flex;
        justify-content: flex-end;
    }
    .top-field {
        display: flex;
        margin-bottom: 2%;
        .wrapper {
            flex: 1;
            &:nth-child(2) {
                margin: 0 2%;
            }
            .top-left-field,
            .top-middle-field,
            .top-right-field {
                @include paddingBg(39.6428%);
                .el-button {
                    position: absolute;
                    top: 50%;
                    left: 50%;
                    transform: translate(-50%, -50%);
                }
                @include toggleBtn();
            }
        }
    }
    .bottom-field {
        display: flex;
        .wrapper {
            flex: 1;
            &:nth-child(2) {
                margin: 0 2%;
            }
            .bottom-left-field,
            .bottom-middle-field,
            .bottom-right-field {
                @include paddingBg(39.6428%);
                .el-button {
                    position: absolute;
                    top: 50%;
                    left: 50%;
                    transform: translate(-50%, -50%);
                }
                @include toggleBtn();
            }
        }
    }
}
</style>
