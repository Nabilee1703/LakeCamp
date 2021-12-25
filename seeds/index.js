const mongoose = require('mongoose');
const cities = require('./cities');
const { places, descriptors } = require('./seedHelpers');
const Campground = require('../schema/campground');
const Review = require('../schema/review');
async function main() {
  await mongoose.connect('mongodb://localhost:27017/yelpcamp');
}
main()
.then(()=>{
    console.log('Connected yelpcamp database')
})
.catch(err => console.log(err));

const db = mongoose.connection;

db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
    console.log("Database connected");
});
async function destroy(){{
    await Campground.deleteMany({})
  }}
destroy()
async function destroy2(){{
    await Review.deleteMany({})
  }}
destroy2()

const sample = (array) => array[Math.floor(Math.random() * array.length)]
async function seedDB() {
        for (let i = 0; i < 150; i++){
            const random = Math.floor(Math.random() *1000)
            const price = Math.floor(Math.random() * 50) + 10
            const camp = new Campground({
                owner: '61c062ac87678d032ebbf0b2',
                title: `${sample(places)} ${sample(descriptors)}`,
                location: `${cities[random].city}, ${cities[random].state}`,
                geometry:{"type":"Point","coordinates":[cities[random].longitude, cities[random].latitude]},
                images: [ { "path" : "https://res.cloudinary.com/diwpadoiz/image/upload/v1640257019/YelpCamp/opaiv6fsxisfkmefxeqm.jpg", "filename" : "YelpCamp/opaiv6fsxisfkmefxeqm" }, { "path" : "https://res.cloudinary.com/diwpadoiz/image/upload/v1640257413/YelpCamp/mqaju8suqgmn7nczmjr4.jpg", "filename" : "YelpCamp/mqaju8suqgmn7nczmjr4"} ],
                description: 'Lorem, ipsum dolor sit amet consectetur adipisicing elit. Molestiae, dolore. Quis odit qui, labore inventore nobis nihil recusandae eum, velit et dolores delectus exercitationem repellat a omnis, adipisci deleniti dolorum.',
                price: price 
            })
            await camp.save()
        }
}

seedDB()
// .then(() => {
//         mongoose.connection.open();
// })

// const sample = array => array[Math.floor(Math.random() * array.length)];


// const seedDB = async () => {
//     await Campground.deleteMany({});
//     for (let i = 0; i < 50; i++) {
//         const random1000 = Math.floor(Math.random() * 1000);
//         const camp = new Campground({
//             location: `${cities[random1000].city}, ${cities[random1000].state}`,
//             title: `${sample(descriptors)} ${sample(places)}`
//         })
//         await camp.save();
//     }
// }

// seedDB().then(() => {
//     mongoose.connection.close();
// })