<template>
  <div class="admin">
    <h1>The Admin Page!</h1>

    <div class="container">
      <div class="col">
        <div class="heading">
          <div class="circle">1</div>
          <h2>Add a Kennel</h2>
        </div>
        <div class="add">
          <div class="form">
            <input v-model="newKennelTitle" placeholder="Title" />
            <br />
            <input type="text" v-model="newKennelSlogan" placeholder="Slogan" /> <br />
            <input type="text" v-model="newKennelCity" placeholder="City" /> <br />
            <button @click="uploadKennel">Create Kennel!</button>
          </div>
          <div class="upload" v-if="newKennel">
            <h2>{{ newKennel.title }}</h2>
          </div>
        </div>

        <div class="heading">
          <div class="circle">2</div>
          <h2>Edit/Delete a Kennel</h2>
        </div>
        <div class="edit">
          <div class="form">
            <input v-model="findKennel" placeholder="Search Kennels" />
            <div class="suggestions" v-if="kennelSuggestions.length > 0">
              <div
                class="suggestion"
                v-for="s in kennelSuggestions"
                :key="s.id"
                @click="selectKennel(s)"
              >
                {{ s.title }}
              </div>
            </div>
          </div>
          <div class="upload" v-if="foundKennel">
            <h3>Title</h3>
            <input v-model="editKennelTitle" /> <br>
            <h3>Slogan</h3>
            <input type="text" v-model="editKennelSlogan"> <br>
            <h3>City</h3>
            <input type="text" v-model="editKennelCity"> <br>
          </div> <br>
          <div class="actions" v-if="foundKennel">
            <button @click="deleteKennel(foundKennel)">Delete</button>
            <button @click="editKennel(foundKennel)">Edit</button>
          </div>
        </div>
      </div>
      <div class="col">
        <div class="heading">
          <div class="circle">1</div>
          <h2>Add a Dog</h2>
        </div>
        <div class="add">
          <div class="form">
            <input v-model="newDogName" placeholder="Name" />
            <p></p>
            <input type="file" name="photo" @change="fileChanged" /> <br />
            <br />
            <!-- <div v-if="newDogFile !== null">
              <img src="" alt="">
            </div> -->
            <input type="number" v-model="newDogAge" placeholder="Age" /> <br />
            <input type="text" v-model="newDogBreed" placeholder="Breed" /> <br />
            <div class="form">
            <input v-model="newDogKennelTitle" placeholder="Kennel" />
            <div class="suggestions" v-if="kennelSuggestions.length > 0">
              <div
                class="suggestion"
                v-for="s in kennelSuggestions"
                :key="s.id"
                @click="selectDogKennel(s)"
              >
                {{ s.title }}
              </div>
            </div>
          </div>
            <button @click="uploadDog">Send to Kennel!</button>
          </div>
          <div class="upload" v-if="newDog">
            <h2>{{ newDog.name }}</h2>
            <img :src="newDog.path" />
          </div>
        </div>

        <div class="heading">
          <div class="circle">2</div>
          <h2>Edit/Delete a Dog</h2>
        </div>
        <div class="edit">
          <div class="form">
            <input v-model="findDog" placeholder="Search Dogs" />
            <div class="suggestions" v-if="dogSuggestions.length > 0">
              <div
                class="suggestion"
                v-for="s in dogSuggestions"
                :key="s.id"
                @click="selectDog(s)"
              >
                {{ s.name }}
              </div>
            </div>
          </div>
          <div class="upload" v-if="foundDog">
            <img :src="foundDog.path" />
            <p></p>
            <h3>Name</h3>
            <input v-model="editDogName" />
            <p></p>
            <h3>Breed</h3>
            <input v-model="editDogBreed" />
            <p></p>
            <h3>Age</h3>
            <input type="number" v-model="editDogAge" />
          </div>
          <p></p>
          <div class="actions" v-if="foundDog">
            <button @click="deleteDog(foundDog)">Delete</button>
            <button @click="editDog(foundDog)">Edit</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.container {
  display: flex;
  flex-direction: row;
  align-content: center;
}

@media only screen and (max-width: 900px){
	/*Big smartphones [426px -> 600px]*/
  .container{
    flex-direction: column;
  }
}

.col{
  grid-column-start: 1;
  background-color: rgb(255, 215, 222);
  border: 5px solid pink;
  border-radius: 20px;
  padding: 10px 20px;
  margin: 10px;
}

.image h2 {
  font-style: italic;
  font-size: 1em;
}

.heading {
  display: flex;
  margin-bottom: 20px;
  margin-top: 20px;
}

.heading h2 {
  margin-top: 8px;
  margin-left: 10px;
}

.add,
.edit {
  display: flex;
  flex-direction: column;
}

.circle {
  border-radius: 50%;
  width: 18px;
  height: 18px;
  padding: 8px;
  background: #333;
  color: #fff;
  text-align: center;
}

/* Form */
input,
textarea,
select,
button {
  font-family: "Montserrat", sans-serif;
  font-size: 1em;
}

.form {
  margin-right: 50px;
}

/* Uploaded images */
.upload h2 {
  margin: 0px;
}

.upload img {
  max-width: 300px;
}

/* Suggestions */
.suggestions {
  width: 200px;
  border: 1px solid #ccc;
}

.suggestion {
  min-height: 20px;
}

.suggestion:hover {
  background-color: #5bdeff;
  color: #fff;
}
</style>

<script>
import axios from "axios";
export default {
  name: "Admin",
  data() {
    return {
      kennels: [],
      newKennelTitle: "",
      newKennelSlogan: "",
      newKennelCity: "",
      newKennel: null,
      findKennel: "",
      foundKennel: null,
      editKennelTitle: "",
      editKennelSlogan: "",
      editKennelCity: "",

      dogs: [],
      newDog: null,
      newDogName: "",
      newDogFile: null,
      newDogAge: 0,
      newDogBreed: "",
      newDogKennel: null,
      newDogKennelTitle: "",
      findDog: "",
      foundDog: null,
      editDogName: "",
      editDogBreed: "",
      editDogAge: 0,
    };
  },
  created() {
    this.getData();
  },
  computed: {
    kennelSuggestions() {
      let kennels = this.kennels.filter((item) =>
        item.title.toLowerCase().startsWith(this.findKennel.toLowerCase())
      );
      return kennels.sort((a, b) => a.title > b.title);
    },
    dogSuggestions() {
      let dogs = this.dogs.filter((item) =>
        item.name.toLowerCase().startsWith(this.findDog.toLowerCase())
      );
      return dogs.sort((a, b) => a.name > b.name);
    },
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
    selectKennel(kennel) {
      this.findKennel = "";
      this.foundKennel = kennel;
      this.editKennelTitle = this.foundKennel.title;
      this.editKennelSlogan = this.foundKennel.slogan;
      this.editKennelCity = this.foundKennel.city;
    },
    selectDog(dog) {
      this.findDog = "";
      this.foundDog = dog;
      this.editDogName = this.foundDog.name;
      this.editDogAge = this.foundDog.age;
      this.editDogBreed = this.foundDog.breed;
    },
    selectDogKennel(kennel) {
      this.findKennel = "";
      this.newDogKennel = kennel;
      this.newDogKennelTitle = kennel.title;
    },
    async deleteKennel(kennel) {
      try {
        await axios.delete("/api/kennels/" + kennel._id);
        this.foundKennel = null;
        this.getData();
        return true;
      } catch (error) {
        console.log(error);
      }
    },
    async deleteDog(dog) {
      try {
        await axios.delete("/api/dogs/" + dog._id);
        this.foundDog = null;
        this.getData();
        return true;
      } catch (error) {
        console.log(error);
      }
    },
    async editKennel(kennel) {
      try {
        await axios.put(
          "/api/kennels/id=" +
            kennel._id +
            "&title=" +
            this.editKennelTitle +
            "&slogan=" +
            this.editKennelSlogan +
            "&city=" +
            this.editKennelCity,
          {}
        );
        this.foundKennel = null;
        this.getData();
        return true;
      } catch (error) {
        console.log(error);
      }
    },
    async editDog(dog) {
      try {
        await axios.put(
          "/api/dogs/id=" +
            dog._id +
            "&name=" +
            this.editDogName +
            "&breed=" + 
            this.editDogBreed + 
            "&age=" +
            this.editDogAge,
          {}
        );
        this.foundDog = null;
        this.getData();
        return true;
      } catch (error) {
        console.log(error);
      }
    },
    fileChanged(event) {
      this.file = event.target.files[0];
    },
    async uploadKennel() {
      try {
        let r2 = await axios.post("/api/kennels", {
          title: this.newKennelTitle,
          slogan: this.newKennelSlogan,
          city: this.newKennelCity,
        });
        this.addItem = r2.data;
        this.newKennelTitle = "";
        this.newKennelSlogan = "";
        this.newKennelCity = "";
        this.getData();
      } catch (error) {
        console.log(error);
      }
    },
    async uploadDog() {
      try {
        const formData = new FormData();
        formData.append("photo", this.file, this.file.name);
        let r1 = await axios.post("/api/photos", formData);
        let r2 = await axios.post("/api/dogs", {
          name: this.newDogName,
          kennelID: this.newDogKennel._id,
          path: r1.data.path,
          breed: this.newDogBreed,
          age: this.newDogAge,
        });
        this.addItem = r2.data;
        this.newDogName = "";
        this.newDogFile = null;
        this.newDogAge = 0;
        this.newDogBreed = "";
        this.newDogKennel = null;
        this.newDogKennelTitle = "";
      } catch (error) {
        console.log(error);
      }
    },
  },
};
</script>