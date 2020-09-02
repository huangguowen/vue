<template>
  <div class="user-wrapper">
    <div class="content-box">
      <a href="https://www.kancloud.cn/xinhuayun/xhy_admin/1713542" target="_blank">
        <span class="action">
          <a-icon type="question-circle-o"></a-icon>
        </span>
      </a>
      <notice-icon class="action" />
      <a-dropdown>
        <span class="action ant-dropdown-link user-dropdown-menu">
          <a-avatar class="avatar" size="small" :src="avatar" />
          <span>{{ nickname }}</span>
        </span>
        <a-menu slot="overlay" class="user-dropdown-menu-wrapper">
          <a-menu-item key="0">
            <router-link :to="{ component: 'profile', path: '/framework/general/profile' }">
              <a-icon type="user" />
              <span>个人中心</span>
            </router-link>
          </a-menu-item>

          <a-menu-item key="1">
            <router-link :to="{ component: 'help', path: '/framework/general/help' }">
              <a-icon type="setting" />
              <span>帮助中心</span>
            </router-link>
          </a-menu-item>

          <a-menu-item key="2">
            <a href="javascript:;" @click="handleResetPassword">
              <a-icon type="password" />
              <span>修改密码</span>
            </a>
          </a-menu-item>

          <a-menu-divider />
          <a-menu-item key="3">
            <a href="javascript:;" @click="handleLogout">
              <a-icon type="logout" />
              <span>退出登录</span>
            </a>
          </a-menu-item>
        </a-menu>
      </a-dropdown>
    </div>
    <reset-password ref="ResetPassword" />
  </div>
</template>

<script>
import NoticeIcon from '@/components/NoticeIcon'
import { mapActions, mapGetters } from 'vuex'
import ResetPassword from '../../views/framework/basic/modifyPassword'

export default {
  name: 'UserMenu',
  components: {
    ResetPassword,
    NoticeIcon
  },
  computed: {
    ...mapGetters(['nickname', 'avatar'])
  },
  methods: {
    ...mapActions(['Logout']),
    handleLogout() {
      this.$confirm({
        title: '提示',
        content: '真的要注销登录吗 ?',
        onOk: () => {
          return this.Logout({})
            .then(() => {
              setTimeout(() => {
                window.location.reload()
              }, 16)
            })
            .catch(err => {
              this.$message.error({
                title: '错误',
                description: err.message
              })
            })
        },
        onCancel() {}
      })
    },
    handleResetPassword() {
      this.$refs.ResetPassword.reset()
    }
  }
}
</script>
