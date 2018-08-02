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
            <div class="avatar-box">
                <img src="~assets/img/avatar_default.png"/>
            </div>
            <label>您好，{{name}}</label>
            <span @click="logout">退出</span>
        </div>
    </div>
</template>

<script>

    import Hamburger from 'sysComponents/custom_components/widget/Hamburger';
    import Cookies from 'js-cookie';

    export default {
        name: 'VHeader',
        components: {
            Hamburger
        },
        data() {
            return {
                isActive: true,
                name: ''
            };
        },
        created() {
            this.name = Cookies.get('name');
        },
        methods: {
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
        justify-content: space-between;
        align-items: center;
        height: 62px;
        box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.20);
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
        padding: 0 20px;
        height: 100%;
        line-height: 64px;
        fill: $grayLineColor;
    }

</style>
