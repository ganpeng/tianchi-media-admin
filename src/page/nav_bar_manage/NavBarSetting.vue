<!--2.0栏目管理-->
<template>
    <div>
        <div class="content-title">栏目预览</div>
        <ul class="preview-list">
            <li v-for="(item, index) in previewNavBarList" :key="index" v-if="item.visible">
                <label>{{item.name || item.picRemark}}</label>
            </li>
        </ul>
        <div class="content-title">栏目调整</div>
        <ul class="operate-list" id="operate-list">
            <li v-for="(item, index) in navBarList"
                :key="index"
                :data-id="item.id"
                :class="{'invisible-item':!item.visible}">
                <div>
                    <label v-if="item.name">{{item.name}}</label>
                    <label v-else class="pic-remark">{{item.picRemark}}</label>
                    <i class="el-icon-circle-close"
                       @click="removeNavBar(item, index)"
                       v-if="item.type === 'CUSTOM'">
                    </i>
                </div>
                <p>
                    <label
                        v-if="item.type === 'CUSTOM'"
                        class="edit"
                        @click="toEditNavBar(item.id)">
                        编辑
                    </label>
                    <input v-if="item.type === 'CUSTOM' || item.type === 'VISIBLE_ONLY'"
                           class="my-switch switch-anim"
                           type="checkbox"
                           @click.prevent="toggleVisible(item)"
                           :checked="item.visible"/>
                    <!--
                    <input v-if="item.type === 'CUSTOM' || item.type === 'VISIBLE_ONLY'"
                           class="my-switch switch-anim"
                           type="checkbox"
                           v-model="item.visible"/>
                    -->
                </p>
            </li>
            <li class="upload-box" @click="createNavBar">
                <i class="el-icon-plus"></i>
            </li>
        </ul>
        <div class="content-title">默认栏目</div>
        <div class="default-nav-bar">
            <div class="label">开机默认栏目</div>
            <el-select
                clearable
                filterable
                class="my-select"
                placeholder="请选择栏目"
                :value="defaultNavbarId"
                @change="defaultNavbarSelectChangeHandler($event)"
            >
                <el-option
                    v-for="(item, index) in defaultNavBarList"
                    :key="index"
                    :label="item.name"
                    :value="item.id">
                </el-option>
            </el-select>
        </div>
        <div class="operate-block text-center">
            <el-button type="primary" @click="updateNavBarSetting" class="btn-style-two">保存</el-button>
        </div>
    </div>
</template>

<script>
    export default {
        name: 'NavBarSetting',
        data() {
            return {
                navBarList: [],
                previewNavBarList: []
            };
        },
        mounted() {
            this.init();
        },
        computed: {
            defaultNavbarId() {
                let navbar = this.navBarList.find((navbar) => navbar.isDefault);
                return navbar ? navbar.id : '';
            },
            defaultNavBarList() {
                return this.navBarList.filter((navbar) => navbar.visible);
            }
        },
        methods: {
            init() {
                let that = this;
                this.getNavBarList();
                this.$dragula([document.getElementById('operate-list')], {
                    moves: function (el) {
                        return !el.classList.contains('upload-box');
                    },
                    accepts: function (el, target, source, sibling) {
                        return !!sibling;
                    },
                    direction: 'horizontal'
                }).on('drop', function () {
                    that.preview();
                });
            },
            getNavBarList() {
                this.$service.getNavbarList().then(response => {
                    if (response && response.code === 0) {
                        this.navBarList = response.data;
                        this.previewNavBarList = response.data.slice(0);
                    }
                });
            },
            removeNavBar(item, index) {
                this.$confirm('删除栏目后该栏目将不会在客户端中展示，可能会造成用户无法观看等问题，是否确认删除？', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    this.navBarList.splice(index, 1);
                    this.previewNavBarList.splice(index, 1);
                    this.$message.success('栏目在本地已删除，可点击保存按钮生效');
                });
            },
            updateNavBarSetting() {
                if (!this.$authority.isHasAuthority('content:navBar:list')) {
                    return;
                }
                console.log('+++++++++');
                console.log(this.previewNavBarList)
                console.log('+++++++++');
                // return false;
                this.$service.setNavBarList(this.previewNavBarList).then(response => {
                    if (response && response.code === 0) {
                        this.$message.success('成功更新栏目列表');
                    }
                });
            },
            createNavBar() {
                if (!this.$authority.isHasAuthority('content:navBar:add')) {
                    return;
                }
                this.$router.push({name: 'CreateNavBar'});
            },
            // 预览栏目调整情况
            preview() {
                let nodes = this.$el.querySelectorAll('#operate-list li');
                let array = [];
                for (let i = 0; i < nodes.length; i++) {
                    for (let k = 0; k < this.navBarList.length; k++) {
                        if (nodes[i].getAttribute('data-id') === this.navBarList[k].id) {
                            array.push(this.navBarList[k]);
                        }
                    }
                }
                this.previewNavBarList = array;
            },
            toEditNavBar(id) {
                if (!this.$authority.isHasAuthority('content:navBar:put')) {
                    return;
                }
                this.$router.push({name: 'EditNavBar', params: {id: id}});
            },
            // dev2.9
            defaultNavbarSelectChangeHandler(id) {
                this.navBarList = this.navBarList.map((navbar) => {
                    if (navbar.id === id) {
                        navbar.isDefault = true;
                    } else {
                        navbar.isDefault = null;
                    }
                    return navbar;
                });
            },
            toggleVisible(navbar) {
                if (navbar.visible) {
                    let len = this.navBarList.filter((_navbar) => _navbar.name !== '我的' && _navbar.id !== navbar.id && _navbar.visible).length;
                    if (len <= 1) {
                        this.$message.error(`无法隐藏该栏目，至少需展示两个栏目`);
                        return false;
                    } else {
                        this.navBarList = this.navBarList.map((_navbar) => {
                            if (_navbar.id === navbar.id) {
                                _navbar.visible = !_navbar.visible;
                            }
                            return _navbar;
                        });
                    }
                } else {
                    this.navBarList = this.navBarList.map((_navbar) => {
                        if (_navbar.id === navbar.id) {
                            _navbar.visible = !_navbar.visible;
                        }
                        return _navbar;
                    });
                }
            }
        }
    };
</script>

<style lang="scss" scoped>

    // 预览
    ul.preview-list {
        padding: 15px 0px;
        margin-bottom: 30px;
        border-top: 1px solid #252D3F;
        border-bottom: 1px solid #252D3F;
        overflow: hidden;
        li {
            float: left;
            margin-right: 28px;
            /*名称或图片*/
            label {
                display: inline-block;
                font-size: 20px;
                color: #637497;
                img {
                    margin-top: 5px;
                    height: 20px;
                }
            }
        }
    }

    // 栏目调整
    ul.operate-list {
        margin-left: 20px;
        overflow: hidden;
        li {
            float: left;
            margin-right: 20px;
            margin-bottom: 20px;
            padding: 0px 10px;
            width: 150px;
            background: #2E384D;
            border-radius: 4px;
            cursor: grab;
            border: 1px solid #2E384D;
            &.invisible-item {
                border: 1px solid transparent;
                background-color: rgba(42, 48, 64, 0.3);
                label {
                    opacity: 0.5;
                    color: #3E495E;
                    img {
                        -webkit-filter: opacity(.3);
                        filter: opacity(.3);
                    }
                }
            }
            &:hover {
                border: 1px solid #1989FA;
                i, .edit {
                    visibility: visible;
                }
            }
            /*上传框*/
            &.upload-box {
                height: 80px;
                border: 1px solid #3E495E;
                border-radius: 4px;
                background: transparent;
                line-height: 80px;
                cursor: pointer;
                i {
                    font-size: 24px;
                    color: #3E495E;
                }
                &:hover {
                    border-color: #1989FA;
                    i {
                        color: #1989FA;
                    }
                }
            }
            div {
                position: relative;
                height: 35px;
                line-height: 35px;
                border-bottom: 1px solid #3E495E;
                /*名称或图片*/
                label {
                    display: -webkit-box;
                    width: 102px;
                    text-align: left;
                    font-size: 18px;
                    color: #fff;
                    -webkit-box-orient: vertical;
                    overflow: hidden;
                    -ms-text-overflow: ellipsis;
                    text-overflow: ellipsis;
                    -webkit-line-clamp: 1;
                    &.pic-remark {
                        color: #A3D0FD;
                    }
                    img {
                        margin-top: 6px;
                        height: 20px;
                    }
                }
                /*删除按钮*/
                i {
                    position: absolute;
                    top: 10px;
                    right: 0px;
                    font-size: 16px;
                    color: #6F7480;
                    cursor: pointer;
                    visibility: hidden;
                    &:hover {
                        color: #C35757;
                    }
                }
            }
            P {
                height: 45px;
                .edit {
                    float: left;
                    margin-top: 12px;
                    font-size: 14px;
                    color: #1989FA;
                    cursor: pointer;
                    visibility: hidden;
                    &:hover {
                        text-decoration: underline;
                        text-underline: #1989FA;
                    }
                }
                .my-switch {
                    float: right;
                    margin-top: 15px;
                }
            }
        }
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
        z-index: 600;
    }

    /*
    * 设置拖拽效果样式
    */
    .gu-mirror {
        cursor: grabbing;
        cursor: -moz-grabbing;
        cursor: -webkit-grabbing;
        background: #293550;
        border: 1px solid #637497;
        box-shadow: 2px 4px 10px 0 rgba(0, 0, 0, 0.30);
        border-radius: 4px;
        transition: opacity 0.4s ease-in-out;
        display: flex;
        margin-right: 75px;
        margin-bottom: 20px;
        flex-direction: column;
        justify-content: space-around;
        align-items: center;
        flex-shrink: 0;
        flex-grow: 0;
        height: 90px;
        width: 160px;
        cursor: grab;
        div {
            position: relative;
            height: 35px;
            width: 128px;
            line-height: 35px;
            border-bottom: 1px solid #3E495E;
            /*名称或图片*/
            label {
                display: -webkit-box;
                width: 86px;
                text-align: left;
                font-size: 18px;
                color: #A8ABB3;
                -webkit-box-orient: vertical;
                overflow: hidden;
                -ms-text-overflow: ellipsis;
                text-overflow: ellipsis;
                -webkit-line-clamp: 1;
                img {
                    margin-top: 6px;
                    width: 44px;
                    height: 20px;
                }
            }
        }
        .el-icon-circle-close {
            display: none;
        }
        .edit {
            display: none;
        }
        P {
            position: relative;
            height: 45px;
            width: 100%;
            .my-switch {
                position: absolute;
                bottom: 13px;
                right: 10px;
            }
        }
    }

    .container > div {
        cursor: move;
        cursor: grab;
        cursor: -moz-grab;
        cursor: -webkit-grab;
    }

</style>
<style lang="scss">
    .default-nav-bar {
        display: flex;
        align-items: center;
        justify-content: flex-start;
        .label {
            margin-right: 20px;
            font-size: 14px;
            color: #A8ABB3;
        }
        .my-select {
            height: 34px;
            line-height: 34px;
            .el-input {
                height: 34px;
                .el-input__inner {
                    height: 34px;
                    line-height: 34px;
                    color: #6F7480;
                }
            }
        }
    }
</style>
