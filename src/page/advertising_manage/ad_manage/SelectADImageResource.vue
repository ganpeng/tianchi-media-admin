<!--选择广告资源图片组件-->
<template>
    <div id="select-ad-video">
        <div class="item-container">
            <label class="item-name">广告主</label>
            <el-select
                v-model="adOwnerId"
                @change="getADResource"
                clearable
                placeholder="请选择广告主">
                <el-option
                    v-for="item in ownerOptions"
                    :key="item.id"
                    :label="item.name"
                    :value="item.id">
                </el-option>
            </el-select>
        </div>
        <el-checkbox-group v-model="selectedResourceIdList">
            <el-checkbox
                @change="checkImage(item,$event)"
                :label="item.id"
                v-for="(item,index) in imageList"
                :key="index">
                <div class="video-box"
                     :style="{'background-image': 'url(' + item.storageUri + ')'}">
                    <div class="ad-desc">
                        <div>{{item.name}}</div>
                        <div>{{item.duration}}s&nbsp;&nbsp;&nbsp;&nbsp;{{item.size | convertFileSize}}</div>
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
                adOwnerId: '',
                ownerOptions: [],
                imageList: []
            };
        },
        mounted() {
            this.init();
        },
        methods: {
            init() {
                this.$service.getAdvertisingOwnerList({pageSize: 1000, pageNum: 0}).then(response => {
                    if (response && response.code === 0) {
                        this.ownerOptions = response.data.list;
                    }
                });
            },
            getADResource() {
                this.$service.getADOwnerResourceList({
                    advertiserId: this.adOwnerId,
                    mediaType: 'IMAGE',
                    pageSize: 1000,
                    pageNum: 1
                }).then(response => {
                    if (response && response.code === 0) {
                        this.imageList = response.data.list;
                    }
                });
            },
            checkImage(image, isAdd) {
                // 设置选中的图片资源list
                if (isAdd) {
                    this.selectedResourceList.push(image);
                } else {
                    for (let i = 0; i < this.selectedResourceList.length; i++) {
                        if (this.selectedResourceList[i].id === image.id) {
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
            & + .el-checkbox {
                margin-left: 0px;
            }
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
