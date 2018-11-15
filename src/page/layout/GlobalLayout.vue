<template>
    <div class="app-container">
        <div v-show="showHeaderAndAside" class="header clearfix">
            <div class="logo float-left">
                <svg-icon
                    icon-class="logo_home"
                    class-name="logo-home">
                </svg-icon>
            </div>
            <ul class="nav-list clearfix float-left">
                <li v-if="index !== navList.length - 1" v-for="(item, index) in navList" :key="index"
                    :class="['nav-item', active === index ? 'active' : '']"
                    @click="changeActive(index)"
                >
                    {{item}}
                </li>
            </ul>
            <div @click="changeActive(navList.length - 1)" class="user-info float-right clearfix">
                <svg-icon
                    icon-class="avatar_default"
                    class-name="avatar_default">
                </svg-icon>
                <label>您好，小盆友</label>
                <span class="logout" @click="logout">&nbsp;退出</span>
            </div>
        </div>
        <div v-show="showHeaderAndAside" class="aside">
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
        <div :style="contentStyleStr()" class="content">
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
            minHeight: 400,
            top: 60,
            left: 200,
            showHeaderAndAside: true
        };
    },
    mounted() {
        let content = document.querySelector('.content');
        content.addEventListener('scroll', this.toggleFixedBtnContainer.bind(this), false);
    },
    created() {
        let {active, activePath} = this.getActivePath();
        this.active = active;
        this.defaultActive = activePath;

        this.setMinHeight();
        window.addEventListener('resize', this.setMinHeight, false);

        this.hideHeaderAndAside();
    },
    methods: {
        contentStyleStr() {
            return `top: ${this.top}px;left: ${this.left}px;`;
        },
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
                        console.log(leftPart);
                        console.log(uri.split('/')[1]);
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
            let minHeight = window.innerHeight - 60;
            this.minHeight = minHeight;
        },
        logout() {
            this.$store.dispatch('user/logout', true);
        },
        hideHeaderAndAside() {
            let allowList = ['ProgrammeImport', 'PersonImport', 'LiveChannelImport', 'VideoImport'];
            let {name} = this.$route;
            if (allowList.indexOf(name) > -1) {
                this.top = 0;
                this.left = 0;
                this.showHeaderAndAside = false;
            } else {
                this.top = 60;
                this.left = 200;
                this.showHeaderAndAside = true;
            }
        },
        toggleFixedBtnContainer() {
            let content = document.querySelector('.content');
            let fixedBtnContainer = document.querySelector('.fixed-btn-container');
            let isBottom = content.scrollHeight - content.scrollTop === content.clientHeight;
            if (fixedBtnContainer) {
                if (isBottom) {
                    fixedBtnContainer.style.background = 'transparent';
                } else {
                    fixedBtnContainer.style.background = '#293550';
                }
            }
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
            position: relative;
            align-items: center;
            width: 160px;
            height: 60px;
            line-height: $headerHeight;
            margin-right: 20px;
            cursor: pointer;
            .avatar_default {
                position: absolute;
                top: 50%;
                left: 0;
                transform: translateY(-50%);
                width: 40px;
                height: 40px;
                z-index: 10;
            }
            label {
                position: absolute;
                top: 50%;
                left: 0;
                transform: translateY(-50%);
                width: 120px;
                height: 40px;
                line-height: 40px;
                border-radius: 20px;
                background: $mainColor;
                font-size: 14px;
                color: #fff;
                text-align: center;
                text-indent: 40px;
                cursor: pointer;
            }
            .logout {
                position: absolute;
                top: 50%;
                right: 0;
                transform: translateY(-50%);
                color: #fff;
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
