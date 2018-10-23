<template>
    <div class="app-container">
        <div class="header clearfix">
            <div class="logo float-left">
                <svg-icon
                    icon-class="logo_home"
                    class-name="logo-home">
                </svg-icon>
            </div>
            <ul class="nav-list clearfix float-left">
                <li v-for="(item, index) in navList" :key="index"
                    :class="['nav-item', active === index ? 'active' : '']"
                    @click="changeActive(index)"
                >
                    {{item}}
                </li>
            </ul>
        </div>
        <div class="aside">
            <ul class="aside-list">
                <li v-if="index === active" v-for="(asides, index) in asideList" :key="index" class="aside-item">
                    <el-menu
                        :default-active="defaultActive"
                        class="el-menu-vertical-demo"
                        background-color="#232e44"
                        text-color="#6a707c"
                        router
                        active-text-color="#fff">
                            <el-menu-item
                                v-for="(item, innerIndex) in asides"
                                :key="innerIndex"
                                :index="item.uri"
                            >
                                <i :class="item.icon"></i>
                                <span slot="title">{{item.text}}</span>
                            </el-menu-item>
                    </el-menu>
                </li>
            </ul>
        </div>
        <div class="content">
            <router-view></router-view>
        </div>
    </div>
</template>
<script>
import role from '@/util/config/role';
export default {
    data() {
        return {
            navList: role.NAV_LIST,
            asideList: role.ASIDE_LIST,
            active: 0,
            defaultActive: ''
        };
    },
    created() {
        let {path} = this.$route;
        if (path === '/home') {
            this.$router.push('/worktop-manage');
            path = '/worktop-manage';
        }
        let leftPart = path.split('/')[1];
        let active = 0;
        let activePath = '';
        for (let i = 0; i < this.asideList.length; i++) {
            for (let j = 0; j < this.asideList[i].length; j++) {
                let {uri} = this.asideList[i][j];
                if (leftPart === uri.split('/')[1]) {
                    active = i;
                    activePath = uri;
                    break;
                }
            }
        }

        this.active = active;
        this.defaultActive = activePath;
    },
    methods: {
        changeActive(index) {
            this.active = index;
            let newPath = this.asideList[this.active][0].uri;
            this.defaultActive = newPath;
            this.$router.push(newPath);
        }
    }
};
</script>
<style lang="scss" scoped>
.app-container {
    position: relative;
    width: 100%;
    height: 100%;
    .header {
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        height: 60px;
        background: #0f1623;
        color: #585e6a;
        .logo, .logo-home {
            width: 200px;
            height: 60px;
        }
        .nav-list {
            line-height: 60px;
            padding-left: 50px;
            .nav-item{
                float: left;
                padding: 0 12px;
                cursor: pointer;
                &.active {
                    color: #fff;
                    background: $lightBlue;
                }
            }
        }
    }
    .aside {
        position: absolute;
        top: 60px;
        left: 0px;
        bottom: 0px;
        width: 200px;
        background: #232e44;
    }
    .content {
        position: absolute;
        top: 60px;
        left: 200px;
        right: 0px;
        bottom: 0px;
        overflow: scroll;
        padding: 20px;
        background: #1a2233;
    }
}
.el-menu {
    border-right: none;
}
.aside-list {
    .el-menu-item.is-active {
        background: #0a1730!important;
    }
}

</style>
