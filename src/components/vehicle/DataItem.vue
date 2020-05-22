<template>
  <el-form label-width="80px" style="height:100%" :class="data_type">
    <el-tabs type="card" v-model="currentAction" @tab-click="loadComponent" v-if="data_action!='new'">
      <el-tab-pane :label="action.title" :name="action.name"  v-for="action in actions.filter((action) => {return action.showInDetail  && checkGranted(action.name)})" :key="action.name"/>
    </el-tabs>
    <component style="padding:5px 20px 10px 10px; height:calc(100% - 60px);overflow-y:auto; overflow-x:hidden;" v-bind:is="itemActionComponent" :data_id="data_id" :data_type="data_type" :data_action="currentAction" :action_type="actionType" :data="data" @itemUpdated="itemUpdated" @hideItem="hideItem"></component>
  </el-form>
</template>

<script>
import DataItemEdit from '@/components/vehicle/DataItem/DataItemEdit'
import securityUtil from '@/utils/securityUtil.js'

export default {
  components: {DataItemEdit},
  props: ['data_id', 'data_type', 'data_action', 'data', 'visible'],
  methods: {
    checkGranted: function (action) {
      return securityUtil.checkGranted(this.data_type + '/' + action)
    },
    loadComponent: function () {
      this.actions = require('./dataconfig/' + this.data_type + '.json').actions
      for (let i = 0; i < this.actions.length; i++) {
        if (this.actions[i].name === this.currentAction) {
          this.actionType = this.actions[i]['type']
          break
        }
      }
      if (this.actionType === 'component') {
        this.itemActionComponent = () => import('@/components/vehicle/DataItem/' + this.data_type + '_' + this.currentAction)
      } else {
        this.itemActionComponent = DataItemEdit
      }
    },
    toggleComponent: function (action) {
      this.currentAction = action
      this.loadComponent()
    },
    hideItem: function () {
      this.$emit('hideItem')
    },
    itemUpdated: function () {
      this.$emit('itemUpdated')
    }
  },
  data: function () {
    return {
      actions: [],
      actionType: '',
      currentAction: '',
      itemActionComponent: DataItemEdit
    }
  },
  mounted: function () {
    this.toggleComponent(this.data_action)
  },
  watch: {
    '$route': function () {
      this.toggleComponent(this.data_action)
    },
    // 'data': function () {
    //   this.toggleComponent(this.data_action)
    // },
    'data_id': function () {
      this.toggleComponent(this.data_action)
    },
    'data_action': function () {
      this.toggleComponent(this.data_action)
    },
    'data_type': function () {
      this.toggleComponent(this.data_action)
    },
    'visible': function () {
      this.toggleComponent(this.data_action)
    }
  }
}
</script>

<style>
.el-tabs__item.is-active {
  background-color: rgb(47, 45, 161);
}
</style>
