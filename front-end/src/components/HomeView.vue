<template>
  <div class="home-view">
    <div v-for="k in kennels" :key="k.id">
      <div class="kennel-container">
        <h1>{{ k.title }}</h1>
        <p>
          <i>{{ k.slogan }}</i>
        </p>
        <section class="image-gallery">
          <div
            class="image"
            v-for="dog in dogs.filter((dog) => dog.kennel === k._id)"
            :key="dog.id"
          >
            <router-link :to="{ name: 'dog', params: { id: dog._id } }">
              <div class="dog-container">
                <h1>{{ dog.name }}</h1>
                <img :src="dog.path" />
                <p>{{ dog.breed }}</p>
                <p>{{ dog.age }}</p>
              </div>
            </router-link>
          </div>
        </section>
      </div>
    </div>
  </div>
</template>

<style scoped>
.kennel-container {
  background-color: rgb(234, 243, 241);
  border: 5px solid rgb(176, 230, 217);
  margin: 10px;
  padding: 10px 20px;
  border-radius: 10px;
}

.dog-container {
  background-color: rgb(255, 244, 244);
  border: 5px solid rgb(248, 189, 189);
  padding: 5px 10px;
  border-radius: 10px;
}

.image h2 {
  font-style: bold;
}

/* Masonry */
*,
*:before,
*:after {
  box-sizing: inherit;
}

.image-gallery {
  column-gap: 1.5em;
}

.image {
  margin: 0 0 1.5em;
  display: inline-block;
  width: 100%;
}

.image img {
  width: 100%;
}

/* Masonry on large screens */
@media only screen and (min-width: 1024px) {
  .image-gallery {
    column-count: 4;
  }
}

/* Masonry on medium-sized screens */
@media only screen and (max-width: 1023px) and (min-width: 768px) {
  .image-gallery {
    column-count: 3;
  }
}

/* Masonry on small screens */
@media only screen and (max-width: 767px) and (min-width: 540px) {
  .image-gallery {
    column-count: 2;
  }
}
</style>

<script>
import axios from "axios";

export default {
  naame: "HomeView",
  data() {
    return {
      kennels: [],
      dogs: [],
    };
  },
  created() {
    this.getData();
  },
  methods: {
    async getData() {
      try {
        let response = await axios.get("/api/kennels");
        this.kennels = response.data;
        response = await axios.get("/api/dogs");
        this.dogs = response.data;
        return true;
      } catch (e) {
        console.log(e);
      }
    },
  },
};
</script>