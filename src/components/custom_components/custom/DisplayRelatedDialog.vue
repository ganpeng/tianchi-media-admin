<!-- 关联关系的组件  -->
<template>
    <el-dialog
        title="关联关系"
        class="relate-dialog"
        custom-class="related-custom-dialog"
        :visible.sync="displayRelatedDialogVisible"
        :show-close="true"
        :before-close="closeDialog"
        :close-on-click-modal="false"
        :close-on-press-escape="false"
        :modal="false"
        top="25vh"
        :append-to-body="true">
        <div v-if="displayRelatedDialogVisible">
            <!--视频-->
            <div v-if="type === 'VIDEO'">
                <div class="origin-name">
                    {{currentItemInfo.originName}}
                </div>
            </div>
            <!--专题-->
            <div v-if="type === 'SUBJECT'">
                <div class="origin-name">
                    {{currentItemInfo.name}}
                </div>
                <ul class="category-list">
                    <li>{{currentItemInfo.category === 'FIGURE' ? '人物' : '节目'}}</li>
                </ul>
                <div class="status status-up" v-if="currentItemInfo.visible">已上架</div>
                <div class="status status-down" v-else>已下架</div>
            </div>
            <!--频道-->
            <div v-if="type === 'CAROUSEL' || type === 'LIVE'">
                <div class="origin-name">
                    {{currentItemInfo.innerName}}
                </div>
                <ul class="category-list">
                    <li v-for="(item, index) in currentItemInfo.typeList" :key="index">
                        {{item.name}}
                    </li>
                </ul>
                <div class="status status-up" v-if="currentItemInfo.visible">已上架</div>
                <div class="status status-down" v-else>已下架</div>
            </div>
            <!--节目-->
            <div v-if="type === 'PROGRAMME'">
                <div class="origin-name">
                    {{currentItemInfo.innerName}}
                </div>
                <ul class="category-list">
                    <li v-for="(item, index) in currentItemInfo.typeList" :key="index">
                        {{item.name}}
                    </li>
                </ul>
                <div class="status status-up" v-if="currentItemInfo.visible">已上架</div>
                <div class="status status-down" v-else>已下架</div>
            </div>
            <!--人物-->
            <div v-if="type === 'FIGURE'">
                <div class="origin-name">
                    {{currentItemInfo.innerName}}
                </div>
                <div class="status status-up" v-if="currentItemInfo.visible">已上架</div>
                <div class="status status-down" v-else>已下架</div>
            </div>
            <ul class="relate-list">
                <li class="relate-title">
                    <span>关联页面</span>
                    <label>关联位置</label>
                </li>
                <li v-for="(item,index) in currentItemInfo.refObjList" :key="index">
                    <span v-html="getRelatedType(item)"></span>
                    <label @click="toRelatedRoute(item)"><i class="ellipsis one">{{item.name ? item.name : '点击跳转'}}</i></label>
                </li>
            </ul>
        </div>
    </el-dialog>
</template>
<script>
    import {mapGetters} from 'vuex';
    import _ from 'lodash';

    export default {
        name: 'DisplayRelateDialog',
        props: {
            type: {
                type: String,
                default: ''
            },
            currentItemInfo: {
                type: Object,
                default: function () {
                    return {};
                }
            }
        },
        data() {
            return {
                displayRelatedDialogVisible: false
            };
        },
        computed: {
            ...mapGetters({
                layout: 'pageLayout/layout'
            }),
            getRelatedType() {
                return (refItem) => {
                    switch (refItem.refType) {
                        case 'PROGRAMME':
                            return '节目';
                        case 'SUBJECT':
                            return '专题';
                        case 'CAROUSEL':
                            return '轮播';
                        case 'LAYOUT':
                            return this.getLayoutTitle(refItem);
                        case 'PRODUCT':
                            return '产品';
                        case 'INTERCUT':
                            return '轮播插播';
                        default:
                            break;
                    }
                };
            }
        },
        methods: {
            toRelatedRoute(refItem) {
                switch (refItem.refType) {
                    case 'PROGRAMME':
                        this.$router.push({name: 'EditProgramme', params: {id: refItem.refId}});
                        break;
                    case 'SUBJECT':
                        let subjectParams = JSON.parse(refItem.params);
                        switch (subjectParams.subjectCategory) {
                            case 'FIGURE':
                                this.$router.push({name: 'EditFigureSubject', params: {id: refItem.refId}});
                                break;
                            case 'PROGRAMME':
                                this.$router.push({name: 'EditProgrammeSubject', params: {id: refItem.refId}});
                                break;
                            default:
                                break;
                        }
                        break;
                    case 'CAROUSEL':
                        this.$router.push({name: 'EditCarouselChannel', params: {id: refItem.refId}});
                        break;
                    case 'LAYOUT':
                        this.layoutRouter(refItem);
                        break;
                    case 'PRODUCT':
                        let productParams = JSON.parse(refItem.params);
                        switch (productParams.productCategory) {
                            case 'PROGRAMME':
                                this.$router.push({name: 'EditProgrammeProduct', params: {id: refItem.refId}});
                                break;
                            case 'CAROUSEL':
                                this.$router.push({name: 'EditCarouselProduct', params: {id: refItem.refId}});
                                break;
                            case 'RECORD':
                                this.$router.push({name: 'EditRecordProduct', params: {id: refItem.refId}});
                                break;
                            default:
                                break;
                        }
                        break;
                    case 'INTERCUT':
                        let interCutParams = JSON.parse(refItem.params);
                        if (Date.now() > interCutParams.startTime) {
                            this.$message.warning('当前插播的状态为生效中或已失效，不能编辑');
                            return;
                        }
                        this.$router.push({name: 'EditInterCut', params: {id: refItem.refId}});
                        break;
                    default:
                        break;
                }
            },
            showDialog() {
                this.displayRelatedDialogVisible = true;
            },
            closeDialog() {
                this.displayRelatedDialogVisible = false;
            },
            layoutRouter(refItem) {
                if (refItem.refType === 'LAYOUT' && refItem.params) {
                    let params = JSON.parse(refItem.params);
                    let {renderType, navBarId, layoutBlockId} = params;
                    if (refItem.refId && navBarId && _.get(this.layout, `${navBarId}.data`)) {
                        let sort = _.get(this.layout, `${navBarId}.data`).findIndex((item) => {
                            return item.id === refItem.refId;
                        });
                        // console.log('++++++++++++++++++++++++++');
                        // console.log(`refItem: ${refItem}`);
                        // console.log(`refId: ${refItem.refId}`);
                        // console.log(`navBarId: ${navBarId}`);
                        // console.log(`layout: ${this.layout}`);
                        // console.log(`sort: ${sort}`);
                        // console.log('++++++++++++++++++++++++++');
                        if (sort < 0) {
                            this.$message.error('该布局模块不存在');
                            return false;
                        }

                        if (parseInt(sort) === 0) {
                            this.$router.push({
                                name: 'EditFixedModule',
                                params: {navbarId: navBarId, index: sort},
                                query: {id: refItem.refId}
                            });
                        } else {
                            switch (renderType) {
                                case 'FIGURE':
                                    this.$router.push({
                                        name: 'PersonModule',
                                        params: {navbarId: navBarId, index: sort, operator: 'edit'},
                                        query: {id: layoutBlockId}
                                    });
                                    break;
                                case 'SPECIAL':
                                    this.$router.push({
                                        name: 'EditSpecialModule',
                                        params: {navbarId: navBarId, index: sort, operator: 'edit'},
                                        query: {id: layoutBlockId}
                                    });
                                    break;
                                case 'PROGRAMME_SUBJECT':
                                    this.$router.push({
                                        name: 'ProgrammeSubjectModule',
                                        params: {navbarId: navBarId, index: sort, operator: 'edit'},
                                        query: {id: layoutBlockId}
                                    });
                                    break;
                                case 'FIGURE_SUBJECT':
                                    this.$router.push({
                                        name: 'PersonSubjectModule',
                                        params: {navbarId: navBarId, index: sort, operator: 'edit'},
                                        query: {id: layoutBlockId}
                                    });
                                    break;
                                case 'SHUFFLE':
                                    this.$router.push({
                                        name: 'ShuffleModule',
                                        params: {navbarId: navBarId, index: sort, operator: 'edit'},
                                        query: {id: layoutBlockId}
                                    });
                                    break;
                            }
                        }
                    }
                }
            },
            getLayoutTitle(refItem) {
                if (refItem.refType === 'LAYOUT' && refItem.params) {
                    let params = JSON.parse(refItem.params);
                    let {navBarFocal, navBarName} = params;
                    if (navBarFocal && navBarFocal.uri) {
                        return `<img src=${navBarFocal.uri} />`;
                    } else {
                        return navBarName;
                    }
                }
            }
        }
    };
</script>

<style lang="scss" scoped>

</style>

<style lang="scss">

    .relate-dialog {
        .related-custom-dialog {
            width: 500px !important;
            border-radius: 8px;
            background: rgba(12, 16, 25, 0.80);
            box-shadow: 2px 4px 10px 0 rgba(0, 0, 0, 0.30);
        }
        .el-dialog__header {
            .el-dialog__title {
                font-size: 20px;
                color: #A8ABB3;
            }
            .el-dialog__headerbtn {
                transform: translateY(-50%);
                .el-dialog__close.el-icon-close {
                    color: $closeBtnColor;
                    font-size: 20px;
                    &:hover {
                        color: $closeBtnHoverColor;
                    }
                }
            }
        }
        .el-dialog__body {
            padding: 20px 20px 90px 20px;
            .origin-name {
                padding-left: 30px;
                margin-bottom: 4px;
                text-align: left;
                font-size: 16px;
                color: #A8ABB3;
            }
            .category-list {
                display: flex;
                padding-left: 30px;
                margin-bottom: 10px;
                li {
                    margin-right: 10px;
                    font-size: 14px;
                    color: #6F7480;
                }
            }
            .status {
                margin-left: 30px;
                width: 50px;
                height: 20px;
                line-height: 20px;
                text-align: center;
                border-radius: 8px;
                font-size: 12px;
                color: #FFFFFF;
                &.status-up {
                    background: #3AC26F;
                }
                &.status-down {
                    background: #6F7480;
                }
            }
            .relate-list {
                margin-top: 20px;
                li {
                    display: flex;
                    align-items: center;
                    height: 60px;
                    line-height: 60px;
                    border-bottom: 1px solid #252D3F;
                    span {
                        display: inline-block;
                        width: 200px;
                        text-align: center;
                        font-size: 16px;
                        color: #FFFFFF;
                        img {
                            margin-top: 20px;
                            height: 20px;
                            width: auto;
                        }
                    }
                    label {
                        display: inline-block;
                        width: 255px;
                        text-align: center;
                        font-size: 16px;
                        color: #1989FA;
                        cursor: pointer;
                        &:hover {
                            text-decoration: underline;
                        }
                    }
                    &.relate-title {
                        height: 40px;
                        line-height: 40px;
                        background: rgba(37, 45, 63, 0.50);
                        border-bottom: none;
                        span, label {
                            font-size: 16px;
                            color: #A8ABB3;
                            cursor: default;
                            &:hover {
                                text-decoration: none;
                            }
                        }
                    }
                }

            }
        }
    }

</style>
