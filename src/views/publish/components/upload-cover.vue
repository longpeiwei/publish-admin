<template>
  <div class="upload-cover" @click="showDialog">
    <div class="cover-wrap">
      <img class="cover-image" :src="value" alt="" ref="cover-image" />
      <div class="plus_icon">+</div>
    </div>

    <el-dialog
      title="提示"
      :visible.sync="dialogVisible"
      width="50%"
      :append-to-body="true"
    >
      <el-tabs v-model="activeName" type="card">
        <el-tab-pane label="素材库" name="first">
          <div class="radio_div">
            <el-radio-group v-model="radio1" size="small">
              <el-radio-button label="全部"></el-radio-button>
              <el-radio-button label="收藏"></el-radio-button>
            </el-radio-group>
          </div>

          <!-- 素材列表 -->
          <el-row :gutter="10" class="img_container">
            <el-col
              class="father_col"
              :xs="12"
              :sm="6"
              :md="6"
              :lg="4"
              v-for="(image, index) in imgList"
              :key="index"
              @click.native="selected = index"
            >
              <el-image
                :class="{'img_item': index == selected, 'img_item_ness' : true}"
                :src="image.imgcol"
                fit="cover"
              ></el-image>
              <div
                :class="{'selected': index == selected}"
              ></div>
            </el-col>
          </el-row>
        </el-tab-pane>
        <el-tab-pane label="本地上传" name="second">
          <input type="file" @change="onFileChange" ref="file" />
          <img src="" class="preview_img" alt="" ref="preview-image" />
        </el-tab-pane>
      </el-tabs>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="onCoverConfirm">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { uploadImage, getAllImages } from '@/util/request'

export default {
  name: 'UploadCover',
  // props: ['cover-image'],
  props: ['value'],
  data () {
    return {
      dialogVisible: false,
      activeName: 'first',
      radio1: '全部',
      imgList: [],
      selected: -1
    }
  },
  created () {
    this.loadAllImages()
  },
  methods: {
    showDialog () {
      this.dialogVisible = true
    },
    onFileChange () {
      const file = this.$refs.file.files[0]
      const blob = window.URL.createObjectURL(file)
      this.$refs['preview-image'].src = blob
    },
    async onCoverConfirm () {
      if (this.activeName === 'second') {
        const file = this.$refs.file.files[0]
        if (!file) {
          return this.$message('请选择文件')
        }
        const fd = new FormData()
        fd.append('avatar', file)
        const { data } = await uploadImage(fd)
        console.log(data)
        this.dialogVisible = false
        this.$refs['cover-image'].src = data.path
        // 把url传到父组件并添加到数组中
        // this.$emit('update-cover', data.path)
        this.$emit('input', data.path)
      } else if (this.activeName === 'first') {
        if (this.selected < 0) {
          return this.$message('请选择封面图片')
        }
        this.dialogVisible = false
        this.$emit('input', this.imgList[this.selected].imgcol)
      }
    },
    async loadAllImages () {
      const { data } = await getAllImages()
      this.imgList = data.data
      console.log(this.imgList)
    }
    // doSelect (index) {
    //   this.selected = index
    //   console.log(index)
    // }
  }
}
</script>

<style scoped lang="less">
.cover-wrap {
  width: 150px;
  height: 120px;
  border: 1px solid #f2f2f2;
  position: relative;
  .cover-image {
    height: 120px;
    // max-width: 100%;
    width: 100%;
  }
  .plus_icon{
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    font-size: 35px;
    color: #f3f3f3;
  }
}
.preview_img {
  width: 100px;
}
.selected {
  height: 25px;
  width: 25px;
  background: url('./image/select.png') no-repeat;
  background-size: 25px 25px;
  // height: 100px;
  // background-size: cover;
  position: absolute;
  right: 0;
  top: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 50%;
}
.father_col {
  position: relative;
  .img_item {
    opacity: .3;
  }
  .img_item_ness{
    height: 100px;
  }
}
.img_container{
  margin-top: 10px;
  height: 250px;
  overflow-y: auto;
}
</style>
