const {Thoughts, User} = require('../models');

module.exports = {

    getAllThought(req, res) {
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
}