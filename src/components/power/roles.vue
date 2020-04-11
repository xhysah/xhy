<template>
    <div>
      <!--    面包屑导航区域-->
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
        <el-breadcrumb-item>权限管理</el-breadcrumb-item>
        <el-breadcrumb-item>角色列表</el-breadcrumb-item>
      </el-breadcrumb>
      <!--      页面主体区域-->
      <el-card>
      <!--        添加角色按钮-->
        <el-row>
        <el-button type="primary" @click="rolesVisible=true">添加角色</el-button>
        </el-row>
        <!--        表格区域-->
        <el-table
          :data="rolesList"
          border
          stripe>
          <el-table-column type="expand">
            <template slot-scope="scope">
              <el-row :class="['bdbottom',index===0?'bdtop':'','vcenter' ]" v-for = "(item1,index) in scope.row.children" :key="item1.id">
                <!--                渲染一级权限-->
                <el-col :span="5">
                  <el-tag closable @close="removeRightById(scope.row,item1.id)">{{item1.authName}}</el-tag>
                  <i class="el-icon-caret-right"></i>
                </el-col>
                <!--                渲染二和级权限-->
                <el-col :span="19">
                <!--                  通过for循环嵌套渲染二级权限-->
                  <el-row :class="[index === 0? '' :'bdtop','vcenter']" v-for="(item2,index) in item1.children" :key="item2.id">
                    <el-col :span="6">
                      <el-tag  type="success" closable @close="removeRightById(scope.row,item2.id)">{{item2.authName}}</el-tag>
                      <i class="el-icon-caret-right"></i>
                    </el-col>
                    <el-col :span="18">
                      <el-tag type="warning" closable v-for="(item3) in item2.children" :key="item3.id" @close="removeRightById(scope.row,item3.id)">{{item3.authName}}</el-tag>
                    </el-col>
                  </el-row>
                </el-col>
              </el-row>
            </template>
          </el-table-column>

          <el-table-column type="index"></el-table-column>
          <el-table-column
            prop="roleName"
            label="角色名称">
          </el-table-column>
          <el-table-column
            prop="roleDesc"
            label="角色描述">
          </el-table-column>
          <el-table-column
            label="操作">
            <template v-slot="scope">
              <!--          修改按钮-->
              <el-button type="primary" icon="el-icon-edit" size="mini" @click="showEditRoles(scope.row.id)">编辑</el-button>
              <!--          删除按钮-->
              <el-button type="danger" icon="el-icon-delete" size="mini" @click="deleteRoles(scope.row.id)">删除</el-button>
              <!--          分配角色按钮-->
              <el-button type="warning" icon="el-icon-setting" size="mini" @click="showSetRightDialog(scope.row)">分配权限</el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-card>
      <!--      添加角色对话框-->
      <el-dialog
        title="添加角色"
        :visible.sync="rolesVisible"
        width="50%"
        @close="resetForm('rolesFormRef')"
      >
        <el-form :model="rolesForm" :rules="rolesRules" ref="rolesFormRef" label-width="100px">
          <el-form-item label="角色名称" prop="roleName">
            <el-input v-model="rolesForm.roleName"></el-input>
          </el-form-item>
          <el-form-item label="角色描述" prop="roleDesc">
            <el-input v-model="rolesForm.roleDesc"></el-input>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="rolesVisible = false">取 消</el-button>
          <el-button type="primary" @click="addRoles">确 定</el-button>
        </span>
      </el-dialog>
      <!--      修改角色对话框-->
      <el-dialog
        title="修改角色"
        :visible.sync="editRolesVisible"
        width="50%"
        @close="resetForm('editRolesFormRef')"
      >
        <el-form :model="editRolesForm" :rules="editRolesRules" ref="editRolesFormRef" label-width="100px">
          <el-form-item label="角色名称" prop="roleName">
            <el-input v-model="editRolesForm.roleName"></el-input>
          </el-form-item>
          <el-form-item label="角色描述" prop="roleDesc">
            <el-input v-model="editRolesForm.roleDesc"></el-input>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="editRolesVisible = false">取 消</el-button>
          <el-button type="primary" @click="editRoles">确 定</el-button>
        </span>
      </el-dialog>
      <!--      分配权限的对话框-->
      <el-dialog
        title="分配权限"
        :visible.sync="distributeRightsVisible"
        width="50%"
        @close="resetList"
      >
      <!--        树形控件-->
        <el-tree
          :data="distributeList"
          :props="treeProps"
          show-checkbox
          node-key="id"
          :default-expand-all= "true"
          :default-checked-keys="defKeys"
          ref="treeRef"
        >
        </el-tree>
        <span slot="footer" class="dialog-footer">
    <el-button @click="distributeRightsVisible = false">取 消</el-button>
    <el-button type="primary" @click="editRights">确 定</el-button>
  </span>
      </el-dialog>
    </div>
</template>

<script>
export default {
  name: 'roles',
  created () {
    this.getRoles()
  },
  data () {
    return {
      rolesList: [],
      rolesVisible: false,
      rolesForm: {
        roleName: '',
        roleDesc: ''
      },
      rolesRules: {
        roleName: [
          { required: true, message: '请输入角色名称', trigger: 'blur' },
          { min: 3, max: 8, message: '长度在 3 到 5 个字符', trigger: 'blur' }
        ],
        roleDesc: [
          { required: true, message: '请输入角色描述', trigger: 'blur' },
          { min: 3, max: 10, message: '长度在 3 到 5 个字符', trigger: 'blur' }
        ]
      },
      editRolesVisible: false,
      editRolesForm: {
      },
      editRolesRules: {
        roleName: [
          { required: true, message: '请输入角色名称', trigger: 'blur' },
          { min: 3, max: 5, message: '长度在 3 到 5 个字符', trigger: 'blur' }
        ],
        roleDesc: [
          { required: true, message: '请输入角色描述', trigger: 'blur' },
          { min: 3, max: 10, message: '长度在 3 到 5 个字符', trigger: 'blur' }
        ]
      },
      distributeRightsVisible: false,
      distributeList: [],
      // 树形控制的属性绑定对象
      treeProps: {
        children: 'children',
        label: 'authName'
      },
      // 默认选中的节点Id值数值
      defKeys: [],
      // 当前即将被分配角色的id
      roleId: ''
    }
  },
  methods: {
    getRoles () {
      this.$http.get('roles').then(response => {
        const {data} = response
        if (data.meta.status !== 200) {
          return this.$message.error('获取数据失败')
        }
        this.rolesList = data.data
      })
    },
    // 重置表单
    resetForm (formName) {
      this.$refs[formName].resetFields()
    },
    addRoles () {
      this.$refs.rolesFormRef.validate(valid => {
        if (!valid) return
        this.$http.post('roles', this.rolesForm).then(response => {
          const {data} = response
          if (data.meta.status !== 201) {
            return this.$message.error('添加信息失败')
          }
          this.$message.success('添加信息成功')
          this.rolesVisible = false
          this.getRoles()
        })
      })
    },
    deleteRoles (id) {
      this.$confirm('此操作将永久删除该角色, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$http.delete(`roles/${id}`).then(response => {
          const {data} = response
          if (data.meta.status !== 200) {
            return this.$message.error('删除角色失败')
          }
          this.$message.success('删除角色成功')
          this.getRoles()
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    },
    showEditRoles (id) {
      this.$http.get(`roles/${id}`).then(response => {
        const {data} = response
        if (data.meta.status !== 200) return this.$message.error('用户请求失败')
        this.editRolesForm = data.data
      })
      this.editRolesVisible = true
    },
    editRoles () {
      this.$refs.editRolesFormRef.validate(valid => {
        if (!valid) return
        this.$http.put(`roles/${this.editRolesForm.roleId}`, {
          roleName: this.editRolesForm.roleName,
          roleDesc: this.editRolesForm.roleDesc
        }).then(response => {
          const {data} = response
          if (data.meta.status !== 200) {
            return this.$message.error('编辑角色失败')
          }
          this.$message.success('编辑角色成功')
          this.editRolesVisible = false
          this.getRoles()
        })
      })
    },
    removeRightById (role, rights) {
      // 弹框提示用户是否要删除
      this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$http.delete(`roles/${role.id}/rights/${rights}`).then(response => {
          const {data} = response
          if (data.meta.status !== 200) {
            return this.$message.error('删除权限失败')
          }
          role.children = data.data
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    },
    // 展示分配权限的对话框
    showSetRightDialog (role) {
      this.roleId = role.id
      this.$http.get('rights/tree').then(response => {
        const {data} = response
        if (data.meta.status !== 200) {
          return this.$message.error('获取权限数据失败')
        }
        this.distributeList = data.data
      })
      // 递归获取三级节点的id
      this.getLeafKeys(role, this.defKeys)
      this.distributeRightsVisible = true
    },
    // 通过递归的方式获取角色下所有的三级id
    getLeafKeys (node, arr) {
      if (!node.children) {
        return arr.push(node.id)
      }
      node.children.forEach(item => {
        this.getLeafKeys(item, arr)
      })
    },
    // 监听分配权限对话框的关闭事件
    resetList () {
      this.defKeys = []
    },
    // 点击确定
    editRights () {
      const keys = [
        ...this.$refs.treeRef.getCheckedKeys(),
        ...this.$refs.treeRef.getHalfCheckedKeys()
      ]
      const idStr = keys.join(',')
      this.$http.post(`roles/${this.roleId}/rights`, {rids: idStr}).then(response => {
        const {data} = response
        if (data.meta.status !== 200) {
          return this.$message.error('分配权限失败')
        }
        this.$message.success('分配权限成功')
        this.getRoles()
        this.distributeRightsVisible = false
      })
    }
  },
  computed: {}
}
</script>

<style lang="less" scoped>
.el-table{
  margin-top: 15px;
}
.el-tag{
    margin: 10px;
}
.bdtop {
  border-top: 1px solid #eee ;
}
.bdbottom{
    border-bottom: 1px solid #eee ;
}
.vcenter{
    display: flex;
  align-items: center;
}
</style>
