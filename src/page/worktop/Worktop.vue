<template>
    <div class="worktop-container">
        <h2 class="content-title clearfix">
            快捷操作
            <el-dropdown
                @command="gotoBlankPage"
                class="float-right" placement="bottom">
                <el-button class="btn-style-two contain-svg-icon">
                    <svg-icon icon-class="add"></svg-icon>
                    批量导入
                    <svg-icon icon-class="arrow_down"></svg-icon>
                </el-button>
                <el-dropdown-menu slot="dropdown">
                    <el-dropdown-item command="PersonImport">批量导入人物</el-dropdown-item>
                    <el-dropdown-item command="ProgrammeImport">批量导入节目</el-dropdown-item>
                    <el-dropdown-item command="LiveChannelImport">批量导入直播频道</el-dropdown-item>
                </el-dropdown-menu>
            </el-dropdown>
        </h2>
        <ul class="short-cut-list">
            <li @click="gotoBlankPage(item.name)" v-for="(item, index) in shortCutList" :key="index" class="short-cut-item">
                <div class="text-wrapper" v-html="item.title">
                </div>
                <svg-icon :icon-class="item.iconClass"></svg-icon>
            </li>
        </ul>
    </div>
</template>
<script>
export default {
    name: 'Worktop',
    data() {
        let style = 'font-size:18px;display:block;text-align:right;';
        return {
            shortCutList: [
                {
                    title: '上传视频',
                    name: 'VideoImport',
                    iconClass: 'shortcut_upload_video'
                },
                {
                    title: '新建节目',
                    name: 'CreateProgramme',
                    iconClass: 'shortcut_programme'
                },
                {
                    title: `<span style=${style}>新建</span>人物专题`,
                    name: 'CreateFigureSubject',
                    iconClass: 'shortcut_subject'
                },
                {
                    title: `<span style=${style}>新建</span>节目专题`,
                    name: 'CreateProgrammeSubject',
                    iconClass: 'shortcut_subject'
                },
                {
                    title: `<span style=${style}>新建</span>直播频道`,
                    name: 'CreateLiveChannel',
                    iconClass: 'shortcut_live_channel'
                },
                {
                    title: `<span style=${style}>新建</span>轮播频道`,
                    name: 'CreateChannel',
                    iconClass: 'shortcut_carousel_channel'
                },
                {
                    title: '新建人物',
                    name: 'CreatePerson',
                    iconClass: 'shortcut_person'
                },
                // {
                //     title: '批量导入节目',
                //     name: 'ProgrammeImport',
                //     iconClass: 'shortcut_import_live_programme'
                // },
                // {
                //     title: '批量导入人物',
                //     name: 'PersonImport',
                //     iconClass: 'shortcut_person'
                // },
                // {
                //     title: '批量导入直播频道',
                //     name: 'LiveChannelImport',
                //     iconClass: 'shortcut_import_live_programme'
                // },
                {
                    title: '上传新版本',
                    name: 'CreateVersion',
                    iconClass: 'shortcut_version'
                }
            ]
        };
    },
    methods: {
        gotoBlankPage(name) {
            let routeData = this.$router.resolve({ name });
            window.open(routeData.href, '_blank');
        }
    }
};
</script>
<style lang="scss" scoped>
.worktop-container {
    position: absolute;
    top: 20px;
    left: 20px;
    right: 20px;
    bottom: 50px;
    background-image: url('../../assets/img/worktop_bg.png');
    background-repeat: no-repeat;
    background-position: bottom center;
    background-size: contain;
    .el-dropdown {
        .el-button {
            width: 140px;
            font-size: 16px;
        }
    }
}

.short-cut-list {
    display: flex;
    flex-wrap: wrap;
    width: 1200px;
    margin-top: 40px;
    .short-cut-item {
        position: relative;
        width: 280px;
        height: 70px;
        background: #2A3040;
        border-radius: 8px;
        margin-right: 20px;
        margin-bottom: 44px;
        cursor: pointer;
        font-size: 24px;
        color: #A8ABB3;
        .text-wrapper {
            position: absolute;
            bottom: 4px;
            right: 10px;
            span.haha {
                display: block;
                font-size: 18px;
            }
        }
        .svg-icon {
            position: absolute;
            left: 30px;
            top: -26px;
            fill: #3E495E;
            width: 56px;
            height: 80px;
        }
        &:hover {
            background: #252D3F;
            .text-wrapper {
                color: #4A90E2;
            }
            .svg-icon {
                fill: #4A90E2 ;
            }
        }
    }
}
</style>
