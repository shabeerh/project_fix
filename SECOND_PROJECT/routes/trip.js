const fetch = require('node-fetch');
const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const Trip = require("../models/trip")
//C
app.get('/trips/add', (req, res, next) => {
    res.render("trip/create")
})
app.post('/trips/add', (req, res, next) => {
    // res.json(req.session.user);
    // return;
    const address = req.body.address
    const apiKey = "AIzaSyAwP4jgYQS1sB9WLmdLV3Bhmfk2-lF3OR4" 
    const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${address}&key=${apiKey}`
    const latlng = fetch(url).then(res=>res.json()).then(res=>res.results[0].geometry.location).catch(err=>{ // fetching lat/long of address
    throw err;
})
const {lat,lng} = latlng;

    Trip
        .create({
            title: req.body.title,
            start: req.body.start,
            end: req.body.end,
            address: req.body.address,
            creator:req.session.user._id, //storing user id in the trip
            coordinates:[lat,lng]   // storing lat/lng
        })
        .then(() => {
            res.redirect('/trips')
        })
        .catch((err) => {
            res.send('error', err)
        })
})
//R list
app.get('/trips', (req, res, next) => {
    Trip
        .find({creator:req.session.user._id}) //find trips of current logged in user
        .then((tripData) => {
            res.render("trip/list", {
                tripsHbs: tripData
            });
        })
        .catch((err) => {
            res.send('error', err)
        })
})
//R detail
app.get("/trips/:id", (req, res, next) => {
    Trip
        .findById(req.params.id)
        .then((tripData) => {
            res.render("trip/detail", {
                tripsHbs: tripData
            });
        })
        .catch((err) => {
            res.send('error', err)
        })
})
//U
app.get("/trips/update/:id", (req, res, next) => {
    Trip
        .findById(req.params.id)
        .then((tripData) => {
            res.render("trip/update", {
                tripsHbs: tripData
            });
        })
        .catch((err) => {
            res.send('error', err)
        })
})
app.post("/trips/update/:id", (req, res, next) => {
    Trip
        .findByIdAndUpdate(req.params.id, {
            name: req.body.name,
            image: req.body.image
        })
        .then(() => {
            res.redirect(`/trips/${req.params.id}`);
        })
        .catch((err) => {
            res.send('error', err)
        })
})
//D
app.get("/trips/delete/:id", (req, res, next) => {
    Trip
        .findByIdAndDelete(req.params.id)
        .then(() => {
            res.redirect("/trips");
        })
        .catch((err) => {
            res.send('error', err);
        })
})
//export
module.exports = app;