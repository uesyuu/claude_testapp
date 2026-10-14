<script setup>
import OllCard from "@/components/select_view/OllCard.vue";
import {useSelectedStore} from "@/stores/SelectedStore";

const select = useSelectedStore()

// display order of OLL groups on the top page (groups not listed here go last)
const OLL_ORDER = ["T", "U", "L", "H", "Pi", "S", "As"]
const orderIndex = oll => {
  const i = OLL_ORDER.indexOf(oll)
  return i === -1 ? OLL_ORDER.length : i
}

const olls = select.allZbllKeysArray
    .map(key => key.split(' ')[0])
    .filter((oll, i, arr) => arr.indexOf(oll) === i)
    .sort((a, b) => orderIndex(a) - orderIndex(b));

</script>

<template>
  <div class="row gx-0">
    <div v-for="oll in olls" :key="oll" class="col">
      <OllCard :oll="oll"/>
    </div>
  </div>
</template>

<style scoped>
</style>