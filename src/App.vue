<template>
    <div id="app">
        <el-container style="height: 100%;">
            <el-container>
                <el-aside style="width: 200px; padding-top: 100px; background-color: teal;">
                    <el-menu
                        class="el-menu-vertical-demo"
                        background-color="teal"
                        text-color="#fff"
                        active-text-color="#ffd04b"
                        router
                    >
                        <el-menu-item index="/">
                            <i class="el-icon-menu"></i>
                            <span slot="title">员工列表</span>
                        </el-menu-item>
                        <el-menu-item index="/awards">
                            <i class="el-icon-menu"></i>
                            <span slot="title">奖项</span>
                        </el-menu-item>
                        <el-menu-item index="/prize">
                            <i class="el-icon-menu"></i>
                            <span slot="title">奖品</span>
                        </el-menu-item>
                        <el-menu-item index="/winlist">
                            <i class="el-icon-menu"></i>
                            <span slot="title">中奖列表</span>
                        </el-menu-item>
                    </el-menu>
                </el-aside>
                <el-main>
                    <el-header style="text-align: right;">
                        <el-button type="primary" size="default">去抽奖</el-button>
                    </el-header>
                    <router-view />
                </el-main>
            </el-container>
        </el-container>
    </div>
</template>

<style>
body, html {
  margin: 0;
  padding: 0;
}
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
  height: 100vh;
}
</style>
