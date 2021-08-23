<template>
  <!-- 内容管理 -->
  <div class="article-container">
    <el-card class="filter-card">
      <div slot="header" class="clearfix">
        <!-- 面包屑 -->
        <el-breadcrumb separator-class="el-icon-arrow-right">
          <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
          <el-breadcrumb-item>内容管理</el-breadcrumb-item>
        </el-breadcrumb>
      </div>
      <!-- 中间表单区域 -->
      <el-form label-width="55px" size="small">
        <el-form-item label="状态">
          <el-radio-group v-model="currentStatus">
            <el-radio :label="null">全部</el-radio>
            <el-radio :label="0">草稿</el-radio>
            <el-radio :label="1">待审核</el-radio>
            <el-radio :label="2">审核通过</el-radio>
            <el-radio :label="3">审核失败</el-radio>
            <el-radio :label="4">已删除</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="频道">
          <el-select v-model="channelId" placeholder="请选择频道">
            <el-option
              label="全部"
              value="null"
            ></el-option>
            <el-option
              :label="channel.name"
              :value="channel.id"
              v-for="(channel, index) in channels"
              :key="index"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="日期">
          <el-date-picker
            v-model="rangeDate"
            type="datetimerange"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            :default-time="['12:00:00']"
            format="yyyy-MM-dd"
            value-format="yyyy-MM-dd HH:mm:ss"
          >
          </el-date-picker>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="loadArticle()" :disabled="isLoading">check</el-button>
        </el-form-item>
      </el-form>
    </el-card>
    <!-- 数据列表 -->
    <el-card class="box-card">
      <div slot="header" class="clearfix">查询到 {{totalCount}} 条结果......</div>
      <el-table
        class="list-table"
        :data="articles"
        style="width: 100%"
        stripe
        size="small"
        v-loading="isLoading"
      >
        <el-table-column label="封面">
          <template slot-scope="scope">
            <img
              v-if="scope.row.cover.images[0]"
              :src="scope.row.cover.images[0]"
              alt=""
              class="article_cover"
            >
          <img v-else src="../article/image/noimage.png" alt="" class="article_cover">
          </template>
        </el-table-column>
        <el-table-column prop="title" label="标题"></el-table-column>
        <el-table-column prop="status" label="状态">
          <template slot-scope="scope">
            <el-tag type="warning" v-if="scope.row.status === 0">草稿</el-tag>
            <el-tag type="danger" v-if="scope.row.status === 1">待审核</el-tag>
            <el-tag type="success" v-if="scope.row.status === 2">审核通过</el-tag>
            <!-- <el-tag v-if="scope.row.status === 3">审核失败</el-tag>
            <el-tag v-if="scope.row.status === 4">已删除</el-tag> -->
          </template>
        </el-table-column>
        <el-table-column label="发布时间">
          <template slot-scope="scope">
            {{ Number(`${scope.row.pub_date}`) | datetime }}
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <!-- 如果需要自定义表格列模板，则把需要自定义的内容放到 template 里 -->
          <template slot-scope="scope">
            <el-button
              size="mini"
              circle
              icon="el-icon-edit"
              @click="$router.push('/publish?id=' + scope.row.article_id)"
            ></el-button>
            <el-button
              size="mini"
              type="danger"
              circle
              icon="el-icon-delete"
            ></el-button>
          </template>
        </el-table-column>
      </el-table>

      <!-- 分页 -->
      <el-pagination
        layout="prev, pager, next"
        :total="totalCount"
        background=""
        @current-change="onCurrentChange"
      />
    </el-card>
  </div>
</template>

<script>
import { getArticles, getchannels } from '@/util/request'

export default {
  name: 'ArticleIndex',
  data () {
    return {
      currentStatus: null,
      articles: [],
      channels: [],
      channelId: null,
      totalCount: 0,
      rangeDate: [],
      isLoading: false
    }
  },
  created () {
    this.isLoading = true
    this.loadChannel()
    this.loadArticle()
  },
  methods: {
    onSubmit () {
      console.log('submit!')
    },
    async loadArticle (page = 1) {
      this.isLoading = true
      const { data } = await getArticles(
        {
          curPage: page,
          pageSize: 10,
          status: this.currentStatus,
          channel_id: this.channelId,
          begin_date: this.rangeDate ? new Date(this.rangeDate[0]).getTime() : NaN,
          end_date: this.rangeDate ? new Date(this.rangeDate[1]).getTime() : NaN
        }
      )
      console.log(data)
      this.articles = data.data.data
      this.totalCount = data.data.count
      this.isLoading = false
    },
    async loadChannel () {
      const { data } = await getchannels()
      this.channels = data.data
      console.log(this.channels)
    },
    onCurrentChange (page) {
      console.log(page)
      this.loadArticle(page)
    }
  }
}
</script>

<style scoped lang="less">
.filter-card {
  margin-bottom: 30px;
}
.list-table {
  margin-bottom: 20px;
}
.article_cover{
  width: 90px;
  max-height: 80px;
  background-size: cover;
}
</style>
