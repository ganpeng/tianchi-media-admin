<!--生成节目单XML文件组件-供产品使用-->
<template>
    <div class="container">
        <el-form :model="channelProgrammeForm" ref="channelProgrammeForm" label-width="120px">
            <el-form-item label="创建者名称">
                <el-input v-model="createName" placeholder="请填写创建者名称"></el-input>
            </el-form-item>
            <el-form-item label="开始时间">
                <el-input v-model="startTime" readonly></el-input>
            </el-form-item>
            <el-form-item label="截止时间">
                <el-input v-model="finalTime" placeholder="请填写节目单截止时间，例如'20180729000000'"></el-input>
            </el-form-item>
            <!--频道列表-->
            <el-form-item>
                <el-button type="primary" plain>频道名称列表</el-button>
            </el-form-item>
            <el-form-item
                v-for="(channel, index) in channelProgrammeForm.channelList"
                :label="'频道' + (index + 1) + '名称：'"
                :key="'channel' + index"
                :prop="'channelList.' + index + '.name'"
                :rules="{
                  required: true, message: '频道名称不能为空', trigger: 'blur'
                }">
                <el-input v-model="channel.name" placeholder="请填写频道名称"></el-input>
                <el-button @click.prevent="removeChannel(channel)">删除</el-button>
            </el-form-item>
            <el-form-item>
                <el-button @click="addChannel">新增频道</el-button>
            </el-form-item>
            <!--节目视频信息列表-->
            <el-form-item>
                <el-button type="primary" plain class="video-sign">节目视频信息列表</el-button>
            </el-form-item>
            <el-form-item
                v-for="(video, index) in channelProgrammeForm.videoList"
                :label="'节目视频' + (index + 1 ) + '信息'"
                :key="'video' + index"
                :prop="'videoList.' + index"
                :rules="{
                  required: true, validator: validateVideoInfo, trigger: 'blur'
                }">
                <el-input v-model="video.name" placeholder="请填写视频的名称"></el-input>
                <el-input v-model="video.uri" placeholder="请填写视频的视频地址"></el-input>
                <el-input v-model="video.duration" type="number" placeholder="请填写视频的持续时间"></el-input>
                <el-button @click.prevent="removeVideo(video)">删除</el-button>
            </el-form-item>
            <el-form-item>
                <el-button @click="addVideo">新增节目视频</el-button>
            </el-form-item>
            <el-form-item>
                <el-button @click="generateProgrammeXml" type="primary" class="generate">生成频道节目单</el-button>
            </el-form-item>
        </el-form>
    </div>
</template>

<script>

    const X2JS = require('../../assets/js/xml2json.min'); // eslint-disable-line
    const x2js = new X2JS();
    export default {
        name: 'GenerateProgrammeXml',
        data() {
            return {
                createName: '',
                finalTime: '',
                channelProgrammeForm: {
                    channelList: [{
                        name: ''
                    }],
                    videoList: [{
                        name: '',
                        uri: '',
                        duration: ''
                    }]
                },
                startTime: '',
                insertArray: []
            };
        },
        mounted() {
            this.startTime = '' + new Date().getFullYear() + (new Date().getMonth().toString().length === 1 ? '0' : '') + (new Date().getMonth() + 1) + (new Date().getDate().toString().length === 1 ? '0' : '') + new Date().getDate() + '000000';
        },
        methods: {
            validateVideoInfo(rule, value, callback) {
                if (value.name === '' || value.uri === '' || value.duration === '') {
                    callback(new Error('请完整输入信息'));
                } else if (value.uri.indexOf('/group') !== 0) {
                    callback(new Error('请填写正确的视频地址'));
                } else if (!/^[0-9]+$/.test(value.duration)) {
                    callback(new Error('请填写正确的视频播放时间'));
                } else {
                    callback();
                }
            },
            // 删除频道
            removeChannel(item) {
                let index = this.channelProgrammeForm.channelList.indexOf(item);
                if (index !== -1) {
                    this.channelProgrammeForm.channelList.splice(index, 1);
                }
            },
            // 添加频道
            addChannel() {
                this.channelProgrammeForm.channelList.push({
                    name: ''
                });
            },
            removeVideo(item) {
                let index = this.channelProgrammeForm.videoList.indexOf(item);
                if (index !== -1) {
                    this.channelProgrammeForm.videoList.splice(index, 1);
                }
            },
            addVideo() {
                this.channelProgrammeForm.videoList.push({
                    name: '',
                    uri: '',
                    duration: ''
                });
            },
            // 生成xml节目单
            generateProgrammeXml() {
                this.$refs['channelProgrammeForm'].validate((valid) => {
                    if (valid) {
                        for (let i = 0; i < this.channelProgrammeForm.channelList.length; i++) {
                            // let randomArray = this.randomArray(this.channelProgrammeForm.videoList, i % this.channelProgrammeForm.videoList.length);
                            this.previewChannelPage(this.channelProgrammeForm.channelList[i].name, this.channelProgrammeForm.videoList);
                        }
                    } else {
                        return false;
                    }
                });
            },
            randomArray(list, index) {
                console.log('从-----------------------' + index);
                let newArray = [];
                for (let i = index; i < list.length; i++) {
                    newArray.push(list[i]);
                }
                for (let k = 0; k < index; k++) {
                    newArray.push(list[k]);
                }
                console.log(newArray);
                return newArray;
            },
            generateJSON(randomVideoArray) {
                let eventList = [];
                let time = this.startTime;
                let pushEvent = true;
                while (pushEvent) {
                    let len = eventList.length;
                    for (let i = len; i < randomVideoArray.length + len; i++) {
                        eventList[i] = {
                            _begintime: time,
                            _duration: randomVideoArray[i - len].duration,
                            EventText: {
                                _language: 'chi',
                                Name: randomVideoArray[i - len].name,
                                ShortDescription: null,
                                playUri: randomVideoArray[i - len].uri
                            }
                        };
                        // 设置下一个节目的开始时间
                        time = this.setNextProgrammeBeginTime(time, randomVideoArray[i - len].duration);
                        let array = [];
                        array = time.split('');
                        if (parseInt(time.charAt(5)) === 9) {
                            array[5] = '0';
                            array[4] = '1';
                        } else {
                            array[5] = parseInt(time.charAt(5)) + 1;
                        }
                        time = array.toString().replace(/,/g, '');
                        /** 设置节目视频循环，直到时间到达第八天超出，不在设置 */
                        console.log('当前时间：' + time);
                        if (parseInt(time) > parseInt(this.finalTime)) {
                            pushEvent = false;
                            break;
                        }
                    }
                }
                /** 设置'结束'的 event */
                for (let i = 0; i < eventList.length; i++) {
                    if (!eventList[i + 1] || !this.isSameDay(eventList[i]._begintime, eventList[i + 1]._begintime)) {
                        this.insertArray.push(i);
                    }
                }
                this.setOverEvent(eventList);
                /** 设置 eventList 的 _eventid 和 _eventtype */
                for (let i = 0; i < eventList.length; i++) {
                    eventList[i]._eventid = i + 1;
                    if (i === 0) {
                        eventList[0]._eventtype = '00';
                    } else if (!this.isSameDay(eventList[i]._begintime, eventList[i - 1]._begintime)) {
                        eventList[i]._eventtype = '00';
                    } else if (!eventList[i + 1] || !this.isSameDay(eventList[i]._begintime, eventList[i + 1]._begintime)) {
                        eventList[i]._eventtype = '22';
                    } else {
                        eventList[i]._eventtype = '11';
                    }
                }
                // 设置最后一个结束event的 _duration 为 000100
                eventList[eventList.length - 1]._duration = '000100';
                return eventList;
            },
            setOverEvent(eventList) {
                for (let i = 0; i < this.insertArray.length; i++) {
                    let overEvent = {
                        _begintime: this.getCurrentDayLastMinutes(eventList[this.insertArray[i]]._begintime),
                        _duration: eventList[this.insertArray[i]]._duration,
                        EventText: {
                            _language: 'chi',
                            Name: '结束',
                            ShortDescription: null
                        }
                    };
                    // 设置前后event的_duration
                    let {currentDuration, overDuration} = this.getOverDuration(eventList, this.insertArray[i] + i);
                    eventList[this.insertArray[i] + i]._duration = currentDuration;
                    overEvent._duration = overDuration;
                    eventList.splice(this.insertArray[i] + 1 + i, 0, overEvent);
                }
            },
            getOverDuration(eventList, index) {
                // 两个换算成秒数，算差秒，换算成建个间隔时间作为index的duration
                let currentSeconds = this.formatStringToDate(parseInt(eventList[index]._begintime)).getTime();
                let lastSeconds = this.formatStringToDate(this.getCurrentDayLastMinutes(eventList[index]._begintime)).getTime();
                let currentDurationSeconds = lastSeconds - currentSeconds;
                let currentDuration = this.formatMillSecondsToDuration(currentDurationSeconds);
                // 计算'结束'的duration
                let overDuration = '';
                if (eventList[index + 1]) {
                    let nextSeconds = this.formatStringToDate(parseInt(eventList[index + 1]._begintime)).getTime();
                    overDuration = this.formatMillSecondsToDuration(nextSeconds - lastSeconds);
                } else {
                    overDuration = '000100';
                }
                return {currentDuration, overDuration};
            },
            formatMillSecondsToDuration(millSeconds) {
                let hour = Math.floor(millSeconds / (60 * 60 * 1000));
                millSeconds = millSeconds - hour * 60 * 60 * 1000;
                let minutes = Math.floor(millSeconds / (60 * 1000));
                millSeconds = millSeconds - minutes * 60 * 1000;
                let seconds = Math.floor(millSeconds / 1000);
                let duration = '' + (hour.toString().length === 1 ? '0' : '') + hour + (minutes.toString().length === 1 ? '0' : '') + minutes + (seconds.toString().length === 1 ? '0' : '') + seconds;
                return duration;
            },
            getCurrentDayLastMinutes(dateString) {
                return dateString.slice(0, 8) + '235900';
            },
            isSameDay(preDateString, nextDateString) {
                if (preDateString.charAt(6) === nextDateString.charAt(6) && preDateString.charAt(7) === nextDateString.charAt(7)) {
                    return true;
                } else {
                    return false;
                }
            },
            setNextProgrammeBeginTime(preBeginTime, preDuration) {
                console.log('preBeginTime1:' + preBeginTime);
                console.log('preDuration:' + preDuration);
                // 换成秒数
                let array = [];
                array = preBeginTime.split('');
                // if (parseInt(preBeginTime.charAt(5)) === 9) {
                //     array[5] = '0';
                //     array[4] = '1';
                // } else {
                //     array[5] = parseInt(preBeginTime.charAt(5)) + 1;
                // }
                preBeginTime = array.toString().replace(/,/g, '');
                console.log('preBeginTime2:' + preBeginTime);
                let day = preBeginTime.substring(0, 4) + '-' + preBeginTime.substring(4, 6) + '-' + preBeginTime.substring(6, 8) + 'T' + preBeginTime.substring(8, 10) + ':' + preBeginTime.substring(10, 12) + ':' + preBeginTime.substring(12, 14);
                console.log('day2:' + day);
                let preDate = new Date(day);
                let preDurationSeconds = preDuration.substring(0, 2) * 60 * 60 * 1000 + preDuration.substring(2, 4) * 60 * 1000 + preDuration.substring(4, 6) * 1000;
                let nextSeconds = preDate.getTime() + preDurationSeconds;
                let nextDate = new Date(nextSeconds);
                console.log('nextDate2:' + nextDate);
                return this.formDateToString(nextDate);
            },
            formatStringToDate(stringDate) {
                stringDate = stringDate.toString();
                let array = [];
                array = stringDate.split('');
                array[5] = parseInt(stringDate.charAt(5));
                stringDate = array.toString().replace(/,/g, '');
                let day = stringDate.substring(0, 4) + '-' + stringDate.substring(4, 6) + '-' + stringDate.substring(6, 8) + 'T' + stringDate.substring(8, 10) + ':' + stringDate.substring(10, 12) + ':' + stringDate.substring(12, 14);
                let preDate = new Date(day);
                return preDate;
            },
            formDateToString(date) {
                return '' + date.getFullYear() + (date.getMonth().toString().length === 1 ? '0' : '') + date.getMonth() + (date.getDate().toString().length === 1 ? '0' : '') + date.getDate() + (date.getHours().toString().length === 1 ? '0' : '') + date.getHours() + (date.getMinutes().toString().length === 1 ? '0' : '') + date.getMinutes() + (date.getSeconds().toString().length === 1 ? '0' : '') + date.getSeconds();
            },
            previewChannelPage(ChannelName, randomVideoArray) {
                let jsonObject = {
                    BroadcastData: {
                        _code: '110000000',
                        _creationtime: this.formDateToString(new Date()), // 创建时间
                        _version: '2.0',
                        ProviderInfo: {
                            _id: 'ChinaEPG',
                            _name: this.createName
                        },
                        SchedulerData: {
                            _type: 'PROGRAM',
                            Channel: {
                                ChannelText: {
                                    _language: 'chi',
                                    ChannelName: ChannelName
                                },
                                Event: this.generateJSON(randomVideoArray)
                            }
                        }
                    }
                };
                let xml = x2js.json2xml_str(jsonObject);
                let blob = new Blob(['<?xml version="1.0" standalone="yes"?>', xml], {type: 'application/xml'});
                this.openDownloadDialog(blob, `${ChannelName}` + '节目单.xml');
                // this.openNewTab(blob);
            },
            openNewTab(url) {
                if (typeof url === 'object' && url instanceof Blob) {
                    url = URL.createObjectURL(url); // 创建blob地址
                }
                let aLink = document.createElement('a');
                aLink.href = url;
                aLink.target = '_blank';
                let event;
                if (window.MouseEvent) {
                    event = new MouseEvent('click');
                } else {
                    event = document.createEvent('MouseEvents');
                    event.initMouseEvent('click', true, false, window, 0, 0, 0, 0, 0, false, false, false, false, 0, null);
                }
                aLink.dispatchEvent(event);
            },
            openDownloadDialog(url, saveName) {
                if (typeof url === 'object' && url instanceof Blob) {
                    url = URL.createObjectURL(url); // 创建blob地址
                }
                let aLink = document.createElement('a');
                aLink.href = url;
                aLink.download = saveName || ''; // HTML5新增的属性，指定保存文件名，可以不要后缀，注意，file:///模式下不会生效
                let event;
                if (window.MouseEvent) {
                    event = new MouseEvent('click');
                } else {
                    event = document.createEvent('MouseEvents');
                    event.initMouseEvent('click', true, false, window, 0, 0, 0, 0, 0, false, false, false, false, 0, null);
                }
                aLink.dispatchEvent(event);
            }
        }
    };
</script>

<style lang="less" scoped>

    .container {
        margin-top: 50px;
    }

    .el-input {
        width: 400px;
    }

    .video-sign {
        margin-top: 30px;
    }

    .generate {
        margin-left: 400px;
        margin-top: 50px;
    }

</style>
