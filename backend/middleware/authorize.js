const jwt = require('jsonwebtoken');

function authorize(req, res, next) {

   

        const authorizationHeader = req.headers['authorization'];
      
        const token = authorizationHeader?.split(' ')[1];
      
        if(!token) {
          res.status(401).send();
          return;
        }
      
      
        jwt.verify(token, 'GREEN', async function(err) {
      
          if (err) {
              res.status(401).send();
              return;
          }
          next();
        })
      }
      



module.exports = authorize;