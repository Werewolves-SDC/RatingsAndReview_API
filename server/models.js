const pool = require('../database/postgreSQL/index.js');

const getReviews = (product_id, count, page, sort) => {
  let offset = count * page;
  if (sort === 'newest') {
    sort = 'reviews.date DESC';
  } else if (sort === 'helpful') {
    sort = `reviews.helpfulness DESC`;
  } else {
    sort = `reviews.date DESC, reviews.helpfulness DESC`;
  }
  let queryString = `SELECT reviews.id, reviews.rating, reviews.date, reviews.summary, reviews.body, reviews.recommend, reviews.reviewer_name, reviews.reviewer_email, reviews.response, reviews.helpfulness, json_agg( COALESCE (json_build_object('id', photos.id, 'url', photos.url), '[]')) AS photos
  FROM reviews
  LEFT JOIN photos ON reviews.id = photos.review_id
  WHERE reviews.product_id = ${product_id}
  AND reviews.reported = false
  GROUP BY reviews.id
  order by ${sort} offset ${offset} limit ${count}`;

  return pool.query(queryString);
}

const getReviewMeta = (product_id) => {

  let queryString = `SELECT
  json_build_object(
    '1', COUNT(1) FILTER (WHERE reviews.rating = 1)::VARCHAR,
    '2', COUNT(1) FILTER (WHERE reviews.rating = 2)::VARCHAR,
    '3', COUNT(1) FILTER (WHERE reviews.rating = 3)::VARCHAR,
    '4', COUNT(1) FILTER (WHERE reviews.rating = 4)::VARCHAR,
    '5', COUNT(1) FILTER (WHERE reviews.rating = 5)::VARCHAR
  ) AS ratings,
  json_build_object(
    'false', COUNT(*) FILTER (WHERE reviews.recommend = false)::VARCHAR,
    'true', COUNT(*) FILTER (WHERE reviews.recommend = true)::VARCHAR
  ) AS recommend,
  (WITH review_chars AS (
    SELECT characteristics.name, characteristics.id, AVG(characteristic_reviews.value)
    FROM characteristics RIGHT JOIN characteristic_reviews
    ON characteristics.id = characteristic_reviews.characteristics_id
    WHERE characteristics.product_id = ${product_id}
    GROUP BY characteristics.id
    ORDER BY characteristics.id
    )
  SELECT json_object_agg(name, json_build_object('id', id, 'value', avg::VARCHAR))
    FROM review_chars) AS characteristics
    FROM reviews WHERE reviews.product_id = ${product_id}`;

  return pool.query(queryString);
}

const markReviewHelpful = (review_id) => {
  let queryString = `UPDATE
  reviews
  SET helpfulness = helpfulness + 1
  WHERE reviews.id = ${review_id}`;

  return pool.query(queryString);
}

const reportReview = (review_id) => {
  let queryString = `UPDATE
  reviews
  SET reported = true
  WHERE reviews.id = ${review_id}`

  return pool.query(queryString);
}

const postReview = ({ product_id, rating, summary, body, recommend, name, email, photos, characteristics }) => {
  let char_keys = [];
  let char_values = [];
  let queryString;

  for (var keys in characteristics) {
    char_keys.push(keys);
    char_values.push(characteristics[keys]);
  }

  if (photos.length > 0) {
    queryString = `WITH insert_review AS (
    INSERT INTO reviews (
      product_id,
      rating,
      summary,
      body,
      recommend,
      reviewer_name,
      reviewer_email
    )
    VALUES (
      ${product_id},
      ${rating},
      '${summary}',
      '${body}',
      ${recommend},
      '${name}',
      '${email}'
    )
    RETURNING id as review_id
    ), char_keys_values AS (
       INSERT INTO characteristic_reviews (
        review_id,
        characteristics_id,
        value
      )
    SELECT review_id, UNNEST(ARRAY[${char_keys}])::INT, UNNEST(ARRAY [${char_values}])::INT FROM insert_review)
      INSERT INTO photos (review_id, url)
      SELECT review_id, UNNEST(ARRAY['${photos}']::VARCHAR[]) FROM insert_review`
  } else {
    queryString = `WITH insert_review AS (
      INSERT INTO reviews (
        product_id,
        rating,
        summary,
        body,
        recommend,
        reviewer_name,
        reviewer_email
      )
      VALUES (
        ${product_id},
        ${rating},
        ${summary},
        ${body}::VARCHAR,
        ${recommend},
        ${name}::VARCHAR,
        ${email}::VARCHAR
      )
      RETURNING id as review_id
    )
    INSERT INTO characteristic_reviews (
      review_id,
      characteristic_id,
      value
    )
    SELECT (review_id FROM insert_review), UNNEST(ARRAY${char_keys}), UNNEST(ARRAY${char_values})`
  }
  return pool.query(queryString);
}

module.exports.getReviews = getReviews;
module.exports.getReviewMeta = getReviewMeta;
module.exports.markReviewHelpful = markReviewHelpful;
module.exports.reportReview = reportReview;
module.exports.postReview = postReview;

