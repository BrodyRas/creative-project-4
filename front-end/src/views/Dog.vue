<template>
  <div class="dog">
    <div v-if="dog !== null">
      <img :src="dog.path" />
      <div class="dogInfo">
        <p>{{ dog.name }}</p>
        <p>{{ dog.age }}</p>
      </div>

      <h1>Comments:</h1>
      <h2>Create a new comment!</h2>
      <textarea v-model="newComment" cols="30" rows="10"></textarea><br />
      <button @click="createComment">Create!</button>
      <div v-for="comment in comments" :key="comment.id">
        <hr />
        <h3>{{ comment.user.name }}</h3>
        <p>{{ comment.msg }}</p>
        <p>
          <i>{{ formatDate(comment.created) }}</i>
        </p>
      </div>
    </div>
  </div>
</template>

<style>
</style>

<script>
import axios from "axios";
import moment from "moment";
export default {
  name: "Dog",
  data() {
    return {
      dog: null,
      comments: [],
      newComment: "",
      error: "",
    };
  },
  created() {
    this.getDog();
    this.getComments();
  },
  methods: {
    async getDog() {
      try {
        let id = this.$route.params.id;
        let response = await axios.get("/api/dogs/" + id);
        this.dog = response.data;
      } catch (error) {
        this.error = error.response.data.message;
      }
    },
    async getComments() {
      try {
        let id = this.$route.params.id;
        let response = await axios.get("/api/comments/" + id);
        this.comments = response.data;
      } catch (error) {
        this.error = error.response.data.message;
      }
    },
    async createComment() {
      try {
        let response = await axios.post("/api/comments/", {
          user: this.$root.$data.user._id,
          dog: this.dog._id,
          msg: this.newComment,
        });
        console.log(response);
        this.newComment = "";
        this.getComments();
      } catch (error) {
        console.log(error);
      }
    },
    formatDate(date) {
      if (moment(date).diff(Date.now(), "days") < 15)
        return moment(date).fromNow();
      else return moment(date).format("d MMMM YYYY");
    },
  },
};
</script>