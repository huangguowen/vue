<template>
  <a-card :bordered="false" style="position: relative">
    <a-col
      :span="9"
      style="position: static; overflow-y: auto;
    height: 500px;"
    >
      <a-tree
        v-if="orgTree.length"
        :tree-data="orgTree"
        class="draggable-tree"
        @select="handleSelect"
        draggable
        :selectedKeys="selectedKey"
        @drop="onDrop"
        showLine
        :expandedKeys="expandedKeys"
        :auto-expand-parent="autoExpandParent"
        @expand="onExpand"
      >
        <template slot="title" slot-scope="{ title }">
          <span v-if="title.indexOf(searchValue) > -1">
            {{ title.substr(0, title.indexOf(searchValue)) }}
            <span style="color: #f50">{{ searchValue }}</span>
            {{ title.substr(title.indexOf(searchValue) + searchValue.length) }}
          </span>
          <span v-else>{{ title }}</span>
        </template>
      </a-tree>
      <div class="table-page-search-wrapper" style="position: absolute;bottom: 0;">
        <a-form layout="inline">
          <a-row :gutter="48">
            <a-col :md="20" :sm="24"><a-input-search style="margin-bottom: 8px" placeholder="Search" @change="onChange" /></a-col>
            <span class="table-page-search-submitButtons cl">
              <a-button icon="plus" style="margin-left: 5px" @click="handleAdd">添加</a-button>
              <a-button icon="delete" style="margin-left: 5px" @click="handleDel">删除</a-button>
              <a-button icon="arrow-up" style="margin-left: 5px" @click="resetTreeUp('up')"></a-button>
              <a-button icon="arrow-down" style="margin-left: 5px" @click="resetTreeUp('down')"></a-button>
            </span>
          </a-row>
        </a-form>
      </div>
    </a-col>

    <a-col :span="15">
      <div><create-menu ref="dictModel"></create-menu></div>
    </a-col>
  </a-card>
</template>

<script>
import { STable } from '@/components';
import Tree from '@/components/Tree/Tree';
import CreateMenu from './create';
import { getPermissionList, del, sortUpdate, sortExchange } from '@/api/framework/dict';
import ACol from 'ant-design-vue/es/grid/Col';
import ARow from 'ant-design-vue/es/grid/Row';
import { mixin } from '@/utils/mixin.js';

export default {
  name: 'dict',
  mixins: [mixin],
  components: {
    Tree,
    ARow,
    ACol,
    STable,
    CreateMenu
  },
  data() {
    return {
      // 权限查询
      u_dict: 'dict@update',
      a_dict: 'dict@save',
      d_dict: 'dict@delete',
      sort_dict: 'dict@sort',
      // 查询参数
      queryParam: {},
      expandedKeys: ['0-0'], // 展开ID
      // 加载数据方法 必须为 Promise 对象
      orgTree: [],
      selectedRowKeys: [],
      display: false,
      searchValue: '',
      selectedKey: [],
      dataList: [],
      autoExpandParent: true
    };
  },
  created() {
    this.initData();
  },

  methods: {
    /* 初始化数据 */
    initData() {
      getPermissionList(this.queryParam).then(res => {
        this.orgTree = res.data;
        if (this.orgTree.length > 0) {
          this.generateListKey(this.orgTree, 0);
          this.generateList(this.orgTree);
        }
      });
    },
    /* 添加分类 */
    handleAdd() {
      if (this.selectedKey != '' && this.selectedKey != '0-0') {
        this.$refs.dictModel.addSon(this.selectedRowKeys);
      } else {
        this.$refs.dictModel.add();
      }
    },
    /* 删除分类 */
    handleDel() {
      if (this.selectedKey != '' && this.selectedKey != '0-0') {
        this.$confirm({
          title: '确定删除' + this.selectedRowKeys.dataRef.title + '吗?',
          okText: '确定',
          okType: 'danger',
          cancelText: '取消',
          onOk: () => {
            del(this.selectedRowKeys.id)
              .then(res => {
                this.$notification['success']({
                  message: res.message,
                  duration: 4
                });
                this.selectedKey = [];
                this.selectedRowKeys = [];
                this.$refs.dictModel.add();
                this.handleOk();
              })
              .catch(err => this.failed(err));
          },
          onCancel() {}
        });
      } else {
        if (this.selectedKey == '0-0') {
          this.$notification['error']({
            message: '此分类不允许删除',
            duration: 4
          });
        } else
          this.$notification['error']({
            message: '请选择要删除的分类',
            duration: 4
          });
      }
    },

    handleOk() {
      this.initData();
    },
    /* 排序 */
    resetTreeUp(action) {
      if(!this.selectedRowKeys.id){
        return false;
      }
      sortUpdate({ id: this.selectedRowKeys.id, action: action }).then(res => {
        if (res.data[0] == true) {
          //排序成功
          this.selectedKey = [];
          this.initData();
        }
      });
    },
    /* 选中节点显示详细内容 */
    handleSelect(selectKey, info) {
      if (selectKey == '0-0') {
        this.selectedKey = [selectKey[0]];
        this.$refs.dictModel.add();
      } else {
        if (info.selected) {
          this.selectedKey = [selectKey[0]];
          this.selectedRowKeys = info.selectedNodes[0].data.props;
          this.display = true;
          this.$refs.dictModel.edit(this.selectedRowKeys);
        } else {
          this.selectedKey = [];
          this.selectedRowKeys = [];
          this.$refs.dictModel.add();
        }
      }
    },
    /* 拖拽节点 */
    onDrop(info) {
      // console.log(info)
      const dropKey = info.node.eventKey;
      const dragKey = info.dragNode.eventKey;
      const dropPos = info.node.pos.split('-');
      const dropPosition = info.dropPosition - Number(dropPos[dropPos.length - 1]);
      //console.log(dropKey)
      // console.log(dragKey)
      let type = 2; //平级移动
      if (!info.dropToGap) {
        type = 1; //移动至父节点
      }
      const to_dir = dropKey.length > dragKey.length ? 'to_childrent' : 'to_parent';
      if (dropKey.length > dragKey.length) {
        this.$notification['error']({
          message: '父节点不能移向子节点',
          duration: 4
        });
        return;
      }

      const dropMenuId = info.node.$options.propsData.dataRef.id; //目标目录id
      const dragMenuId = info.dragNode.$options.propsData.dataRef.id; //移动id
      sortExchange({ dropId: dropMenuId, dragId: dragMenuId, to: to_dir, type: type, pos: dropPosition }).then(res => {
        console.log(res);
        this.initData();
        // 取消选中效果
        this.selectedKey = [];
      });
    },
    /* 搜索框变化 */
    onChange(e) {
      const value = e.target.value;
      if (value == '') {
        this.expandedKeys = ['0-0'];
      } else {
        console.log(this.dataList);
        const expandedKeys = this.dataList
          .map(item => {
            if (item.title.indexOf(value) > -1) {
              return this.getParentKey(item.key, this.orgTree);
            }
            return null;
          })
          .filter((item, i, self) => item && self.indexOf(item) === i);
        console.log(expandedKeys);
        this.expandedKeys = expandedKeys;
      }
      this.searchValue = value;
      this.autoExpandParent = true;
    },
    /* 整理树结构的数据 */
    generateList(data) {
      for (let i = 0; i < data.length; i++) {
        const node = data[i];
        const key = node.key;
        this.dataList.push({ key, title: node.title });
        if (node.children) {
          this.generateList(node.children);
        }
      }
    },
    /* 整理树结构的数据 */
    generateListKey(data, parentKey) {
      for (let i = 0; i < data.length; i++) {
        const node = data[i];
        node.key = parentKey + '-' + i;
        node.scopedSlots = { title: 'title' };
        if (node.children && node.children.length) {
          this.generateListKey(node.children, node.key);
        }
      }
    },
    /* 获取父节点 */
    getParentKey(key, tree) {
      let parentKey;
      for (let i = 0; i < tree.length; i++) {
        const node = tree[i];
        if (node.children) {
          if (node.children.some(item => item.key === key)) {
            parentKey = node.key;
          } else if (this.getParentKey(key, node.children)) {
            parentKey = this.getParentKey(key, node.children);
          }
        }
      }
      return parentKey;
    },
    /* 节点展开 */
    onExpand(expandedKeys) {
      this.expandedKeys = expandedKeys;
      this.autoExpandParent = false;
    }
  }
};
</script>

<style scoped>
@media screen and (max-width: 1600px) {
  .cl {
    white-space: inherit;
  }
}
</style>
