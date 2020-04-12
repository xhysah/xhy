<template>
    <div>
      <!--    面包屑导航区域-->
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
        <el-breadcrumb-item>商品管理</el-breadcrumb-item>
        <el-breadcrumb-item>商品分类</el-breadcrumb-item>
      </el-breadcrumb>
        <!--      卡片视图-->
      <el-card>
        <el-row>
          <el-button type="primary">添加分类</el-button>
        </el-row>
        <!--        表格-->
        <tree-table  class="tree-table" :data="categotiesList"
                    :columns="columns"
                    :selection-type="false"
                    :expand-type="false"
                    :show-index="true"
                    index-text=" "
                    :show-row-hover="false"
                    border>
          <!--           是否有效-->
          <template slot="isok" slot-scope="scope">
            <i style="color: lightgreen" class="el-icon-success" v-if="scope.row.cat_deleted === false"></i>
            <i style="color: red" class="el-icon-error" v-else></i>
          </template>
          <!--          排序-->
          <template slot="order" slot-scope="scope">
            <el-tag size="mini" v-if="scope.row.cat_level===0">一级</el-tag>
            <el-tag type="success" size="mini" v-else-if="scope.row.cat_level===1">二级</el-tag>
            <el-tag type="warning" size="mini" v-else>三级</el-tag>
          </template>
          <!--          操作-->
          <template slot="opt" slot-scope="scope">
            <el-button type="primary" icon="el-icon-edit" size="mini">编辑</el-button>
            <el-button type="danger" icon="el-icon-delete" size="mini">删除</el-button>
          </template>
        </tree-table>
        <!--        分页-->
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="query.pagenum"
          :page-sizes="[1, 5, 10,15]"
          :page-size="query.pagesize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="total">
        </el-pagination>
      </el-card>
    </div>
</template>

<script>
export default {
  name: 'categories',
  created () {
    this.getCategotiesList()
  },
  data () {
    return {
      categotiesList: [],
      // 获取商品列表的参数对象
      query: {
        type: 3,
        pagenum: 1,
        pagesize: 5
      },
      // 总数据条数
      total: 0,
      // 为table指定列的定义
      columns: [
        {
          label: '分类名称',
          prop: 'cat_name'
        },
        {
          label: '是否有效',
          // 表示将当前列定义为模版列
          type: 'template',
          // 表示当前这一列使用模版名称
          template: 'isok'
        },
        {
          label: '排序',
          // 表示将当前列定义为模版列
          type: 'template',
          // 表示当前这一列使用模版名称
          template: 'order'
        },
        {
          label: '操作',
          // 表示将当前列定义为模版列
          type: 'template',
          // 表示当前这一列使用模版名称
          template: 'opt'
        }
      ]
    }
  },
  methods: {
    getCategotiesList () {
      this.$http.get('categories', {params: this.query}).then(response => {
        const {data} = response
        if (data.meta.status !== 200) {
          return this.$message.error('获取商品分类列表失败')
        }
        this.categotiesList = data.data.result
        this.total = data.data.total
        console.log(data.data)
      })
    },
    // 监听pagesize改变
    handleSizeChange (newSize) {
      this.query.pagesize = newSize
      this.getCategotiesList()
    },
    // 监听pagenum的改变
    handleCurrentChange (newPage) {
      this.query.pagenum = newPage
      this.getCategotiesList()
    }
  },
  computed: {}
}
</script>

<style lang="less" scoped>
.tree-table{
  margin-top: 15px;
}
</style>
