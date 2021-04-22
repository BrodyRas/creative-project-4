<template>
  <div class="home">
    <Login v-if="user === null" />
    <HomeView v-else />
  </div>
</template>

<style scoped>
</style>

<script>
// @ is an alias to /src

import Login from "@/components/Login.vue";
import HomeView from "@/components/HomeView.vue";

export default {
  name: "Home",
  components: {
    Login,
    HomeView
  },
  computed: {
    user() {
      return this.$root.$data.user;
    },
  },
};
</script>
