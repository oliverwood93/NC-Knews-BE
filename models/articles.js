const connection = require('../db/connection');

exports.getArticles = ({
  sort_by = 'created_at',
  order = 'desc',
  limit = 10,
  p,
  author,
  ...whereQuery
}) => {
  if (author) whereQuery['articles.author'] = author;
  return connection
    .select('articles.*')
    .count({ comment_count: 'comments.comment_id' })
    .from('articles')
    .where(whereQuery)
    .orderBy(sort_by, order)
    .leftJoin('comments', 'comments.article_id', 'articles.article_id')
    .groupBy('articles.article_id')
    .offset(limit * p - limit)
    .limit(limit);
};
exports.postArticle = newArticle => connection('articles')
  .insert(newArticle)
  .returning('*');
