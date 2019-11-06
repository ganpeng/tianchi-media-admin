<!--部门详情页面-->
<template>
    <div>
        <div class="content-title">部门详情</div>
        <div class="seperator-line"></div>
        <div class="detail-title-block">
            <div class="channel-status"></div>
            <div class="title">
                <label>{{departmentInfo.name}}</label>
            </div>
            <div class="channel-time">
                <div>创建于{{departmentInfo.createdAt | formatDate('yyyy.MM.DD')}}</div>
                <div>更新于{{departmentInfo.updatedAt | formatDate('yyyy.MM.DD')}}</div>
            </div>
        </div>
        <!--相关信息-->
        <div class="about-channel">
            <svg-icon icon-class="goods_placeholder"></svg-icon>
            <div class="info-container">
                <div>
                    <ul class="info-list">
                        <li>
                            <span>负责人：</span>
                            <label v-for="item in departmentInfo.adminList"
                                   :key="item.id">{{item.name}}</label>
                        </li>
                        <li><span>描述：</span><label>{{departmentInfo.remark}}</label></li>
                    </ul>
                </div>
            </div>
        </div>
        <div class="fixed-btn-container">
            <el-button class="btn-style-two" type="primary" @click="editInfo">编辑</el-button>
            <el-button class="btn-style-three" @click="toDepartmentList" plain>返回列表</el-button>
        </div>
    </div>
</template>

<script>

    export default {
        name: 'DepartmentDetail',
        data() {
            return {
                showProductList: true,
                departmentInfo: {
                    name: '',
                    description: '',
                    price: '',
                    validityDays: '',
                    productList: [],
                    visible: false
                }
            };
        },
        filters: {
            getDepartmentDuration(days) {
                switch (days) {
                    case 30:
                        return '一个月';
                    case 90:
                        return '三个月';
                    case 180:
                        return '半年';
                    case 365:
                        return '一年';
                }
            }
        },
        mounted() {
            this.init();
        },
        methods: {
            init() {
                this.$util.toggleFixedBtnContainer();
                this.$service.getDepartmentDetail(this.$route.params.id).then(response => {
                    if (response && response.code === 0) {
                        for (let key in response.data) {
                            this.departmentInfo[key] = response.data[key];
                        }
                    }
                });
            },
            // 编辑轮播频道
            editInfo() {
                this.$router.push({
                    name: 'EditDepartment',
                    params: {id: this.$route.params.id}
                });
            },
            toDepartmentList() {
                this.$router.push({
                    name: 'DepartmentList'
                });
            }
        }
    };
</script>

<style lang="scss" scoped>

    // 频道题目
    .detail-title-block {
        height: 50px;
        line-height: 50px;
        overflow: hidden;
        .channel-status {
            float: left;
            margin-left: 86px;
            margin-right: 94px;
            margin-top: 9px;
            height: 30px;
            width: 80px;
            line-height: 30px;
            border-radius: 4px;
            font-size: 20px;
            text-align: center;
            &.un-shelve {
                color: #6F7480;
                background: #2A3040;
            }
            &.shelve {
                color: #fff;
                background: #3AC26F;
            }
        }

        .title {
            float: left;
            label {
                font-size: 20px;
                color: #FFFFFF;
            }
            .start-time {
                font-size: 14px;
                color: #A8ABB3;
            }
        }
        .channel-time {
            float: right;
            margin-left: 350px;
            margin-right: 20px;
            div {
                height: 17px;
                line-height: 17px;
                &:first-child {
                    margin-top: 6px;
                    margin-bottom: 3px;
                }
            }
        }
    }

    // 相关信息
    .about-channel {
        position: relative;
        padding-bottom: 12px;
        border-bottom: 1px solid #252D3F;
        text-align: left;
        overflow: hidden;
        .svg-icon {
            position: absolute;
            top: 0px;
            left: 20px;
            height: 200px !important;
            width: 200px !important;
        }
        .info-container {
            min-width: 1220px;
            margin-left: 260px;
            height: 202px;
            border-top: 1px solid #252D3F;
            > div {
                display: inline-block;
                margin-right: 60px;
            }
            .info-list {
                display: inline-block;
                &.right-info {
                    padding-top: 50px;
                }
                li {
                    display: flex;
                    justify-content: flex-start;
                    margin-bottom: 8px;
                    span {
                        flex-shrink: 0;
                        flex-grow: 0;
                        width: 80px;
                        text-align: right;
                        padding-right: 10px;
                        font-size: 16px;
                        color: #A8ABB3;
                    }
                    label {
                        margin-right: 20px;
                        font-size: 16px;
                        color: #A8ABB3;
                    }
                }
            }
        }
    }

    .content-sub-title {
        span:first-child {
            font-size: 20px;
        }
        .toggle-btn {
            font-size: 14px;
            cursor: pointer;
            margin-left: 40px;
            &.is-active,
            &:hover {
                color: $mainColor;
            }
            i {
                color: #3E495E;
            }
            &.disabled {
                opacity: 0.5;
                font-size: 14px;
                cursor: default;
            }
        }
    }

    .svg-icon-arrow_down {
        font-size: 12px;
    }

    .search-list {
        display: flex;
        align-items: center;
        flex-wrap: wrap;
        margin-top: 10px;
        .search-item {
            width: 200px;
            height: 34px;
            line-height: 34px;
            border: 1px solid #3E495E;
            background: #2A3040;
            border-radius: 4px;
            margin-right: 20px;
            margin-bottom: 14px;
            .wrapper {
                position: relative;
                display: flex;
                align-items: center;
                height: 32px;
                .index {
                    width: 32px;
                    height: 32px;
                    line-height: 32px;
                    color: #A8ABB3;
                    border-right: 1px solid #3E495E;
                }
                .search-name {
                    color: #A8ABB3;
                    flex: 1;
                    height: 32px;
                    font-size: 14px;
                    line-height: 32px;
                    text-indent: 10px;
                    text-align: left;
                }
                .ellipsis-content {
                    display: none;
                    position: absolute;
                    top: -24px;
                    left: 20px;
                    background: rgba(0, 0, 0, 0.90);
                    box-shadow: 2px 4px 10px 0 rgba(0, 0, 0, 0.30);
                    border-radius: 4px;
                    white-space: nowrap;
                    padding: 0 10px;
                }
                &:hover {
                    .ellipsis-content {
                        display: block;
                    }
                }
            }
        }
    }

</style>
