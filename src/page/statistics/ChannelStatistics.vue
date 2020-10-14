<template>
    <div class="channel-statistics-container">
        <div class="left-field">
            <div class="left-top-field top-field">
                <div class="field-header">
                    <div class="line"></div>
                    <div class="icon">
                        <svg-icon icon-class="channel_static_icon_01"></svg-icon>
                    </div>
                    <div class="title">直播</div>
                </div>
                <div class="top-field-content">
                    <div class="left-content">
                        <div class="content-one">
                            <div class="title">
                                <div class="text">直播总数</div>
                                <svg-icon icon-class="channel_static_icon_07"></svg-icon>
                            </div>
                            <div class="value">87</div>
                        </div>
                        <div class="content-two">
                            <div class="title">
                                <svg-icon icon-class="channel_static_icon_03"></svg-icon>
                                <div class="text">TV端直播数</div>
                            </div>
                            <div class="value">87</div>
                        </div>
                        <div class="content-three">
                            <div class="title">
                                <svg-icon icon-class="channel_static_icon_04"></svg-icon>
                                <div class="text">APP端直播数</div>
                            </div>
                            <div class="value">87</div>
                        </div>
                    </div>
                    <div class="right-content">
                        <div class="title">开启回看频道</div>
                        <div class="value">10</div>
                        <svg-icon icon-class="channel_static_icon_08"></svg-icon>
                    </div>
                </div>
            </div>
            <div class="left-bottom-field bottom-field"></div>
        </div>
        <div class="splite"></div>
        <div class="right-field">
            <div class="right-top-field top-field">
                <div class="field-header">
                    <div class="line"></div>
                    <div class="icon">
                        <svg-icon icon-class="channel_static_icon_02"></svg-icon>
                    </div>
                    <div class="title">轮播</div>
                </div>
                <div class="top-field-content">
                    <div class="left-content">
                        <div class="content-one">
                            <div class="title">
                                <div class="text">轮播总数</div>
                                <svg-icon icon-class="channel_static_icon_09"></svg-icon>
                            </div>
                            <div class="value">87</div>
                        </div>
                        <div class="content-two">
                            <div class="title">
                                <svg-icon icon-class="channel_static_icon_03"></svg-icon>
                                <div class="text">TV端轮播数</div>
                            </div>
                            <div class="value">87</div>
                        </div>
                        <div class="content-three">
                            <div class="title">
                                <svg-icon icon-class="channel_static_icon_04"></svg-icon>
                                <div class="text">APP端轮播数</div>
                            </div>
                            <div class="value">87</div>
                        </div>
                    </div>
                    <div class="right-content">
                        <div class="right-top-content">
                            <div class="title">轮播视频<br/>总时长</div>
                            <div class="value">
                                <div class="text">300<i>小时</i></div>
                                <svg-icon icon-class="channel_static_icon_05"></svg-icon>
                            </div>
                        </div>
                        <div class="right-bottom-content">
                            <div class="title">轮播视频<br/>总体积</div>
                            <div class="value">
                                <div class="text">10<i>TB</i></div>
                                <svg-icon icon-class="channel_static_icon_06"></svg-icon>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="right-bottom-field bottom-field"></div>
        </div>
    </div>
</template>
<script>
export default {
    name: 'ChannelStatistics',
    async created() {
        try {
            // await this.$nextTick();
            // let contentWrapper = document.querySelector('.content-wrapper');
            // contentWrapper.style.paddingBottom = '20px';
        } catch (err) {
            console.log(err);
        }
    }
};
</script>
<style lang="scss" scoped>
.channel-statistics-container {
    display: flex;
    width: 100%;
    // height: 100%;
    .left-field {
        flex: 1;
        // height: 100%;
        .left-top-field {
            display: flex;
            flex-direction: column;
            .field-header {
                .line {
                    background-color: #4A90E2;
                }
            }
            .top-field-content {
                display: flex;
                flex: 1;
                .left-content {
                    display: flex;
                    flex-direction: column;
                    flex: 1;
                    margin-right: 20px;
                    background-color: #293550;
                    border-radius: 16px;
                    padding: 0 16px;
                    .content-one {
                        display: flex;
                        justify-content: space-between;
                        align-items: center;
                        width: 100%;
                        height: 72px;
                        border-bottom: 1px solid #36425C;
                        .title {
                            position: relative;
                            width: 223px;
                            height: 72px;
                            .svg-icon {
                                position: absolute;
                                top: 0;
                                left: 0;
                                width: 223px;
                                height: 72px;
                            }
                            .text {
                                position: absolute;
                                left: 8px;
                                top: 50%;
                                transform: translateY(-50%);
                                font-size: 14px;
                                font-weight: 600;
                                color: #A3D0FD;
                            }
                        }
                        .value {
                            font-size: 40px;
                            color: #1989FA;
                        }
                    }
                    .content-two,
                    .content-three {
                        flex: 1;
                        display: flex;
                        justify-content: space-between;
                        align-items: center;
                        .title {
                            display: flex;
                            align-items: center;
                            .svg-icon {
                                width: 32px;
                                height: 32px;
                                margin-right: 8px;
                            }
                            .text {
                                font-size: 12px;
                                font-weight: 400;
                                color: #A3D0FD;
                            }
                        }
                    }
                    .content-two {
                        .value {
                            font-size: 28px;
                            color: #00A2DE;
                        }
                    }
                    .content-three {
                        .value {
                            font-size: 28px;
                            color: #FC8C07;
                        }
                    }
                }
                .right-content {
                    position: relative;
                    flex: 1;
                    background-color: #293550;
                    border-radius: 16px;
                    padding: 0 16px;
                    .title {
                        position: absolute;
                        top: 16px;
                        left: 16px;
                        font-size: 14px;
                        color: #A3D0FD;
                    }
                    .value {
                        position: absolute;
                        bottom: 16px;
                        left: 16px;
                        font-size: 48px;
                        color: #00ABFF;
                    }
                    .svg-icon {
                        position: absolute;
                        top: 50%;
                        right: 16px;
                        transform: translateY(-50%);
                        width: 147px;
                        height: 163px;
                    }
                }
            }
        }
        .left-bottom-field {
            // flex: 1;
        }
    }
    .splite {
        width: 1px;
        height: 670px;
        // height: 100%;
        margin: 0 20px;
        background-color: #252D3F;
    }
    .right-field {
        flex: 1;
        height: 100%;
        .right-top-field {
            .field-header {
                .line {
                    background-color: #639E68;
                }
            }
            .top-field-content {
                display: flex;
                flex: 1;
                .left-content {
                    display: flex;
                    flex-direction: column;
                    flex: 1;
                    margin-right: 20px;
                    background-color: #293550;
                    border-radius: 16px;
                    padding: 0 16px;
                    .content-one {
                        display: flex;
                        justify-content: space-between;
                        align-items: center;
                        width: 100%;
                        height: 72px;
                        border-bottom: 1px solid #36425C;
                        .title {
                            position: relative;
                            width: 223px;
                            height: 72px;
                            .svg-icon {
                                position: absolute;
                                top: 0;
                                left: 0;
                                width: 223px;
                                height: 72px;
                            }
                            .text {
                                position: absolute;
                                left: 8px;
                                top: 50%;
                                transform: translateY(-50%);
                                font-size: 14px;
                                font-weight: 600;
                                color: #A3D0FD;
                            }
                        }
                        .value {
                            font-size: 40px;
                            color: #67C23A;
                        }
                    }
                    .content-two,
                    .content-three {
                        flex: 1;
                        display: flex;
                        justify-content: space-between;
                        align-items: center;
                        .title {
                            display: flex;
                            align-items: center;
                            .svg-icon {
                                width: 32px;
                                height: 32px;
                                margin-right: 8px;
                            }
                            .text {
                                font-size: 12px;
                                font-weight: 400;
                                color: #A3D0FD;
                            }
                        }
                    }
                    .content-two {
                        .value {
                            font-size: 28px;
                            color: #00A2DE;
                        }
                    }
                    .content-three {
                        .value {
                            font-size: 28px;
                            color: #FC8C07;
                        }
                    }
                }
                .right-content {
                    display: flex;
                    flex-direction: column;
                    justify-content: space-between;
                    flex: 1;
                    .right-top-content,
                    .right-bottom-content {
                        display: flex;
                        justify-content: space-between;
                        align-items: center;
                        width: 100%;
                        height: 76px;
                        background-color: #26304A;
                        border-radius: 16px;
                        padding: 0 16px;
                        .title {
                            font-size: 14px;
                            color: #A3D0FD;
                            text-align: left;
                        }
                        .value {
                            display: flex;
                            align-items: center;
                            .text {
                                font-size: 32px;
                                color: #3AC26F;
                                i {
                                    font-size: 14px;
                                }
                            }
                            .svg-icon {
                                width: 30px;
                                height: 30px;
                                margin-left: 8px;
                            }
                        }
                    }
                }
            }
        }
        .right-bottom-field {
            // flex: 1;
        }
    }
    .top-field {
        display: flex;
        flex-direction: column;
        width: 100%;
        // height: 34.11%;
        // height: 35%;
        height: 232px;
        margin-bottom: 40px;
        .field-header {
            display: flex;
            justify-content: flex-start;
            align-items: center;
            width: 100%;
            height: 40px;
            margin-bottom: 20px;
            .line {
                width: 4px;
                height: 100%;
                border-radius: 2px;
            }
            .icon {
                margin: 0 8px;
                .svg-icon {
                    width: 64px;
                    height: 40px;
                }
            }
            .title {
                font-size: 20px;
                font-weight: 400;
                color: #FFF;
            }
        }
        .top-field-content {
            flex: 1;
        }
    }
    .bottom-field {
        height: 400px;
        border-radius: 16px;
        background-color: #26304A;
    }
}
</style>
