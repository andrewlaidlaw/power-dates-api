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
var url = "mongodb://" + mongoUser + ":" + mongoPassword + "@" + mongoHost + ":" + mongoPort + "/" + mongoDatabase
// Used for local testing
// var url = "mongodb://localhost:27017/dates"
// var url = "mongodb+srv://andrew:Fdpgz9Cf@cluster0.xahhl.mongodb.net/?retryWrites=true&w=majority";
console.log("MongoDB instance is at: " + url)

// Set Express.js to listen for all connections
const app = express();
const port = 8080;
const hostname = "0.0.0.0";

app.use(cors());

// Basic response on /
app.get('/', (req, res) => {
    res.send("ok");
})

// This function is currently undocumented in the OpenAPI specification
// Provides all entries in the Dates database using the query modifier from HTTP query
app.get('/findall', (req, res) => {
    const client = new MongoClient(url, { useNewUrlParser: true, useUnifiedTopology: true });
    console.log("connection created");
    async function findall(findQuery) {
        var result = ""
        try {
            await client.connect();
            console.log("connected");
            const collection = client.db(mongoDatabase).collection(mongoCollection);
            console.log("collection set");
            console.log("query is: " + JSON.stringify(findQuery));
            result = await collection.find(findQuery).toArray();
            console.log("search completed");
        } finally {
            await client.close();
            console.log("client closed");
        }
        console.log("returning result:");
        console.log(result);
        res.send(result);
    }
    findall(req.query).catch(console.dir);
})

// Get the announcement date for a server model based on the Machine Type Model (MTM)
app.get('/announce/:mtm', (req, res) => {
    // TODO
    // Build logic to check that MTM is valid and in correct format

    // Create the query document for MongoDB
    const announcequery = {'mtm': req.params.mtm.toUpperCase() };
    console.log("1 Query is: " + JSON.stringify(announcequery));
    
    // Create a new MongoDB Client connection
    const client = new MongoClient(url, { useNewUrlParser: true, useUnifiedTopology: true });
    console.log("connection created");
    
    // Define our lookup function
    async function findannounce(findQuery) {
        var result = ""
        try {
            await client.connect();
            console.log("connected");
            const collection = client.db(mongoDatabase).collection(mongoCollection);
            console.log("collection set");
            result = await collection.findOne(findQuery);
            console.log("search completed");
        } finally {
            await client.close();
            console.log("client closed");
        }
        console.log("returning result:");
        console.log(result);
        // If there is a result, return only the announcement date
        if (result) {
            output = result.announcement;
        } else {
            // Otherwise explain why we can't
            output = "No servers with MTM " + req.params.mtm + " found."
        }
        console.log(output);
        res.send(output);
    }
    // Try to find the announcement date with our specified MTM
    findannounce(announcequery).catch(console.dir);
})

// Get the general availability date for a server model based on the Machine Type Model (MTM)
app.get('/ga/:mtm', (req, res) => {
    // TODO
    // Build logic to check that MTM is valid and in correct format

    // Create the query document for MongoDB
    const gaquery = {'mtm': req.params.mtm.toUpperCase() };
    console.log("1 Query is: " + JSON.stringify(gaquery));
    
    // Create a new MongoDB Client connection
    const client = new MongoClient(url, { useNewUrlParser: true, useUnifiedTopology: true });
    console.log("connection created");
    
    // Define our lookup function
    async function findga(findQuery) {
        var result = ""
        try {
            await client.connect();
            console.log("connected");
            const collection = client.db(mongoDatabase).collection(mongoCollection);
            console.log("collection set");
            result = await collection.findOne(findQuery);
            console.log("search completed");
        } finally {
            await client.close();
            console.log("client closed");
        }
        console.log("returning result:");
        console.log(result);
        // If there is a result, return only the GA date
        if (result) {
            output = result.ga;
        } else {
            // Otherwise explain why we can't
            output = "No servers with MTM " + req.params.mtm + " found."
        }
        console.log(output);
        res.send(output);
    }
    // Try to find the general availability date with our specified MTM
    findga(gaquery).catch(console.dir);
})

// Get the withdrawn from marketing date for a server model based on the Machine Type Model (MTM)
app.get('/wdfm/:mtm', (req, res) => {
    // TODO
    // Build logic to check that MTM is valid and in correct format

    // Create the query document for MongoDB
    const wdfmquery = {'mtm': req.params.mtm.toUpperCase() };
    console.log("1 Query is: " + JSON.stringify(wdfmquery));
    
    // Create a new MongoDB Client connection
    const client = new MongoClient(url, { useNewUrlParser: true, useUnifiedTopology: true });
    console.log("connection created");
    
    // Define our lookup function
    async function findwdfm(findQuery) {
        var result = ""
        try {
            await client.connect();
            console.log("connected");
            const collection = client.db(mongoDatabase).collection(mongoCollection);
            console.log("collection set");
            result = await collection.findOne(findQuery);
            console.log("search completed");
        } finally {
            await client.close();
            console.log("client closed");
        }
        console.log("returning result:");
        console.log(result);
        // If there is a result, return only the WDFM date if one exists
        if (result) {
            // Check a WDFM date is available
            if (result.wdfm) {
                output = result.wdfm;
            } else {
                output = "No withdrawal from marketing date has been announced for " + req.params.mtm + ".";
            }
        } else {
            // Otherwise explain why we can't
            output = "No servers with MTM " + req.params.mtm + " found."
        }
        console.log(output);
        res.send(output);
    }
    // Try to find the withdrawal from marketing date with our specified MTM
    findwdfm(wdfmquery).catch(console.dir);
})

// Get the withdrawn from marketing date for a server model based on the Machine Type Model (MTM)
app.get('/eos/:mtm', (req, res) => {
    // TODO
    // Build logic to check that MTM is valid and in correct format

    // Create the query document for MongoDB
    const eosquery = {'mtm': req.params.mtm.toUpperCase() };
    console.log("1 Query is: " + JSON.stringify(eosquery));
    
    // Create a new MongoDB Client connection
    const client = new MongoClient(url, { useNewUrlParser: true, useUnifiedTopology: true });
    console.log("connection created");
    
    // Define our lookup function
    async function findeos(findQuery) {
        var result = ""
        try {
            await client.connect();
            console.log("connected");
            const collection = client.db(mongoDatabase).collection(mongoCollection);
            console.log("collection set");
            result = await collection.findOne(findQuery);
            console.log("search completed");
        } finally {
            await client.close();
            console.log("client closed");
        }
        console.log("returning result:");
        console.log(result);
        // If there is a result, return only the WDFM date if one exists
        if (result) {
            // Check a EOS date is available
            if (result.eos) {
                output = result.eos;
            } else {
                output = "No end of support date has been announced for " + req.params.mtm + ".";
            }
        } else {
            // Otherwise explain why we can't
            output = "No servers with MTM " + req.params.mtm + " found."
        }
        console.log(output);
        res.send(output);
    }
    // Try to find the end of support date with our specified MTM
    findeos(eosquery).catch(console.dir);
})

// Get all of the relevant dates for a server model based on the Machine Type Model (MTM)
app.get('/dates/:mtm', (req, res) => {
    // TODO
    // Build logic to check that MTM is valid and in correct format

    // Create the query document for MongoDB
    const datesquery = {'mtm': req.params.mtm.toUpperCase() };
    console.log("1 Query is: " + JSON.stringify(datesquery));
    
    // Create a new MongoDB Client connection
    const client = new MongoClient(url, { useNewUrlParser: true, useUnifiedTopology: true });
    console.log("connection created");
    
    // Define our lookup function
    async function finddates(findQuery) {
        var result = ""
        try {
            await client.connect();
            console.log("connected");
            const collection = client.db(mongoDatabase).collection(mongoCollection);
            console.log("collection set");
            result = await collection.findOne(findQuery);
            console.log("search completed");
        } finally {
            await client.close();
            console.log("client closed");
        }
        console.log("returning result:");
        console.log(result);
        // If there is a result, return all of the dates
        if (result) {
            output = result.alldates;
        } else {
            // Otherwise explain why we can't
            output = "No servers with MTM " + req.params.mtm + " found."
        }
        console.log(output);
        res.send(output);
    }
    // Try to find the various relevant dates for our specified MTM
    finddates(datesquery).catch(console.dir);
})

// Get the sales manual link for the Machine Type Model (MTM)
app.get('/smurl/:mtm', (req, res) => {
    // TODO
    // Build logic to check that MTM is valid and in correct format

    // Create the query document for MongoDB
    const smurlquery = {'mtm': req.params.mtm.toUpperCase() };
    console.log("1 Query is: " + JSON.stringify(smurlquery));
    
    // Create a new MongoDB Client connection
    const client = new MongoClient(url, { useNewUrlParser: true, useUnifiedTopology: true });
    console.log("connection created");
    
    // Define our lookup function
    async function findsmurl(findQuery) {
        var result = ""
        try {
            await client.connect();
            console.log("connected");
            const collection = client.db(mongoDatabase).collection(mongoCollection);
            console.log("collection set");
            result = await collection.findOne(findQuery);
            console.log("search completed");
        } finally {
            await client.close();
            console.log("client closed");
        }
        console.log("returning result:");
        console.log(result);
        // If there is a result, return the link to the Sales Manual page
        if (result) {
            // Check that we have a link available
            if (result.smlink) {
                output = result.smlink;
            } else {
                output = "No link available for MTM " + req.params.mtm + ".";
            }
        } else {
            // Otherwise explain why we can't
            output = "No servers with MTM " + req.params.mtm + " found."
        }
        console.log(output);
        res.send(output);
    }
    // Try to find the various relevant dates for our specified MTM
    findsmurl(smurlquery).catch(console.dir);
})

app.get('/json/:mtm', (req, res) => {
    // TODO
    // Build logic to check that MTM is valid and in correct format

    // Create the query document for MongoDB
    const datesquery = {'mtm': req.params.mtm.toUpperCase() };
    console.log("1 Query is: " + JSON.stringify(datesquery));
    
    // Create a new MongoDB Client connection
    const client = new MongoClient(url, { useNewUrlParser: true, useUnifiedTopology: true });
    console.log("connection created");
    
    // Define our lookup function
    async function finddates(findQuery) {
        var result = ""
        try {
            await client.connect();
            console.log("connected");
            const collection = client.db(mongoDatabase).collection(mongoCollection);
            console.log("collection set");
            result = await collection.findOne(findQuery);
            console.log("search completed");
        } finally {
            await client.close();
            console.log("client closed");
        }
        console.log("returning result:");
        console.log(result);
        // If there is a result, return all of the dates
        if (result) {
            output = {"success": 1};
            output.announce = result.announcement;
            output.available = result.ga;
            output.wdfm = result.wdfm;
            output.eos = result.eos;
            if (result.smlink) {
                output.smurl = result.smlink
            };
        } else {
            // Otherwise explain why we can't
            output = {"success": 0, "message": "No servers with MTM " + req.params.mtm + " found."};
        }
        console.log(output);
        res.json(output);
    }
    // Try to find the various relevant dates for our specified MTM
    finddates(datesquery).catch(console.dir);
})

// Healthcheck on /healthz
app.get('/healthz', (req, res) => {
    res.send('ok');
})

// Shows the URL of the MongoDB instance
app.get('/url', (req, res) => {
    res.send(url);
})

// Deploy web server and log status
app.listen(port, hostname, () => {
    console.log(`MongoDB app listening at http://${hostname}:${port}`)
})