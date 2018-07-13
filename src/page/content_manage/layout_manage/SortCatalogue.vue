<!--内容管理-栏目管理-为频道或者类型等目录排序-->
<template>
    <div>
        <ul class="recommend-type">
            <li class="operator" @click="setPickCatalogueVisible(true)">
                <div class="ab-center">设置<br/>分类</div>
            </li>
            <li v-for="(item,index) in pickedCatalogueList" :key="index">
                <div class="ab-center">
                    <img v-if="item.coverImage" :src="item.coverImage ? item.coverImage.uri : '' | imageUrl"
                         :alt="item.coverImage ? item.coverImage.name : ''"/>
                </div>
            </li>
        </ul>
        <el-dialog :title="setCatalogueTitle" :visible.sync="pickCatalogueVisible">
            <template v-if="pickCatalogueVisible">
                <ul class="pick-list" id="pick-list">
                    <li v-for="(item, index) in pickedCatalogueSettingList" :key="index"
                        :data-id="item.id"
                        :class="item.layoutItemType === 'ALL' ? 'all' : ''">
                        <div class="image-box">
                            <div class="ab-center">
                                <img v-if="item.coverImage" :src="item.coverImage ? item.coverImage.uri : '' | imageUrl"
                                     :alt="item.coverImage ? item.coverImage.name : ''"/>
                                <label v-else>预览图片</label>
                            </div>
                        </div>
                        <el-select v-if="item.layoutItemType !== 'ALL'" v-model="item.id" placeholder="请选择"
                                   @change="setOptionsStatus">
                            <el-option
                                v-for="item in typeList"
                                :key="item.id"
                                :label="item.name"
                                :value="item.id"
                                :disabled="item.disabled">
                            </el-option>
                        </el-select>
                        <!--'全部'的id默认设置为1-->
                        <el-select v-else v-model="item.id" placeholder="请选择">
                            <el-option
                                v-for="item in [{id:'1',name:'全部'}]"
                                :key="item.id"
                                :label="item.name"
                                :value="item.id"
                                :disabled="item.disabled">
                            </el-option>
                        </el-select>
                        <el-button type="success" size="mini" plain @click="setItemCoverImage(index)">设置图片</el-button>
                    </li>
                </ul>
                <div slot="footer" class="dialog-footer">
                    <el-button @click="setPickCatalogueVisible(false)">取 消</el-button>
                    <el-button type="primary" @click="setCatalogue">确 定</el-button>
                </div>
            </template>
        </el-dialog>
        <upload-image
            :size='size'
            title="上传图片"
            :successHandler="addPosterImage"
            :imageUploadDialogVisible="imageUploadDialogVisible"
            v-on:changeImageDialogStatus="closeImageDialog($event)">
        </upload-image>
    </div>
</template>

<script>

    import UploadImage from 'sysComponents/custom_components/global/UploadImage';
    import {CATALOGUE_DIMENSION} from '@/util/config/dimension';
    import CATALOGUE_CONFIG_MAP from '@/util/config/catalogue';

    export default {
        name: 'SortCatalogue',
        props: ['blockIndex', 'setCatalogueTitle', 'pickedCatalogueList', 'navBarId', 'navBarSignCode'],
        components: {
            UploadImage
        },
        data() {
            return {
                size: CATALOGUE_DIMENSION,
                pickCatalogueVisible: false,
                typeList: [],
                valueList: [],
                valueAll: '全部',
                imageUploadDialogVisible: false,
                imageIndex: '',
                pickedCatalogueSettingList: []
            };
        },
        computed: {
            catalogueConfig() {
                return CATALOGUE_CONFIG_MAP[this.navBarSignCode];
            }
        },
        methods: {
            getTypeList() {
                if (this.navBarSignCode === 'LIVE_CHANNEL') {
                    this.$service.getChannelType({})
                        .then((res) => {
                            if (res && res.code === 0) {
                                this.typeList = res.data;
                            }
                        });
                } else {
                    this.$service.getProgrammeCategory().then(response => {
                        if (response && response.code === 0) {
                            response.data.map(item => {
                                if (this.catalogueConfig.level === 'SECOND' && item.signCode === this.catalogueConfig.categorySignCode) {
                                    this.typeList = item.programmeTypeList;
                                    // 色块展示一级类别，例如'娱乐'
                                } else if (this.catalogueConfig.level === 'FIRST') {
                                    for (let i = 0; i < this.catalogueConfig.categorySignCode.length; i++) {
                                        if (item.signCode === this.catalogueConfig.categorySignCode[i]) {
                                            this.typeList.push(item);
                                        }
                                    }
                                }
                                this.setOptionsStatus();
                            });
                        }
                    });
                }
            },
            initDragula() {
                let that = this;
                this.$nextTick(function () {
                    // 拖拽设置
                    this.$dragula([document.getElementById('pick-list')], {
                        direction: 'horizontal',
                        // '全部'的标签不可以移动
                        moves: function (el) {
                            return !el.classList.contains('all');
                        },
                        // 其它标签不可以移动到'全部'标签之后
                        accepts: function (el, target, source, sibling) {
                            return !(that.pickedCatalogueList[that.pickedCatalogueList.length - 1].layoutItemType === 'ALL' && sibling === null);
                        }
                    });
                });
            },
            // 打开或关闭蒙层
            setPickCatalogueVisible(isVisible) {
                this.pickCatalogueVisible = isVisible;
                if (isVisible) {
                    this.pickedCatalogueSettingList = JSON.parse(JSON.stringify(this.pickedCatalogueList));
                    this.initDragula();
                    this.typeList = [];
                    this.getTypeList();
                }
            },
            // 设置目录项是否可选
            setOptionsStatus() {
                this.typeList.map(type => {
                    type.disabled = false;
                    this.pickedCatalogueSettingList.map(selectItem => {
                        if (type.id === selectItem.id) {
                            type.disabled = true;
                        }
                    });
                });
            },
            // 设置目录项图片
            setItemCoverImage(index) {
                this.imageIndex = index;
                this.closeImageDialog(true);
            },
            // 关闭上传图片对话框
            closeImageDialog(status) {
                this.imageUploadDialogVisible = status;
            },
            // 设置色块图片
            addPosterImage(newPosterImage) {
                this.pickedCatalogueSettingList[this.imageIndex].coverImage = newPosterImage.posterImage;
            },
            // 检测是否设置完成
            checkSettingStatus() {
                if (this.pickedCatalogueSettingList.length !== 6) {
                    return false;
                }
                this.pickedCatalogueSettingList.map(item => {
                    if (!item.id || !item.coverImage) {
                        return false;
                    }
                });
                return true;
            },
            getTypeInfo(id) {
                for (let i = 0; i < this.typeList.length; i++) {
                    if (this.typeList[i].id === id) {
                        return this.typeList[i];
                    }
                }
            },
            // 设置目录
            setCatalogue() {
                if (!this.checkSettingStatus()) {
                    this.$message({
                        message: '请完整设置六个推荐类型',
                        type: 'warning'
                    });
                    return;
                }
                let list = [[]];
                let nodeList = this.$el.querySelectorAll('#pick-list li');
                for (let i = 0; i < nodeList.length; i++) {
                    this.pickedCatalogueSettingList.map(item => {
                        if (nodeList[i].getAttribute('data-id') === item.id) {
                            // 选择全部
                            if (item.id === '1') {
                                item.name = '全部';
                                item.layoutItemType = 'ALL';
                            } else {
                                item.name = this.getTypeInfo(item.id).name;
                                // 推荐二级分类
                                if (this.catalogueConfig.level === 'SECOND') {
                                    item.layoutItemType = this.catalogueConfig.layoutItemType.type;
                                    // 推荐一级分类
                                } else if (this.catalogueConfig.level === 'FIRST') {
                                    let signCode = this.getTypeInfo(item.id).signCode;
                                    item.layoutItemType = this.catalogueConfig.layoutItemType[signCode].category;
                                }
                            }
                            list[0].push(item);
                        }
                    });
                }
                let catalogueItem = {
                    layoutTemplate: 'LT_6',
                    renderType: 'CATALOGUE',
                    // 色块高度为 s6 的134px
                    height: 134,
                    title: '',
                    subjectId: '',
                    layoutItemMultiList: list
                };
                // 保存数据到本地store，并展示，关闭弹出框
                this.$store.commit('layout/setCatalogue', {
                    navBarId: this.navBarId,
                    navBarSignCode: this.navBarSignCode,
                    model: this.blockIndex,
                    catalogueModel: catalogueItem
                });
                this.$message({
                    message: '设置推荐节目类别成功',
                    type: 'success'
                });
                this.$emit('setCatalogue', catalogueItem, this.blockIndex);
                this.pickCatalogueVisible = false;
            }
        }
    };
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="less" scoped>

    // 推荐节目类型或者直播频道
    .recommend-type {
        display: flex;
        margin-top: 20px;
        justify-content: space-between;
        li {
            position: relative;
            width: 14%;
            padding-top: 8%;
            background: #008178;
            color: #fff;
            &.operator {
                width: 80px;
                border-radius: 10px;
                cursor: pointer;
            }
            div {
                display: flex;
                flex-direction: column;
                justify-content: center;
                font-size: 20px;
                img {
                    width: 100%;
                    height: 100%;
                }
            }
        }
    }

    .pick-list {
        display: flex;
        justify-content: space-around;
        align-items: center;
        height: 200px;
        margin-bottom: 30px;
        border: 1px solid gray;
        li {
            margin-bottom: 16px;
            margin-right: 12px;
            width: 14%;
            cursor: grab;
            &.all {
                cursor: default;
            }
            .image-box {
                position: relative;
                flex-shrink: 0;
                width: 100%;
                padding-top: 57%;
                background: #008178;
                color: #fff;
                font-size: 14px;
                .ab-center {
                    display: flex;
                    flex-direction: column;
                    justify-content: center;
                }
                img {
                    width: 100%;
                    height: 100%;
                }
            }
            .el-button {
                margin-top: 20px;
            }
        }
    }

    /*
     * 设置拖拽效果样式
     */

    .gu-mirror {
        cursor: grabbing;
        cursor: -moz-grabbing;
        cursor: -webkit-grabbing;
        background-color: rgba(0, 0, 0, 0.2);
        transition: opacity 0.4s ease-in-out;
        text-align: center;
        .image-box {
            position: relative;
            flex-shrink: 0;
            width: 100%;
            padding-top: 57%;
            background: #008178;
            color: #fff;
            font-size: 14px;
            .ab-center {
                display: flex;
                flex-direction: column;
                justify-content: center;
            }
            img {
                width: 100%;
                height: 100%;
            }
        }
        .el-button {
            margin-top: 20px;
        }
    }

    .container > div {
        cursor: move;
        cursor: grab;
        cursor: -moz-grab;
        cursor: -webkit-grab;
    }
</style>
