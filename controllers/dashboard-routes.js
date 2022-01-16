const router = require('express').Router();
const sequelize = require('../config/connection');
const { Post, User, Comment } = require('../models');

//When the URL is examplewebsite.com/, then the homepage.handlbars view will be rendered within the main.handlebars layout
router.get('/', (req, res) => {
    console.log(req.session);
    Post.findAll({
        where: {
            // use the ID from the session
            user_id: req.session.user_id
          },
      attributes: [
        'id',
        'title',
        'post_contents',
        'created_at'
      ],
      include: [
        {
          model: Comment,
          attributes: ['id', 'comment_text', 'post_id', 'user_id', 'created_at'],
          include: {
            model: User,
            attributes: ['username']
          }
        },
        {
          model: User,
          attributes: ['username']
        }
      ]
    })
      .then(dbPostData => {
  
        const posts = dbPostData.map(post => post.get({ plain: true }));
        // pass a single post object into the homepage template
        res.render('homepage', { posts });
      })
      .catch(err => {
        console.log(err);
        res.status(500).json(err);
      });
  });

module.exports = router;