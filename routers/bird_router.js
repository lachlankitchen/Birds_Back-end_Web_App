const express = require('express');
const { unwatchFile } = require('fs');
var bird_controller = require('../controllers/bird_controller');
const Birds = require('../models/schema.js');
const multer = require("multer");
const mongoose = require("mongoose");
const upload = multer({dest: 'public/images/'})
const router = express.Router(); // create a router (to export)

/* route the default URL: `/birds/ */
router.get('/', async (req, res) => {
    if (req.query.id !== undefined){
        var id = req.query.id;
        var b = await bird_controller.search_by_id(id);
        res.render('bird_profile', {
            bird: b
        });
    }else{
        const search = req.query.search;
        const status = req.query.status;
        const sort = req.query.sort;
        // render the Pug template 'home.pug' with the filtered data
        const b = await bird_controller.filter_bird_data(search, status, sort)
        res.render('home', {
            birds: b
        });
    }
})

router.get('/create', async (req, res) => {
    var id = req.query.id;
    var b = await bird_controller.search_by_id(id);
    res.render('create_bird', {birds:b});
})

router.post('/create', upload.single('upload'), async (req, res) => {
    const data = req.body;
    const photo = req.file;
    if(req.file === undefined){
        bird_profile = {
            primary_name: data.primary_name,
            english_name: data.english_name,
            scientific_name: data.scientific_name,
            order: data.order,
            family: data.family,
            other_names: data.other_names,
            status: data.status,
            photo: {
                credit: data.credit,
                source: "",
                upload: ""
            },
            size: {
                length: {
                    value: data.length_value,
                    units: 'cm'
                },
                weight: {
                    value: data.weight_value,
                    units: 'g'
                }
            }
        };
    }else{
        // get the data from the request body 
        bird_profile = {
            primary_name: data.primary_name,
            english_name: data.english_name,
            scientific_name: data.scientific_name,
            order: data.order,
            family: data.family,
            other_names: data.other_names,
            status: data.status,
            photo: {
                credit: data.credit,
                source: photo.filename,
                upload: photo.filename
            },
            size: {
                length: {
                    value: data.length_value,
                    units: 'cm'
                },
                weight: {
                    value: data.weight_value,
                    units: 'g'
                }
            }
        };
    }    
    // insert the data into the database
    const db_info = await Birds.create(bird_profile);
    // print some stuff
    console.log(db_info, '/api/create response');
    res.redirect('/');
});

router.get('/update', upload.single('upload'), async (req, res) => {
    var id = req.query.id;
    var b = await bird_controller.search_by_id(id);
    res.render('update_bird', {bird:b});
})

router.post('/edit/:id', upload.single('upload'), async (req, res) => {
    const id = req.params.id;
    const data = req.body;
    const photo = req.file;
    const b = await bird_controller.search_by_id(id);
    if(req.file === undefined){
        bird_profile = {
            primary_name: data.primary_name,
            english_name: data.english_name,
            scientific_name: data.scientific_name,
            order: data.order,
            family: data.family,
            other_names: data.other_names,
            status: data.status,
            photo: {
                credit: data.credit,
                source: b.photo.source,
            },
            size: {
                length: {
                    value: data.length_value,
                    units: 'cm'
                },
                weight: {
                    value: data.weight_value,
                    units: 'g'
                }
            }
        };
    }else{
        // get the data from the request body 
        bird_profile = {
            primary_name: data.primary_name,
            english_name: data.english_name,
            scientific_name: data.scientific_name,
            order: data.order,
            family: data.family,
            other_names: data.other_names,
            status: data.status,
            photo: {
                credit: data.credit,
                source: photo.filename,
                upload: photo.filename
            },
            size: {
                length: {
                    value: data.length_value,
                    units: 'cm'
                },
                weight: {
                    value: data.weight_value,
                    units: 'g'
                }
            }
        };
    }  
    // insert the data into the database
    const db_info = await Birds.findByIdAndUpdate(id, bird_profile);
    
    // print some stuff
    console.log(db_info, '/api/create response');
    
    res.redirect('/');
});

// TODO: Delete bird route(s)
router.post('/delete', async (req, res) => {
    // currently does nothing except redirect to home page
    const id = req.query.id;
    const db_info = await Birds.findByIdAndDelete({ _id: id })
    console.log(db_info, '/api/delete response');
    res.redirect('/');
});

module.exports = router; // export the router