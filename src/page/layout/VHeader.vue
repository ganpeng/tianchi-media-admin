<!--页头组件-->
<template>
    <div class="container">
        <div class="hamburger-box">
            <hamburger
                :isActive="isActive"
                :toggleClick="toggleAside">
            </hamburger>
        </div>
        <div class="info">
            <el-button type="text" class="site-name">{{siteName ? siteName:'站点未配置'}}</el-button>
            <div class="avatar-box">
                <svg-icon
                    icon-class="avatar_default"
                    class-name="avatar_default">
                </svg-icon>
            </div>
            <label>您好，{{name}}</label>
            <span @click="logout">退出</span>
        </div>
    </div>
</template>

<script>

    import Hamburger from 'sysComponents/custom_components/custom/Hamburger';
    import Cookies from 'js-cookie';

    export default {
        name: 'VHeader',
        components: {
            Hamburger
        },
        data() {
            return {
                siteName: '',
                isActive: true,
                name: ''
            };
        },
        created() {
            this.init();
        },
        methods: {
            init() {
                this.name = Cookies.get('name');
                this.siteName = this.$wsCache.localStorage.get('siteInfo').siteName;
                // 初始化站点名称
            },
            // 切换侧边栏
            toggleAside() {
                this.isActive = !this.isActive;
                this.$emit('toggleAside', this.isActive);
            },
            logout() {
                this.$store.dispatch('user/logout', true);
            }
        }
    };
</script>

<style scoped lang="scss">

    .container {
        padding-right: 20px;
        display: flex;
        background: white;
        justify-content: space-between;
        align-items: center;
        height: 64px;
    }

    .info {
        display: flex;
        justify-content: space-between;
        align-items: center;
        .avatar-box {
            margin-right: 14px;
            height: 45px;
            width: 45px;
            border-radius: 45px;
        }
        label {
            margin-right: 32px;
        }
        span {
            color: $baseBlue;
            cursor: pointer;
        }
    }

</style>

<style lang="scss">

    .hamburger-box {
        display: flex;
        align-items: center;
        padding: 0 20px;
        height: 100%;
        fill: $grayLineColor;
    }

    .avatar_default {
        width: 45px !important;
        height: 45px !important;
    }

    .site-name {
        margin-right: 20px;
    }

</style>
