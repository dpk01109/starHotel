// const { model } = require('mongoose');
const Hotel = require('../models/hotel');
const { cloudinary } = require("../cloudinary");

module.exports.index = async (req, res) => {
    const hotels = await Hotel.find({});
    res.render('hotels/index', { hotels })
};

module.exports.renderNewForm =  (req, res) =>{
     res.render('hotels/new');
}

module.exports.createCampground = async (req, res, next) => {
    if (!req.body.hotel) throw new ExpressError('Invalid Hotel Data', 400);
    
    const hotel = new Hotel(req.body.hotel);
    hotel.images = req.files.map(f => ({ url: f.path, filename: f.filename }));
    hotel.author = req.user._id;
    await hotel.save();
    // console.log(hotel);
    req.flash('success', 'Successfully made a new Hotel!');
    res.redirect(`/hotels/${hotel._id}`)
}

module.exports.showCampground = async (req, res,) => {
    const hotel = await Hotel.findById(req.params.id).populate({
        path: 'reviews',
        populate: {
            path: 'author'
        }
    }).populate('author');
    if (!hotel) {
        req.flash('error', 'Cannot find that hotel!');
        return res.redirect('/hotels');
    }
    res.render('hotels/show', { hotel });
}

module.exports.renderEditForm = async (req, res) => {
    const { id } = req.params;
    const hotel = await Hotel.findById(id)
    if (!hotel) {
        req.flash('error', 'Cannot find that hotel!');
        return res.redirect('/hotels');
    }
    res.render('hotels/edit', { hotel });
}

module.exports.updateCampground = async (req, res) => {
    const { id } = req.params;
    // console.log(req.body);
    const hotel = await Hotel.findByIdAndUpdate(id, { ...req.body.hotel });
    const imgs = req.files.map(f => ({ url: f.path, filename: f.filename }));
    hotel.images.push(...imgs);
    await hotel.save();
    if (req.body.deleteImages) {
        for (let filename of req.body.deleteImages) {
            await cloudinary.uploader.destroy(filename);
        }
        await hotel.updateOne({ $pull: { images: { filename: { $in: req.body.deleteImages } } } })
    }
    req.flash('success', 'Successfully updated hotel!');
    res.redirect(`/hotels/${hotel._id}`)
}

module.exports.deleteCampground = async (req, res) => {
    const { id } = req.params;
    await Hotel.findByIdAndDelete(id);
    req.flash('success', 'Successfully deleted hotel')
    res.redirect('/hotels');
}