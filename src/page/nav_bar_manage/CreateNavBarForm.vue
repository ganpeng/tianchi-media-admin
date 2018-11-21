<!--添加栏目组件-->
<template>
    <div>
        <div class="content-title">添加栏目</div>
        <div class="seperator-line"></div>
        <el-form
            ref="navBarInfo"
            :model="navBarInfo"
            :rules="infoRules"
            status-icon
            label-width="120px"
            class="form-block fill-form">
            <el-form-item label="栏目标题类型" prop="type" class="title-type" required>
                <el-radio-group v-model="navBarInfo.type">
                    <el-radio :label="0">文字
                        <el-input v-model="navBarInfo.name" placeholder="请输入栏目标题，10字以内"></el-input>
                    </el-radio>
                    <el-radio :label="1">图片
                        <div class="image-box">
                            <div class="upload-box">
                                <div>
                                    <i class="el-icon-plus"></i>
                                    <img src="">
                                </div>
                                <p>
                                    <label>42*100-500</label>
                                    <span>落焦图</span>
                                </p>
                            </div>
                            <div class="upload-box">
                                <div>
                                    <i class="el-icon-plus"></i>
                                    <img src="">
                                </div>
                                <p>
                                    <label>42*100-500</label>
                                    <span>非落焦图</span>
                                </p>
                            </div>
                        </div>
                    </el-radio>
                </el-radio-group>
            </el-form-item>
            <el-form-item label="栏目板式" class="nav-bar-model" prop="model" required>
                <el-radio-group v-model="navBarInfo.model">
                    <el-radio :label="3">新闻板式类
                        <svg-icon icon-class="model_news"></svg-icon>
                    </el-radio>
                    <el-radio :label="6">电影板式类
                        <svg-icon icon-class="model_movie"></svg-icon>
                    </el-radio>
                    <el-radio :label="9">电视剧板式类
                        <svg-icon icon-class="model_TV_drama"></svg-icon>
                    </el-radio>
                    <el-radio :label="11">专题板式类
                        <svg-icon icon-class="model_subject"></svg-icon>
                    </el-radio>
                </el-radio-group>
            </el-form-item>
        </el-form>
        <div class="operate">
            <el-button type="primary" @click="createNavBar" class="btn-style-two">保存</el-button>
            <el-button @click="toNavBarSetting" class="btn-style-three">返回</el-button>
        </div>
    </div>
</template>

<script>

    export default {
        name: 'CreateNavNarForm',
        data() {
            let checkType = (rule, value, callback) => {
                if (this.$util.isEmpty(value)) {
                    return callback(new Error('请选择栏目标题类型'));
                } else {
                    callback();
                }
            };
            let checkModel = (rule, value, callback) => {
                if (this.$util.isEmpty(value)) {
                    return callback(new Error('请选择栏目板式'));
                } else {
                    callback();
                }
            };
            return {
                navBarInfo: {
                    type: '',
                    name: '',
                    model: ''
                },
                infoRules: {
                    type: [
                        {validator: checkType, trigger: 'change'}
                    ],
                    model: [
                        {validator: checkModel, trigger: 'change'}
                    ]
                }
            };
        },
        methods: {
            createNavBar() {
                this.$refs['navBarInfo'].validate((valid) => {
                    if (valid) {

                    } else {
                        return false;
                    }
                });
            },
            toNavBarSetting() {
                this.$router.push({name: 'NavBarSetting'});
            }
        }
    };
</script>

<style lang="scss" scoped>

    .el-form {
        margin-top: 25px;
        /*标题类型*/
        .title-type {
            .el-radio {
                display: block;
                margin-left: 0px;
                overflow: hidden;
                &:last-child {
                    position: relative;
                    margin-top: 25px;
                    height: 88px;
                }
            }
            .el-input {
                margin-left: 20px;
                width: 300px;
            }
            .image-box {
                position: absolute;
                display: inline-block;
                margin-left: 24px;
            }
            /*上传框*/
            .upload-box {
                display: inline-block;
                &:last-child {
                    margin-left: 30px;
                }
                div {
                    width: 100px;
                    height: 42px;
                    border: 1px solid #3E495E;
                    line-height: 42px;
                    border-radius: 4px;
                    text-align: center;
                    cursor: pointer;
                    i {
                        font-size: 20px;
                        color: #3E495E;
                    }
                }
                p {
                    margin-top: 7px;
                    label, span {
                        display: block;
                        text-align: center;
                        font-size: 12px;
                        line-height: 17px;
                    }
                }
            }
        }
    }

    .nav-bar-model {
        .el-radio-group {
            margin-top: 12px;
            width: 900px;
            .el-radio:nth-child(3) {
                margin-left: 0px;
                margin-top: 26px;
            }
            .el-radio:nth-child(4) {
                margin-top: 26px;
            }
        }
        .svg-icon {
            display: block;
            margin-top: 10px;
            width: 370px !important;
            height: 158px !important;
        }
    }

    .operate {
        margin-top: 200px;
        margin-bottom: 80px;
        .el-button:nth-child(2) {
            margin-left: 40px;
        }
    }

</style>
