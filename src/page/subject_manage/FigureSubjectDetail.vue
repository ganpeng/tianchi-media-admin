<!--人物专题详情组件-->
<template>
    <div>
        <div class="content-title">专题详情</div>
        <div class="seperator-line"></div>
        <!--专题题目-->
        <div class="detail-title-block">
            <div class="subject-status shelve" v-if="subjectInfo.visible">已上架</div>
            <div class="subject-status un-shelve" v-else>已下架</div>
            <div class="title">
                <label>{{subjectInfo.name}}</label>
                <span>人物专题</span>
            </div>
            <div class="subject-time">
                <div>创建于{{subjectInfo.createdAt | formatDate('yyyy.MM.DD')}}</div>
                <div>更新于{{subjectInfo.updatedAt | formatDate('yyyy.MM.DD')}}</div>
            </div>
        </div>
        <!--相关信息-->
        <div class="about-subject">
            <img :src="uniquePosterImage ? uniquePosterImage.uri : '' | imageUrl"
                 :alt="uniquePosterImage ? uniquePosterImage.name : ''">
            <div>
                <ul>
                    <li v-for="(item, index) in subjectInfo.programmeCategoryList"
                        :key="index">
                        {{item.name}}
                    </li>
                </ul>
                <p>节目数量</p>
                <span>{{subjectInfo.subjectItemList.length}}个</span>
            </div>
        </div>
        <!--其它海报-->
        <div class="other-poster">
            <div class="content-sub-title">其它海报</div>
            <thumbnail
                :imageList="subjectInfo.posterImageList"
                :removeSign="false">
            </thumbnail>
        </div>
        <!--专题内容-->
        <div class="subject-content">
            <div class="content-sub-title">专题内容</div>
            <programme-operate-table
                v-if="subjectInfo.subjectItemList && subjectInfo.subjectItemList.length !== 0"
                model="DETAIL"
                :programmeList="subjectInfo.subjectItemList">
            </programme-operate-table>
        </div>
        <!--操作-->
        <div class="fixed-btn-container">
            <el-button class="btn-style-two" type="primary" @click="editSubject">编辑</el-button>
            <el-button class="btn-style-three" @click="toSubjectList" plain>返回列表</el-button>
        </div>
    </div>
</template>

<script>
    import Thumbnail from 'sysComponents/custom_components/custom/Thumbnail';
    import ProgrammeOperateTable from './components/ProgrammeOperateTable';

    export default {
        name: 'FigureSubjectDetail',
        components: {
            Thumbnail,
            ProgrammeOperateTable
        },
        data() {
            return {
                subjectInfo: {
                    subjectItemList: []
                },
                uniquePosterImage: {}
            };
        },
        mounted() {
            this.init();
        },
        methods: {
            init() {
                this.$util.toggleFixedBtnContainer();
                this.$service.getSubjectDetail(this.$route.params.id).then(response => {
                    if (response && response.code === 0) {
                        this.subjectInfo = response.data;
                        // 设置人物专题唯一的260*600的专题E封面
                        for (let i = 0; i < this.subjectInfo.posterImageList.length; i++) {
                            if (this.subjectInfo.posterImageList[i].width.toString() === '260' && this.subjectInfo.posterImageList[i].height.toString() === '600') {
                                this.uniquePosterImage = this.subjectInfo.posterImageList[i];
                                this.subjectInfo.posterImageList.splice(i, 1);
                            }
                        }
                    }
                });
            },
            editSubject() {
                this.$router.push({
                    name: 'EditFigureSubject', params: this.$route.params
                });
            },
            toSubjectList() {
                this.$router.push({name: 'SubjectList'});
            }
        }
    };
</script>

<style lang="scss" scoped>

    // 专题题目
    .detail-title-block {
        height: 50px;
        line-height: 50px;
        overflow: hidden;
        .subject-status {
            float: left;
            margin-left: 30px;
            margin-right: 40px;
            margin-top: 9px;
            height: 30px;
            width: 80px;
            line-height: 30px;
            border-radius: 4px;
            font-size: 20px;
            text-align: center;
            &.un-shelve {
                color: #6F7480;
                background: #2A3040;
            }
            &.shelve {
                color: #fff;
                background: #3AC26F;
            }
        }

        .title {
            float: left;
            label {
                font-size: 20px;
                color: #FFFFFF;
            }
            span {
                display: inline-block;
                margin-top: 9px;
                margin-left: 20px;
                height: 30px;
                width: 100px;
                line-height: 30px;
                background: #D27B25;
                border-radius: 4px;
                font-size: 20px;
                color: #FFFFFF;
            }
        }
        .subject-time {
            float: right;
            margin-left: 350px;
            margin-right: 20px;
            div {
                height: 17px;
                line-height: 17px;
                color: #6F7480;
                &:first-child {
                    margin-top: 6px;
                    margin-bottom: 3px;
                }
            }
        }
    }

    // 相关信息
    .about-subject {
        position: relative;
        padding-bottom: 12px;
        border-bottom: 1px solid #252D3F;
        text-align: left;
        overflow: hidden;
        img {
            position: absolute;
            top: 0px;
            left: 20px;
            height: 300px;
            width: 100px;
            border: 1px solid #3E495E;
            border-radius: 8px;
            box-shadow: 2px 2px 5px 0 rgba(0,0,0,0.50);
        }
        div {
            margin-left: 155px;
            height: 310px;
            border-top: 1px solid #252D3F;
            ul {
                margin-top: 10px;
                height: 40px;
                li {
                    float: left;
                    margin-right: 10px;
                    padding: 0px 5px;
                    height: 20px;
                    line-height: 20px;
                    background: #637497;
                    border-radius: 4px;
                    font-size: 10px;
                    color: #FFFFFF;
                }
            }
            p {
                margin-bottom: 9px;
                font-size: 18px;
                color: #A8ABB3;
            }
            span {
                font-size: 14px;
                color: #A8ABB3;
            }
        }
    }

    .content-sub-title {
        padding-left: 20px;
    }

    // 其它海报
    .other-poster {
        padding-bottom: 12px;
        border-bottom: 1px solid #252D3F;
        .thumbnail {
            margin-left: 20px;
        }
    }

    // 专题内容
    .subject-content {
        margin-bottom: 160px;
    }

    // 操作
    .operate-block {
        position: fixed;
        bottom: 10px;
        left: 0px;
        right: 0px;
        margin: auto;
        width: 500px;
        height: 80px;
        line-height: 90px;
        background: #293550;
        box-shadow: 0 2px 10px 0 rgba(0, 0, 0, 0.20);
        border-radius: 8px;
        z-index: 600;
        .el-button:last-child {
            margin-left: 40px;
        }
    }

</style>
