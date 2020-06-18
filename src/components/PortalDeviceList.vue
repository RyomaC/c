<template>
  <div id="devicelist">
    <div id="actionBar" style="text-align:right; margin-right:10px">
      <el-button type="text" @click="toggleSelectMode(true)" v-show="!selectMode">切换至多选</el-button><el-button type="text" @click="toggleSelectMode(false)" v-show="selectMode">切换至单选</el-button>
    </div>
    <div class="listContainer">
      <div class="groupItem" v-for="(groupDevices,group) in devices" :key="group">
        <div style="clear:both; font-size:15px; line-height:40px">{{(group == 'undefined' || !group) ? "默认组" : group}}
          <el-button type="text" style="float:right; margin-right:10px" v-show="selectMode" @click="toggleGroupSelect(groupDevices, group, groupNotAllSelected[group]?'All':'None')">{{groupNotAllSelected[group]?'全选':'全不选'}}</el-button>
        </div>
        <div style="clear:both; margin-bottom:30px;" id="footer-box-title">
          <span @click="itemClicked(device.UUID)" v-for="device in groupDevices"
            :key="device.ID"
            :ref="device.UUID"
            :class="
              ((!device.STATE || device.STATE == 0)
                ? 'deviceItem offline'
                : device.Warning_state>0
                    ?'deviceItem warning'
                    : device.FirDimming>=10
                      ? 'deviceItem on'
                      :'deviceItem off') +
                      (
                      selectMode
                        ? selectedUUIDs[device.UUID]
                          ? ' selected'
                          : ' select'
                        : selectedUUIDs[device.UUID] ? ' active' : ''
                      ) ">
                {{device.NAME}}
          </span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import {_} from 'underscore'

export default {
  props: ['deviceList', 'selectedUUIDsProp', 'selectModeProp'],
  methods: {
    checkGroupSelectStatus (groupDevices, group) {
      let notAllSelected = false
      for (const device of groupDevices) {
        if (!this.selectedUUIDs[device.UUID]) {
          notAllSelected = true
          break
        }
      }
      this.groupNotAllSelected[group] = notAllSelected
    },
    checkAllGroupSelectStatus () {
      for (const group in this.devices) {
        this.checkGroupSelectStatus(this.devices[group], group)
      }
    },
    toggleGroupSelect (groupDevices, group, selectMode) {
      for (const device of groupDevices) {
        if (selectMode === 'All') {
          this.$set(this.selectedUUIDs, device.UUID, 1)
        } else {
          this.$delete(this.selectedUUIDs, device.UUID)
        }
      }
      this.$emit('itemsSelected', this.selectedUUIDs)
      this.checkAllGroupSelectStatus()
    },
    toggleSelectMode (selectMode) {
      this.selectMode = selectMode
      this.selectedUUIDs = {}
      this.$emit('controlModeChange', selectMode)
    },
    itemClicked (id) {
      if (!this.selectMode) {
        this.selectedUUIDs = {}
        this.$set(this.selectedUUIDs, id, 1)
        this.$emit('itemClicked', id)
        this.$emit('itemsSelected', this.selectedUUIDs)
        return
      }
      if (this.selectedUUIDs[id]) {
        this.$delete(this.selectedUUIDs, id)
      } else {
        this.$set(this.selectedUUIDs, id, 1)
      }
      this.$emit('itemsSelected', this.selectedUUIDs)
      this.checkAllGroupSelectStatus()
    }
  },
  data: function () {
    return {
      devices: [],
      selectMode: false,
      selectedUUIDs: {},
      groupNotAllSelected: {}
    }
  },
  watch: {
    'deviceList': function () {
      this.devices = _.where(this.deviceList, {TYPE: 2})
      this.devices = _.sortBy(this.devices, 'NAME')
      this.devices = _.groupBy(this.devices, 'SUBGROUP')
      this.checkAllGroupSelectStatus()
    },
    'selectedUUIDsProp': function () {
      this.selectedUUIDs = this.selectedUUIDsProp
      console.log('selectedUUIDs', this.selectedUUIDs)
    },
    'selectModeProp': function () {
      this.selectMode = this.selectModeProp
    }
  }
}
</script>

<style scoped>
#devicelist {
  height: 92%;
  text-align: left;
  user-select: none;
}
.listContainer{
  height: calc(100% - 50px);
  overflow: auto;
}
.groupItem {
  color: white
}
.deviceItem {
  color: black;
  background-color: aqua;
  font-size:7pt;
  float: left;
  width: 40px;
  height: 40px;
  margin: 1px;
  word-wrap:break-word;
}
.select {
  opacity: 0.5;
}
.selected {
  opacity: 1;
  -moz-box-shadow: inset red 0 -1px 0 0;
  -webkit-box-shadow: inset red 0 -1px 0 0;
  box-shadow: inset red 0 -1px 0 0;
}
.offline {
  background-color:rgb(37, 70, 131)
}
.on {
  background-color:yellow
}
.off {
  background-color:cornflowerblue
}
.warning {
  background-color:red;
}
.active {
  opacity: 1;
  -moz-box-shadow: inset #09BB07 0 -1px 0 0;
  -webkit-box-shadow: inset #09BB07 0 -1px 0 0;
  box-shadow: inset #09BB07 0 -1px 0 0;
}
.highlight {
  -moz-box-shadow: inset red 0 -1px 0 0;
  -webkit-box-shadow: inset red 0 -1px 0 0;
  box-shadow: inset red 0 -1px 0 0;
}
@media screen and (max-width: 800px) {
  #actionBar{
    display: none;
  }
}
</style>
