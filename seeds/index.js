const mongoose = require('mongoose');
const cities = require('./cities');
const { places, descriptors } = require('./seedHelpers'); 
const Hotel= require('../models/hotel');

mongoose.connect('mongodb://127.0.0.1:27017/yelp-camp');
const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", ()=>{
    console.log("Database connected");
});

const sample = array => array[Math.floor(Math.random() * array.length)];

const seedDB = async() => {
    await Hotel.deleteMany({});
    for (let i = 0; i < 50; i++) {
        const random1000 = Math.floor(Math.random() * 1000);
        const price = Math.floor(Math.random() * 20)+ 10;
        const camp = new Hotel({
            author: '65be4634f99fadaa1bb5ebfd',
            location: `${cities[random1000].city}, ${cities[random1000].state}`,
            title: `${sample(descriptors)} ${sample(places)}`, 
            
            description: 'lorem  ipsum  dolor this bbdvsjgiahlkcbhb vcjhbjbcmn hjdbvj m hohjhdji kjbdlvdfvb',
            price,
            images: [
                {
                  url: 'https://res.cloudinary.com/dnxgljqk6/image/upload/v1707068243/Hotel/q7jzukijfcfek1uzv4tl.webp',
                  filename: 'Hotel/q7jzukijfcfek1uzv4tl'
                }
              ],
            
      })
      await camp.save();
    }
}

seedDB();