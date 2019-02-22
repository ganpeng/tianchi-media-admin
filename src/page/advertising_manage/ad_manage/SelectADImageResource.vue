<!--选择广告资源图片组件-->
<template>
    <div id="select-ad-video">
        <div class="item-container">
            <label class="item-name">广告主</label>
            <el-select
                v-model="adOwner"
                @change="getADResource"
                clearable
                placeholder="请选择广告主">
                <el-option
                    v-for="item in ownerOptions"
                    :key="item.value"
                    :label="item.name"
                    :value="item.value">
                </el-option>
            </el-select>
        </div>
        <el-checkbox-group v-model="selectedResourceIdList">
            <el-checkbox
                @change="checkImage(item,$event)"
                :label="item.value"
                v-for="(item,index) in imageList"
                :key="index">
                <div class="video-box"
                     :style="{'background-image': 'url(' + item.url + ')'}">
                    <div class="ad-desc">
                        <div>{{item.name}}</div>
                        <div>{{item.duration}}s&nbsp;&nbsp;&nbsp;&nbsp;{{item.size}}</div>
                    </div>
                </div>
            </el-checkbox>
        </el-checkbox-group>
    </div>
</template>

<script>

    export default {
        name: 'SelectADImageResource',
        data() {
            return {
                selectedResourceIdList: [],
                selectedResourceList: [],
                adOwner: '',
                ownerOptions: [
                    {name: '一重', value: '1'},
                    {name: '二重', value: '2'},
                    {name: '大起大重', value: '3'}
                ],
                imageList: [],
                imageListOne: [
                    {
                        name: '一重2019年开机广告',
                        owner: '一重',
                        value: '1',
                        duration: '20',
                        size: '20M',
                        url: 'http://0.0.0.0:8081/group1/M00/01/E7/CgEBUVxlGZ-AFn6kAACzb8qKBxU201.jpg'
                    },
                    {
                        name: '二重2019年开机广告',
                        owner: '二重',
                        value: '2',
                        duration: '30',
                        size: '30M',
                        url: 'http://0.0.0.0:8081/group3/M00/01/E7/CgEBU1xlGdqASZpRAAC4C-0n_nE287.jpg'
                    },
                    {
                        name: '大起大重2019年开机广告',
                        owner: '大起大重',
                        value: '3',
                        duration: '40',
                        size: '40M',
                        url: 'http://0.0.0.0:8081/group1/M00/01/E7/CgEBUVxlGkKAeI03AACsmdHAeqk833.jpg'
                    }
                ],
                imageListTwo: [
                    {
                        name: '一重2019年开机广告1111',
                        owner: '一重',
                        value: '4',
                        duration: '20',
                        size: '20M',
                        url: 'http://0.0.0.0:8081/group1/M00/01/E7/CgEBUVxlGZ-AFn6kAACzb8qKBxU201.jpg'
                    },
                    {
                        name: '二重2019年开机广告2222',
                        owner: '二重',
                        value: '5',
                        duration: '30',
                        size: '30M',
                        url: 'http://0.0.0.0:8081/group3/M00/01/E7/CgEBU1xlGdqASZpRAAC4C-0n_nE287.jpg'
                    },
                    {
                        name: '大起大重2019年开机广告333',
                        owner: '大起大重',
                        value: '6',
                        duration: '40',
                        size: '40M',
                        url: 'http://0.0.0.0:8081/group1/M00/01/E7/CgEBUVxlGkKAeI03AACsmdHAeqk833.jpg'
                    }
                ]
            };
        },
        mounted() {
            this.init();
        },
        methods: {
            init() {
                // this.$service.getOwners.then(response => {
                //     if (response && response.code === 0) {
                //         this.ownerOptions = response.data.list;
                //     }
                // });
                this.imageList = this.imageListOne;
            },
            getADResource() {
                if (this.imageList === this.imageListTwo) {
                    this.imageList = this.imageListOne;
                } else {
                    this.imageList = this.imageListTwo;
                }
            },
            checkImage(image, isAdd) {
                // 设置选中的图片资源list
                if (isAdd) {
                    this.selectedResourceList.push(image);
                } else {
                    for (let i = 0; i < this.selectedResourceList.length; i++) {
                        if (this.selectedResourceList[i].value === image.value) {
                            this.selectedResourceList.splice(i, 1);
                        }
                    }
                }
            },
            getImageInfo() {
                if (this.selectedResourceIdList.length === 0) {
                    this.$message.warning('请选择相应的图片资源');
                    return false;
                } else {
                    return this.selectedResourceList;
                }
            }
        }
    }
    ;
</script>

<style lang="scss" scoped>

    #select-ad-video {
        text-align: left;
    }

    .item-container {
        margin-left: 40px;
        margin-top: 30px;
        text-align: left;
        .item-name {
            margin-right: 20px;
            font-size: 16px;
            color: #A8ABB3;
        }
    }

    .el-checkbox-group {
        padding-bottom: 50px;
        margin-left: 40px;
        overflow: hidden;
        .el-checkbox {
            float: left;
            margin-right: 40px;
            margin-top: 30px;
        }
        .video-box {
            height: 100px;
            width: 170px;
            border: 1px solid #3E495E;
            border-radius: 8px;
            background-size: cover;
            background-repeat: no-repeat;
            background-position: center;
            background: #2A3040;
            cursor: pointer;
            overflow: visible;
            &:hover {
                border: 1px solid #1989FA;
                i {
                    visibility: visible;
                }
            }
            .ad-desc {
                position: relative;
                top: 105px;
                div {
                    height: 20px;
                    line-height: 20px;
                    text-align: center;
                    font-size: 12px;
                    color: #A8ABB3;
                }
            }
        }
    }

</style>

<style lang="scss">

    #select-ad-video {
        .el-checkbox__input {
            position: absolute;
            top: 22px;
            left: 10px;
        }
    }

</style>
