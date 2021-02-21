var express = require('express')
var router = express.Router()


router.use(express.static('public'))
router.use(express.json());



///to get the error 404 not found template
router.get('/', (req, res) => {
    const obj = {
        statuts:404,
        message:"page not found",
    }
    res.send(obj);
})
  


module.exports = router
