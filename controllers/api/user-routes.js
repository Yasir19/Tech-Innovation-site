const router = require("express").Router();
const { User, Post, Comment } = require("../../models");
// api end point to get all the user 
router.get("/", (req, res) => {
  //access User model and run findall()method
  User.findAll({
    attribute: { exclude: ["password"] },
  })
    .then((userData) => res.json(userData))
    .catch((err) => {
      console.log(err);
      res.status(500).json(err);
    });
});
//get user by id 
router.get('/:id', (req,res)=>{
    User.findOne({
        attribute: { exclude: [ 'password' ] },
        where: {
            id: req.params.id
        }, 
        include: [
            {
                model: Post,
                attribute:['id','title','post_text', 'created_at'],
            },
            {
                model: Comment,
                attribute: ['id', 'comment_text', 'created_at'],
                include: {
                    model: Post,
                    attribute:['title']
                }
            },
        ]
    })
    .then(userData => {
        if(!userData) {
            res.status(404).json({message: 'No user found with this id'})
            return;
        }
        res.json(userData)
    })
    .catch(err => {
        console.log(err);
        res.status(500).json(err);
    });
});
// post to user 
router.post('/',(req,res)=>{
    User.create({
        username: req.body.username,
        email: req.body.email,
        password: req.body.password
    })
    .then(userData => res.json(userData))
    .catch(err => {
        console.log(err);
        res.status(500).json(err);
    })
});
router.post('/login', (req,res)=> {
    User.findOne({
        where: {
            email:req.body.email
        }
    })
    .then(userData => {
        if(!userData){
            res.status(400).json({ message: 'wrong login ifromation' });
            return;
        }
        //verfiy password
        const validPassword = userData.checkPassword(req.body.password);
        if(!validPassword){
            res.status(400).json({ message: 'wrong login information' })
            return
        }
        res.json({user:dbUserData, message: 'You are now logged in!'})
    })
})

// update user 
router.put('/:id',(req,res) => {
    User.update(req.body, {
        individualHooks: true,
        where: {
            id: req.params.id
        }
    })
    .then(userData => {
        if(!userData[0]) {
            res.status(404).json({message: 'No user found with this id'});
            return;
        }
        res.json(userData);
    })
    .catch(err => {
        console.log(err);
        res.status(500).json(err);
    });
});
// delete user
router.delete('/:id',(req,res) => {
    User.destroy({
        where: { 
            id: req.params.id
        }
    })
    .then(userData =>{
        if(!userData){
            res.status(404).json({ message: 'No user found with this id' });
            return;
        }
        res.json(userData);
    })
    .catch(err => {
        console.log(err);
        res.status(500).json(err);
    })
})

module.exports = router;