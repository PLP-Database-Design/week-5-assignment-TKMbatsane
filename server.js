
const express = require('express');
const mysql = require('mysql2');
const dotenv = require('dotenv');


const app = express();
dotenv.config();

const db = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
})

db.connect((err) => {
    if (err) {
        return console.log("Error connecting to database", err)
    }
    console.log("Database connection successful")
})

app.get('', (req, res) => {
    res.send('hello world ')
})

app.get('/get-patients', (req, res) => {
    const getPatients = "SELECT * FROM patients"

    db.query(getPatients, (err, results) => {

        if (err) {
            return res.status(500).send("Failed to fetch the patients")
        }


        res.status(200).send(results)
    })
})

app.get('/get-providers', (req, res) => {
    const getProviders = "SELECT first_name, last_name, provider_specialty FROM providers";

    db.query(getProviders, (err, results) => {
        if (err) {
            console.error("Error querying database:", err);
            return res.status(500).send("Failed to fetch the providers");
        }

        res.status(200).json(results);
    });
});


app.get('/get-patients-by-name', (req, res) => {

    const getPatientsByName = "SELECT  first_name FROM patients";


    db.query(getPatientsByName, (err, results) => {
        if (err) {
            console.error("Error querying database:", err); // Log the error details for debugging
            return res.status(500).send("Failed to fetch the patients");
        }

        if (results.length === 0) {
            return res.status(404).send("No patients found with that first name");
        }

        res.status(200).json(results); // Send the results as JSON
    });
});

app.get('/get-providers-by-specialty', (req, res) => {
    const getProvidersBySpecialty = "SELECT provider_specialty FROM providers";

    db.query(getProvidersBySpecialty, (err, results) => {
        if (err) {
            console.error("Error querying database:", err);
            return res.status(500).send("failed to fetch providers");
        }
        if (results.length === 0) {
            return res.status(404).send("NO providers were found ");
        }
        res.status(200).json(results);
    })

});

//declare the port 
const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server is running on PORT ${PORT}`)
})