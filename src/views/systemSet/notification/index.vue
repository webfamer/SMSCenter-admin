<template>
  <div class="content">
    <el-card class="box-card noteCard">
      <div slot="header" class="clearfix">
        <p class="title"><i class="el-icon-menu"></i>全局设置提醒</p>
      </div>
      <div>
        <el-form ref="form" :model="form" label-width="120px">
          <el-form-item label="服务到期提醒：">
            <el-checkbox v-model="checked1">到期前2周</el-checkbox>
            <el-checkbox v-model="checked2">到期前1周</el-checkbox>
            <el-checkbox v-model="checked2">到期当天</el-checkbox>
          </el-form-item>
          <el-form-item label="服务变更提醒："> </el-form-item>
          <el-form-item label="开通/关闭：">
            <el-radio v-model="radio" label="1">提醒</el-radio>
            <el-radio v-model="radio" label="2">不提醒</el-radio>
          </el-form-item>
          <el-form-item label="续期提醒：">
            <el-radio v-model="radio" label="1">提醒</el-radio>
            <el-radio v-model="radio" label="2">不提醒</el-radio>
          </el-form-item>
        </el-form>
      </div>
      <el-row style="margin-top:30px;">
        <el-col :span="8" :offset="2">
          <el-button type="primary" icon="el-icon-success">保存</el-button>
        </el-col>
      </el-row>
    </el-card>
  </div>
</template>

<script>
export default {
  data() {
    return {
      form: {}
    };
  }
};
</script>

<style lang="scss" scoped>
.content {
  box-sizing: border-box;
  margin: 30px;
  .noteCard{
  .title {
    color: #666666;
    font-size: 20px;
  }
  /deep/.el-card__body {
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
  }
  }

}
</style>
