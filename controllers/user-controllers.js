const { User, Thoughts} = require('../models');

module.exports = {

    getAllUsers(req,res){
        User.find({})
            .select('__v')
            .then((user) => res.json(user))
            .catch((err) => res.status(500).json(err))
    },

    getUserById(req,res){
        User.findOne({_id: req.params.userId})
            .populate({
                path: 'thoughts',
                select:'-__v'
            })
            .select('-__v')
            .then((user) => 
                !user
                    ? res.status(404).json({ message: 'Invalid ID'})
                    : res.json(user)
        )
        .catch((err) => res.status(500).json(err));
    },

    createUser(req, res) {
        User.create(req.body)
            .then((user) => res.json(user))
            .catch((err) => {
                console.log(err);
                return res.status(500).json(err);
        });
    
    },

    deleteUser( req, res) {
        User.findOneAndDelete({_id: req.params.userId})
            .then((user) => 
                !user
                    ? res.status(404).json({ message: 'Invalid ID'})
                    : Thoughts.deleteMany({_id: { $in: user.thoughts}})
                )
                .then(() => res.json({ message: 'User & Thought Deleted'}))
                .catch((err) => res.status(500).json(err));
    },

    updateUser(req, res) {
        User.findOneAndUpdate (
            {_id: req.params.userId},
            { $set: req.body},
            { runValidators: true, new: true}
        )
            .then((user) =>
                !user
                    ? res.status(404).json({ message: 'Invalid ID'})
                    : res.json(user)
            )
            .catch((err) => res.status(500).json(err));
    },

    addFriend(req, res) {
        User.findOneAndUpdate (
            {_id: req.params.userId},
            {$push: {friends: req.params.friendId}},
            { runValidators: true, new: true}
        )
        .then((user) => 
            !user
                ? res.status(404).json({message: 'Invalid ID'})
                : res.json(user)
            )
            .catch((err) => res.status(500).json(err));
    },

    removeFriend(req, res) {
        User.findOneAndUpdate(
            {_id: req.params.userId},
            {$pull: {friends: req.params.friendId}},
            {new: true}
        )
        .then((user) =>
            !user
                ? res.status(404).json({message: 'Invalid ID'})
                : res.json(user)
            )
            .catch((err) => res.status(500).json(err));
    },
} 
