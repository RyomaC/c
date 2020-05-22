<template>
  <div style="position:relative; background: #0E2A43;">
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
.border-frame{
    position:absolute;
    width:30px;
    height:30px;
    z-index:99;
}
.border-left-top{
    top:6px;
    left:6px;
    border-left:3px solid #fff;
    border-top:3px solid #fff;
}
.border-left-bottom{
    bottom:6px;
    left:6px;
    border-left:3px solid #fff;
    border-bottom:3px solid #fff;
}
.border-right-top{
    top:6px;
    right:6px;
    border-right:3px solid #fff;
    border-top:3px solid #fff;
}
.border-right-bottom{
    bottom:6px;
    right:6px;
    border-right:3px solid #fff;
    border-bottom:3px solid #fff;
}
</style>
