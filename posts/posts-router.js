const router = require('express').Router();


const Hubs = require('../data/db.js');

//Get all the posts
router.get('/', (req, res) => {
    Hubs.find()
    .then(users => {
        res.status(200).json(users)
    });
});

//get a specific post
router.get('/:id', (req, res) => {
    const { id } = req.params;

    Hubs.findById(id)
    .then(post => {
        if(post.length){
            res.status(200).json(post[0]);
        } else{
            res.status(404).json({ message: "The post with the specified ID does not exist." });
        }
    })
    .catch(err => {
        res.status(500).json({ error: "There was an error while saving the post to the database" })
    })
})


//add a new post
router.post('/', (req, res) => {
    const newPost = req.body;

    if(newPost.title && newPost.contents) {
      Hubs.insert(newPost)
      .then(() => {
          res.status(201).json(newPost);
      })
      .catch(err => {
          res.status(500).json({ error: "There was an error while saving the post to the database" })
      })  
    } else {
        res.status(400).json({ errorMessage: "Please provide title and contents for the post." })
    }
});

//retrieve comments for a post
router.get('/:id/comments', (req, res) => {
    const { id } = req.params;
    Hubs.findById(id)
    .then(post => {
        if(post.length) {
            Hubs.findPostComments(id)
            .then(comments => {
                res.status(200).json(comments)
            })
            .catch(err => {
                res.status(500).json({ error: "There was an error while retrieving the comments" })
            })
        } else{
            res.status(404).json({ message: "The post with the specified ID does not exist." });
        }
    })
    
})

//deleting a post
router.delete('/:id', (req, res) => {
    const postId = req.params.id;


    Hubs.findById(postId)
    .then(post => {
        if(post.length) {
            Hubs.remove(postId)
            .then(oldPost => {
                res.status(200).json(oldPost)
            })
            .catch(err => {
                res.status(500).json({ error: "There was an error while retrieving the comments" })
            })
        } else{
            res.status(404).json({ message: "The post with the specified ID does not exist." })
        }
    })
});

//updating a post
router.put('/:id', (req, res) => {
    const { id } = req.params;
    const changes = req.body;
    console.log(changes);
    Hubs.findById(id)
    .then(post => {
        if(post.length) {
            Hubs.update(id, changes)
            .then(updated => {
                console.log('Updated', updated);
                if(changes.title && changes.contents) {
                    res.status(200).json(updated);
                } else {
                    res.status(400).json({ errorMessage: "Please provide title and contents for the post." })
                }
            })
        } else {
            res.status(404).json({ message: "The post with the specified ID does not exist." })
        }
    }) 
    
});

//posting a comment
router.post('/:id/comments', (req, res) => {
    const { id } = req.params;
    const newComment = req.body;
    newComment.post_id = +id;

    Hubs.findById(id)
    .then(post => {
        if(post.length) {
            if(newComment.text){
                Hubs.insertComment(newComment)
                .then(() => {
                    res.status(201).json(newComment)
                })
                .catch(err => {
                    res.status(500).json({ error: "There was an error while adding the comment" })
                })
            } else {
                res.status(400).json({ errorMessage: "Please provide text for the comment." })
            }
        } else{
            res.status(404).json({ message: "The post with the specified ID does not exist." })
        }
    })

})




module.exports = router;