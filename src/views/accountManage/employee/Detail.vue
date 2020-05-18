<template>
  <el-dialog title="添加客户" :visible.sync="dialogVisible" width="30%" :before-close="handleClose">
    <el-form ref="form" :model="form" label-width="120px">
      <el-form-item label="员工姓名">
        <el-input v-model="form.name"></el-input>
      </el-form-item>
      <el-form-item label="登录账号">
        <el-input v-model="form.name"></el-input>
      </el-form-item>
      <el-form-item label="登录密码">
        <el-input v-model="form.name" ></el-input>
      </el-form-item>
      <el-form-item label="当前职务">
        <el-select v-model="value" placeholder="请选择">
          <el-option
            v-for="item in options"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="邮箱地址">
        <el-input v-model="form.name"></el-input>
      </el-form-item>
      <el-form-item label="手机号码">
        <el-input v-model="form.name"></el-input>
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button  type="primary" @click="dialogVisible = false" icon="el-icon-check">提交</el-button>
      <el-button  @click="dialogVisible = false" icon="el-icon-refresh-right">重置</el-button>
    </span>
  </el-dialog>
</template>

<script>
export default {
  data() {
    return {
      form: {},
      dialogVisible: false
    };
  },
  methods: {
    handleClose(done) {
      this.$confirm("确认关闭？")
        .then(_ => {
          done();
        })
        .catch(_ => {});
    },
    openDialog() {
      this.dialogVisible = true;
    }
  }
};
</script>

<style lang="scss" scoped>

.el-select{
  width: 100%;
}
</style>>

</style>