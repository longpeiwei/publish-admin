<template>
  <div class="image-container">
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <el-breadcrumb separator-class="el-icon-arrow-right">
          <el-breadcrumb-item to="/">首页</el-breadcrumb-item>
          <el-breadcrumb-item>素材管理</el-breadcrumb-item>
        </el-breadcrumb>
      </div>
      <div class="radio_div">
        <el-radio-group
          v-model="radio1"
          size="small"
        >
          <el-radio-button label="全部"></el-radio-button>
          <el-radio-button label="收藏"></el-radio-button>
        </el-radio-group>
        <el-button
          size="small"
          type="success"
          @click="openDialog"
        >上传素材</el-button>
      </div>

      <!-- 素材列表 -->
      <el-row :gutter="10" >
        <el-col
          :xs="12"
          :sm="6"
          :md="6"
          :lg="4"
          v-for="(image, index) in imgList"
          :key=index
        >
          <el-image
            style="height: 100px"
            :src="image.imgcol"
            fit="cover"
          ></el-image>
        </el-col>
      </el-row>
    </el-card>

    <el-dialog
      title="上传素材"
      :visible.sync="dialogTableVisible"
      :append-to-body="true"
    >
      <el-upload
        class="upload-demo"
        drag
        action="http://localhost:8080/load/avatar"
        :header="uploadHeaders"
        multiple
        name="avatar"
        :on-success="onUploadSuccess"
        :http-request="afterLoading"
      >

        <i class="el-icon-upload"></i>
        <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
        <div class="el-upload__tip" slot="tip">只能上传jpg/png文件，且不超过500kb</div>
      </el-upload>
    </el-dialog>
  </div>
</template>

<script>
import { getAllImages, uploadImage } from '@/util/request'

export default {
  name: 'ImageIndex',
  data () {
    const user = JSON.parse(window.localStorage.getItem('user'))
    return {
      radio1: '全部',
      imgList: [],
      dialogTableVisible: false,
      uploadHeaders: {
        Authorization: `Bearer ${user.token}`
      }
    }
  },
  created () {
    this.loadAllImages()
  },
  methods: {
    async loadAllImages () {
      const { data } = await getAllImages()
      this.imgList = data.data
      console.log(this.imgList)
    },
    openDialog () {
      this.dialogTableVisible = true
    },
    onUploadSuccess () {
    },
    async afterLoading () {
      await uploadImage()
    }
  }
}
</script>

<style scoped lang="less">
.radio_div{
  padding-bottom: 20px;
  display: flex;
  justify-content: space-between;
}
</style>
