<template>
  <div class="show_content">
    <i class="border-frame border-left-top"></i>
    <i class="border-frame border-left-bottom"></i>
    <i class="border-frame border-right-top"></i>
    <i class="border-frame border-right-bottom"></i>
    <slot/>
  </div>
</template>

<script>
export default {

}
</script>

<style scoped>
.show_content {
    position:relative; 
    background: #0E2A43;
}
.border-frame{
    position:absolute;
    width:30px;
    height:30px;
    z-index:99;
    border: 2px solid #49C7D9;
}
.border-left-top{
    top:2px;
    left:2px;
    border-right:0;
    border-bottom:0;
}
.border-left-bottom{
    bottom:2px;
    left:2px;
    border-right:0;
    border-top:0;
}
.border-right-top{
    top:2px;
    right:2px;
    border-left:0;
    border-bottom:0;
}
.border-right-bottom{
    bottom:2px;
    right:2px;
    border-left:0;
    border-top:0;
}
</style>
