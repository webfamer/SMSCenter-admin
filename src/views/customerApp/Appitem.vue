<template>
  <div class="appItem">
    <div class="item" v-for="item in appdata" :key="item.id">
      <img :src="item.picUrl" alt />
      <span>{{ item.appChiName }}</span>
      <div class="mask">
        <ul>
          <li @click="checkSecret(item)">查看秘钥</li>
          <li @click="editApp(item)">编辑</li>
          <li style="border-bottom:none;color:red" @click="delApp(item)">
            删除
          </li>
        </ul>
      </div>
    </div>
    <div class="item" @click="addApp">
      <i class="el-icon-plus"></i>
    </div>
    <ItemDetail
      ref="appItemDetail"
      :userdata="userdata"
      @getAppItem="getAppItem"
    ></ItemDetail>
    <SecretDetail ref="secretDetail"></SecretDetail>
  </div>
</template>

<script>
import ItemDetail from "./ItemDetail";
import SecretDetail from './SecretDetail'
import customerApp from "@/api/custmoerApp";
export default {
  data() {
    return {
      userdata: {},
      appdata: []
    };
  },
  methods: {
    addApp() {
      this.$refs.appItemDetail.openDialog();
    },
    checkSecret(data){
this.$refs.secretDetail.openSecretDialog(data);
    },
    editApp(data) {
      console.log(data, "渲染循环的时候数据");
      this.$refs.appItemDetail.openDialog(data);
    },
    delApp(item) {
      this.$confirm("此操作将永久删除该文件, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          customerApp
            .delApp({
              appId: item.id,
              status:99
            })
            .then(res => {
              if (res.code === 0) {
                this.$message({
                  type: "success",
                  message: "删除成功!"
                });
                this.getAppItem();
              } else {
                this.$message(res.msg);
              }
            });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除"
          });
        });
    },
    getAppItem() {
      customerApp
        .getApp({
          merchantId: this.userdata.id
        })
        .then(res => {
          if (res.code === 0) {
            this.appdata = res.data.appDetailVOS;
            console.log(this.appdata);
          } else {
            this.$message.error(res.msg);
          }
        });
    }
  },
  components: {
    ItemDetail,SecretDetail
  },
  created() {
    this.userdata = JSON.parse(localStorage.getItem("userdata"));
    this.getAppItem();
    // console.log(this.userdata,'111')
  }
};
</script>

<style lang="scss" scoped>
.appItem {
  .item {
    width: 20.666667rem;
    height: 10.666667rem;
    margin-top: 30px;
    display: flex;
    position: relative;
    overflow: hidden;
    float: left;
    justify-content: center;
    flex-direction: column;
    align-items: center;
    margin-right: 30px;
    border: 1px solid #ccc;
    &:hover .mask {
      top: 0px;
      transition: all 0.2s ease;
    }
    .mask {
      position: absolute;
      // display: none;
      transition: all 0.2s ease;
      left: 0;
      top: 10.666667rem;
      width: 20.666667rem;
      height: 10.666667rem;
      background: rgba(204, 204, 204, 0.6);
      ul {
        list-style: none;
        background: #f2f2f2;
        padding: 15px;
        margin-top: 51px;
        box-sizing: border-box;
        li {
          height: 30px;
          text-align: center;
          color: #0079fe;
          line-height: 30px;
          cursor: pointer;
          border-bottom: 1px solid #ccc;
        }
      }
    }
    img {
      width: 60px;
      height: 60px;
    }
    i {
      font-size: 60px;
      font-weight: bold;
      color: #ccc;
    }
  }
}
</style>
