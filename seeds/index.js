if (process.env.NODE_ENV !== "production") {
    require('dotenv').config();
}

const mongoose = require('mongoose');
const cities = require('./cities');
const {places, descriptors} = require('./seedHelpers');
const Campground = require('../models/campground');

const dbUrl = process.env.DB_URL || 'mongodb://localhost:27017/hikes-n-camps';
mongoose.connect(dbUrl, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true
});

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
    console.log("Database connected");
});

const sample = (array) => array[Math.floor(Math.random() * array.length)];

const seedDB = async () => {
    await Campground.deleteMany({});
    for (let i=0; i<200; i++) {
        const random1000 = Math.floor(Math.random() * 1000);
        const price = (Math.floor(Math.random() * 50) + 10)*100;
        const camp = new Campground({
            // YOUR USER ID
            author: '61082701577e5638642b05f8',
            location: `${cities[random1000].city}, ${cities[random1000].state}`,
            title: `${sample(descriptors)} ${sample(places)}`,
            description: "Lorem ipsum dolor sit amet consectetur, adipisicing elit. Assumenda beatae excepturi placeat ea eos recusandae repudiandae, aliquam ipsum dolorem inventore facilis quam nulla porro minima ipsam veniam natus dicta quis!",
            price,
            geometry: { 
                type: 'Point', 
                coordinates: [
                    cities[random1000].longitude, 
                    cities[random1000].latitude
                ] 
            },
            images: [
                {
                  url: 'https://res.cloudinary.com/wizzard21/image/upload/v1629477610/Hikes_n_Camps/caqrzbyww1dmhax3kaz4.jpg',
                  filename: 'Hikes_n_Camps/caqrzbyww1dmhax3kaz4'
                },
                {
                  url: 'https://res.cloudinary.com/wizzard21/image/upload/v1629477610/Hikes_n_Camps/ivcqxtoeq0mv9xl7gjhx.jpg',
                  filename: 'Hikes_n_Camps/ivcqxtoeq0mv9xl7gjhx'
                }
              ]
        })
        await camp.save();
    }
}

seedDB().then(() => {
    mongoose.connection.close();
})