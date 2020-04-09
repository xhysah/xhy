<template>
  <el-container class="home-container">
<!--    页面头部-->
    <el-header>
      <div><img src="../assets/heima.png" alt=""><span>电商后台管理系统</span></div>
      <el-button type="info" @click="exit">退出</el-button>
    </el-header>
<!--    页面主体-->
    <el-container>
      <!--        侧边栏-->
      <el-aside :width="width">
        <div class="toggle-button" @click="toggleCollapse">|||</div>
        <el-menu
          background-color="#333744"
          text-color="#fff"
          active-text-color="#409EFF"
          :unique-opened="true"
          :collapse-transition="false"
          :collapse="collapse"
          :router="true"
          :default-active="save"
        >
          <!--          一级菜单-->
          <el-submenu :index="String(menu.id)" v-for="menu in menuList" :key="menu.id">
            <template slot="title">
              <i :class="iconsObj[menu.id]"></i>
              <span>{{menu.authName}}</span>
            </template>
          <!--            二级菜单-->
            <el-menu-item :index="'/'+item.path" v-for="item in menu.children" :key="item.id" @click="saveNav('/'+item.path)">
              <template slot="title">
                <i class="el-icon-menu"></i>
                <span>{{item.authName}}</span>
              </template>
            </el-menu-item>
          </el-submenu>
        </el-menu>
      </el-aside>
<!--      中间部分-->
      <el-main>
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>
<script>
export default {
  name: 'home',
  components: {
  },
  created () {
    this.getMenuList()
    this.save = window.sessionStorage.getItem('save')
  },
  data () {
    return {
      // 左侧菜单数据
      menuList: '',
      // 给对应的一级菜单匹配icon
      iconsObj: {
        '125': 'iconfont icon-groupctrl',
        '103': 'iconfont icon-donework',
        '101': 'iconfont icon-donework',
        '102': 'iconfont icon-layered',
        '145': 'iconfont icon-faimlyalbum'
      },
      // 折叠
      collapse: false,
      width: '260px',
      save: ''
    }
  },
  methods: {
    exit () {
      window.sessionStorage.clear()
      this.$router.push('/login')
    },
    // 获取所有菜单
    getMenuList () {
      this.$http.get('menus').then(response => {
        if (response.data.meta.status !== 200) return this.$message.error(response.data.meta.msg)
        this.menuList = response.data.data
      })
    },
    // 菜单折叠与展开
    toggleCollapse () {
      this.collapse = !this.collapse
      if (this.collapse !== true) {
        this.width = '260px'
      } else {
        this.width = '64px'
      }
    },
    // 保存链接的激活状态
    saveNav (path) {
      window.sessionStorage.setItem('save', path)
      this.save = path
    }
  },
  computed: {}
}
</script>

<style lang="less" scoped>
  .home-container{
    height: 100%;
  }
  .el-header{
    background-color: #373D41;
    display: flex;
    justify-content: space-between;
    padding-left: 0;
    align-items: center;
    color: white;
    font-size: 20px;
    div{
      display: flex;
      align-items: center;
    }
    span{
      margin-left: 15px;
    }
  }
  .el-aside{
    background-color: #333744;
    .el-menu{
      border-right: none;
    }
  }
  .el-main{
    background-color: #eaedf1;
  }
  .icon{
    margin-right: 15px;
  }
  .toggle-button{
    background-color: #4A5064;
    text-align: center;
    color: white;
    font-size: 10px;
    letter-spacing: 0.2em;
    line-height: 24px;
    cursor:pointer;

  }
</style>
