const User = require('../models/user');
const Post = require('../models/post');
const bcrypt = require('bcryptjs');
const mongoose = require('mongoose');

const registerUser = async (req, res) => {
    try {
        const { name, username, email, password, profilePicture, bio } = req.body;
        if ( !name || !username || !email || !password ) {
            res.status(412).json({ message: "name, username, email & password fields cannot be empty!"})
        };
        const user = await User.findOne({ email: email, username: username });
        if (user) {
            res.status(400).json({ error: "User already exists" });
        };
        

        const salt = await bcrypt.genSalt(10);
        const hashedPWD = await bcrypt.hash(password,salt);

        const newUser = await User.create({
            name,
            username,
            email,
            password: hashedPWD,
            profilePicture,
            bio,          
        })
        await newUser.save();
        // const token = newUser.createJWT();

        const displayUser = { username: newUser.username, email: newUser.email };
        res.status(201).json(displayUser)
    } catch (err) {
        res.status(500).json({Error: err.message});
        console.log("Error in Registration:", err.message);
    }
}

const loginUser = async (req, res) => {
    try {
        const { username, password } = req.body;
        const user = await User.findOne({ username });
        if (!user) {
            return res.status(400).json({Err: "Invalid username"});
        };

        const isCorrectUser = await bcrypt.compare(password, user?.password || "")
        if ( !isCorrectUser ) {
            return res.status(400).json({Err: "Invalid password"});
        };

        const token = await user.createJWT();
        res.cookie("jwt", token, {
            maxAge: 30 * 24 * 60 * 60 * 1000,
            sameSite: "strict",
         });

        res.status(200).json({ 
            userId: user._id,
            name: user.name,
            username: user.username,
            email: user.email,
            profilePicture: user.profilePicture,
            bio: user.bio,
         })
    } catch (err) {
        res.status(500).json({Err: err.message});
        console.log("Error in Logging in:", err.message);
    }
};

const logoutUser = async (req, res) => {
    try {
        res.cookie("jwt", "", {maxAge: 1});
        res.status(200).json({ message: "You are now logged out!" });
    } catch (err) {
        res.status(500).json({Err: err.message});
        console.log("Error in Logging  out:", err.message);
    }
};

const followToggle = async (req, res) => {
    try {
        const { id } = req.params;
        const otherUser = await User.findById(id);
        const currentUser = await User.findById(req.user._id);
        // console.log(otherUser)
        // console.log(currentUser)
        if (!otherUser) return res.status(404).json({ message: "User not found"});
        if (otherUser.toString() === currentUser.toString())  {
            return res.status(404).json({ message: "You cannot follow yourself"});
        };
        
        const isFollowing = currentUser.following.includes(id);

       if (isFollowing) {
            // Pull your id from otherUsers followers list
            await User.findByIdAndUpdate(id, {$pull: { followers: req.user._id}});
            // Pull from Your following list 
            await User.findByIdAndUpdate(req.user._id, {$pull: { following: id}});
            res.status(200).json({ message: `You have successfully unfollowed ${otherUser.username}`});
        } else {
            // Push your id into otherUsers followers list
            await User.findByIdAndUpdate(id, {$push: { followers: req.user._id }});
            // Push otherUsers id into your following list
            await User.findByIdAndUpdate(req.user._id, {$push: { following: id }});
            res.status(200).json({ message: `You have successfully started following ${otherUser.username}`}); 
        }
    } catch (err) {
        res.status(500).json({Err: err.message});
        console.log("Error in Following/Unfollowing user:", err.message);
    }
};

const updateUserInfo = async (req, res) => {
    try {
        const userId = req.user._id;
        const { name, username, email, password, bio } = req.body;
        let { profilePicture } = req.body;
        let user = await User.findById(userId);
        if (password) {
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(password, salt);
            user.password = hashedPassword;
        };
        // Updating user Properties
        user.profilePicture = profilePicture || "";
        user.name = name || user.name;
        user.username = username || user.username;
        user.email = email || user.email;
        user.bio = bio || user.bio;

        user = await user.save();

        await Post.updateMany(
            {
                "replies.userId": user.id
            },
            {
                $set: {
                    "replies.$[reply].username": user.username,
                    "replies.$[reply].userProfilePicture": user.profilePicture,
                },
            },
            {
                arrayFilters: [{ "reply.userId": user.id }]
            },
        );

        const updatedUser = { name, username, email, bio };
        res.status(200).json(updatedUser);
    } catch (err) {
        res.status(500).json({Err: err.message});
        console.log("Error in Updating user information:", err.message);
    }
};

const getUser = async (req, res) => {
    try {
        const { query } = req.params;
        let user;
        if (mongoose.Types.ObjectId.isValid(query)) {
            user = await User.findOne({ _id: query }).select("-password").select("-updatedAt");
        } else {
            user = await User.findOne({ username: query }).select("-password").select("-updatedAt");
        }

        if (!user) return res.status(404).json({ message: "User not found" });

        res.status(200).json(user);
    } catch (err) {
        res.status(500).json({Err: err.message});
        console.log("Error in getting user information:", err.message);
    }
};


module.exports = { registerUser, loginUser, logoutUser, followToggle, updateUserInfo, getUser };