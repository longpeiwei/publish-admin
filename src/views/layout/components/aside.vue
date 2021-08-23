<template>
  <el-menu
    class="nav-menu"
    default-active="/"
    background-color="#545c64"
    text-color="#fff"
    active-text-color="#ffd04b"
    router
    :collapse="isCollapse"
  >
    <el-menu-item index="/">
      <i class="el-icon-s-home"></i>
      <span slot="title">首页</span>
    </el-menu-item>
    <el-menu-item index="/article">
      <i class="el-icon-document"></i>
      <span slot="title">内容管理</span>
    </el-menu-item>
    <el-menu-item index="/image">
      <i class="iconfont icon-image"></i>
      <span slot="title">素材管理</span>
    </el-menu-item>
    <el-menu-item index="/publish">
      <i class="iconfont icon-publish"></i>
      <span slot="title">发布文章</span>
    </el-menu-item>
    <el-menu-item index="/comment">
      <i class="iconfont icon-commentdots-fill"></i>
      <span slot="title">评论管理</span>
    </el-menu-item>
    <!-- <el-menu-item index="7">
      <i class="icon-fans iconfont"></i>
      <span slot="title">粉丝管理</span>
    </el-menu-item> -->
    <el-menu-item index="/settings">
      <i class="el-icon-setting"></i>
      <span slot="title">个人设置</span>
    </el-menu-item>
  </el-menu>
</template>

<script>
export default {
  name: 'AppAside',
  props: ['is-collapse'],
  data () {
    return {
    }
  },
  created () {},
  methods: {
  }
}
</script>

<style scoped lang="less">
.nav-menu{
  .iconfont {
    margin-right: 9px;
    padding-left: 5px;
  }
}
</style>
