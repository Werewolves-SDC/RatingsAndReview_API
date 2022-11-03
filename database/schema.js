const mongoose = require('mongoose');

const db = mongoose.connect('mongodb://localhost:27017/reviews')
  .then(() => console.log('Connection to database has been made!'))
  .catch((err) => console.log(err))

const Schema = mongoose.Schema;

const ReviewsSchema = new Schema({
  review_id: Number,
  rating: Number,
  summary: String,
  recommend: Boolean,
  response: String,
  body: String,
  date: Date,
  reviewer_name: String,
  helpfulness: Number,
  photos: Array
});

const Reviews = mongoose.model('Reviews', ReviewsSchema);

const ReviewsMetaSchema = new Schema({
  product_id: Number,
  ratings: {
    1: Number,
    2: Number,
    3: Number,
    4: Number,
    5: Number
  },
  recommended: {
    false: Number,
    true: Number
  },
  characteristics: {
    Fit: {
      id: Number,
      value: Number
    },
    Length: {
      id: Number,
      value: Number
    },
    Comfort: {
      id: Number,
      value: Number
    },
    Quality: {
      id: Number,
      value: Number
    }
  }
});

const ReviewsMeta = mongoose.model('ReviewsMtea', ReviewsMetaSchema);

module.exports = {
  Reviews,
  ReviewsMeta
}