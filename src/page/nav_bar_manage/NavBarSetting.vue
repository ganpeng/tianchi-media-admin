<!--栏目管理-->
<template>
    <div>
        <div class="content-title">栏目预览</div>
        <ul class="preview-list">
            <li><label>新闻</label></li>
            <li><label>新闻</label></li>
            <li><label>新闻</label></li>
            <li><label>新闻</label></li>
            <li><label>新闻</label></li>
            <li><label>新闻</label></li>
            <li><label>新闻</label></li>
            <li><label>新闻</label></li>
        </ul>
        <div class="content-title">
            栏目调整
            <el-button class="btn-style-two operate-edit">退出编辑</el-button>
        </div>
        <ul class="operate-list">
            <li>
                <div>
                    <label>新闻</label>
                    <i class="el-icon-circle-close"></i>
                </div>
                <p>
                    <img src=""/>
                    <el-switch
                        active-color="#13ce66"
                        inactive-color="#ff4949">
                    </el-switch>
                </p>
            </li>
            <li>
                <div>
                    <label>新闻</label>
                    <i class="el-icon-circle-close"></i>
                </div>
                <p>
                    <img src=""/>
                    <el-switch
                        active-color="#13ce66"
                        inactive-color="#ff4949">
                    </el-switch>
                </p>
            </li>
            <li class="upload-box" @click="createNavBar">
                <i class="el-icon-plus"></i>
            </li>
        </ul>
        <el-button class="btn-style-two update-btn" @click="updateNavBarSetting">保存</el-button>
    </div>
</template>

<script>
    export default {
        name: 'NavBarSetting',
        data() {
            return {};
        },
        mounted() {
            this.init();
        },
        methods: {
            init() {
            },
            updateNavBarSetting() {

            },
            createNavBar() {
                this.$router.push({name: 'CreateNavBar'});
            }
        }
    };
</script>

<style lang="scss" scoped>

    ul.preview-list {
        padding: 15px 0px;
        margin-bottom: 30px;
        border-top: 1px solid #252D3F;
        border-bottom: 1px solid #252D3F;
        overflow: hidden;
        li {
            float: left;
            margin-right: 28px;
            font-size: 20px;
            color: #637497;
        }
    }

    .operate-edit {
        float: right;
    }

    ul.operate-list {
        overflow: hidden;
        li {
            float: left;
            margin-right: 20px;
            margin-bottom: 20px;
            padding: 0px 10px;
            width: 150px;
            background: #2E384D;
            border-radius: 4px;
            /*上传框*/
            &.upload-box {
                height: 100px;
                border: 1px solid #3E495E;
                border-radius: 4px;
                background: #252D3F;
                line-height: 100px;
                cursor: pointer;
                i {
                    font-size: 24px;
                    color: #3E495E;
                }
            }
            div {
                height: 35px;
                line-height: 35px;
                border-bottom: 1px solid #3E495E;
                label {
                    display: inline-block;
                    width: 86px;
                    text-align: left;
                    font-size: 18px;
                    color: #A8ABB3;
                }
                i {
                    font-size: 16px;
                    color: #C0C4CC;
                    cursor: pointer;
                }
            }
            P {
                height: 65px;
                img {
                    margin-top: 8px;
                    width: 63px;
                    height: 50px;
                    &.little {
                        margin-top: 21px;
                        width: 38px;
                        height: 23px;
                    }
                }
                i {
                    display: inline-block;
                    margin-top: 23px;
                    margin-left: 10px;
                    font-size: 14px;
                    color: #1989FA;
                    cursor: pointer;
                }
            }
        }
    }

    .update-btn {
        margin-top: 200px;
    }

</style>
