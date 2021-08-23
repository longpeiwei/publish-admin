<template>
  <div class="publish-container">
    <el-card class="filter-card">
      <div slot="header" class="clearfix">
        <!-- 面包屑 -->
        <el-breadcrumb separator-class="el-icon-arrow-right">
          <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
          <el-breadcrumb-item>发布文章</el-breadcrumb-item>
        </el-breadcrumb>
      </div>
      <!-- 中间表单区域 -->
      <el-form ref="publish-form" label-width="60px" size="small" :rules="formRules" :model="article">
        <el-form-item label="标题" prop="title">
          <el-input v-model="article.title" placeholder="请输入标题"></el-input>
        </el-form-item>
        <el-form-item label="内容" prop="content" @blur="onBlur">
          <el-tiptap
            v-model="article.content"
            :extensions="extensions"
            height="400"
            placeholder="请输入文章内容"
          >
          </el-tiptap>
        </el-form-item>
        <el-form-item label="封面">
          <el-radio-group v-model="article.cover.type" class="radio_group">
            <el-radio :label="1">单图</el-radio>
            <el-radio :label="3">三图</el-radio>
            <el-radio :label="0">无图</el-radio>
          </el-radio-group>
          <br/>
          <!--
            给事件处理函数传了自定义的参数以后，就无法得到原本的那个参数

            解决： 手动加 $event 代表事件本身的参数
            -->
          <template v-if="article.cover.type > 0">
            <!-- <UploadCover
              :key="index"
              v-for="(cover, index) in Number(article.cover.type)"
              :cover-image="article.cover.images[index]"
              @update-cover="onUpdateCover(index, $event)"
            /> -->
           <UploadCover
              class="each_cover"
              :key="index"
              v-for="(cover, index) in Number(article.cover.type)"
              v-model="article.cover.images[index]"
            />
          </template>
        </el-form-item>
        <el-form-item label="频道" prop="channelId">
          <el-select v-model="article.channelId" placeholder="请选择频道">
            <el-option
              :label="channel.name"
              :value="channel.id"
              v-for="(channel, index) in channels"
              :key="index"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item size="small">
          <el-button type="primary" @click="onSubmit(false)">发布</el-button>
          <el-button @click="onSubmit(true)">存入草稿</el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script>
import UploadCover from './components/upload-cover.vue'
import {
  getchannels,
  postArticle,
  getArticleById,
  upadteArticle,
  uploadImage
} from '@/util/request'
import {
  ElementTiptap,
  Image,
  Doc,
  Text,
  Paragraph,
  Heading,
  Bold,
  Underline,
  Italic,
  Strike,
  ListItem,
  BulletList,
  OrderedList,
  CodeBlock,
  HorizontalRule,
  Fullscreen,
  TextColor
} from 'element-tiptap'

export default {
  name: 'PublishIndex',
  components: {
    'el-tiptap': ElementTiptap,
    UploadCover
  },
  data () {
    return {
      article: {
        title: '',
        content: '',
        cover: {
          type: 0,
          images: []
        },
        channelId: null
      },
      channels: [],
      formRules: {
        title: [
          { required: true, message: '请输入文章标题', trigger: 'blur' },
          { min: 5, max: 30, message: '长度在 5 到 30 个字符之间', trigger: 'blur' }
        ],
        content: [
          {
            validator (rule, value, callback) {
              if (value === '<p></p>') {
                // 验证失败 富文本无内容时 value 默认为<p></p>
                callback(new Error('请输入文章内容'))
              } else {
                callback()
              }
            }
          },
          { required: true, message: '请输入文章内容', trigger: 'blur' }
        ],
        channelId: [
          { required: true, message: '请选择文章所在频道' }
        ]
      },
      extensions: [
        new Doc(),
        new Image({
          // 把base64的图片传到服务端 返回一个地址
          uploadRequest (file) {
            const fd = new FormData()
            fd.append('avatar', file)
            return uploadImage(fd).then(data => {
              return data.data.path
            })
            // return ''
          }
        }),
        new Text(),
        new Paragraph(),
        new Heading({ level: 5 }),
        new Bold({ bubble: true }), // render command-button in bubble menu.
        new Underline({ bubble: true, menubar: true }), // render command-button in bubble menu but not in menubar.
        new Italic(),
        new Strike(),
        new ListItem(),
        new BulletList(),
        new OrderedList(),
        new CodeBlock(),
        new HorizontalRule(), // 分割线
        new Fullscreen(),
        new TextColor()
      ]
    }
  },
  created () {
    this.loadChannel()

    if (this.$route.query.id) {
      this.loadArticle()
    }
  },
  methods: {
    async onSubmit (isDraft) {
      this.$refs['publish-form'].validate(async valid => {
        if (!valid) {
          return false
        } else {
          const articleId = this.$route.query.id
          if (articleId) {
            const { data } = await upadteArticle(articleId, {
              article: {
                title: this.article.title,
                content: this.article.content,
                cover: {
                  type: this.article.cover.type,
                  images: this.article.cover.images
                },
                type_id: this.article.channelId,
                aut_id: JSON.parse(localStorage.getItem('user')).id,
                aut_name: JSON.parse(localStorage.getItem('user')).name
              }
            }, isDraft)
            if (data.errno === 0) {
              this.$message({
                message: '操作成功',
                type: 'success'
              })
              this.article.content = ''
              this.article.title = ''
              this.article.channelId = null
            }
          } else {
            const { data } = await postArticle({
              article: {
                title: this.article.title,
                content: this.article.content,
                cover: {
                  type: this.article.cover.type,
                  images: this.article.cover.images
                },
                type_id: this.article.channelId,
                aut_id: JSON.parse(localStorage.getItem('user')).id,
                aut_name: JSON.parse(localStorage.getItem('user')).name
              }
            }, isDraft)
            if (data.errno === 0) {
              this.$message({
                message: '操作成功',
                type: 'success'
              })
              this.article.content = ''
              this.article.title = ''
            }
          }
        }
      })
    },
    async loadChannel () {
      const { data } = await getchannels()
      this.channels = data.data
      console.log(this.channels)
    },
    async loadArticle () {
      console.log(1)
      const { data } = await getArticleById(this.$route.query.id)
      this.article.title = data.data[0].title
      this.article.content = data.data[0].content
      this.article.channelId = data.data[0].type_id
      this.article.cover = data.data[0].cover
      console.log(data.data[0].cover)
    },
    onBlur () {
      console.log('blur')
    },
    onUpdateCover (index, url) {
      // console.log('onUpdateCover', index, url)
      this.article.cover.images[index] = url
    }
  }
}
</script>

<style scoped lang="less">
.each_cover{
  display: inline-block;
  margin-right: 10px;
  margin-top: 10px;
}
</style>
