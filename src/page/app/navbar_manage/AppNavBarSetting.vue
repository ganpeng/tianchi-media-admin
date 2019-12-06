<!--2.0栏目管理-->
<template>
    <div>
        <div class="content-title">栏目预览</div>
        <ul class="preview-list">
            <li v-for="(item, index) in visibleNavbarList" :key="index">
                <label>{{item.name}}</label>
            </li>
        </ul>
        <div class="content-title">栏目调整</div>
        <draggable filter=".ignore-element" element="ul" class="operate-list" v-model="navBarList">
            <li v-for="(item, index) in navBarList"
                :key="index"
                :class="[!item.visible && 'invisible-item', 'handle']">
                <div>
                    <label>{{item.name}}</label>
                    <i class="el-icon-circle-close"
                        @click="removeNavBar(item, index)">
                    </i>
                </div>
                <p>
                    <label class="edit" @click="toEditNavBar(item.id)">
                        编辑
                    </label>
                    <input class="my-switch switch-anim" type="checkbox"
                        :checked="item.visible"
                        @click="toggleNavbarVisible(index)"/>
                </p>
            </li>
            <li class="upload-box ignore-element" @click="createNavBar">
                <i class="el-icon-plus"></i>
            </li>
        </draggable>
        <div class="operate-block text-center">
            <el-button type="primary" @click="updateNavBarSetting" class="btn-style-two">保存</el-button>
        </div>
    </div>
</template>

<script>
    // import _ from 'lodash';
    import draggable from 'vuedraggable';
    export default {
        name: 'AppNavBarSetting',
        components: {draggable},
        data() {
            return {
                navBarList: []
            };
        },
        mounted() {
            this.init();
        },
        computed: {
            visibleNavbarList() {
                return this.navBarList.filter((item) => item.visible);
            }
        },
        methods: {
            init() {
                let that = this;
                this.getAppNavBarList();
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
            getAppNavBarList() {
                let params = {
                    applicableClient: 'APP'
                };
                this.$service.getAppNavBarList(params).then(response => {
                    if (response && response.code === 0) {
                        this.navBarList = response.data;
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
                    this.$message.success('栏目在本地已删除，可点击保存按钮生效');
                });
            },
            async updateNavBarSetting() {
                try {
                    if (!this.$authority.isHasAuthority('content:navBar:list')) {
                        return false;
                    }

                    let res = await this.$service.putAppNavBar(this.navBarList);
                    if (res && res.code === 0) {
                        this.$message.success(`保存成功`);
                    } else {
                        this.$message.error(`保存失败`);
                    }
                } catch (err) {
                    console.log(err);
                }
            },
            createNavBar() {
                if (!this.$authority.isHasAuthority('content:navBar:add')) {
                    return false;
                }
                this.$router.push({name: 'AppCreateNavBar'});
            },
            toEditNavBar(id) {
                if (!this.$authority.isHasAuthority('content:navBar:put')) {
                    return false;
                }

                this.$router.push({name: 'AppEditNavBar', params: {id: id}});
            },
            toggleNavbarVisible(index) {
                this.navBarList = this.navBarList.map((item, _index) => {
                    if (index === _index) {
                        item.visible = !item.visible;
                    }
                    return item;
                });
                console.log(this.navBarList);
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
