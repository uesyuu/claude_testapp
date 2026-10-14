<script setup>
import {RouterView} from 'vue-router'
import NavBar from "@/components/nav/NavBar.vue";
import "@/assets/global.css"
import {useThemeStore} from "@/stores/ThemeStore";
import {useSessionStore} from "@/stores/SessionStore";
import {useSelectedStore} from "@/stores/SelectedStore";
import {watch} from "vue";

useThemeStore().applyCurrentTheme();
const selected = useSelectedStore()
const session = useSessionStore()

// bind selectStore and sessionStore
watch(() => selected.store.keys, () => {
  session.setSelectedKeys(selected.store.keys, selected.commonScrambleLength)
})
session.setSelectedKeys(selected.store.keys, selected.commonScrambleLength)

</script>

<template>
  <div class="container-fluid min-vh-100 d-flex flex-column">
    <div class="row">
      <NavBar/>
    </div>
    <RouterView/>
    <!-- credit to the original app this one is based on -->
    <footer class="mt-auto py-2 text-center small text-secondary border-top">
      This app is a modified version of
      <a href="https://bestsiteever.net/zbll/#/select" target="_blank" rel="noopener" class="link-secondary">ZBLL trainer</a>
      by Roman Strakhov.
      Original work &copy; Roman Strakhov
      (<a href="https://github.com/Roman-/zbll" target="_blank" rel="noopener" class="link-secondary">github.com/Roman-/zbll</a>).
    </footer>
  </div>
</template>

