// const birds_json = require('../public/nzbird.json');
const Birds = require('../models/schema.js');
const { bird_sort, search_string } = require('./bird_utils.js');

// get all birds (filtered)
async function filter_bird_data(search, status, sort) {
    // var results = birds;
    //v ar results = birds_json;
    var results = await Birds.find({});
    
    // filter by conservation status 
    if (status !== undefined && status !== "All") {
        results = results.filter((b) => b.status == status);
    }
    // filter by search string
    if (search !== undefined && search !== "") {
        results = search_string(results, search);
    }
    // sort by
    if (sort !== undefined) {
        results = bird_sort(results, sort);
    }
    
    return results;
}

async function search_by_id(id){
    var results = await Birds.find();
    for(i = 0; i< results.length; i++){
        if(results[i]._id == id){
            return results[i];
        }
    }
}

module.exports = { filter_bird_data, search_by_id };