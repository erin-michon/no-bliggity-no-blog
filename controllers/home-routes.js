const router = require('express').Router();

//
router.get('/', (req, res) => {
    //passing object into homepage.handlbars template so each property is available in the template useing the {{}} syntax
    res.render('homepage', {
      id: 1,
      title: 'Handlebars Docs',
      post_contents: 'https://handlebarsjs.com/guide/',
      created_at: new Date(),
      comments: [{}, {}],
      user: {
        username: 'test_user'
      }
    });
  });

module.exports = router;