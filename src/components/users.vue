<template>
  <div>
    <!--    面包屑导航区域-->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!--    卡片视图-->
    <el-card>
      <!--      搜索与添加-->
      <el-row :gutter="20">
        <el-col :span="12">
          <el-input placeholder="请输入内容" class="input-with-select" v-model="queryInfo.query" clearable
                    @clear="getUserList">
            <el-button slot="append" icon="el-icon-search" @click="getUserList"></el-button>
          </el-input>
        </el-col>
        <el-col :span="4">
          <el-button type="primary" @click="dialogVisible = true">添加用户</el-button>
        </el-col>
      </el-row>
    </el-card>
    <!--    用户列表区域-->
    <el-table
      :data="userlist"
      border
      stripe
      style="width: 100%">
      <el-table-column type="index" label="#">
      </el-table-column>
      <el-table-column
        prop="username"
        label="姓名">
      </el-table-column>
      <el-table-column
        prop="email"
        label="邮箱">
      </el-table-column>
      <el-table-column
        prop="mobile"
        label="电话">
      </el-table-column>
      <el-table-column
        prop="role_name"
        label="角色">
      </el-table-column>
      <el-table-column
        label="状态">
        <template v-slot="scope">
          <el-switch v-model="scope.row.mg_state" @change="userStateChange(scope.row)">
          </el-switch>
        </template>
      </el-table-column>
      <el-table-column
        label="操作">
        <template v-slot="scope">
          <!--          修改按钮-->
          <el-button type="primary" icon="el-icon-edit" circle size="mini" @click="showEditDialog(scope.row.id)"></el-button>
          <!--          删除按钮-->
          <el-button type="danger" icon="el-icon-delete" circle size="mini" @click="deleteUser(scope.row.id)"></el-button>
          <!--          分配角色按钮-->
          <el-tooltip content="分配角色" placement="top" :enterable="false">
            <el-button type="warning" icon="el-icon-setting" circle size="mini" @click="distributeRole(scope.row)"></el-button>
          </el-tooltip>
        </template>
      </el-table-column>
    </el-table>
    <!--    分页-->
    <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="queryInfo.pagenum"
      :page-sizes="[1, 2, 5, 10]"
      :page-size="queryInfo.pagesize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total">
    </el-pagination>
    <!--添加用户的对话框-->
    <el-dialog
      title="添加用户"
      :visible.sync="dialogVisible"
      width="50%"
      @close="resetForm()"
    >
      <!--      内容主体区-->
      <!--      添加用户的表单-->
      <el-form :model="addForm" :rules="addRules" ref="ruleFormRef" label-width="100px">
        <el-form-item label="用户名" prop="username">
          <el-input v-model="addForm.username"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input v-model="addForm.password"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="addForm.email"></el-input>
        </el-form-item>
        <el-form-item label="手机 " prop="mobile">
          <el-input v-model="addForm.mobile"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
    <el-button @click="dialogVisible = false">取 消</el-button>
    <el-button type="primary" @click="addUser">确 定</el-button>
  </span>
    </el-dialog>
    <!--    修改用户的对话框-->
    <el-dialog
      title="修改用户"
      :visible.sync="editVisible"
      width="50%"
      @close="closeEdit">
      <el-form :model="editForm" :rules="editRules" ref="editRuleForm" label-width="70px">
        <el-form-item label="用户名">
          <el-input v-model="editForm.username" disabled></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="editForm.email"></el-input>
        </el-form-item>
        <el-form-item label="手机" prop="mobile">
          <el-input v-model="editForm.mobile"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
    <el-button @click="editVisible = false">取 消</el-button>
    <el-button type="primary" @click="editUserInFo">确 定</el-button>
  </span>
    </el-dialog>
    <!--    分配角色对话框-->
    <el-dialog
      title="提示"
      :visible.sync="distributeVisible"
      width="30%"
    @close="resetSelect">
      <div>
        <p>当前的用户：{{userInfo.username}}</p>
        <p>当前的角色：{{userInfo.role_name}}</p>
        <p>分配新角色：
          <el-select v-model="selectedRole" placeholder="请选择">
            <el-option
              v-for="item in rolesList"
              :key="item.id"
              :label="item.roleName"
              :value="item.id">
            </el-option>
          </el-select>
        </p>
      </div>
      <span slot="footer" class="dialog-footer">
    <el-button @click="distributeVisible = false">取 消</el-button>
    <el-button type="primary" @click="saveRole">确 定</el-button>
  </span>
    </el-dialog>

  </div>
</template>

<script>
export default {
  name: 'users',
  data () {
    // 验证邮箱的规则
    var checkEmail = (rule, value, callback) => {
      const regEmail = /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(\.[a-zA-Z0-9_-])+/
      if (regEmail.test(value)) {
        return callback()
      }
      callback(new Error('请输入合法的邮箱'))
    }
    // 验证手机号规则
    var checkMobile = (rule, value, callback) => {
      const regmobile = /^(0|86|17951)?(13[0-9]|15[012356789]|17[678]|18[0-9]|14[57])[0-9]{8}$/
      if (regmobile.test(value)) {
        return callback()
      }
      callback(new Error('请输入合法的手机号'))
    }
    return {
      // 获取用户列表的参数对象
      queryInfo: {
        query: '',
        pagenum: 1,
        pagesize: 10
      },
      userlist: [],
      total: 0,
      dialogVisible: false,
      addForm: {
        username: '',
        password: '',
        email: '',
        mobile: ''
      },
      addRules: {
        username: [
          {required: true, message: '请输入用户名', trigger: 'blur'},
          {min: 3, max: 5, message: '长度在 3 到 10 个字符', trigger: 'blur'}
        ],
        password: [
          {required: true, message: '请输入密码', trigger: 'blur'},
          {min: 6, max: 15, message: '长度在 6 到 15 个字符', trigger: 'blur'}
        ],
        email: [
          {required: true, message: '请输入邮箱', trigger: 'blur'},
          {validator: checkEmail, trigger: 'blur'}
        ],
        mobile: [
          {required: true, message: '请输入手机', trigger: 'blur'},
          {validator: checkMobile, trigger: 'blur'}
        ]
      },
      editRules: {
        email: [
          {required: true, message: '请输入邮箱', trigger: 'blur'},
          {validator: checkEmail, trigger: 'blur'}
        ],
        mobile: [
          {required: true, message: '请输入手机', trigger: 'blur'},
          {validator: checkMobile, trigger: 'blur'}
        ]
      },
      editVisible: false,
      // 查询到的用户信息
      editForm: {},
      distributeVisible: false,
      // 需要被分配角色的用户
      userInfo: {},
      rolesList: {},
      selectedRole: ''
    }
  },
  created () {
    this.getUserList()
  },
  methods: {
    getUserList () {
      this.$http.get('users', {params: this.queryInfo}).then(response => {
        if (response.data.meta.status !== 200) return this.$message.error('获取用户列表失败')
        this.userlist = response.data.data.users
        this.total = response.data.data.total
      })
    },
    // 监听pagesize改变的事件
    handleSizeChange (val) {
      this.queryInfo.pagesize = val
      this.getUserList()
    },
    // 监听页码值改变的事件
    handleCurrentChange (val) {
      this.queryInfo.pagenum = val
      this.getUserList()
    },
    userStateChange (userInfo) {
      this.$http.put(`users/${userInfo.id}/state/${userInfo.mg_state}`).then(response => {
        if (response.data.meta.status !== 200) {
          userInfo.mg_state = !userInfo.mg_state
          return this.$message.error('更新用户状态失败！')
        }
        this.$message.success('更新用户状态成功！')
      })
    },
    // 重置表单
    resetForm () {
      this.$refs.ruleFormRef.resetFields()
    },
    // 点击按钮，添加新用户
    addUser () {
      this.$refs.ruleFormRef.validate(valid => {
        // 判断表单的预校验是否为true
        if (!valid) return
        this.$http.post('users', this.addForm).then(response => {
          if (response.data.meta.status !== 201) {
            this.$message.error('用户添加失败')
          } else {
            this.$message.success('用户添加成功')
            this.dialogVisible = false
            // 重新获取用户列表
            this.getUserList()
          }
        })
      })
    },
    // 展示编辑用户的对话框
    showEditDialog (id) {
      this.$http.get(`users/${id}`).then(response => {
        if (response.data.meta.status !== 200) {
          return this.$message.error('查询用户信息失败')
        }
        this.editForm = response.data.data
      })
      this.editVisible = true
    },
    closeEdit () {
      this.$refs.editRuleForm.resetFields()
    },
    editUserInFo () {
      this.$refs.editRuleForm.validate(valid => {
        if (!valid) return
        // 发起修改用户信息的数据请求
        this.$http.put(`users/${this.editForm.id}`, {
          email: this.editForm.email,
          mobile: this.editForm.mobile
        }).then(response => {
          if (response.data.meta.status !== 200) {
            return this.$message.error('更新用户信息失败')
          }
          // 关闭对话框
          this.editVisible = false
          // 刷新数据列表
          this.getUserList()
          // 提示修改成功
          this.$message.success('更新用户信息成功')
        })
      })
    },
    // 根据id删除用户
    deleteUser (id) {
      this.$confirm('此操作将永久删除该用户, 是否删除?', '提示', {
        confirmButtonText: '删除',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$http.delete(`users/${id}`).then(response => {
          if (response.data.meta.status !== 200) {
            return this.$message.error('删除用户失败')
          }
          this.$message.success('删除用户成功')
          this.getUserList()
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    },
    // 分配角色
    distributeRole (userInfo) {
      this.userInfo = userInfo
      // 在战死对话框之前要展示所有角色列表
      this.$http.get('roles').then(response => {
        const {data} = response
        if (data.meta.status !== 200) {
          return this.$message.error('获取角色列表失败')
        }
        this.rolesList = data.data
      })
      this.distributeVisible = true
    },
    // 点击按钮，分配角色
    saveRole () {
      if (!this.selectedRole) {
        return this.$message.error('请选择要分配的角色！')
      }
      this.$http.put(`users/${this.userInfo.id}/role`, {rid: this.selectedRole}).then(response => {
        const {data} = response
        if (data.meta.status !== 200) {
          return this.$message.error('更新角色失败')
        }
        this.$message.success('更新角色成功')
        console.log(data.data)
        this.getUserList()
        this.distributeVisible = false
      })
    },
    resetSelect () {
      this.selectedRole = ''
    }
  },
  computed: {}
}
</script>

<style lang="less" scoped>
.el-button{
  text-align: center;
}
.el-table{
  font-size: 12px;
  }
.el-pagination{
  margin-top: 15px;
}
</style>
