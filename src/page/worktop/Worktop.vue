<template>
    <div class="worktop-container">
        <h2 class="content-title">快捷操作</h2>
        <ul class="short-cut-list">
            <li @click="gotoBlankPage(item.name)" v-for="(item, index) in shortCutList" :key="index" class="short-cut-item">
                <span>
                    {{item.title}}
                </span>
            </li>
        </ul>
    </div>
</template>
<script>
export default {
    name: 'Worktop',
    data() {
        return {
            shortCutList: [
                {
                    title: '上传视频',
                    name: 'VideoImport'
                },
                {
                    title: '新建频道',
                    name: 'CreateLiveChannel'
                },
                {
                    title: '新建节目',
                    name: 'CreateProgramme'
                },
                {
                    title: '新建人物专题',
                    name: 'CreateFigureSubject'
                },
                {
                    title: '新建节目专题',
                    name: 'CreateProgrammeSubject'
                },
                {
                    title: '新建轮播',
                    name: 'CreateChannel'
                },
                {
                    title: '批量导入节目',
                    name: 'ProgrammeImport'
                },
                {
                    title: '新建人物',
                    name: 'CreatePerson'
                },
                {
                    title: '批量导入人物',
                    name: 'PersonImport'
                },
                {
                    title: '批量导入直播频道',
                    name: 'LiveChannelImport'
                },
                {
                    title: '上传新版本',
                    name: 'CreateVersion'
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
.short-cut-list {
    display: flex;
    flex-wrap: wrap;
    .short-cut-item {
        position: relative;
        width: 260px;
        height: 100px;
        background: #394154;
        border-radius: 8px;
        margin-right: 10px;
        margin-bottom: 10px;
        cursor: pointer;
        font-size: 24px;
        color: #C5D0E6;
        span {
            position: absolute;
            bottom: 10px;
            right: 10px;
        }
    }
}
</style>
