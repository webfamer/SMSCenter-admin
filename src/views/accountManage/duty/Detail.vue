<template>
  <el-dialog title="添加客户" :visible.sync="dialogVisible" width="30%" :before-close="handleClose">
    <el-form ref="form" :model="form" label-width="120px">
      <el-form-item label="职务名称">
        <el-input v-model="form.name"></el-input>
      </el-form-item>
      <el-form-item label="部门描述">
        <el-input type="textarea"
  :rows="2"
  placeholder="请输入描述信息"
  v-model="textarea"></el-input>
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button   @click="dialogVisible = false" >取消</el-button>
      <el-button type="primary" @click="dialogVisible = false" >保存</el-button>
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