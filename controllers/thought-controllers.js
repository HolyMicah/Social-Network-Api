const {Thoughts, User} = require('../models');

module.exports = {

    getAllThoughts(req, res) {
        Thoughts.find({})
            .populate({
                path: 'reactions',
                select: '-__v'
            })
            .select('-__v')
          .then((thoughts) => res.json(thoughts))
          .catch((err) => res.status(500).json(err));
    },

    getThoughtById(req, res) {
        Thoughts.findOne({_id: req.params.id})
        .populate({
            path: 'reactions',
            select: '-__v'
        })
        .select('-__v')
        .then((thoughts) => 
            !thoughts
                ? res.status(404).json({message: 'Invalid ID'})
                : res.json(thoughts)
        )
        .catch((err) => res.status(500).json(err));
    },

    createThought(req, res) {
        Thoughts.create(req.body)
            .then(({username, _id}) => {
                return User.findOneAndUpdate(
                    {username: username},
                    {$push: {thoughts: _id }},
                    {new: true, runValidators: true}
                );
            })
        .then((thoughts) => res.json(thoughts))
        .catch((err) => {
            console.log(err);
            return res.status(500).json(err);
        });

    },

    updateThought(req, res) {
        Thoughts.findOneAndUpdate(
            {_id: req.params.id},
            {$set: req.body},
            { runValidators: true, new: true}
        )
        .then((thoughts) =>
            !thoughts
                ? res.status(404).json({message: 'Invalid ID'})
                : res.json(thoughts))
            
                .catch((err) => res.staus(500).json(err));
    },

    deleteThought( req, res) {
        Thoughts.findOneAndDelete({ _id: req.params.id })
            .then(({ username }) => {
                return User.findOneAndUpdate(
                    { username: username },
                    { $pull: { thoughts: req.params.id } },
                    { new: true }
                )
            })
            .then(user => {
                if (user) {
                    res.status(404).json({ message: 'Invalid ID' });
                    return;
                }

                res.json(user);
            })
            .catch(err => {
                console.log(err);
                res.status(400).json(err);
            })
    },

    addReaction (req, res) {
        Thoughts.findOneAndUpdate(
            { _id: req.params.thoughtId },
            { $addToSet: { reactions: req.body }},
            { runValidators: true, new: true }
          )
            .then((thoughts) =>
              !thoughts
                ? res.status(404).json({ message: 'Invalid ID'})
                : res.json(thoughts)
            )
            .catch((err) => res.status(500).json(err));
    },

    removeReaction(req, res) {
        Thoughts.findOneAndUpdate(
          { _id: req.params.thoughtId },
          { $pull: { reactions: { reactionId: req.params.reactionId }}},
          { runValidators: true, new: true }
        )
          .then((thoughts) =>
            !thoughts
              ? res.status(404).json({ message: 'Invalid ID' })
              : res.json(thoughts)
          )
          .catch((err) => res.status(500).json(err));
      },
}