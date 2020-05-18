<template>
  <div>
    <el-dialog title="查看秘钥" :visible.sync="dialogFormVisible">
      <div class="secret">
        <span>{{secret.clientId}}<br>{{secret.clientSecret}}</span>
 <button style="float:right" class="btn" :data-clipboard-text="'用户名:'+secret.clientId+'密码:'+secret.clientSecret">
         <i class="el-icon-document-copy"></i>
    </button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import customerApp from "@/api/custmoerApp";
import Clipboard from 'clipboard';
export default {
  data() {
    return {
      dialogFormVisible: false,
      secret: ""
    };
  },
  methods: {
    openSecretDialog(data) {
        console.log(1)
      this.dialogFormVisible = true;
      this.getSectet(data)
        console.log(2)

    },
    getSectet(data) {
      if (data) {
        customerApp
          .getCustomerSecret({
            appId: data.id
          })
          .then(res => {
            this.secret = res.data;
          });
      }
    }
  },
    mounted() {
    const clipboard = new Clipboard('.btn');
  }
};
</script>

<style lang="scss" scoped>
.secret {
  border: 1px solid #ccc;
  width: 100%;
  height: 10rem;
  box-sizing: border-box;
  padding: 30px;
}
</style>