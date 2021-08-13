<template>
  <el-container class="layout-container">
    <el-aside width="auto" class="aside">
      <AppAside class="aside-menu" :is-collapse="isCollapse"/>
    </el-aside>
    <el-container>
      <el-header class="header">
        <div>
          <i
            @click="isCollapse = !isCollapse"
            :class="{
              'el-icon-s-fold': isCollapse,
              'el-icon-s-unfold': !isCollapse
            }"
          ></i>
          <span>头条管理系统</span>
        </div>
        <el-dropdown>
          <div class="avatar-wrap">
            <img class="avatar" src="https://img2.baidu.com/it/u=1704219071,3761829583&fm=26&fmt=auto&gp=0.jpg" alt="">
            <span>年付费的</span>
            <i class="el-icon-arrow-down el-icon--right"></i>
          </div>
          <!-- <span>
            下拉菜单<i class="el-icon-arrow-down el-icon--right"></i>
          </span> -->
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item>setting</el-dropdown-item>
            <el-dropdown-item
              @click.native="onLogout"
            >log out</el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </el-header>
      <el-main class="main">
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
    <!-- 子路由出口 -->
    <!-- <router-view></router-view> -->
</template>

<script>
import AppAside from './components/aside.vue'
import { getCurrentUser } from '@/util/request'

export default {
  name: 'LayoutIndex',
  components: {
    AppAside
  },
  data () {
    return {
      isCollapse: false
    }
  },
  async created () {
    await getCurrentUser()
  },
  methods: {
    onLogout () {
      this.$confirm('确认退出吗？?', '退出提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        window.localStorage.removeItem('user')
        this.$router.push('/login')
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消退出'
        })
      })
    }
  }
}
</script>

<style scoped lang="less">
  .header {
    // background-color: #B3C0D1;
    background-color: #fff;
    border-bottom: #B3C0D1;
    color: #333;
    height: 60px;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  .main {
    background-color: #e9eef3;
  }
  .layout-container {
    background-color: #D3DCE6;
    color: #333;
    position: fixed;
    top: 0;
    right: 0;
    left: 0;
    bottom: 0;
  }
  .aside {
    background-color: #d3dce6;
    .aside-menu {
      height: 100%;
    }
  }
  .avatar-wrap{
    display: flex;
    align-items: center;
    .avatar {
      width: 40px;
      height: 40px;
      border-radius: 50%;
      margin-right: 10px;
    }
  }
</style>
