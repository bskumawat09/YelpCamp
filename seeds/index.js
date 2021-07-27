// seperate node file to seed initial data into the database
const mongoose = require('mongoose');
const Campground = require('../models/campground');
const cities = require('./cities');
const { descriptors, places } = require('./seedHelpers');

mongoose.connect('mongodb://localhost:27017/yelp-camp', {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true
});

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
    console.log("Database connected");
});

const sample = (arr) => {
    return arr[Math.floor(Math.random() * arr.length)];
}

const seedDB = async () => {
    await Campground.deleteMany({});
    for (let i = 0; i < 50; i++) {
        const rand = Math.floor(Math.random() * 1000);
        const camp = new Campground({
            title: `${sample(descriptors)} ${sample(places)}`,
            image: 'https://source.unsplash.com/collection/483251/1080x720',
            description: 'Lorem ipsum dolor sit, amet consectetur adipisicing elit. Ab atque illum, facere itaque, debitis nulla blanditiis error, voluptates et neque reprehenderit. Quibusdam, ratione. Ex doloremque ratione rerum pariatur ducimus laboriosam.',
            location: `${cities[rand].city}, ${cities[rand].state}`,
            price: rand + 100

        })
        await camp.save();
    }
}

seedDB()
    .then(() => {
        mongoose.connection.close()
    });