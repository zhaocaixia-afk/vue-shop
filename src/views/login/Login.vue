<template>
<div class="login-container">
  <div class="login">
    <div class="logo">
      <img src="~assets/img/logo.png" />
    </div>
    <el-form :model="loginForm" :rules="rules" ref="loginForm" class="login-form">
      <el-form-item prop="username">
        <el-input v-model="loginForm.username">
          <i slot="prefix" class="el-input__icon iconfont icon-user"></i>
        </el-input>
      </el-form-item>
      <el-form-item prop="password">
        <el-input type='password' v-model="loginForm.password">
          <i slot="prefix" class="el-input__icon iconfont icon-3702mima"></i>
        </el-input>
      </el-form-item>
      <el-form-item class="login-button">
        <el-button type="primary" @click="login">登录</el-button>
        <el-button @click="resetForm">重置</el-button>
      </el-form-item>
    </el-form>
  </div>
</div>
  
</template>

<script>
import { setSession } from 'common/utils'

import { login } from "network/login"
export default {
  name: "Login",
  data() {
    return {
      // 1.表单数据
      loginForm: {
        username: "admin",
        password: "123456"
      },
      // 2.验证规则
      rules: {
        username: [
          { required: true, message: "请输入用户名", trigger: "blur" },
          { min: 5, max: 12, message: "长度在 3 到 12 个字符", trigger: "blur" }
        ],
        password: [
          { required: true, message: "请输入密码", trigger: "blur" },
          { min: 6, max: 12, message: "长度在 3 到 5 个字符", trigger: "blur" }
        ]
      }
    };
  },
  methods: {
    // 1.重置
    resetForm(){
      this.$refs.loginForm.resetFields()
    },
    // 2.点击登录
    login(){
      this.$refs.loginForm.validate(async (valid) => {
        // console.log(valid) //true or false
        if(!valid) return;
        const { data:res } = await login(this.loginForm)
        // const { data:res } = await this.$http.post('login',this.loginForm)
        // console.log(res)
        if(res.meta.status !== 200) return this.$message.error("登录失败! ")
        this.$message.success('登录成功')
        // 1.将登录成功之后的 token,保存到客户端的sessionStorage 中
        //  1.1项目中除了登录之外的其它API接口,必须在登录之后才能访问
        setSession("token",res.data.token)
        // 2.跳转到后台主页
        this.$router.push('/home')
      })
    }
  },
};
</script>

<style lang="scss" scoped>
.login-container{
  width: 100%;
  height: 100%;
  background-color: aquamarine;
  .login {
  width: 400px;
  height: 350px;
  background-color: #fff;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  .logo {
    width: 80px;
    height: 80px;
    border: 5px solid #ddd;
    border-radius: 50%;
    position: absolute;
    left: 50%;
    transform: translate(-50%, -50%);
    background-color: #eee;
    img {
      border-radius: 50%;
    }
  }
  .login-form {
    padding: 100px 20px 0 20px;
    .login-button {
      display: flex;
      justify-content: flex-end;
    }
  }
}
}

</style>
