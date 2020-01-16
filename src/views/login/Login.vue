<template>
  <div class="login">
    <div class="logo">
      <img src="~assets/img/logo.png" />
    </div>
    <el-form :model="loginForm" ref="loginForm" class="login-form">
      <el-form-item>
        <el-input v-model="loginForm.username">
            <i slot="prefix" class="el-input__icon iconfont icon-user"></i>
        </el-input>
      </el-form-item>
      <el-form-item>
        <el-input v-model="loginForm.password">
            <i slot="prefix" class="el-input__icon iconfont icon-3702mima"></i>
        </el-input>
      </el-form-item>
      <el-form-item class="login-button">
        <el-button type="primary">登录</el-button>
        <el-button>重置</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
export default {
  name: "Login",
  data() {
    return {
      loginForm: {
        username: "",
        password: ""
      }
    };
  }
};
</script>

<style lang="scss" scoped>
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
    .login-button{
        display: flex;
        justify-content: flex-end;
    }
  }
}
</style>
