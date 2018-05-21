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
                <div class="record no-settable"></div>
                <div class="live-channel settable" @click="setChannel">
                    <div class="ab-center">点击设置 / 查看<label>直播频道</label></div>
                </div>
                <div class="ad-group settable" @click="toAdGroup">
                    <div class="ab-center">点击设置 / 查看<label>广告组</label></div>
                </div>
            </div>
            <ul class="recommend-three recommend-line">
                <li class="settable recommend-item">
                    <div class="ab-center">
                        <div class="recommend-operate">
                            <el-tooltip class="item" effect="dark" content="编辑" placement="top">
                                <i class="el-icon-edit" @click="editRecommend"></i>
                            </el-tooltip>
                            <el-dropdown @command="setRecommend" placement="bottom">
                            <span class="el-dropdown-link">
                                <i class="el-icon-circle-plus-outline"></i>
                            </span>
                                <el-dropdown-menu slot="dropdown">
                                    <el-dropdown-item command="PROGRAMME">设置为节目</el-dropdown-item>
                                    <el-dropdown-item command="PERSON">设置为专题</el-dropdown-item>
                                </el-dropdown-menu>
                            </el-dropdown>
                        </div>
                    </div>
                </li>
                <li class="settable recommend-item">
                    <div class="ab-center">
                        <div class="recommend-operate">
                            <el-tooltip class="item" effect="dark" content="编辑" placement="top">
                                <i class="el-icon-edit" @click="editRecommend"></i>
                            </el-tooltip>
                            <el-dropdown @command="setRecommend" placement="bottom">
                            <span class="el-dropdown-link">
                                <i class="el-icon-circle-plus-outline"></i>
                            </span>
                                <el-dropdown-menu slot="dropdown">
                                    <el-dropdown-item command="PROGRAMME">设置为节目</el-dropdown-item>
                                    <el-dropdown-item command="PERSON">设置为专题</el-dropdown-item>
                                </el-dropdown-menu>
                            </el-dropdown>
                        </div>
                    </div>
                </li>
                <li class="settable recommend-item">
                    <div class="ab-center">
                        <div class="recommend-operate">
                            <el-tooltip class="item" effect="dark" content="编辑" placement="top">
                                <i class="el-icon-edit" @click="editRecommend"></i>
                            </el-tooltip>
                            <el-dropdown @command="setRecommend" placement="bottom">
                            <span class="el-dropdown-link">
                                <i class="el-icon-circle-plus-outline"></i>
                            </span>
                                <el-dropdown-menu slot="dropdown">
                                    <el-dropdown-item command="PROGRAMME">设置为节目</el-dropdown-item>
                                    <el-dropdown-item command="PERSON">设置为专题</el-dropdown-item>
                                </el-dropdown-menu>
                            </el-dropdown>
                        </div>
                    </div>
                </li>
            </ul>
            <ul class="recommend-two recommend-line">
                <li class="settable recommend-item">
                    <div class="ab-center">
                        <div class="recommend-operate">
                            <el-tooltip class="item" effect="dark" content="编辑" placement="top">
                                <i class="el-icon-edit" @click="editRecommend"></i>
                            </el-tooltip>
                            <el-dropdown @command="setRecommend" placement="bottom">
                            <span class="el-dropdown-link">
                                <i class="el-icon-circle-plus-outline"></i>
                            </span>
                                <el-dropdown-menu slot="dropdown">
                                    <el-dropdown-item command="PROGRAMME">设置为节目</el-dropdown-item>
                                    <el-dropdown-item command="PERSON">设置为专题</el-dropdown-item>
                                </el-dropdown-menu>
                            </el-dropdown>
                        </div>
                    </div>
                </li>
                <li class="settable recommend-item">
                    <div class="ab-center">
                        <div class="recommend-operate">
                            <el-tooltip class="item" effect="dark" content="编辑" placement="top">
                                <i class="el-icon-edit" @click="editRecommend"></i>
                            </el-tooltip>
                            <el-dropdown @command="setRecommend" placement="bottom">
                            <span class="el-dropdown-link">
                                <i class="el-icon-circle-plus-outline"></i>
                            </span>
                                <el-dropdown-menu slot="dropdown">
                                    <el-dropdown-item command="PROGRAMME">设置为节目</el-dropdown-item>
                                    <el-dropdown-item command="PERSON">设置为专题</el-dropdown-item>
                                </el-dropdown-menu>
                            </el-dropdown>
                        </div>
                    </div>
                </li>
            </ul>
            <ul id="feature-block">
                <li class="feature settable">
                    <h3>最新上线大片</h3>
                    <ul class="block-line block-2">
                        <li></li>
                        <li></li>
                    </ul>
                    <ul class="block-line block-3">
                        <li></li>
                        <li></li>
                        <li></li>
                    </ul>
                    <div class="block-operate">
                        <el-tooltip class="item" effect="dark" content="编辑" placement="top">
                            <i class="el-icon-edit" @click="editBlock('PROGRAMME')"></i>
                        </el-tooltip>
                        <el-dropdown @command="addBlockSubject" placement="bottom">
                            <span class="el-dropdown-link">
                                <i class="el-icon-circle-plus-outline"></i>
                            </span>
                            <el-dropdown-menu slot="dropdown">
                                <el-dropdown-item command="PROGRAMME">添加节目专题</el-dropdown-item>
                                <el-dropdown-item command="PERSON">添加人物专题</el-dropdown-item>
                            </el-dropdown-menu>
                        </el-dropdown>
                    </div>
                </li>
                <li class="feature settable">
                    <h3>热播电视剧</h3>
                    <ul class="block-line block-6">
                        <li></li>
                        <li></li>
                        <li></li>
                        <li></li>
                        <li></li>
                        <li></li>
                    </ul>
                    <div class="block-operate">
                        <el-tooltip class="item" effect="dark" content="编辑" placement="top">
                            <i class="el-icon-edit" @click="editBlock('PROGRAMME')"></i>
                        </el-tooltip>
                        <el-dropdown @command="addBlockSubject" placement="bottom">
                            <span class="el-dropdown-link">
                                <i class="el-icon-circle-plus-outline"></i>
                            </span>
                            <el-dropdown-menu slot="dropdown">
                                <el-dropdown-item command="PROGRAMME">添加节目专题</el-dropdown-item>
                                <el-dropdown-item command="PERSON">添加人物专题</el-dropdown-item>
                            </el-dropdown-menu>
                        </el-dropdown>
                    </div>
                </li>
                <li class="feature settable">
                    <h3>热门人物</h3>
                    <ul class="block-line block-person">
                        <li></li>
                        <li></li>
                        <li></li>
                        <li></li>
                        <li></li>
                        <li></li>
                        <li></li>
                    </ul>
                    <div class="block-operate">
                        <el-tooltip class="item" effect="dark" content="编辑" placement="top">
                            <i class="el-icon-edit" @click="editBlock('PERSON')"></i>
                        </el-tooltip>
                        <el-dropdown @command="addBlockSubject" placement="bottom">
                            <span class="el-dropdown-link">
                                <i class="el-icon-circle-plus-outline"></i>
                            </span>
                            <el-dropdown-menu slot="dropdown">
                                <el-dropdown-item command="PROGRAMME">添加节目专题</el-dropdown-item>
                                <el-dropdown-item command="PERSON">添加人物专题</el-dropdown-item>
                            </el-dropdown-menu>
                        </el-dropdown>
                    </div>
                </li>
            </ul>
            <div class="append-block">
                <el-dropdown @command="addBlockSubject" placement="bottom">
                 <span class="el-dropdown-link">
                    <i class="el-icon-circle-plus-outline"></i>
                    </span>
                    <el-dropdown-menu slot="dropdown">
                        <el-dropdown-item command="PROGRAMME">添加节目模块</el-dropdown-item>
                        <el-dropdown-item command="PERSON">添加人物模块</el-dropdown-item>
                    </el-dropdown-menu>
                </el-dropdown>
                <el-tooltip class="item" effect="dark" content="模块排序" placement="top">
                    <i class="el-icon-sort" @click="sortBlock('PERSON')"></i>
                </el-tooltip>
            </div>
        </div>
        <el-button type="primary" @click="publish" class="column-publish">发 布</el-button>
        <el-dialog title="模块排序" :visible.sync="sortDialogVisible">
            <ul v-dragula="{direction:'horizontal'}" id="block-sort-list">
                <li>
                    <el-tag type="success">最新上线大片</el-tag>
                </li>
                <li>
                    <el-tag type="success">热播电视剧</el-tag>
                </li>
                <li>
                    <el-tag type="success">热门人物</el-tag>
                </li>
            </ul>
        </el-dialog>
    </div>
</template>

<script>
    export default {
        name: 'TodayRecommended',
        data() {
            return {
                naviBarId: 0,
                sortDialogVisible: false
            };
        },
        mounted() {
            this.init();
        },
        methods: {
            init() {
            },
            // 设置直播频道
            setChannel() {
                this.$router.push({name: 'SetChannel', params: {naviBarId: this.naviBarId}});
            },
            // 跳转到广告组列表页面
            toAdGroup() {
                this.$router.push({name: 'AdGroup'});
            },
            // 编辑当前推荐位
            editRecommend(val) {
                this.$router.push({name: val === 'PROGRAMME' ? 'AppendProgramme' : 'SingleAppendSubject'});
            },
            // 设置推荐位为节目或者专题
            setRecommend(val) {
                this.$router.push({name: val === 'PROGRAMME' ? 'AppendProgramme' : 'SingleAppendSubject'});
            },
            // 编辑节目模块或者人物模块内容
            editBlock(val) {
                this.$router.push({name: val === 'PROGRAMME' ? 'BlockAppendProgrammeSubject' : 'BlockAppendPersonSubject'});
            },
            // 添加模块，设置模块内的专题
            addBlockSubject(val) {
                this.$router.push({name: val === 'PROGRAMME' ? 'BlockAppendProgrammeSubject' : 'BlockAppendPersonSubject'});
            },
            // 模块排序
            sortBlock() {
                this.sortDialogVisible = true;
            },
            // 点击发布,设置直播频道
            publish() {
                let liveChannelList = this.$store.state.todayRecommend.liveChannelList;
                if (liveChannelList.length !== 0) {
                    this.$service.setLiveChannelLayout(liveChannelList).then(response => {
                        if (response) {
                            this.$message({
                                message: '直播频道设置成功',
                                type: 'success'
                            });
                        }
                    });
                }
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

    // 第一行主推荐
    #live {
        display: flex;
        position: relative;
        width: 100%;
        &:after {
            display: block;
            content: "";
            visibility: hidden;
            clear: both;
        }
        .record {
            float: left;
            width: 11%;
            padding-top: 24%;
            flex-grow: 1;
        }
        .live-channel, .ad-group {
            position: relative;
            float: left;
            width: 43%;
            padding-top: 24%;
            margin-left: 20px;
            flex-grow: 12;
            font-size: 30px;
            div {
                display: flex;
                flex-direction: column;
                justify-content: center;
                label {
                    padding-top: 30px;
                    font-size: 34px;
                    font-weight: bold;
                }
            }
        }
    }

    // 推荐位样式设置
    .recommend-line {
        display: flex;
        margin-top: 20px;
        &.recommend-three {
            li {
                width: 31%;
                padding-top: 13%;
            }
        }

        &.recommend-two {
            li {
                width: 48%;
                padding-top: 13%;
            }
        }
    }

    .recommend-item {
        margin-right: 30px;
        flex-grow: 1;
        &:last-child {
            margin-right: 0px;
        }
        .recommend-operate {
            position: absolute;
            right: 20px;
            top: 10px;
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
    }

    // 模块列表
    #feature-block {
        // 模块通用样式
        .feature {
            position: relative;
            margin-top: 30px;
            h3 {
                font-size: 50px;
                color: #ffffff;
                text-align: left;
            }
            ul.block-line {
                display: flex;
                margin-top: 30px;
                li {
                    margin-right: 30px;
                    flex-grow: 1;
                    background: #8D949C;
                    &:last-child {
                        margin-right: 0px;
                    }
                    img {
                        width: 100%;
                    }
                }
            }
        }
        // 每行的样式
        ul.block-2 {
            li {
                width: 48%;
                padding-top: 13%;
            }
        }
        ul.block-3 {
            li {
                width: 31%;
                padding-top: 13%;
            }
        }
        ul.block-6 {
            li {
                width: 14%;
                padding-top: 20%;
            }
        }
        ul.block-person {
            li {
                width: 12%;
                padding-top: 12%;
                border-radius: 50%;
            }
        }
    }

    .block-operate {
        position: absolute;
        right: 20px;
        top: 18px;
        .el-tooltip {
            margin-right: 30px;
        }
        i {
            margin-right: 20px;
            font-size: 36px;
            color: white;
            cursor: pointer;
        }
    }

    .append-block {
        margin-top: 40px;
        padding-left: 40px;
        text-align: left;
        .el-dropdown {
            margin-right: 40px;
        }
        i {
            font-size: 80px;
            color: white;
            cursor: pointer;
        }
    }

    .column-publish {
        margin-bottom: 50px;
        width: 180px;
        height: 60px;
        font-size: 24px;
    }

    // 模块排序列表
    #block-sort-list {
        display: flex;
        li {
            text-align: left;
            margin-right: 20px;
            cursor: grab;
        }
    }

</style>
