<template>
  <div style="font-size: 15px">
    <el-form-item label="地点">{{data.address}}</el-form-item>
<!--    <div>{{data.ts}}</div>-->
    <el-form-item label="联系人">{{data.contact}}</el-form-item>
    <el-form-item label="联系电话">{{data.phone}}</el-form-item>
    <el-form-item label="状态">{{data.status}}</el-form-item>
    <el-form-item label="处理人">{{data.handler}}</el-form-item>
    <el-form-item label="处理结果">{{data.handleResult}}</el-form-item>
    <div><img :src="`https://iot2.sz-luoding.com:888/static/upload/${data.file}`" height="400px"/></div>
    <br/><br/>
    <br/><br/>
  </div>
</template>

<script>
import StatsDataList from '@/components/StatsDataList'
import {_} from 'underscore'
import {JSMpeg} from '../jsmpeg.min.js'

export default {
  props: ['data_id', 'data_action', 'data_type', 'data', 'action_type']
}
</script>

<style>
  
</style>
