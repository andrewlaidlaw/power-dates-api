// Prepare necessary pre-requisites
const express = require('express');
const cors = require('cors');
const os = require("os");
// var mongo = require('mongodb'); 
const { MongoClient } = require('mongodb');
const http = require('http');

// Collect database settings from environment variables
const mongoHost = process.env.database_host;
const mongoPort = process.env.database_port;
//const mongoDatabase = process.env.database_name;
const mongoUser = process.env.database_user;
const mongoPassword = process.env.database_password;
//const mongoCollection = process.env.database_collection;

const mongoDatabase = "dates";
const mongoCollection = "dates";

// Build MongoDB connection string
//================================
// Used for OpenShift environment
// var url = "mongodb://" + mongoUser + ":" + mongoPassword + "@" + mongoHost + ":" + mongoPort + "/" + mongoDatabase
// Used for local testing
// var url = "mongodb://localhost:27017/dates"
var url = "mongodb+srv://andrew:Fdpgz9Cf@cluster0.xahhl.mongodb.net/?retryWrites=true&w=majority";
console.log("MongoDB instance is at: " + url)

// Set Express.js to listen for all connections
const app = express();
const port = 8080;
const hostname = "0.0.0.0";

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Basic response on /
app.get('/', (req, res) => {
    res.send("ok");
})

// General function to query the MongoDB database by MTM only
async function findbymtm(mtm) {
    // TODO
    // Add logic to check that the MTM passed in is valid

    // Create the query document for MongoDB
    const query = {'mtm': mtm.toUpperCase()};

    // Create a new MongoDB Client connection
    const client = new MongoClient(url, { useNewUrlParser: true, useUnifiedTopology: true });
    // Query the database using the document created above
    try {
        await client.connect();
        const collection = client.db(mongoDatabase).collection(mongoCollection);
        var result = await collection.findOne(query);
    // Catch any errors that come up
    } catch (err) {
        console.error(err);
    // Close the database connection after use
    } finally {
        await client.close();
    }

    // If there is a result, return the entry
    if (result) {
        output = result;
    } else {
        // Otherwise explain why we can't
        output = {"status": "failed", "message": "MTM not found"};
    }
    // Return the JSON document
    return output;
};

// Get all information stored about a server model
app.get('/all/:mtm', async (req,res) => {
    output = await findbymtm(req.params.mtm);
    res.json(output);
});

// Get the announcement date for a server model based on the Machine Type Model (MTM)
app.get('/announce/:mtm', async (req, res) => {
    var result = await findbymtm(req.params.mtm);
    if (result.status == "failed") {
        output = result.message;
    } else {
        output = result.announcement;
    }
    res.send(output);
});

// Get the date of General Availability for a server model based on the Machine Type Model (MTM)
app.get('/ga/:mtm', async (req, res) => {
    var result = await findbymtm(req.params.mtm);
    if (result.status == "failed") {
        output = result.message;
    } else {
        output = result.ga;
    }
    res.send(output);
});

// Get the withdrawn from marketing date for a server model based on the Machine Type Model (MTM)
app.get('/wdfm/:mtm', async (req, res) => {
    var result = await findbymtm(req.params.mtm);
    if (result.status == "failed") {
        output = result.message;
    } else {
        if (result.wdfm) {
            output = result.wdfm;
        } else {
            output = "No withdrawal from marketing date has been announced for " + req.params.mtm + ".";
        }
    }
    res.send(output);
});

// Get the withdrawn from marketing date for a server model based on the Machine Type Model (MTM)
app.get('/eos/:mtm', async (req, res) => {
    var result = await findbymtm(req.params.mtm);
    if (result.status == "failed") {
        output = result.message;
    } else {
        if (result.eos) {
            output = result.eos;
        } else {
            output = "No end of support date has been announced for " + req.params.mtm + ".";
        }
    }
    res.send(output);
});

// Get all of the relevant dates for a server model based on the Machine Type Model (MTM)
app.get('/dates/:mtm', async (req, res) => {
    var result = await findbymtm(req.params.mtm);
    if (result.status == "failed") {
        output = result.message;
    } else {
        output = result.alldates;
    }
    res.send(output);
});

// Get the sales manual link for the Machine Type Model (MTM)
app.get('/smurl/:mtm', async (req, res) => {
    var result = await findbymtm(req.params.mtm);
    if (result.status == "failed") {
        output = result.message;
    } else {
        if (result.smlink) {
            output = result.smlink;
        } else {
            output = "No sales manual URL has been provided for " + req.params.mtm + ".";
        }
    }
    res.send(output);
});

app.get('/json/:mtm', async (req, res) => {
    var result = await findbymtm(req.params.mtm);
    if (result.status == "failed") {
        output = result.message;
    } else {
        if (result) {
            output = {"status": "success"};
            output.announce = result.announcement;
            output.available = result.ga;
            output.wdfm = result.wdfm;
            output.eos = result.eos;
            output.mtm = result.mtm;
            if (result.smlink) {
                output.smurl = result.smlink
            };
        } else {
            output = {"status": "failed", "message": "Database has not responded"}
        }
    }
    res.json(output);
});

app.post('/json', async (req,res) => {
    var result = await findbymtm(req.body.mtm);
    if (result.status == "failed") {
        output = result.message;
    } else {
        if (result) {
            output = {"status": "success"};
            output.announce = result.announcement;
            output.available = result.ga;
            output.wdfm = result.wdfm;
            output.eos = result.eos;
            output.mtm = result.mtm;
            if (result.smlink) {
                output.smurl = result.smlink
            };
        } else {
            output = {"status": "failed", "message": "Database has not responded"}
        }
    }
    res.json(output);
});

// Healthcheck on /healthz
app.get('/healthz', (req, res) => {
    res.send('ok');
});

// Shows the URL of the MongoDB instance
app.get('/url', (req, res) => {
    res.send(url);
});

// Deploy web server and log status
app.listen(port, hostname, () => {
    console.log(`MongoDB app listening at http://${hostname}:${port}`)
});