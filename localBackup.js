const fs = require("fs")


fs.writeFile('comments.json', JSON.stringify(req.body), function(err){
    if (err) throw err;
    console.log('Replaced!');
})