const mongoose = require("mongoose");
const uri = 'mongodb+srv://chysuman709:Xp3omR71CGqORipy@test-pro-db.wu9lb.mongodb.net/test-pro-db?retryWrites=true&w=majority&appName=test-pro-db';

function main() {
    mongoose.connect(uri).then(() => {
        console.log("Succesfull connected to the database mongodb-atlas")
    
    }).catch((err) => {
        console.log("Error: ", err)
    })
}

module.exports = { main };