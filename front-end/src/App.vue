<template>
  <div id="app">
    <div class="header">
      <router-link to="/">
        <div class="logo">
          <img src="/doggo.png" style="width: 100px" />
        </div>
      </router-link>

      <div class="title">
        <h1>Kennels and Doggos</h1>
      </div>
      <div v-if="user !== undefined">
        <p>{{ user.firstName + " " + user.lastName }}</p>
        <p>Log Out</p>
      </div>
    </div>
    <div class="content">
      <router-view />
    </div>
    <div class="footer">
      <router-link v-if="user !== null" to="/admin">Admin</router-link>
      <p></p>
      <a href="https://github.com/BrodyRas/creative-project-4"
        >See Source Code!</a
      >
    </div>
  </div>
</template>

<style>
html {
  box-sizing: border-box;
}

body {
  font-family: "Montserrat", sans-serif;
  font-size: 16px;
  background: #fff;
  padding: 0px;
  margin: 0px;
}

/* Header */
.header {
  display: flex;
  justify-content: space-between;
  padding: 10px 100px 0px 100px;
  background-color: rgb(255, 145, 163);
  color: #1c454f;
}

.title {
  margin-top: 5px;
}

.title h1 {
  font-size: 30px;
  text-decoration: none;
}

.content {
  padding: 20px 100px;
  min-height: 500px;
}

/* Footer */
.footer {
  height: 70px;
  padding: 20px 100px 0px 100px;
  background: #c1fff5;
  font-size: 12px;
}

.footer a {
  color: #000;
}

h1 {
  font-size: 20px;
}

h2 {
  font-size: 14px;
}
</style>

<script>
import axios from "axios";
export default {
  async created() {
    try {
      let response = await axios.get("/api/users");
      this.$root.$data.user = response.data.user;
    } catch (error) {
      this.$root.$data.user = null;
    }
  },
  computed: {
    user() {
      return this.$root.$data.user;
    },
  },
};
</script>