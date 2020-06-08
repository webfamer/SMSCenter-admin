<template>
  <div class="login-container">
    <el-form
      ref="loginForm"
      :model="loginForm"
      :rules="loginRules"
      class="login-form"
      auto-complete="on"
      label-position="left"
    >
      <div class="title-container">
        <div class="logo">
          <img src="../../assets/img/logo.png" alt="" />
        </div>
        <h3 class="title">中控平台</h3>
        <p class="e-name">Control Platform</p>
      </div>
      <el-form-item prop="phone" v-if="showVerify">
        <span class="svgBox">
          <svg-icon :icon-class="svgName" class="svgPic" />
        </span>
        <span class="select-input">
          <el-select
            v-model="select"
            slot="prepend"
            placeholder="请选择"
            size="mini"
            @change="changeSvgPic"
          >
            <el-option label="+86" value="CN">
              <svg-icon icon-class="china" />
              <span>中国</span>
            </el-option>
            <el-option label="+91" value="IN">
              <svg-icon icon-class="india" />
              <span>印度</span>
            </el-option>
          </el-select>
        </span>
        <el-input
          ref="phone"
          v-model="loginForm.phone"
          placeholder="phone"
          name="phone"
          type="text"
          tabindex="1"
          auto-complete="on"
        />
      </el-form-item>
      <el-form-item prop="username" v-else>
        <span class="svg-container">
          <svg-icon icon-class="user" />
        </span>
        <el-input
          ref="username"
          v-model="loginForm.username"
          placeholder="Username"
          name="username"
          type="text"
          tabindex="1"
          auto-complete="on"
        />
      </el-form-item>
      <el-form-item prop="password" v-if="!showVerify">
        <span class="svg-container">
          <svg-icon icon-class="password" />
        </span>
        <el-input
          :key="passwordType"
          ref="password"
          v-model="loginForm.password"
          :type="passwordType"
          placeholder="Password"
          name="password"
          tabindex="2"
          auto-complete="on"
          @keyup.enter.native="handleLogin"
        />
        <span class="show-pwd" @click="showPwd">
          <svg-icon
            :icon-class="passwordType === 'password' ? 'eye' : 'eye-open'"
          />
        </span>
      </el-form-item>
      <el-form-item prop="verificationCode" v-if="showVerify">
        <span class="svg-container">
          <svg-icon icon-class="verifyCode" />
        </span>
        <el-input
          ref="verificationCode"
          v-model="loginForm.verificationCode"
          placeholder="Verifycation Code"
          name="verificationCode"
          type="text"
          tabindex="3"
          auto-complete="on"
        />
        <span class="sendVerify" @click="getVerifyCode" v-if="countNum == 60">
          OTP
        </span>
        <span class="sendVerify" ref="verifyCode" v-else>
          {{ countNum }}s
        </span>
      </el-form-item>
      <el-button
        :loading="loading"
        type="primary"
        style="width:100%;margin-bottom:30px;"
        @click.native.prevent="handleLogin"
        >Login</el-button
      >
      <el-button
        type="text"
        style="width:100%;margin-bottom:30px;"
        @click.native.prevent="toggleVerifyInput"
        >{{ toggleTips }}</el-button
      >
      <!-- <div class="tips">
        <span style="margin-right:20px;">username: admin</span>
        <span> password: any</span>
      </div> -->
    </el-form>
  </div>
</template>

<script>
import { validUsername } from "@/utils/validate";
import { sendVerifyCode } from "@/api/user.js";
export default {
  name: "Login",
  data() {
    const validateUsername = (rule, value, callback) => {
      if (!validUsername(value)) {
        callback(new Error("Please enter the correct user name"));
      } else {
        callback();
      }
    };
    const validatePassword = (rule, value, callback) => {
      if (value.length < 6) {
        callback(new Error("The password can not be less than 6 digits"));
      } else {
        callback();
      }
    };
    return {
      loginForm: {
        username: "",
        password: "",
        verificationCode: "",
        phone: ""
      },
      select: "CN",
      svgName: "china",
      countNum: 60,
      showVerify: false,
      toggleTips: "Switch to SMS login >>",
      loginRules: {
        username: [{ required: true, trigger: "blur" }],
        phone: [{ required: true, trigger: "blur" }],
        password: [
          { required: true, trigger: "blur", validator: validatePassword }
        ],
        verificationCode: [{ required: true, trigger: "blur" }]
      },
      loading: false,
      passwordType: "password",
      redirect: "/dashboard"
    };
  },
  watch: {
    $route: {
      handler: function(route) {
        this.redirect = route.query && route.query.redirect;
      },
      immediate: true
    }
  },
  methods: {
    showPwd() {
      if (this.passwordType === "password") {
        this.passwordType = "";
      } else {
        this.passwordType = "password";
      }
      this.$nextTick(() => {
        this.$refs.password.focus();
      });
    },
    changeSvgPic(value) {
      switch (value) {
        case "CN":
          this.svgName = "china";
          break;
        case "IN":
          this.svgName = "india";
          break;
      }
    },
    getVerifyCode() {
      sendVerifyCode({mobile:this.loginForm.phone,countryCode:this.select}).then(res => {
        console.log(res);
        if (res.code == 0) {
          this.$message({
            message: "发送成功",
            type: "success"
          });
          this.countNum -= 1;
          const time = setInterval(() => {
            this.countNum -= 1;
            if (this.countNum < 0) {
              clearInterval(time);
              this.countNum = 60;
            }
          }, 1000);
        } else {
          // this.$message.error(res.message);
        }
      });
    },
    toggleVerifyInput() {
      this.$refs["loginForm"].resetFields();
      this.showVerify = !this.showVerify;
      if (this.showVerify) {
        this.toggleTips = "Switch to Password login >>";
      } else {
        this.toggleTips = "Switch to SMS login >>";
      }
    },
    handleLogin() {
      this.$refs.loginForm.validate(valid => {
        if (valid) {
          this.loading = true;
          console.log(this.loginForm);
          let loginInfo = JSON.parse(JSON.stringify(this.loginForm));
          loginInfo.password = this.$encrypt.encodePwd(loginInfo.password);
          this.$store
            .dispatch("user/login", loginInfo)
            .then(res => {
              // if (res.code != 0) {
              //   this.$message.error(res.message);
              // }
              this.$router.push({ path: this.redirect || "/dashboard" });
              this.loading = false;
            })
            .catch(error => {
              this.loading = false;
            });
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    }
  }
};
</script>

<style lang="scss">
/* 修复input 背景不协调 和光标变色 */
/* Detail see https://github.com/PanJiaChen/vue-element-admin/pull/927 */

$bg: #283443;
$light_gray: rgb(77, 73, 73);
$cursor: #000;

@supports (-webkit-mask: none) and (not (cater-color: $cursor)) {
  .login-container .el-input input {
    color: $cursor;
  }
}

/* reset element-ui css */
.login-container {
  .logo {
    width: 100%;
    display: flex;
    justify-content: center;
    img {
      width: 150px;
      height: 120px;
      margin-bottom: 40px;
    }
  }
  .el-input {
    display: inline-block;
    height: 47px;
    width: 85%;

    input {
      background: transparent;
      border: 0px;
      -webkit-appearance: none;
      border-radius: 0px;
      padding: 12px 5px 12px 15px;
      color: $light_gray;
      height: 47px;
      caret-color: $cursor;

      &:-webkit-autofill {
        box-shadow: 0 0 0px 1000px $bg inset !important;
        -webkit-text-fill-color: $cursor !important;
      }
    }
  }

  .el-form-item {
    border: 1px solid rgba(255, 255, 255, 0.1);
    background: rgba(0, 0, 0, 0.1);
    border-radius: 5px;
    color: #454545;
  }
}
</style>

<style lang="scss" scoped>
$bg: #2d3a4b;
$dark_gray: #889aa4;
$light_gray: #0079fe;

.login-container {
  min-height: 100%;
  width: 100%;
  // background-color: $bg;
  background: url("../../assets/img/bg.png");
  overflow: hidden;

  .login-form {
    position: relative;
    width: 520px;
    max-width: 100%;
    padding: 60px 35px 0;
    margin: 200px auto;
    overflow: hidden;
    background: #fff;
  }

  .tips {
    font-size: 14px;
    color: #fff;
    margin-bottom: 10px;

    span {
      &:first-of-type {
        margin-right: 16px;
      }
    }
  }

  .svg-container {
    padding: 6px 5px 6px 15px;
    color: $dark_gray;
    vertical-align: middle;
    width: 30px;
    display: inline-block;
  }

  .title-container {
    position: relative;

    .title {
      font-size: 38px;
      color: $light_gray;
      margin: 0px auto 0px auto;
      text-align: center;
      font-weight: bold;
    }
    .e-name {
      font-size: 20px;
      margin: 10px auto 40px auto;
      text-align: center;
      color: $light_gray;
    }
  }

  .show-pwd {
    position: absolute;
    right: 10px;
    top: 7px;
    font-size: 16px;
    color: $dark_gray;
    cursor: pointer;
    user-select: none;
  }
  .sendVerify {
    position: absolute;
    right: 0px;
    padding-top: 7px;
    top: 0px;
    font-size: 16px;
    width: 50px;
    height: 100%;
    text-align: center;
    color: $dark_gray;
    background: #d7d7d7;
    cursor: pointer;
    user-select: none;
  }
  .svgBox {
    position: absolute;
    left: 5px;
    top: 15px;
    .svgPic {
      width: 26px;
      height: 30px;
    }
  }
  /deep/.select-input {
    padding: 6px 5px 6px 25px;
    color: $dark_gray;
    vertical-align: middle;
    width: 60px;
    display: inline-block;
    .el-input input {
      padding-left: 6px;
    }
    .el-select {
      width: 65px;
    }
  }
}
</style>
