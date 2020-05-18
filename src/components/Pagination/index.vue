<template>
   <div
          class="block"
          style="float:right; margin-top:30px;margin-bottom:30px;"
        >
          <el-pagination
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page.sync="page.start"
            :page-sizes="page.pageSize"
            :page-size="100"
            layout="sizes, prev, pager, next"
            :total="page.total"
          ></el-pagination>
        </div>
</template>

<script>
export default {
  props:{
    page:{
      type:Object
    }
  },
  data(){
      return{

      }
  },
  methods:{
       handleSizeChange(val){
        this.$emit('sizeChange',val)
      },
      handleCurrentChange(val) {
        this.$emit('currentChange',val)
      }
  }
}
</script>

<style>

</style>