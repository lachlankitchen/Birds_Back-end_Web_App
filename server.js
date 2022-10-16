const dotenv = require('dotenv')
const path = require('path');
const express = require('express');
const bird_router = require('./routers/bird_router');
const image_router = require('./routers/image_router');
const mongoose = require("mongoose");
const Birds = require("./models/schema.js")
const bodyParser = require('body-parser');
/* load .env */
dotenv.config();

/* create Express app */
const app = express();

app.use(bodyParser.urlencoded({ extended: false }))

// Setup Atlas as the database host
const user = process.env.ATLAS_USER;
const password = process.env.ATLAS_PASSWORD;
const db_nm = process.env.DB_NAME;
const db_url = `mongodb+srv://${user}:${password}@cluster0.8ylicsf.mongodb.net/${db_nm}`
const options = {
    useNewUrlParser: true,
    useUnifiedTopology: true,
}

// TODO: connect to a database
mongoose.connect(db_url, options).then(() => {
    console.log('successfully connected!')
}).catch((e) => {
    console.error(e, 'could not connect!')
});

/* setup Express middleware */
// Pug for SSR (static site rendering)
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');
// TODO: middleware for parsing POST body
// TODO: middleware for uploading files

/* host static resources (.css, .js, ...) */
app.use('/images/', image_router);
app.use('/', express.static(path.resolve(__dirname, 'public/')));

/* redirect root route `/` to `/birds/` */
app.get('/', (req, res) => {
    res.redirect('/birds/');
});

app.use('/birds/', bird_router);

app.use('/api/getallbirds/', async (req, res) =>{
    const birds = await Birds.find({});
    res.json(birds);
});

// TODO: 404 page
/* redirect root route `/` to `/birds/` */
app.get('*', (req, res) => {
    res.status(404);
    res.render('404');
});

/* start the server */
const PORT = process.env.PORT;
app.listen(PORT, () => {
    console.log(`Server is live http://localhost:${PORT}`);
});
