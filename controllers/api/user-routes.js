const router = require('express').Router();
const { User } = require('../../models');


//CRUD METHODS for User Model
//GET all users
router.get('/', (req, res) => {
    User.findAll({
      attributes: { exclude: ['password'] }
    })
      .then(dbUserData => res.json(dbUserData))
      .catch(err => {
        console.log(err);
        res.status(500).json(err);
    });
});

//GET one user, and all associated posts and comment with post
router.get('/:id', (req, res) => {
    User.findOne({
      attributes: { exclude: ['password'] },
      where: {
        id: req.params.id
      },
    //   include: [
    //     {
    //       model: Post,
    //       attributes: ['id', 'title', 'contents', 'created_at']
    //     },
    //     {
    //       model: Comment,
    //       attributes: ['id', 'comment_text', 'created_at'],
    //       include: {
    //         model: Post,
    //         attributes: ['title']
    //       }
    //     }
    // ]
    })
      .then(dbUserData => {
        if (!dbUserData) {
          res.status(404).json({ message: 'No user found with this id' });
          return;
        }
        res.json(dbUserData);
      })
      .catch(err => {
        console.log(err);
        res.status(500).json(err);
    });
});

//POST or create a user
router.post('/', (req, res) => {
    // expects {username: 'Erin', password: 'password1234'}
    User.create({
      username: req.body.username,
      password: req.body.password
    })
      .then(dbUserData => {
        req.session.save(() => {
          req.session.user_id = dbUserData.id;
          req.session.username = dbUserData.username;
          req.session.loggedIn = true;
    
          res.json(dbUserData);
        });
      })
      .catch(err => {
        console.log(err);
        res.status(500).json(err);
    });
});

//User Login - Post Session
router.post('/login', (req, res) => {
    // expects {username: 'Erin', password: 'password1234'}
    User.findOne({
      where: {
        email: req.body.username
      }
    }).then(dbUserData => {
      if (!dbUserData) {
        res.status(400).json({ message: 'No user with that username!' });
        return;
      }
  
      const validPassword = dbUserData.checkPassword(req.body.password);
  
      if (!validPassword) {
        res.status(400).json({ message: 'Incorrect password!' });
        return;
      }
  
      req.session.save(() => {
        req.session.user_id = dbUserData.id;
        req.session.username = dbUserData.username;
        req.session.loggedIn = true;
    
        res.json({ user: dbUserData, message: 'You are now logged in!' });
      });
    });
});

//User Logout  - Destroy Posted Session
router.post('/logout', (req, res) => {
    if (req.session.loggedIn) {
      req.session.destroy(() => {
        res.status(204).end();
      });
    }
    else {
      res.status(404).end();
    }
});

//PUT - Edit User
router.put('/:id', (req, res) => {
    // expects {username: 'Erin', password: 'password1234'}
  
    // pass in req.body instead to only update what's passed through
    User.update(req.body, {
      individualHooks: true,
      where: {
        id: req.params.id
      }
    })
      .then(dbUserData => {
        if (!dbUserData) {
          res.status(404).json({ message: 'No user found with this id' });
          return;
        }
        res.json(dbUserData);
      })
      .catch(err => {
        console.log(err);
        res.status(500).json(err);
      });
});

//DELETE - Delete a user  
router.delete('/:id', (req, res) => {
  User.destroy({
    where: {
      id: req.params.id
    }
  })
    .then(dbUserData => {
      if (!dbUserData) {
        res.status(404).json({ message: 'No user found with this id' });
        return;
      }
      res.json(dbUserData);
    })
    .catch(err => {
      console.log(err);
      res.status(500).json(err);
    });
});



module.exports = router;