<template>
    <div class="news-fixed-module">
        <div v-if="!isEdit" class="btn-field text-right">
            <el-button @click="editFixedModuleHandler" class="btn-style-two">编辑</el-button>
        </div>
        <div class="top-field">
            <div class="wrapper">
                <div :style="styleBgImageStr(0)" class="top-left-field">
                    <el-button v-if="isEdit" class="btn-style-two">
                        选择节目
                    </el-button>
                </div>
            </div>
            <div class="wrapper">
                <div class="top-right-field">
                    <div class="top-right-top-field">
                        <div class="wrapper">
                            <div :style="styleBgImageStr(1)" class="top-right-top-left-field">
                                <el-button v-if="isEdit" class="btn-style-two">
                                    选择节目
                                </el-button>
                            </div>
                        </div>
                        <div class="wrapper">
                            <div :style="styleBgImageStr(2)" class="top-right-top-right-field">
                                <el-button v-if="isEdit" class="btn-style-two">
                                    选择节目
                                </el-button>
                            </div>
                        </div>
                    </div>
                    <div class="top-right-bottom-field">
                        <div class="wrapper">
                            <div :style="styleBgImageStr(3)" class="top-right-bottom-left-field">
                                <el-button v-if="isEdit" class="btn-style-two">
                                    选择节目
                                </el-button>
                            </div>
                        </div>
                        <div class="wrapper">
                            <div :style="styleBgImageStr(4)" class="top-right-bottom-right-field">
                                <el-button v-if="isEdit" class="btn-style-two">
                                    选择节目
                                </el-button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div class="bottom-field">
            <div class="wrapper">
                <div :style="styleBgImageStr(5)" class="bottom-field-item">
                    <el-button v-if="isEdit" class="btn-style-two">
                        选择筛选
                    </el-button>
                </div>
            </div>
            <div class="wrapper">
                <div :style="styleBgImageStr(6)" class="bottom-field-item">
                    <el-button v-if="isEdit" class="btn-style-two">
                        选择筛选
                    </el-button>
                </div>
            </div>
            <div class="wrapper">
                <div :style="styleBgImageStr(7)" class="bottom-field-item">
                    <el-button v-if="isEdit" class="btn-style-two">
                        选择筛选
                    </el-button>
                </div>
            </div>
            <div class="wrapper">
                <div :style="styleBgImageStr(8)" class="bottom-field-item">
                    <el-button v-if="isEdit" class="btn-style-two">
                        选择筛选
                    </el-button>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
import {mapGetters} from 'vuex';
import _ from 'lodash';
export default {
    name: 'NewsFixedModule',
    props: {
        isEdit: {
            type: Boolean,
            default: false
        }
    },
    computed: {
        ...mapGetters({
            pageLayoutList: 'pageLayout/pageLayoutList'
        }),
        fixedLayoutItems() {
            return (this.pageLayoutList[0] &&
                    this.pageLayoutList[0].layoutItemMultiList) || [];
        },
        styleBgImageStr() {
            return (index) => {
                let items = (this.pageLayoutList[0] &&
                    this.pageLayoutList[0].layoutItemMultiList) || [];
                let uri = items[index] ? _.get(items[index], 'coverImage.uri') : '';
                return `background-image: url(${uri})`;
            };
        }
    },
    data() {
        return {};
    },
    created() {
        console.log(this.isEdit);
    },
    methods: {
        editFixedModuleHandler() {
            let {navbarId} = this.$route.params;
            this.$router.push({ name: 'EditFixedModule', params: {navbarId} });
        }
    }
};
</script>
<style lang="scss" scoped>
@mixin paddingBg($paddingNum) {
    height: 0;
    padding-bottom: $paddingNum;
    background-color: #2A3040;
    background-size: contain;
    background-repeat: no-repeat;
    background-position: center center;
    border-radius: 8px;
}
.news-fixed-module {
    margin-top: 20px;
    .btn-field {
        margin: 40px 0 10px 0;
    }
    .top-field {
        display: flex;
        margin-bottom: 2%;
        .wrapper {
            flex: 1;
            &:first-child {
                margin-right: 2%;
            }
            .top-left-field {
                position: relative;
                @include paddingBg(50.998%);
            }
            .top-right-field {
                display: flex;
                flex-direction: column;
                .top-right-top-field {
                    margin-bottom: 4%;
                }
                .top-right-top-field,
                .top-right-bottom-field {
                    display: flex;
                    .wrapper {
                        flex: 1;
                        &:first-child {
                            margin-right: 4%;
                        }
                        .top-right-top-left-field,
                        .top-right-top-right-field,
                        .top-right-bottom-left-field,
                        .top-right-bottom-right-field {
                            position: relative;
                            @include paddingBg(48.6748%);
                        }
                    }
                }
            }
        }
    }
    .bottom-field {
        display: flex;
        .wrapper {
            flex: 1;
            .bottom-field-item {
                position: relative;
                @include paddingBg(44.03292%);
            }
        }
        .wrapper + .wrapper {
            margin-left: 2%;
        }
    }
    .wrapper {
        .btn-style-two {
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
        }
    }
}
</style>
