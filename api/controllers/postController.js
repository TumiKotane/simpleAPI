const User = require('../models/user');
const Post = require('../models/post');

const createPost = async (req, res) => {
    // Create a single post
    try {
        const { text } = req.body;
        let { img } = req.body || "";
        // if (!postedBy) return res.status(400).json({ error: "No user"});
        if (!text) return res.status(404).json({ error: "Empty text field"});

        const user = await User.findById(req.user._id);
        if (!user) return res.status(404).json({ error: "User not found" });
        if (user._id.toString() !== req.user._id.toString()) {
            return res.status(401).json({ error: "Unauthorized post entry" });
        };
        if (text.length > 500) {
            return res.status(400).json({ error: "Text must be less than 500 characters" });
        };
        // For img saving

        const newPost = new Post({ postedBy: req.user._id, text, img });
        await newPost.save();
        res.status(201).json(newPost)
    } catch (err) {
        res.status(500).json({ error: err.message });
        console.log(err);
    }
};

const feed = async (req, res) => {
    // Get a feed of all the latest posts
    try {
        const posts = await Post.find().sort({ createdAt: -1 });
        if (!posts) return res.status(404).json({posts: "There are no posts yet..."})
        res.status(200).json(posts);
    } catch (err) {
        res.status(500).json({ error: err.message });
        console.log(err);
    }
};

const getPost = async (req, res) => {
    // Get a specific post
    try {
        const { id } = req.params;
        const post = await Post.findById(id);
        if (!post) return res.status(401).json({ message: `Couldn't find post with id: ${id}` });
        res.status(200).json(post)
    } catch (err) {
        res.status(500).json({ error: err.message });
        console.log(err);
    }
};

const getUserPosts = async (req, res) => {
    // Get a users posts
    try {
        const { username } = req.params;
        const user = await User.findOne({username});
        if (!user) return res.status(404).json({ error: "User does not exist." });
        // console.log(user);
        const { _id } = user;
        const posts = await Post.find({ postedBy: user._id }).sort({ createdAt: -1 });
        res.status(200).json(posts)   
    } catch (err) {
        res.status(500).json({ error: err.message });
        console.log(err);
    }
};

const updatePost = async (req, res) => {
    // Update post
    try {
        const { id } = req.params;
        const post = await Post.findById(id);
        if (!post) return res.status(404).json({ error: "Post not found"});
        if (req.user._id.toString() !== post.postedBy.toString()) {
            return res.status(404).json({ error: "Unauthorized to update." });
        }

        const { text } = req.body;
        post.text = text;
        await post.save();
        res.status(200).json(post)
    } catch (err) {
        res.status(500).json({ error: err.message });
        console.log(err);
    }
};

const deletePost = async (req, res) => {
    // Delete post
    try {
        const { id } = req.params;
        const post = await Post.findById(id);
        // console.log(post.postedBy.toString());
        // console.log(req.user._id.toString());
        if (!post) return res.status(404).json({ error: "Post not found"});
        if (req.user._id.toString() !== post.postedBy.toString()) {
            return res.status(404).json({ error: "Unauthorized to delete." });
        }
        
        await Post.findByIdAndDelete(id);
        res.status(200).json({ Successful: `Post ${id} deleted successfully`})
    } catch (err) {
        res.status(500).json({ error: err.message });
        console.log(err);
    }
};

const likingToggle = async (req, res) => {
    try {
        const { id: postId } = req.params;
        const userId = req.user._id;
        const post = await Post.findById(postId);
        if (!post) return res.status(404).json({ error: "Post does not exist." });
        // Check if the user ID of client is in the Likes array
        const likedTrue = post.likes.includes(userId);
        // if so, remove(pop/pull) out of the array but if not, add(push, put) into array
        if (likedTrue) {
            // Match the id to update
            const filterById = {_id: postId}; 
            // Use $pull operator to "pop" specific userId from likes list/array
            const operation = {$pull: {likes: userId}}; 
            const post = await Post.updateOne(filterById, operation);
            res.status(200).json({ message: "Post has been un-liked successfully" })
        } else {
            post.likes.push(userId);
            await post.save();
            res.status(200).json({ message: "Post has been liked successfully" });
        }

    } catch (err) {
        res.status(500).json({ error: err.message });
        console.log(err);
    }
};

const comment = async (req, res) => {
    try {
        const { id: postId } = req.params;
        const userId = req.user._id;
        const { username, profilePicture: userProfilePicture } = req.user;
        const { text } = req.body;
        const post = await Post.findById(postId);
        if (!text) return res.status(404).json({ error: "Text field cannot be empty" });
        if (!post) return res.status(404).json({ error: "Post does not exist" });

        const comment = { userId, username, text, userProfilePicture };
        post.replies.push(comment);
        await post.save();

        res.status(200).json(comment);
    } catch (err) {
        res.status(500).json({ error: err.message });
        console.log(err);
    }
};

const getPostComments = async (req, res) => {
    try {
        const { id } = req.params;
        const post = await Post.findById(id);
        if (!post) return res.status(404).json({ error: "POst does not exist."});
        res.status(200).json(post.replies)
    } catch (err) {
        res.status(500).json({ error: err.message });
        console.log(err);
    }
};

const updateComment = async (req, res) => {
    try {
        const { postId, commentId } = req.params;
        const userId = req.user._id;
        const { username, profilePicture: userProfilePicture } = req.user;
        const { text } = req.body;
        const post = await Post.findById(postId);
        if (!text) return res.status(404).json({ error: "Text field cannot be empty" });
        if (!post) return res.status(404).json({ error: "Post does not exist" });
        
        const commentOwner = post.replies // Array
        // console.log(commentOwner);
        
        let comObject;
        for (let i = 0; i < commentOwner.length; i++) {
            if (commentOwner[i]._id.toString() === commentId.toString()) {
                comObject = commentOwner[i];
            }
        }
        // console.log("============")
        // console.log(comObject);
        // console.log(`post owner: ${post.postedBy}`);
        // console.log(`logged in client: ${userId}`);

        if ( userId.toString() === post.postedBy.toString() ) {
            const comments = post.replies;
            comments.pull({_id: commentId })
            post.save();
            const newComment = { userId, username, text, userProfilePicture };
            post.replies.push(newComment);
            // console.log('1');
            res.status(200).json({comment: newComment,  message: "Comment successfully updated."});
        } else {
            if (userId.toString() === comObject.userId.toString()) {
                const comments = post.replies;
                comments.pull({_id: commentId })
                post.save();
                const newComment = { userId, username, text, userProfilePicture };
                post.replies.push(newComment);
                // console.log('2');
                res.status(200).json(newComment);
            } else {
                res.status(401).json({message: "Unauthorized to update comment"})
                // console.log('3');
            }
        }
    } catch (err) {
        res.status(500).json({ error: err.message });
        console.log(err);
    }
};

const deleteComment = async (req, res) => {
    try {
        const { postId, commentId } = req.params;
        const userId = req.user._id;
        const post = await Post.findById(postId);
        if (!post) return res.status(404).json({ error: "Post does not exist" });
       
        const commentOwner = post.replies // Array
        // console.log(commentOwner);
        
        let comObject;
        for (let i = 0; i < commentOwner.length; i++) {
            if (commentOwner[i]._id.toString() === commentId.toString()) {
                comObject = commentOwner[i];
            }
        }
        // console.log("============")
        // console.log(comObject);
        // console.log(`post owner: ${post.postedBy}`);
        // console.log(`logged in client: ${userId}`);

        if ( userId.toString() === post.postedBy.toString() ) {
            const comments = post.replies;
            comments.pull({_id: commentId})
            post.save();
            res.status(200).json({ comments: post.replies, message: "Comment successfully deleted" });
            // console.log('1');
        } else {
            if (userId.toString() === comObject.userId.toString()) {
                const comments = post.replies;
                comments.pull({_id: commentId})
                post.save();
                res.status(200).json({ comments: post.replies, message: "Your Comment successfully deleted" });
                // console.log('2');
            } else {
                res.status(401).json({message: "Unauthorized to delete comment"})
                // console.log('3');
            }
        }
    } catch (err) {
        res.status(500).json({ error: err.message });
        console.log(err);
    }
};


module.exports = { 
    createPost, 
    feed, 
    getPost, 
    getUserPosts, 
    updatePost, 
    deletePost, 
    likingToggle, 
    comment, 
    getPostComments, 
    updateComment, 
    deleteComment, 
}