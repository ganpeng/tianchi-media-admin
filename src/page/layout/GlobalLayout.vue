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
            <div class="user-info float-right clearfix">
                <div class="avatar-box float-left">
                    <svg-icon
                        icon-class="avatar_default"
                        class-name="avatar_default">
                    </svg-icon>
                </div>
                <label class="float-left">您好，小盆友</label>
                <span class="float-left" @click="logout">&nbsp;退出</span>
            </div>
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
            <div class="content-wrapper" :style="`min-height: ${minHeight}px`">
                <router-view></router-view>
            </div>
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
            defaultActive: '',
            minHeight: 400
        };
    },
    mounted() {
        let content = document.querySelector('.content');
        content.addEventListener('scroll', (e) => {
            let fixedBtnContainer = document.querySelector('.fixed-btn-container');
            let isBottom = content.scrollHeight - content.scrollTop === content.clientHeight;
            if (fixedBtnContainer) {
                if (isBottom) {
                    fixedBtnContainer.style.background = 'transparent';
                } else {
                    fixedBtnContainer.style.background = '#293550';
                }
            }
        }, false);
    },
    created() {
        let {active, activePath} = this.getActivePath();
        this.active = active;
        this.defaultActive = activePath;
    },
    methods: {
        getActivePath() {
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
            return {active, activePath};
        },
        changeActive(index) {
            this.active = index;
            let newPath = this.asideList[this.active][0].uri;
            this.defaultActive = newPath;
            this.$router.push(newPath);
        },
        setMinHeight() {
            let minHeight = window.innerHeight - 60 - 65;
            this.minHeight = minHeight;
        },
        logout() {
            this.$store.dispatch('user/logout', true);
        },
        bodyScrollHandler(e) {
            console.log(this.checkIsBottom());
            if (this.checkIsBottom()) {
                console.log('aaaa');
            }
        },
        checkIsBottom() {
            let body = document.querySelector('body');
            return body.scrollHeight - body.scrollTop === body.clientHeight;
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
        height: $headerHeight;
        background: $headerBg;
        color: #585e6a;
        .logo, .logo-home {
            width: 200px;
            height: $headerHeight;
        }
        .nav-list {
            line-height: $headerHeight;
            padding-left: 50px;
            .nav-item{
                float: left;
                padding: 0 12px;
                cursor: pointer;
                font-size: 20px;
                color: #6F7480;
                &.active {
                    color: #fff;
                    background: $mainColor;
                }
            }
        }
        .user-info {
            line-height: $headerHeight;
            margin-right: 20px;
            .avatar_default {
                width: 40px;
                height: 40px;
                margin: 10px 10px 0 0;
            }
            span {
                cursor: pointer;
            }
        }
    }
    .aside {
        position: absolute;
        top: $headerHeight;
        left: 0px;
        bottom: 0px;
        width: 200px;
        background-image: linear-gradient(-90deg, #152036 0%, #252F46 100%);
    }
    .content {
        position: absolute;
        top: $headerHeight;
        left: 200px;
        right: 0px;
        bottom: 0px;
        overflow: scroll;
        background: $contentBg;
        .content-wrapper {
            padding: 20px 20px 100px 20px;
        }
    }
}
.el-menu {
    border-right: none;
}
.aside-list {
    .el-menu-item {
        font-size: 20px;
        color: #6F7480;
        &.is-active {
            background: #0A1730!important;
            border-left: 4px solid $mainColor;
        }
    }
}
</style>
