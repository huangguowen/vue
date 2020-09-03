<template>
  <a-modal :title="title" :width="800" :visible="visible" :confirmLoading="confirmLoading" @ok="handleSubmit" @cancel="handleCancel">
    <a-spin :spinning="spinning">
      <a-row :gutter="16">
        <a-col :span="8" style="overflow: hidden;">
          <a-card :bordered="true" :bodyStyle="{height: '348px',overflow:'auto'}">
            <template slot="title">
              <a-input-search style="margin-bottom: 8px" placeholder="搜索部门" @search="onChange"/>
            </template>
            <a-tree
              :checkedKeys="selectDepartKeys"
              :tree-data="departData"
              @select="select"
              showLine
              :openKeys="expandedKeys"
              :defaultExpandedKeys="expandedKeys"
            >
              <a-icon slot="smile" type="folder"/>
            </a-tree>
          </a-card>
        </a-col>
        <a-col :span="8" style="overflow: hidden;">
          <a-card :bordered="true" :bodyStyle="{height: '300px',overflow:'auto'}">
            <a-tree
              :checkedKeys="selectUserKeys"
              :tree-data="userData"
              @check="checkUsers"
              show-icon
              checkable
            >
              <a-icon slot="smile" type="user"/>
            </a-tree>
            <template slot="title">
              <a-input-search style="margin-bottom: 8px" placeholder="搜索人员" @search="onChangeUser"/>
            </template>
            <template slot="actions" class="ant-card-actions">
              <span @click="selectAll"><a-icon type="check-square"/> 全选</span>
              <span @click="cancelAll"><a-icon type="minus-square"/> 取消全选</span>
            </template>
          </a-card>
        </a-col>
        <!--        <a-col :span="6" style="overflow: hidden;">-->
        <!--          <a-card :bordered="true" :bodyStyle="{height: '300px',overflow:'auto'}">-->
        <!--            <a-tree :tree-data="selectDepartData" show-icon @select="deleteDepart">-->
        <!--              <a-icon slot="smile" type="folder" />-->
        <!--            </a-tree>-->
        <!--            <template slot="title">-->
        <!--              <div style="height: 40px;line-height: 40px">-->
        <!--                已选部门-->
        <!--              </div>-->
        <!--            </template>-->
        <!--            <template slot="actions" class="ant-card-actions">-->
        <!--              <span key="delete" @click="selectEmpty"><a-icon type="delete" /> 清空</span>-->
        <!--            </template>-->
        <!--          </a-card>-->
        <!--        </a-col>-->
        <a-col :span="8" style="overflow: hidden;">
          <a-card :bordered="true" :bodyStyle="{height: '300px',overflow:'auto'}">
            <a-tree :tree-data="selectUserData" show-icon @select="deleteUser">
              <a-icon slot="smile" type="user"/>
            </a-tree>
            <template slot="title">
              <div style="height: 40px;line-height: 40px">
                已选人员
              </div>
            </template>
            <template slot="actions" class="ant-card-actions">
              <span key="delete" @click="selectEmpty"><a-icon type="delete"/> 清空</span>
            </template>
          </a-card>
        </a-col>
      </a-row>
    </a-spin>
  </a-modal>
</template>

<script>
    import {axios} from '@/utils/request'
    export default {
        name: "SelectPeople",
        props: ['ok'],
        data() {
            return {
                departData: [],
                spinning: false,
                visible: false,
                confirmLoading: false,
                title: '请选择',
                userData: [],
                selectUserKeys: [],
                selectDepartKeys: [],
                selectDepartData: [],
                selectUserData: [],
                pids: [],
                expandedKeys:['0-0'],
                oldKeys:[],
                oldSelectData:[]
            };
        },
        mounted() {
            this.spinning = true
            this.getData().then(res => {
                this.spinning = false
                this.departData = res.data
            });
        },
        methods: {
            getData(param) {
                return axios({
                    url: '/selectPeople',
                    method: 'get',
                    params: param
                })
            },
            /*部门点击事件*/
            select(selectedKeys) {
                this.spinning = true
                this.pids = selectedKeys
                this.getData({type: 'users', pid: selectedKeys}).then(res => {
                    this.spinning = false
                    this.userData = res.data
                });
                this.oldSelectData  = this.selectUserData
                this.oldKeys  = this.selectUserKeys
                this.selectUserKeys = this.oldKeys.length > 0 ? this.oldKeys : []
            },
            /*搜索部门*/
            onChange(e) {
                this.spinning = true
                this.getData({keyword: e}).then(res => {
                    this.spinning = false
                    this.departData = res.data
                });
            },
            open(values) {
                this.visible = true
                for (let index in values) {
                    values[index].slots = {icon: 'smile'}
                }
                this.selectUserData = values || []
                this.selectUserData.forEach((item) => {
                    this.selectUserKeys.push(item.key)
                })
            },
            /*确定*/
            handleSubmit() {
                let keys = [], names = [], departKeys = [], departNames = [];
                for (let index in this.selectUserData) {
                    keys.push(this.selectUserData[index].key)
                    names.push(this.selectUserData[index].title)
                }
                for (let index in this.selectDepartData) {
                    departKeys.push(this.selectDepartData[index].key)
                    departNames.push(this.selectDepartData[index].title)
                }
                this.visible = false
                let params = {
                    userKeys: keys,
                    userNames: names.join(','),
                    userData: this.selectUserData,
                    nameArr: names,
                    departKeys: departKeys,
                    departNames: departNames.join(','),
                    departNamesArr: departNames,
                    departData: this.selectDepartData,
                }
                this.$emit("ok", params);
            },
            /*关闭*/
            handleCancel() {
                this.visible = false
            },
            /*搜索人员*/
            onChangeUser(e) {
                this.spinning = true
                this.getData({type: 'users', pid: this.pids, keyword: e}).then(res => {
                    this.spinning = false
                    this.userData = res.data
                });
            },
            /*选择人员*/
            checkUsers(e) {
                let selectUserData = [],newData = [],delKeyIndex = [],delDataIndex = []
                this.userData.forEach((item) => {
                    if (e.indexOf(item.key) != -1) {
                        selectUserData.push(item)
                    }
                    if (this.oldKeys.indexOf(item.key) != -1 && e.indexOf(item.key) == -1){
                        for (let index in this.oldKeys){
                            if (item.key == this.oldKeys[index]){
                                delKeyIndex.push(index)
                            }
                        }
                        for (let index in this.oldSelectData){
                            if (item.key == this.oldSelectData[index].key){
                                delDataIndex.push(index)
                            }
                        }
                    }
                });
                delKeyIndex.forEach((item) => {
                  this.oldKeys.splice(item,1)
                })
                delDataIndex.forEach((item) => {
                  this.oldSelectData.splice(item,1)
                })
                this.oldSelectData.forEach((item) => {
                    if (item.key  &&  e.indexOf(item.key) == -1){
                        newData.push(item)
                    }
                })
                this.selectUserKeys = e.concat(this.oldKeys)

                this.selectUserData = newData.concat(selectUserData)

            },
            /*全选人员*/
            selectAll() {
                let selectUserKeys = []
                for (let index in this.userData) {
                    selectUserKeys.push(this.userData[index].key)
                }
                this.selectUserKeys = this.oldKeys.concat(selectUserKeys)
                this.selectUserData = this.oldSelectData.concat(this.userData)
            },
            /*取消全选*/
            cancelAll() {
                this.selectUserKeys = this.oldKeys
                this.selectUserData = this.oldSelectData
                for (let index in this.userData) {
                    if (this.selectUserKeys.indexOf(this.userData[index].key) != -1) {
                        this.selectUserKeys.splice(this.selectUserKeys.indexOf(this.userData[index].key),1)
                    }
                }
                let delDataIndex = []
                for (let index in this.selectUserData) {
                    if (this.selectUserKeys.indexOf(this.selectUserData[index].key) == -1) {
                        delDataIndex.push(this.selectUserData[index].key)
                    }
                }
                if (delDataIndex.length > 0){
                    delDataIndex.forEach((item) => {
                        for (let index in this.selectUserData){
                            if (item == this.selectUserData[index].key){
                                this.selectUserData.splice(index,1)
                            }
                        }
                    })
                }
            },
            /*清空*/
            selectEmpty() {
                this.selectUserKeys = []
                this.selectUserData = []
                this.oldKeys  = []
                this.oldSelectData = []
            },
            /*删除已选用户*/
            deleteUser(e) {
                let selectUserData = []
                for (let index in this.selectUserData) {
                    if (e.indexOf(this.selectUserData[index].key) == -1) {
                        selectUserData.push(this.selectUserData[index])
                    }else {
                        this.selectUserKeys.splice(this.selectUserKeys.indexOf(this.selectUserData[index].key),1)
                    }
                }
                this.selectUserData = selectUserData
            },
            deleteDepart(e) {
                let selectDepartData = []
                for (let index in this.selectDepartData) {
                    if (e.indexOf(this.selectDepartData[index].key) == -1) {
                        selectDepartData.push(this.selectDepartData[index])
                    }
                }
                this.selectDepartData = selectDepartData
            },
            /*选择部门*/
            checkDepart(e) {
                this.selectDepartKeys = e
                let selectDepartData = []
                for (let index in this.departData) {
                    if (e.indexOf(this.departData[index].key) != -1) {
                        selectDepartData.push(this.departData[index])
                    }
                }
                this.selectDepartData = selectDepartData
            }
        },
    };
</script>
