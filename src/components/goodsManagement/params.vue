<template>
  <div>
    <!--    面包屑导航区域-->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>分类参数</el-breadcrumb-item>
    </el-breadcrumb>
    <!--    卡片视图-->
    <el-card>
      <el-alert
        title="注意：只允许为第三级分类设置相关参数！"
        type="warning"
        show-icon
        :closable="false">
      </el-alert>
      <div class="block">
        <span class="demonstration">选择商品分类：</span>
        <el-cascader
          v-model="paramsValue"
          :options="paramsOptions"
          :props="paramsProps"
          @change="handleChange">
        </el-cascader>
      </div>
      <el-tabs v-model="activeName">
        <el-tab-pane label="动态参数" name="first">
          <el-button type="primary" :disabled="isDisabled" @click="parameterVisible = true">添加参数</el-button>
          <el-table
            style="width: 100%"
            :data="addParameterData"
            border>
            <el-table-column
              type="index"
              label="#">
            </el-table-column>
            <el-table-column
              prop="attr_name"
              label="参数名称">
            </el-table-column>
            <el-table-column
              label="操作">
              <template slot-scope="scope">
              <el-button icon="el-icon-edit" size="small" type="primary" @click="showEditParameter(scope.row)">修改</el-button>
              <el-button icon="el-icon-delete" type="danger" size="small" @click="deleteParameter(scope.row)">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
        <el-tab-pane label="静态属性" name="second">
          <el-button type="primary" :disabled="isDisabled"  @click="attributeVisible = true">添加属性</el-button>
          <el-table
            style="width: 100%"
            border
            :data="addAttributeData">
            <el-table-column
              type="index"
              label="#">
            </el-table-column>
            <el-table-column
              prop="attr_name"
              label="属性名称">
            </el-table-column>
            <el-table-column
              label="操作">
              <template slot-scope="scope">
              <el-button icon="el-icon-edit" size="small" type="primary" @click="showEditAttribute(scope.row)">修改</el-button>
              <el-button icon="el-icon-delete" type="danger" size="small" @click="deleteAttribute(scope.row)">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
      </el-tabs>
    </el-card>
    <!--    添加参数对话框-->
    <el-dialog
      title="添加参数"
      :visible.sync="parameterVisible"
      width="50%"
      @close="resetForm('parameterRef')">
      <el-form :model="parameterForm" :rules="parameterRules" ref="parameterRef" label-width="100px">
        <el-form-item label="参数名称" prop="attr_name">
          <el-input v-model="parameterForm.attr_name"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
    <el-button @click="parameterVisible = false">取 消</el-button>
    <el-button type="primary" @click="addParameter">确 定</el-button>
  </span>
    </el-dialog>
    <!--    添加属性对话框-->
    <el-dialog
      title="添加属性"
      :visible.sync="attributeVisible"
      width="50%"
      @close="resetForm('attributeRef')">
      <el-form :model="attributeForm" :rules="attributeRules" ref="attributeRef" label-width="100px">
        <el-form-item label="属性名称" prop="attr_name">
          <el-input v-model="attributeForm.attr_name"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
    <el-button @click="attributeVisible = false">取 消</el-button>
    <el-button type="primary" @click="addAttribute">确 定</el-button>
  </span>
    </el-dialog>
    <!--    编辑参数对话框-->
    <el-dialog
      title="修改参数名称"
      :visible.sync="editParameterVisible"
      width="50%"
      @close="resetForm('editParameterRef')">
      <el-form :model="editParameterForm" :rules="editParameterRules" ref="editParameterRef" label-width="100px">
        <el-form-item label="旧的参数名称:" label-width="150px">
          <span>{{parameterName.attr_name}}</span>
        </el-form-item>
        <el-form-item label="新的参数名称" label-width="150px" prop="attr_name">
          <el-input v-model="editParameterForm.attr_name"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
    <el-button @click="editParameterVisible = false">取 消</el-button>
    <el-button type="primary" @click="editParameter">确 定</el-button>
  </span>
    </el-dialog>
    <!--    编辑属性对话框-->
    <el-dialog
      title="修改属性名称"
      :visible.sync="editAttributeVisible"
      width="50%"
      @close="resetForm('editAttributeRef')">
      <el-form :model="editAttributeForm" :rules="editAttributeRules" ref="editAttributeRef" label-width="100px">
        <el-form-item label="旧的属性名称:" label-width="150px">
          <span>{{attributeName.attr_name}}</span>
        </el-form-item>
        <el-form-item label="新的属性名称" label-width="150px" prop="attr_name">
          <el-input v-model="editAttributeForm.attr_name"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
    <el-button @click="editAttributeVisible = false">取 消</el-button>
    <el-button type="primary" @click="editAttribute">确 定</el-button>
  </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: 'params',
  mounted () {
    this.getParams()
  },
  data () {
    return {
      // 选中的值
      paramsValue: [],
      // 级联列表的值
      paramsOptions: [],
      paramsProps: {
        expandTrigger: 'hover',
        value: 'cat_id',
        label: 'cat_name',
        children: 'children'
      },
      activeName: 'first',
      // 静态属性
      addAttributeData: [],
      // 动态参数
      addParameterData: [],
      isDisabled: true,
      // 添加参数对话框是否隐藏
      parameterVisible: false,
      // 添加属性对话框是否隐藏
      attributeVisible: false,
      // 参数的表单
      parameterForm: {attr_sel: 'many', attr_name: ''},
      // 属性的表单
      attributeForm: {attr_sel: 'only', attr_name: ''},
      // 参数验证
      parameterRules: {
        attr_name: [
          { required: true, message: '请输入参数名称', trigger: 'blur' },
          { min: 3, max: 5, message: '长度在 3 到 5 个字符', trigger: 'blur' }
        ]
      },
      // 属性验证
      attributeRules: {
        attr_name: [
          { required: true, message: '请输入属性名称', trigger: 'blur' },
          { min: 3, max: 5, message: '长度在 3 到 5 个字符', trigger: 'blur' }
        ]
      },
      // 编辑参数对话框显示
      editParameterVisible: false,
      // 编辑属性对话框显示
      editAttributeVisible: false,
      // 编辑参数表单
      editParameterForm: {
        attr_sel: 'many'
      },
      // 编辑属性表单
      editAttributeForm: {
        attr_sel: 'only'
      },
      editParameterRules: {
        attr_name: [
          { required: true, message: '请输入参数名称', trigger: 'blur' },
          { min: 3, max: 5, message: '长度在 3 到 5 个字符', trigger: 'blur' }
        ]
      },
      editAttributeRules: {
        attr_name: [
          { required: true, message: '请输入参数名称', trigger: 'blur' },
          { min: 3, max: 5, message: '长度在 3 到 5 个字符', trigger: 'blur' }
        ]
      },
      parameterName: {},
      attributeName: {}
    }
  },
  methods: {
    getParams () {
      this.$http.get('categories', {params: {type: 3}}).then(response => {
        const {data} = response
        if (data.meta.status !== 200) {
          return this.$message.error('获取商品列表失败')
        }
        this.paramsOptions = data.data
      })
    },
    handleChange (value) {
      if (value.length !== 3) return
      this.paramsValue = value
      this.getAttributes()
      this.getParameter()
      this.isDisabled = false
    },
    // 获取属性列表
    getAttributes () {
      this.$http.get(`categories/${this.paramsValue[this.paramsValue.length - 1]}/attributes`, {params: {sel: 'only'}}).then(response => {
        const {data} = response
        if (data.meta.status !== 200) {
          return this.$message.error('获取属性列表失败')
        }
        this.addAttributeData = data.data
      })
    },
    // 获取参数列表
    getParameter () {
      this.$http.get(`categories/${this.paramsValue[this.paramsValue.length - 1]}/attributes`, {params: {sel: 'many'}}).then(response => {
        const {data} = response
        if (data.meta.status !== 200) {
          return this.$message.error('获取属性列表失败')
        }
        this.addParameterData = data.data
      })
    },
    // 添加新属性
    addAttribute () {
      this.$refs.attributeRef.validate(value => {
        if (!value) return
        this.$http.post(`categories/${this.paramsValue[2]}/attributes`, this.attributeForm).then(response => {
          const {data} = response
          if (data.meta.status !== 201) {
            return this.$message.error('添加属性失败')
          }
          this.attributeVisible = false
          this.getAttributes()
        })
      })
    },
    // 添加新参数
    addParameter () {
      this.$refs.parameterRef.validate(value => {
        if (!value) return
        this.$http.post(`categories/${this.paramsValue[2]}/attributes`, this.parameterForm).then(response => {
          const {data} = response
          if (data.meta.status !== 201) {
            return this.$message.error('添加参数失败')
          }
          this.parameterVisible = false
          this.getParameter()
        })
      })
    },
    // 展示编辑参数对话框
    showEditParameter (value) {
      this.editParameterVisible = true
      this.parameterName = value
    },
    // 删除参数
    deleteParameter (value) {
      this.$confirm('此操作将永久删除该参数, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$http.delete(`categories/${value.cat_id}/attributes/${value.attr_id}`).then(response => {
          const {data} = response
          if (data.meta.status !== 200) {
            return this.$message.error('删除参数失败')
          }
          this.$message.success('删除成功')
          this.getParameter()
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    },
    // 展示编辑属性对话框
    showEditAttribute (value) {
      this.editAttributeVisible = true
      this.attributeName = value
    },
    // 删除属性
    deleteAttribute (value) {
      this.$confirm('此操作将永久删除该属性, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$http.delete(`categories/${value.cat_id}/attributes/${value.attr_id}`).then(response => {
          const {data} = response
          if (data.meta.status !== 200) {
            return this.$message.error('删除参数失败')
          }
          this.$message.success('删除成功')
          this.getAttributes()
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    },
    editParameter () {
      this.$refs.editParameterRef.validate(value => {
        if (!value) return
        this.$http.put(`categories/${this.parameterName.cat_id}/attributes/${this.parameterName.attr_id}`, this.editParameterForm).then(response => {
          const {data} = response
          if (data.meta.status !== 200) {
            return this.$message.error('更新参数失败')
          }
          this.$message.success('更新成功')
          this.getParameter()
          this.editParameterVisible = false
        })
      })
    },
    editAttribute () {
      this.$refs.editAttributeRef.validate(value => {
        if (!value) return
        this.$http.put(`categories/${this.attributeName.cat_id}/attributes/${this.attributeName.attr_id}`, this.editAttributeForm).then(response => {
          const {data} = response
          if (data.meta.status !== 200) {
            return this.$message.error('更新属性失败')
          }
          this.$message.success('更新成功')
          this.getAttributes()
          this.editAttributeVisible = false
        })
      })
    },
    resetForm (formName) {
      // 父级分类的id
      this.$refs[formName].resetFields()
    }
  },
  computed: {}
}
</script>

<style lang="less" scoped>
  .el-tabs,.block{
  margin-left: 10px;
  margin-top: 15px;
}
.el-cascader{
  width: 30%;
}
  .el-button{
    margin-bottom:10px ;
  }
</style>
