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
          <el-button type="primary" @click="showDialog">添加分类</el-button>
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
            <el-button type="primary" icon="el-icon-edit" size="mini" @click="showEidtCategories(scope.row)">编辑</el-button>
            <el-button type="danger" icon="el-icon-delete" size="mini" @click="deleteCategories(scope.row)">删除</el-button>
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
        <!--      添加分类的对话框-->
      <el-dialog
        title="添加分类"
        :visible.sync="addDialogVisible"
        width="50%"
        @close="resetForm('addCateFormRef')">
        <el-form :model="addCateForm" :rules="addCateRules" ref="addCateFormRef" label-width="100px">
          <el-form-item label="分类名称：" prop="cat_name">
            <el-input v-model="addCateForm.cat_name"></el-input>
          </el-form-item>
          <el-form-item label="父级分类：">
            <!--            options 用来指定数据源-->
            <el-cascader
              :v-model="selectedKeys"
              :options="parentCateList"
              :props="cascaderProps"
              @change="handleChange" clearable
            ></el-cascader>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
    <el-button @click="addDialogVisible = false">取 消</el-button>
    <el-button type="primary" @click="addCate">确 定</el-button>
  </span>
      </el-dialog>
        <!--      编辑对话框-->
      <el-dialog
        title="编辑分类"
        :visible.sync="editCategoriesVisible"
        width="50%"
      @close="resetForm('ruleFormCategories')">
        <el-form :model="ruleFormCategories" :rules="rulesCategories" ref="ruleFormCategories" label-width="100px">
          <el-form-item label="旧的分类名称:" label-width="150px">
            <span>{{categoriesById.cat_name}}</span>
          </el-form-item>
          <el-form-item label="新的分类名称:" label-width="150px" prop="cat_name">
            <el-input v-model="ruleFormCategories.cat_name"></el-input>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
    <el-button @click="editCategoriesVisible = false">取 消</el-button>
    <el-button type="primary" @click="eidtCategories">确 定</el-button>
  </span>
      </el-dialog>

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
        pagesize: 10
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
      ],
      addDialogVisible: false,
      // 添加分类的表单数据对象
      addCateForm: {
        // 将要分类的名称
        cat_name: '',
        // 父级分类的id
        cat_pid: 0,
        // 分类的等级，默认要添加的是一级分类
        cat_level: 0
      },
      addCateRules: {
        cat_name: [
          { required: true, message: '请输入分类名称', trigger: 'blur' }
        ]
      },
      // 父级分类列表
      parentCateList: [],
      // 指定级联选择器的配置对象
      cascaderProps: {
        expandTrigger: 'hover',
        value: 'cat_id',
        label: 'cat_name',
        children: 'children',
        checkStrictly: true
      },
      // 选中的父级分类的id
      selectedKeys: [],
      // 根据id获取到的分类
      categoriesById: {},
      // 编辑对话框的存在与否
      editCategoriesVisible: false,
      ruleFormCategories: {
      },
      rulesCategories: {
        cat_name: [
          { required: true, message: '请输入分类名称', trigger: 'blur' }
        ]
      }
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
    },
    // 展示添加按钮的对话框
    showDialog () {
      // 先获取父级分类的数据列表
      this.getParentCateList()
      // 在展示出对话框
      this.addDialogVisible = true
    },
    // 获取父级分类的数据列表
    getParentCateList () {
      this.$http.get('categories', {params: {type: 2}}).then(response => {
        const {data} = response
        if (data.meta.status !== 200) {
          return this.$message.error('获取父级分类失败')
        }
        this.parentCateList = data.data
      })
    },
    // 选择项发生变化触发这个函数
    handleChange (value) {
      this.selectedKeys = value
      // 父级分类的id
      this.addCateForm.cat_pid = this.selectedKeys[this.selectedKeys.length - 1]
      // 分类的等级
      this.addCateForm.cat_level = this.selectedKeys.length
    },
    resetForm (formName) {
      // 父级分类的id
      this.$refs[formName].resetFields()
    },
    addCate () {
      this.$refs.addCateFormRef.validate(valid => {
        if (!valid) return
        this.$http.post('categories', this.addCateForm).then(response => {
          const {data} = response
          if (data.meta.status !== 201) {
            return this.$message.error('添加分类失败')
          }
          this.getCategotiesList()
          this.addDialogVisible = false
          this.$message.success('添加分类成功')
        })
      })
    },
    // 显示编辑分类
    showEidtCategories (value) {
      this.editCategoriesVisible = true
      this.$http.get(`categories/${value.cat_id}`).then(response => {
        const {data} = response
        if (data.meta.status !== 200) {
          return this.$message.error('获取分类失败')
        }
        this.categoriesById = data.data
      })
    },
    // 删除分类
    deleteCategories (value) {
      this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        console.log(value)
        this.$http.delete(`categories/${value.cat_id}`).then(response => {
          const {data} = response
          if (data.meta.status !== 200) {
            return this.$message.error('删除分类失败')
          }
          this.$message.success('删除分类成功')
          this.getCategotiesList()
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    },
    // 确定编辑分类
    eidtCategories () {
      this.$http.put(`categories/${this.categoriesById.cat_id}`, {cat_name: this.ruleFormCategories.cat_name}).then(response => {
        const {data} = response
        if (data.meta.status !== 200) {
          return this.$message.error('更新分类名称失败')
        }
        this.$message.success('更新分类名称成功')
        this.editCategoriesVisible = false
        this.getCategotiesList()
      })
    }
  },
  computed: {}
}
</script>

<style lang="less" scoped>
.tree-table{
  margin-top: 15px;
}
.el-cascader{
  width: 100%
}
</style>
