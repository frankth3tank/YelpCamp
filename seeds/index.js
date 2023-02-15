const mongoose = require("mongoose");
const Campground = require("../models/campground");
const cities = require("./cities");
const axios = require("axios");
const {descriptors, places} = require("./seedHelpers");

mongoose.connect("mongodb://localhost:27017/yelp-camp");

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
    console.log("Database Connected");
});

const sample = array => array[Math.floor(Math.random() * array.length)];

const seedDB = async () => {
    await Campground.deleteMany({});
    for (let i = 0; i < 50; i++) {
        const random1000 = Math.floor(Math.random() * 1000);
        const price = Math.floor(Math.random() * 20) + 10;
        const camp = new Campground({
            image: await seedImg(),
            location: `${cities[random1000].city}, ${cities[random1000].state}`,
            title:  `${sample(descriptors)} ${sample(places)}`,
            description: "Lorem ipsum, dolor sit amet consectetur adipisicing elit. Ab adipisci, iste quaerat optio consectetur laborum delectus cum repellendus placeat veritatis quo dolore perspiciatis ullam nulla explicabo est ratione cupiditate vel.",
            price
        });
        await camp.save();
    }
};

async function seedImg() {
    try {
      const resp = await axios.get('https://api.unsplash.com/photos/random', {
        params: {
          client_id: 'Rv-fY6bdOv_pZd-lavwDwJwzxNPPEQf9iiUTcITop7c',
          collections: 1114848,
        },
      })
      return resp.data.urls.small
    } catch (err) {
      console.error(err)
    }
}

seedDB().then(() => {
    mongoose.connection.close();
});