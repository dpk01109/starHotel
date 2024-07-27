const express = require('express');
const router = express.Router();
const hotels = require('../controllers/hotels');
const catchAsync = require('../utils/catchAsync');

const { isLoggedIn, isAuthor, validateCampground } = require('../middleware');

const multer = require('multer');
const { storage } = require('../cloudinary');
const upload = multer({ storage });


const Hotel = require('../models/hotel');



router.route('/')
    .get(catchAsync(hotels.index))
    .post(isLoggedIn, upload.array('image'), validateCampground,  catchAsync(hotels.createCampground))
    
    

router.get('/new', isLoggedIn, hotels.renderNewForm)

router.route('/:id')
    .get(catchAsync(hotels.showCampground))
    .put(isLoggedIn, isAuthor, upload.array('image'), validateCampground, catchAsync(hotels.updateCampground))
    .delete(isLoggedIn, isAuthor,  catchAsync(hotels.deleteCampground));

    router.get('/:id/edit', isLoggedIn, isAuthor, catchAsync(hotels.renderEditForm))


module.exports = router;