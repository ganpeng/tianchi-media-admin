<!--视频列表组件-->
<template>
    <div class="preview-channel-programme-list-container">
        <h2 class="content-title">{{channelName}}</h2>
        <div class="seperator-line"></div>
        <div class="content">
            <el-row>
                <el-col class="float-left" :span="11">
                    <el-collapse id="prevContainer" @change="prevHandleChange" accordion>
                        <el-collapse-item v-for="(item, key, index) in prevObj" :key="index" :name="index">
                            <template slot="title">
                                <span class="title">{{key}}</span>
                            </template>
                            <ul class="item-list">
                                <li v-for="(ele, index) in item" :key="index" class="item-li">
                                    <div class="wrapper">
                                        <span class="time-name">{{ele.startTime}} - {{ele.endTime}} {{ele.name}}</span>
                                        <span class="url">{{ele.playUri}}</span>
                                    </div>
                                </li>
                            </ul>
                        </el-collapse-item>
                    </el-collapse>
                </el-col>
                <el-col class="float-right" :span="11">
                    <el-collapse id="afterContainer" @change="afterHandleChange" accordion>
                        <el-collapse-item v-for="(item, key, index) in afterObj" :key="index" :name="index">
                            <template slot="title">
                                <span class="title">{{key}}</span>
                            </template>
                            <ul class="item-list">
                                <li v-for="(ele, index) in item" :key="index" class="item-li">
                                    <div class="wrapper">
                                        <span class="time-name">{{ele.startTime}} - {{ele.endTime}} {{ele.name}}</span>
                                        <span class="url">{{ele.playUri}}</span>
                                    </div>
                                </li>
                            </ul>
                        </el-collapse-item>
                    </el-collapse>
                </el-col>
            </el-row>
        </div>
        <div class="fixed-btn-container">
            <el-button class="btn-style-three" @click="goBack" plain>返回列表页</el-button>
        </div>
    </div>
</template>
<script>
    import {mapActions} from 'vuex';
    export default {
        name: 'PreviewProgrammeList',
        data() {
            return {
                prevList: [],
                afterList: [],
                prevObj: {},
                afterObj: {}
            };
        },
        created() {
            let {id} = this.$route.params;
            this.getChannelPageById(id)
                .then((res) => {
                    if (res && res.code === 0) {
                        let prevList = [];
                        let afterList = [];
                        let today = new Date().getFullYear() + '-' + (new Date().getMonth() + 1) + '-' + new Date().getDate() + ' 00:00:00';
                        let timeStamp = new Date(today).getTime();
                        res.data.forEach((item) => {
                            if (item.startTime < timeStamp) {
                                prevList.push(item);
                            } else {
                                afterList.push(item);
                            }
                        });
                        let prevObj = this.serializeDataByDate(prevList);
                        let afterObj = this.serializeDataByDate(afterList);
                        this.prevList = prevList;
                        this.afterList = afterList;
                        this.prevObj = prevObj;
                        this.afterObj = afterObj;
                    }
                });
        },
        computed: {
            channelName() {
                let obj = this.prevList[0] || this.afterList[0];
                return obj ? obj.channelName : '';
            }
        },
        methods: {
            ...mapActions({
                getChannelPageById: 'channel/getChannelPageById'
            }),
            timeStampFormat(seconds) {
                let date = new Date(seconds);
                let year = date.getFullYear();
                let month = date.getMonth() + 1;
                let day = date.getDate();
                let hour = date.getHours();
                let minute = date.getMinutes();
                let second = date.getSeconds();
                return `${year}-${month}-${day} ${hour}:${minute}:${second}`;
            },
            goBack() {
                this.$router.push({name: 'LiveChannelList'});
            },
            prevHandleChange(activeName) {
                let prevArrowList = document.querySelectorAll('#prevContainer .el-collapse-item__arrow.el-icon-arrow-right');
                let prevTitleList = document.querySelectorAll('#prevContainer .title');
                for (let i = 0; i < prevArrowList.length; i++) {
                    if (activeName === i) {
                        prevArrowList[i].style.color = '#1989FA';
                        prevTitleList[i].style.color = '#1989FA';
                    } else {
                        prevArrowList[i].style.color = '#A8ABB3';
                        prevTitleList[i].style.color = '#A8ABB3';
                    }
                }
            },
            afterHandleChange(activeName) {
                let afterArrowList = document.querySelectorAll('#afterContainer .el-collapse-item__arrow.el-icon-arrow-right');
                let afterTitleList = document.querySelectorAll('#afterContainer .title');
                for (let i = 0; i < afterArrowList.length; i++) {
                    if (activeName === i) {
                        afterArrowList[i].style.color = '#1989FA';
                        afterTitleList[i].style.color = '#1989FA';
                    } else {
                        afterArrowList[i].style.color = '#A8ABB3';
                        afterTitleList[i].style.color = '#A8ABB3';
                    }
                }
            },
            serializeDataByDate(list) {
                return list.map((item) => {
                    item.startTime = this.timeStampFormat(item.startTime);
                    item.endTime = this.timeStampFormat(item.endTime);
                    return item;
                }).reduce((res, curr) => {
                    let timeKey = curr.startTime.split(' ')[0];
                    if (res[timeKey]) {
                        res[timeKey].push(curr);
                    } else {
                        res[timeKey] = [];
                        res[timeKey].push(curr);
                    }
                    return res;
                }, {});
            }
        }
    };
</script>
<style scoped lang="less">
.content {
    margin-top: 20px;
}
.title, .time-name, .url {
    display: block;
    text-align: left;
}
.title {
    font-size: 18px;
    color: #A8ABB3;
    padding-left: 20px;
}
.time-name {
    font-size: 14px;
    line-height: 30px;
    color: #606060;
}
.url {
    font-size: 12px;
    line-height: 20px;
    color: #8C8C8C;
}
</style>
<style lang="scss">
#prevContainer,
#afterContainer {
    border-top: none;
    border-bottom: none;
    border-radius: 8px;
    overflow: hidden;
    .item-list {
        background: #2A3040;
        .item-li {
            padding: 0 20px 0 20px;
            .wrapper {
                border-bottom: 1px solid #3E495E;
            }
            &:last-child {
                .wrapper {
                    border-bottom: none;
                }
            }
        }
    }
    .el-collapse-item {
        border-bottom: 1px solid #3E495E;
        &:last-child {
            border-bottom: none;
        }
        .el-collapse-item__header {
            background: #2A3040;
            border: none;
        }
    }
}

.el-collapse-item__content {
    padding-bottom: 0;
}
.el-collapse-item__wrap {
    border-bottom: none;
}
</style>
