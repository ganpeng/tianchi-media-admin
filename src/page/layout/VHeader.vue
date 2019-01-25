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
            <el-button
                type="text"
                class="site-name"
                @click="toConfigSite">
                {{siteName ? siteName:'站点未配置，点击配置'}}
            </el-button>
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
                // 初始化站点名称
                this.$service.getSiteInfo().then(response => {
                    if (response && response.code === 0) {
                        this.siteName = response.data.siteName;
                        this.$wsCache.localStorage.set('siteInfo', response.data);
                    }
                });
            },
            // 切换侧边栏
            toggleAside() {
                this.isActive = !this.isActive;
                this.$emit('toggleAside', this.isActive);
            },
            logout() {
                this.$store.dispatch('user/logout', true);
            },
            // 如果是子站，点击跳转到设置子站点页面;中心站点跳转到站点列表
            toConfigSite() {
                if (this.$wsCache.localStorage.get('siteInfo') && !this.$wsCache.localStorage.get('siteInfo').siteMasterEnable) {
                    this.$router.push({name: 'ConfigSite'});
                } else {
                    this.$router.push({name: 'SiteList'});
                }
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
