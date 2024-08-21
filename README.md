# alx-webstack_portfolio_project

To use, add into .env file with:

- MONGO_URI,
- PORT,
- JWT_SECRET,
- JWT_LIFETIME

# About API

A fully functional online social media and social networking service built on a Mongo, express,(React), Node tech stack.


# User Endpoints
- post('/api/v1/register')\n
- post('/api/v1/login',);
- post('/api/v1/logout');
- post('/api/v1/follow/:id');
- put('/api/v1/updateUserInfo');
- get('/api/v1/getUser/:query')

# Post Endpoints
- post('/api/v1/create');
- get('/api/v1/getFeed')
- get('/api/v1/getPost/:id');
- get('/api/v1/getUserPosts/:username');
- put('/api/v1/updatePost/:id');
- delete('/api/v1/deletePost/:id');
- put('/api/v1/like/:id');
- put('/api/v1/comment/:id');
- get('/api/v1/getPostComments/:id');
- put('/api/v1/updateComment/:postId/:commentId');
- delete('/api/v1/deleteComment/:postId/:commentId');
