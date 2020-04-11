<template>
    <div>
      <!--    面包屑导航区域-->
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
        <el-breadcrumb-item>权限管理</el-breadcrumb-item>
        <el-breadcrumb-item>权限列表列表</el-breadcrumb-item>
      </el-breadcrumb>
      <!--      卡片-->
      <el-card>
        <el-table
          :data="rightsList"
          border
          stripe
          :max-height="windowHeight">
          <el-table-column type="index">
          </el-table-column>
          <el-table-column
            prop="authName"
            label="权限名称">
          </el-table-column>
          <el-table-column
            prop="path"
            label="路径">
          </el-table-column>
          <el-table-column
            label="权限等级">
            <template v-slot="scope">
            <el-tag v-if="scope.row.level === '0'" type="success">一级权限</el-tag>
            <el-tag v-if="scope.row.level === '1'" type="info">二级权限</el-tag>
            <el-tag v-if="scope.row.level === '2'" type="warning">三级权限</el-tag>
            </template>
          </el-table-column>
        </el-table>
      </el-card>
    </div>
</template>

<script>
export default {
  name: 'rights',
  created () {
    this.getRightsList()
  },
  data () {
    return {
      // 所有的权限列表
      rightsList: []
    }
  },
  methods: {
    getRightsList () {
      this.$http.get('rights/list').then(response => {
        if (response.data.meta.status !== 200) {
          return this.$message.error('获取权限列表失败')
        }
        this.rightsList = response.data.data
      })
    }
  },
  computed: {
    windowHeight: function () {
      return document.body.clientHeight
    }
  }
}
</script>

<style lang="less" scoped>

</style>
