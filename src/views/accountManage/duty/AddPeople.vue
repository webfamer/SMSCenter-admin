<template>
  <el-dialog title="添加客户" :visible.sync="dialogVisible" width="30%" :before-close="handleClose">
    <el-form ref="form" :model="form" label-width="120px">
      <el-form-item label="职务名称">
        <el-input v-model="form.name"></el-input>
      </el-form-item>
      <el-form-item label="添加成员">
        <el-select
    v-model="value"
    multiple
    filterable
    allow-create
    default-first-option
    placeholder="请选择文章标签">
    <el-option
      v-for="item in options"
      :key="item.value"
      :label="item.label"
      :value="item.value">
    </el-option>
  </el-select>
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
      dialogVisible: false,
       options: [{
          value: 'HTML',
          label: 'HTML'
        }, {
          value: 'CSS',
          label: 'CSS'
        }, {
          value: 'JavaScript',
          label: 'JavaScript'
        }],
        value: []
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
</style>
