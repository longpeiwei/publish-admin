<template>
  <div class="login-container">
    <!--
        手动触发表单验证
        1 给 el-form 设置 ref 起个名字（名字不要重复
        2 通过 ref 获得 el-form 组件， 调用组件的 validate 进行验证
    -->
    <el-form class="login-form" ref="login-form" :model="user" :rules="formRules">
      <el-form-item prop="mobile">
        <el-input
          v-model="user.mobile"
          placeholder="请输入手机号"
        ></el-input>
      </el-form-item>
      <el-form-item prop="password">
        <el-input
          v-model="user.password"
          placeholder="请输入密码"
        ></el-input>
      </el-form-item>
      <el-form-item prop="agree">
        <el-checkbox
          v-model="user.agree"
        >我已阅读并同意用户协议和隐私条款</el-checkbox>
      </el-form-item>
      <el-form-item>
        <el-button
          :loading="loginLoading"
          type="primary"
          @click="onSubmit"
          class="login-btn"
        >登录</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import { apiLogin } from '@/util/request'

export default {
  name: 'LoginIndex',
  data () {
    return {
      user: {
        mobile: '',
        password: '',
        agree: false
      },
      loginLoading: false,
      formRules: {
        mobile: [
          { required: true, message: '请输入手机号码', trigger: 'change' }
          // { pattern: /^1[3|5|7|8|9]\d{9}$/, message: '手机格式错误', trigger: 'change' }
        ],
        password: [
          { required: true, message: '密码不能为空', trigger: 'change' }
        ],
        agree: [
          {
            validator: (rule, value, callback) => {
              if (value) {
                callback()
              } else {
                callback(new Error('请勾选用户协议'))
              }
            }
          }
        ]
      }
    }
  },
  methods: {
    async onSubmit () {
      this.$refs['login-form'].validate((valid, err) => {
        // valid为false则验证不通过
        // console.log(valid)
        if (!valid) {
          return
        }
        this.login()
      })
    },
    async login () {
      this.loginLoading = true
      const user = this.user
      const { data } = await apiLogin(user)
      if (data.errno === -1) {
        this.loginLoading = false
        return this.$message.error('登录失败，手机号或密码错误')
      }
      this.$message.success('登录成功')
      this.loginLoading = false
      window.localStorage.setItem('user', JSON.stringify(data.data[0]))
      this.$router.push({ path: '/' })
    }
  }
}
</script>

<style scoped lang="less">
.login-container {
  position: fixed;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  background: url("./login_bg2.jpg") no-repeat;
  background-size: cover;
  .login-form {
    background-color: #fff;
    padding: 50px 50px 28px;
    min-width: 300px;
    border-radius: 10px;
    opacity: .95;
  }
  .login-btn {
    width: 100%;
  }
}
</style>
