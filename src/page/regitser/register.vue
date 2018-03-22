<template>
    <div class="hello">
        <h1>{{ msg }}</h1>
        <el-input v-model="input" placeholder="请输入内容"></el-input>
    </div>
</template>

<script>
    export default {
        name: 'login',
        data () {
            return {
                msg: 'h5-admin'
            }
        }
    }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
    div{
        width: 200px;
    }
</style>
