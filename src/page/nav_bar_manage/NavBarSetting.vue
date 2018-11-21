<!--栏目管理-->
<template>
    <div>
        <div class="content-title">栏目预览</div>
        <ul class="preview-list">
            <li><label>新闻</label></li>
            <li><label>新闻</label></li>
        </ul>
        <div class="content-title">栏目调整</div>
        <ul class="operate-list">
            <li v-for="(item, index) in navBarList" :key="index">
                <div>
                    <label>{{item.name}}</label>
                    <i class="el-icon-circle-close" @click="removeNavBar(item, index)"></i>
                </div>
                <p>
                    <input class="my-switch switch-anim"
                           type="checkbox"
                           v-model="scope.row.visible"/>
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
            return {
                navBarList: []
            };
        },
        mounted() {
            this.getNavBarList();
        },
        methods: {
            getNavBarList() {
            },
            removeNavBar(item, index) {
                this.$confirm('此操作将删除角标, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    this.navBarList.splice(index, 1);
                    this.$message.success('栏目在本地已删除，可点击保存按钮生效');
                }).catch(() => {
                    this.$message({
                        type: 'info',
                        message: '已取消删除'
                    });
                });
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
            font-size: 20px;
            color: #637497;
        }
    }

    // 栏目调整
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
                height: 80px;
                border: 1px solid #3E495E;
                border-radius: 4px;
                background: #252D3F;
                line-height: 80px;
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
                    &:hover {
                        color: #C35757;
                    }
                }
            }
            P {
                height: 45px;
                .my-switch {
                    float: right;
                    margin-top: 15px;
                }
            }
        }
    }

    .update-btn {
        margin-top: 200px;
    }

</style>
