<template>
  <div class="settings-container">
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <el-breadcrumb separator-class="el-icon-arrow-right">
          <el-breadcrumb-item to="/">首页</el-breadcrumb-item>
          <el-breadcrumb-item>个人设置</el-breadcrumb-item>
        </el-breadcrumb>
      </div>

      <el-row>
        <el-col :span="14">
          <!-- 表单 -->
          <el-form ref="form" :model="form" label-width="80px" size="small">
            <el-form-item label="编号"> 100{{CurrUser.id}} </el-form-item>
            <el-form-item label="手机"> {{CurrUser.mobile}} </el-form-item>
            <el-form-item label="媒体名称">
              <el-input v-model="CurrUser.name"></el-input>
            </el-form-item>
            <el-form-item label="媒体介绍">
              <el-input type="textarea" v-model="CurrUser.intro"></el-input>
            </el-form-item>
            <el-form-item label="邮箱">
              <el-input v-model="CurrUser.email"></el-input>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="updateInfo">save</el-button>
            </el-form-item>
          </el-form>
        </el-col>
        <el-col :offset="3" :span="4">
          <label for="file" class="photo_label">
            <el-avatar
              shape="square"
              :size="120"
              fit="cover"
              :src="CurrUser.photo"
            ></el-avatar>
            <p>点击修改头像</p>
          </label>
          <input type="file" id="file" hidden ref="file" @change="onPhotoChange">
        </el-col>
      </el-row>
    </el-card>

    <el-dialog
      title="修改头像"
      :visible.sync="dialogVisible"
      width="30%"
      append-to-body
      @opened="onDialogOpened"
      @closed="onDialogClosed"
    >
      <div class="preview_div">
        <img
          class="preview_image"
          :src="previvwImage"
          alt=""
          ref="preview-image"
        >
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button
          type="primary"
          @click="onUpdatePhoto"
          :loading="upadtePhotoLoading"
        >确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import {
  getCurrentUser,
  uploadImage,
  updateImages,
  updateInfo
} from '@/util/request'
import 'cropperjs/dist/cropper.css'
import Cropper from 'cropperjs'

export default {
  name: 'SettingsIndex',
  data () {
    return {
      CurrUser: {},
      dialogVisible: false,
      previvwImage: '', // 预览的图片
      cropper: null,
      upadtePhotoLoading: false,
      form: {
        name: '',
        region: '',
        date1: '',
        date2: '',
        delivery: false,
        type: [],
        resource: '',
        desc: ''
      }
    }
  },
  created () {
    this.loadUser()
  },
  methods: {
    onSubmit () {
      console.log('submit!')
    },
    async loadUser () {
      const { data } = await getCurrentUser()
      this.CurrUser = data.data[0]
      console.log(this.CurrUser)
    },
    onPhotoChange () {
      // 取得选中的文件
      const file = this.$refs.file
      // window.URL.createObjectURL(file.files[0]) 把图片转成一串url地址
      const blobData = window.URL.createObjectURL(file.files[0])
      this.previvwImage = blobData
      console.log(blobData)

      // 弹出层出现 预览选择的图片
      this.dialogVisible = true

      // 解决选择相同文件不触发 change 事件问题
      this.$refs.file.value = ''
    },
    onDialogOpened () {
      // 图片裁切器必须基于 img 进行初始化
      // 注意： img 必须是可见状态才能正常完成初始化
      //        因为我们这里要在对话框里面初始化裁切器
      // 所以要调用一个对话框完全打开之后的回调来初始化
      // 获取图片dom节点
      const image = this.$refs['preview-image']

      /*
        第一次初始化好以后，如果预览裁切的图片发生了变化，
        裁切器默认不会更新
          如果需要预览图片发生变化更新裁切器的图片
              方式一： 裁切器的.replace方法
              方式二： 销毁裁切器，重新初始化
      */

      if (this.cropper) {
        this.cropper.replace(this.previvwImage)
        return
      }
      this.cropper = new Cropper(image, {
        aspectRatio: 1, // 比例
        background: false
      })
    },
    onDialogClosed () {
      // 对话框关闭，销毁裁切器  （消耗较大
      // this.cropper.destroy()
    },
    onUpdatePhoto () {
      this.upadtePhotoLoading = true
      this.cropper.getCroppedCanvas().toBlob(file => {
        // 获取裁切的图片对象
        console.log(file)
        const fd = new FormData()
        fd.append('avatar', file, 'example.png')
        uploadImage(fd).then(file => {
          const { data } = file
          console.log(data.path)
          // 请求更新用户的头像
          updateImages({ path: data.path })
          // 关闭对话框
          this.dialogVisible = false
          // 更新视图展示
          this.loadUser().then(() => {
            this.$bus.$emit('update-info', this.CurrUser)
            this.upadtePhotoLoading = false
            this.$message({
              message: '更新头像成功',
              type: 'success'
            })
          })
        })
      })
    },
    async updateInfo () {
      const { name, intro, email } = this.CurrUser
      const { data } = await updateInfo({
        name,
        intro,
        email
      })
      this.$bus.$emit('update-info', this.CurrUser)
      console.log(data)
    }
  }
}
</script>

<style scoped lang="less">
.photo_label{
  cursor: pointer;
}
.preview_div{
  .preview_image{
    display: block;
    max-width: 100%;
    height: 200px;
  }
}
</style>
