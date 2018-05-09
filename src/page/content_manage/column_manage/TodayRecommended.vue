<!--今日推荐组件-->
<template>
    <div>
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>内容管理</el-breadcrumb-item>
            <el-breadcrumb-item>栏目管理</el-breadcrumb-item>
            <el-breadcrumb-item>今日推荐设置</el-breadcrumb-item>
        </el-breadcrumb>
        <div id="setting">
            <div id="live">
                <div class="record">
                    <el-tag color="#fff">不可设置</el-tag>
                </div>
                <div class="live-channel">
                    <img src="~assets/img/temporary/column_manage/main-channel.png" alt="主推荐窗口">
                </div>
                <div class="ad-group" @click="toAdGroup">
                    <img src="~assets/img/temporary/column_manage/main-ad.png" alt="主推荐广告">
                </div>
            </div>
            <ul id="recommend-three">
                <li @click="toAppendProgramme">
                    <img src="~assets/img/temporary/column_manage/three-recommend.png" alt="推荐节目">
                </li>
                <li @click="toSingleAppendSubject">
                    <img src="~assets/img/temporary/column_manage/three-recommend.png" alt="推荐节目">
                </li>
                <li>
                    <img src="~assets/img/temporary/column_manage/three-recommend.png" alt="推荐节目">
                </li>
            </ul>
            <ul id="recommend-two">
                <li>
                    <img src="~assets/img/temporary/column_manage/two-recommend.png" alt="推荐节目">
                </li>
                <li>
                    <img src="~assets/img/temporary/column_manage/two-recommend.png" alt="推荐节目">
                </li>
            </ul>
            <ul id="feature-module">
                <li class="feature feature-2-3">
                    <h3>最新上线大片</h3>
                    <div class="line-block">
                        <div>
                            <img src="~assets/img/temporary/column_manage/two-recommend.png" alt="专题节目">
                        </div>
                        <div>
                            <img src="~assets/img/temporary/column_manage/two-recommend.png" alt="专题节目">
                        </div>
                    </div>
                    <div class="line-block">
                        <div>
                            <img src="~assets/img/temporary/column_manage/three-recommend.png" alt="专题节目">
                        </div>
                        <div>
                            <img src="~assets/img/temporary/column_manage/three-recommend.png" alt="专题节目">
                        </div>
                        <div>
                            <img src="~assets/img/temporary/column_manage/three-recommend.png" alt="专题节目">
                        </div>
                    </div>
                    <div class="operate">
                        <el-tooltip class="item" effect="dark" content="编辑名称" placement="top">
                            <i class="el-icon-edit"></i>
                        </el-tooltip>
                        <el-tooltip class="item" effect="dark" content="设置内容" placement="top">
                            <i class="el-icon-setting"></i>
                        </el-tooltip>
                        <el-tooltip class="item" effect="dark" content="添加模块" placement="top">
                            <i class="el-icon-circle-plus-outline"></i>
                        </el-tooltip>
                        <el-tooltip class="item" effect="dark" content="删除模块" placement="top">
                            <i class="el-icon-delete"></i>
                        </el-tooltip>
                    </div>
                </li>
                <li class="feature feature-6">
                    <h3>热播电视剧</h3>
                    <div class="line-block">
                        <div>
                            <img src="~assets/img/temporary/column_manage/six-recommend.png" alt="专题节目">
                        </div>
                        <div>
                            <img src="~assets/img/temporary/column_manage/six-recommend.png" alt="专题节目">
                        </div>
                        <div>
                            <img src="~assets/img/temporary/column_manage/six-recommend.png" alt="专题节目">
                        </div>
                        <div>
                            <img src="~assets/img/temporary/column_manage/six-recommend.png" alt="专题节目">
                        </div>
                        <div>
                            <img src="~assets/img/temporary/column_manage/six-recommend.png" alt="专题节目">
                        </div>
                        <div>
                            <img src="~assets/img/temporary/column_manage/six-recommend.png" alt="专题节目">
                        </div>
                    </div>
                    <div class="operate">
                        <el-tooltip class="item" effect="dark" content="编辑名称" placement="top">
                            <i class="el-icon-edit"></i>
                        </el-tooltip>
                        <el-tooltip class="item" effect="dark" content="设置内容" placement="top">
                            <i class="el-icon-setting"></i>
                        </el-tooltip>
                        <el-tooltip class="item" effect="dark" content="添加模块" placement="top">
                            <i class="el-icon-circle-plus-outline"></i>
                        </el-tooltip>
                        <el-tooltip class="item" effect="dark" content="删除模块" placement="top">
                            <i class="el-icon-delete"></i>
                        </el-tooltip>
                    </div>
                </li>
                <li class="feature feature-7">
                    <h3>热门人物</h3>
                    <div class="line-block">
                        <div>
                            <img src="~assets/img/temporary/column_manage/seven-recommend.png" alt="专题节目">
                        </div>
                        <div>
                            <img src="~assets/img/temporary/column_manage/seven-recommend.png" alt="专题节目">
                        </div>
                        <div>
                            <img src="~assets/img/temporary/column_manage/seven-recommend.png" alt="专题节目">
                        </div>
                        <div>
                            <img src="~assets/img/temporary/column_manage/seven-recommend.png" alt="专题节目">
                        </div>
                        <div>
                            <img src="~assets/img/temporary/column_manage/seven-recommend.png" alt="专题节目">
                        </div>
                        <div>
                            <img src="~assets/img/temporary/column_manage/seven-recommend.png" alt="专题节目">
                        </div>
                    </div>
                    <div class="operate">
                        <el-tooltip class="item" effect="dark" content="编辑名称" placement="top">
                            <i class="el-icon-edit"></i>
                        </el-tooltip>
                        <el-tooltip class="item" effect="dark" content="设置内容" placement="top">
                            <i class="el-icon-setting"></i>
                        </el-tooltip>
                        <el-tooltip class="item" effect="dark" content="添加模块" placement="top">
                            <i class="el-icon-circle-plus-outline"></i>
                        </el-tooltip>
                        <el-tooltip class="item" effect="dark" content="删除模块" placement="top">
                            <i class="el-icon-delete"></i>
                        </el-tooltip>
                    </div>
                </li>
            </ul>
            <div class="append">
                <el-tooltip class="item" effect="dark" content="添加模块" placement="top">
                    <i class="el-icon-circle-plus-outline" @click="addBlock"></i>
                </el-tooltip>
            </div>
        </div>
        <el-button type="primary" @click="prePublish">预发布</el-button>
    </div>
</template>

<script>
    export default {
        name: 'TodayRecommended',
        data() {
            return {};
        },
        mounted() {
            this.init();
        },
        methods: {
            init() {
            },
            toAppendProgramme() {
                this.$router.push({name: 'AppendProgramme'});
            },
            toSingleAppendSubject() {
                this.$router.push({name: 'SingleAppendSubject'});
            },
            toAdGroup() {
                this.$router.push({name: 'AdGroup'});
            },
            // 添加模块，设置模块内的专题
            addBlock() {
                this.$router.push({name: 'BlockAppendSubject'});
            },
            prePublish() {

            }
        }
    };
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="less" scoped>
    #setting {
        margin: 50px 0px;
        padding: 30px 0px;
        background-image: linear-gradient(0deg, #283974 3%, #022c68 35%, #011530 100%);
        width: 100%;
    }

    /*第一行主推荐*/
    #live {
        display: flex;
        width: 100%;
        .record {
            flex-grow: 1;
            width: 191px;
            background: gray;
        }
        .live-channel, .ad-group {
            margin-left: 20px;
            flex-grow: 12;
            width: 734px;
            cursor: pointer;
            img {
                width: 100%;
            }
        }
    }

    /*一行三个推荐位,一行两个推荐位*/
    #recommend-three, #recommend-two {
        margin-top: 20px;
        display: flex;
        li {
            margin-right: 30px;
            flex-grow: 1;
            cursor: pointer;
            &:last-child {
                margin-right: 0px;
            }
            img {
                width: 100%;
            }
        }
    }

    /*专题列表*/
    #feature-module {
        /*专题通用样式*/
        .feature {
            margin-top: 30px;
            position: relative;
            &:hover {
                .operate {
                    display: block;
                }
            }
            h3 {
                font-size: 64px;
                color: #ffffff;
                text-align: left;
            }
            .line-block {
                margin-top: 30px;
                display: flex;
                div {
                    margin-right: 30px;
                    flex-grow: 1;
                    cursor: pointer;
                    &:last-child {
                        margin-right: 0px;
                    }
                    img {
                        width: 100%;
                    }
                }
            }
            .operate {
                display: none;
                position: absolute;
                right: 0px;
                top: 18px;
                i {
                    margin-right: 20px;
                    font-size: 30px;
                    color: white;
                    cursor: pointer;
                }
            }
        }
    }

    .append {
        margin-top: 40px;
        padding-left: 40px;
        text-align: left;
        i {
            font-size: 80px;
            color: white;
            cursor: pointer;
        }
    }

    .el-button {
        margin-bottom: 50px;
    }

</style>
