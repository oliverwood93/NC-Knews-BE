const connection = require('../db/connection');

exports.getArticles = ({
  sort_by = 'created_at',
  order = 'desc',
  limit = 10,
  p = 1,
  author,
  ...whereQuery
}) => {
  if (author) whereQuery['articles.author'] = author;
  if (limit <= 0) limit = 10;
  return Promise.all([
    connection
      .select(
        'articles.author',
        'articles.article_id',
        'articles.title',
        'articles.body',
        'articles.votes',
        'articles.topic',
        'articles.author',
        'articles.created_at',
      )
      .count({ comment_count: 'comments.comment_id' })
      .from('articles')
      .where(whereQuery)
      .leftJoin('comments', 'comments.article_id', 'articles.article_id')
      .orderBy(sort_by, order)
      .groupBy('articles.article_id')
      .offset(limit * p - limit)
      .limit(limit),
    connection('articles')
      .count('article_id as total_count')
      .where(whereQuery),
  ]);
};

exports.getArticleById = article_id => connection
  .select('articles.*')
  .count({ comment_count: 'comments.comment_id' })
  .from('articles')
  .where('articles.article_id', article_id)
  .leftJoin('comments', 'comments.article_id', 'articles.article_id')
  .groupBy('articles.article_id');

exports.getArticleComments = (
  article_id,
  {
    sort_by = 'created_at', order = 'desc', limit = 10, p = 1,
  },
) => connection
  .select('comment_id', 'author', 'body', 'votes', 'created_at')
  .from('comments')
  .where({ article_id })
  .orderBy(sort_by, order)
  .offset(limit * p - limit)
  .limit(limit);

exports.postArticle = ({
  title, body, topic, author,
}) => connection('articles')
  .insert({
    title,
    body,
    topic,
    author,
  })
  .returning('*');

exports.patchArticleVotes = (article_id, inc_votes) => connection
  .select('*')
  .from('articles')
  .where({ article_id })
  .increment('votes', [-1, 1].includes(inc_votes) ? inc_votes : 0)
  .returning('*');

exports.deleteArticle = article_id => connection
  .select('*')
  .from('articles')
  .where({ article_id })
  .del();

exports.postComment = (article_id, { username, body }) => connection('comments')
  .insert({ article_id, author: username, body })
  .returning('*');
