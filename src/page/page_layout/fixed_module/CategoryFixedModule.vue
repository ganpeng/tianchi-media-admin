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
                        <corner-mark :squareIndex="0"></corner-mark>
                        <shuffle-btn
                            v-if="isEdit"
                            :onlyChannel="false"
                            :addShuffleLayout="addShuffleLayout(0)"
                        ></shuffle-btn>
                        <!--
                        <el-button v-if="isEdit" @click="selectFilter(0)" class="btn-style-two btn130">
                            选择筛选
                        </el-button>
                        -->
                    </div>
                </div>
                <div class="wrapper">
                    <div :style="styleBgImageStr(1)" class="top-middle-field">
                        <corner-mark :squareIndex="1"></corner-mark>
                        <shuffle-btn
                            v-if="isEdit"
                            :onlyChannel="false"
                            :addShuffleLayout="addShuffleLayout(1)"
                        ></shuffle-btn>
                        <!--
                        <el-button v-if="isEdit" @click="selectFilter(1)" class="btn-style-two btn130">
                            选择筛选
                        </el-button>
                        -->
                    </div>
                </div>
                <div class="wrapper">
                    <div :style="styleBgImageStr(2)" class="top-right-field">
                        <corner-mark :squareIndex="2"></corner-mark>
                        <shuffle-btn
                            v-if="isEdit"
                            :onlyChannel="false"
                            :addShuffleLayout="addShuffleLayout(2)"
                        ></shuffle-btn>
                        <!--
                        <el-button v-if="isEdit" @click="selectFilter(2)" class="btn-style-two btn130">
                            选择筛选
                        </el-button>
                        -->
                    </div>
                </div>
            </div>
            <div class="bottom-field">
                <div class="wrapper">
                    <div :style="styleBgImageStr(3)" class="bottom-left-field">
                        <corner-mark :squareIndex="3"></corner-mark>
                        <shuffle-btn
                            v-if="isEdit"
                            :onlyChannel="false"
                            :addShuffleLayout="addShuffleLayout(3)"
                        ></shuffle-btn>
                        <!--
                        <el-button v-if="isEdit" @click="selectFilter(3)" class="btn-style-two btn130">
                            选择筛选
                        </el-button>
                        -->
                    </div>
                </div>
                <div class="wrapper">
                    <div :style="styleBgImageStr(4)" class="bottom-middle-field">
                        <corner-mark :squareIndex="4"></corner-mark>
                        <shuffle-btn
                            v-if="isEdit"
                            :onlyChannel="false"
                            :addShuffleLayout="addShuffleLayout(4)"
                        ></shuffle-btn>
                        <!--
                        <el-button v-if="isEdit" @click="selectFilter(4)" class="btn-style-two btn130">
                            选择筛选
                        </el-button>
                        -->
                    </div>
                </div>
                <div class="wrapper">
                    <div :style="styleBgImageStr(5)" class="bottom-right-field">
                        <corner-mark :squareIndex="5"></corner-mark>
                        <shuffle-btn
                            v-if="isEdit"
                            :onlyChannel="false"
                            :addShuffleLayout="addShuffleLayout(5)"
                        ></shuffle-btn>
                        <!--
                        <el-button v-if="isEdit" @click="selectFilter(5)" class="btn-style-two btn130">
                            选择筛选
                        </el-button>
                        -->
                    </div>
                </div>
            </div>
        </div>
        <div v-if="isEdit" class="fixed-btn-container">
            <el-button class="btn-style-two" type="primary" @click="saveHandler">保存</el-button>
        </div>
        <edit-filter
            :squareIndex="squareIndex" :allowResolutions="allowResolutions" ref="selectFilterDialog">
        </edit-filter>
        <!--  2.2.0新增逻辑 -->
        <link-dialog
            :squareIndex="squareIndex" :allowResolutions="allowResolutions" ref="selectLinkDialog">
        </link-dialog>
    </div>
</template>
<script>
import {mapGetters, mapMutations, mapActions} from 'vuex';
import _ from 'lodash';
import EditFilter from '../add_edit_module/EditFilter';
import CornerMark from '../CornerMark';

// 2.2.0新增
import LinkDialog from '../add_edit_module/LinkDialog';
import ShuffleBtn from './ShuffleBtn';

export default {
    name: 'CategoryFixedModule',
    components: {
        EditFilter,
        CornerMark,

        //  2.2.0新增逻辑
        LinkDialog,
        ShuffleBtn
    },
    props: {
        isEdit: {
            type: Boolean,
            default: false
        }
    },
    computed: {
        ...mapGetters({
            selectAll: 'pageLayout/selectAll',
            //  2.3.0新增
            activeLayout: 'pageLayout/getActiveLayout'
        }),
        styleBgImageStr() {
            return (squareIndex) => {
                let url = _.get(this.activeLayout, `0.layoutItemMultiList.${squareIndex}.coverImage.uri`);
                let bgStr = `background-image: url(${url})`;
                return bgStr;
            };
        }
    },
    data() {
        return {
            squareIndex: 0,
            navbarId: '',
            allowResolutions: []
        };
    },
    async created() {
        try {
            let {navbarId} = this.$route.params;
            this.navbarId = navbarId;
        } catch (err) {
            console.log(err);
        }
    },
    methods: {
        ...mapMutations({}),
        ...mapActions({
            //  2.3.0 新增的部分
            getLayoutByNavbarId: 'pageLayout/getLayoutByNavbarId'
        }),
        editFixedModuleHandler() {
            if (!this.$authority.isHasAuthority('content:layoutBlock:put')) {
                return;
            }
            let {navbarId} = this.$route.params;
            let id = _.get(this.activeLayout, '0.id');
            this.$router.push({ name: 'EditFixedModule', params: {navbarId, index: 0}, query: {id} });
        },
        selectFilter(squareIndex) {
            this.squareIndex = squareIndex;
            this.setAllowResolutions(this.squareIndex);
            this.$refs.selectFilterDialog.showDialog('FILTER');
        },
        async saveHandler() {
            try {
                if (!this.$authority.isHasAuthority('content:layoutBlock:add')) {
                    return;
                }
                let {navbarId} = this.$route.params;
                if (!this.selectAll(navbarId, 0)) {
                    let {id} = this.$route.query;
                    if (id) {
                        let layoutBlock = this.activeLayout.find((item) => item.id === id);
                        if (layoutBlock) {
                            let putLayoutBlockRes = await this.$service.putLayoutBlock(id, layoutBlock);
                            if (putLayoutBlockRes && putLayoutBlockRes.code === 0) {
                                this.$message.success('保存成功');
                                this.$router.push({ name: 'PageLayout', params: {navbarId} });
                            }
                        }
                    }
                } else {
                    this.$message.error('色块必须全部选择');
                }
            } catch (err) {
                console.log(err);
            }
        },
        addShuffleLayout(squareIndex) {
            return (layoutItemType) => {
                if (!this.$authority.isHasAuthority('content:layoutBlock:add')) {
                    return;
                }
                this.squareIndex = squareIndex;
                this.layoutItemType = layoutItemType;
                this.setAllowResolutions(this.squareIndex);
                switch (layoutItemType) {
                    case 'LINK':
                        this.$refs.selectLinkDialog.showDialog('LINK');
                        break;
                    case 'FILTER':
                        this.$refs.selectFilterDialog.showDialog();
                        break;
                    default:
                        throw new Error('layoutItemType类型错误');
                }
            };
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
