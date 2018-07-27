<!--页头组件-->
<template>
    <div class="container">
        <hamburger
            :isActive="isActive"
            :toggleClick="toggleAside">
        </hamburger>
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
                this.$store.dispatch('user/logout');
            }
        }
    };
</script>

<style scoped lang="scss">

    .container {
        padding: 0 20px;
        display: flex;
        justify-content: space-between;
        align-items: center;
        height: 100%;
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
