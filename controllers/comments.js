const { patchCommentVotes, deleteComment } = require('../models/comments');

exports.updateCommentVotesById = (req, res, next) => {
  const { comment_id } = req.params;
  const { inc_votes } = req.body;
  patchCommentVotes(comment_id, inc_votes)
    .then(([updatedComment]) => res.status(200).send({ updatedComment }))
    .catch(console.log);
};

exports.deleteCommentById = (req, res, next) => {
  const { comment_id } = req.params;
  deleteComment(comment_id)
    .then(() => res.status(204).send({}))
    .catch(console.log);
};
