<template>
  <div class="footer">
    <div class="links">
      <a href="https://ant.design/">帮助中心</a>
      <a href="https://vue.ant.design/">联系我们</a>
    </div>
    <div class="copyright">
      Copyright
      <a-icon type="copyright" /> 2020 <span>新华云教育科技有限公司</span>
    </div>
  </div>
</template>

<script>
export default {
  name: 'GlobalFooter',
  data () {
    return {}
  }
}
</script>

<style lang="less" scoped>
.footer {
  padding: 0 16px;
  margin: 48px 0 24px;
  text-align: center;

  .links {
    margin-bottom: 8px;

    a {
      color: rgba(0, 0, 0, 0.45);

      &:hover {
        color: rgba(0, 0, 0, 0.65);
      }

      &:not(:last-child) {
        margin-right: 40px;
      }
    }
  }
  .copyright {
    color: rgba(0, 0, 0, 0.45);
    font-size: 14px;
  }
}
</style>
