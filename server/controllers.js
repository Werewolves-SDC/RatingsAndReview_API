const models = require('./models.js');

const getReviews = (req, res) => {
  let count = req.query.count || 5;
  let page = (req.query.page - 1) || 0;
  let product_id = req.query.product_id;
  let sort = req.query.sort || 'relevant';
  return models.getReviews(product_id, count, page, sort)
    .then((response) => {

      res.status(200).send({
        'product': product_id,
        'page': page,
        'count': count,
        'results': response.rows
      });
    })
    .catch((err) => {
      console.log('error getting reviews: ', err);
      res.status(500).send(err);
    })
}

const getReviewMeta = (req, res) => {
  let product_id = req.query.product_id;
  return models.getReviewMeta(product_id)
    .then((response) => {

      res.status(200).send(response.rows[0]);
    })
    .catch((err) => {
      console.log('error getting metadata: ', err);
      res.status(500).send(err);
    })
}

const markReviewHelpful = (req, res) => {

  let review_id = req.params.review_id;
  models.markReviewHelpful(review_id)
    .then(() => {
      res.status(204).send('Review marked as helpful!')
    })
    .catch((err) => {
      console.log('error marking review as helpful: ', err);
      res.status(500).send(err);
    })
}

const reportReview = (req, res) => {

  let review_id = req.params.review_id;
  models.reportReview(review_id)
    .then(() => {
      res.status(204).send('Review reported')
    })
    .catch((err) => {
      console.log('error reporting review: ', err);
      res.status(500).send(err);
    })
}

const postReview = (req, res) => {

  models.postReview(req.body)
    .then(() => {
      res.status(201).send('Post Made');
    })
    .catch((err) => {
      console.log('error making post: ', err);
      res.status(500).send(err);
    })
}

module.exports.getReviews = getReviews;
module.exports.getReviewMeta = getReviewMeta;
module.exports.markReviewHelpful = markReviewHelpful;
module.exports.reportReview = reportReview;
module.exports.postReview = postReview;