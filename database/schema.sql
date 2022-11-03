CREATE SCHEMA reviews
  CREATE TABLE review (
    id int primary key,
    rating smallint,
    summary varchar(200),
    recommend boolean,
    response varchar(200),
    body varchar(1000),
    date timestamp,
    reviewer_name varchar(20),
    helpfulness int,
    photo_id int references photo(id)
  );

  CREATE TABLE photo (
    id int primary key,
    url varchar(200),
  );

  CREATE TABLE review_meta (
    product_id int primary key,
    rating_id int references rating(id),
    recommend_id int references recommend(id),
    characteristic_id int references characteristic(id),
  );

  CREATE TABLE rating (
    id int primary key,
    "1" int,
    "2" int,
    "3" int,
    "4" int,
    "5" int
  );

  CREATE TABLE recommend (
    id primary key,
    false int,
    true int
  );

  CREATE TABLE characteristic (
    id int primary key,
    fit_id int references fit(id),
    length_id int references _length(id),
    comfort_id int references comfort(id),
    quality_id int references quality(id)
  );

  CREATE TABLE fit (
    id int primary key,
    "value" smallint
  );

  CREATE TABLE _length (
    id int primary key,
    "value" smallint
  );

  CREATE TABLE comfort (
    id int primary key,
    "value" smallint
  );

  CREATE TABLE quality (
    id int primary key,
    "value" smallint
  );
