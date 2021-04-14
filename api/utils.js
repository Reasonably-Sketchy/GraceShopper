
function requireUser(req, res, next) {
  if (!req.user) {
    next({
      name: "MissingUserError",
      message: "You must be logged in to perform this action",
    });
  };

  next();
}

const requiredNotSent = ({ requiredParams, atLeastOne = false }) => {
  return (req, res, next) => {
    // for operations that need at least one param. Not all required.
    if(atLeastOne) {
      let numParamsFound = 0;
      for(let param of requiredParams) {
        if(req.body[param] !== undefined) {
          numParamsFound++;
        }
      }
      if(!numParamsFound) {
        next({
          name: 'MissingParams',
          message: `Must provide at least one of these in body: ${requiredParams.join(', ')}`
        })
      } else {
        next();
      }
    } else {
      // figure out which ones are not defined, and return them
      const notSent = [];
      for(let param of requiredParams) {
        if(req.body[param] === undefined) {
          notSent.push(param);
        }
      }
      if(notSent.length) next({
        name: 'MissingParams',
        message: `Required Parameters not sent in body: ${notSent.join(', ')}`
      })
      next();
    }
  }
}

function requireAdmin(req, res, next) {
  if (!req.user.isAdmin) {
    next({
      name: "UnauthorizedError",
      message: "You must be an admin to perform this action",
    });
  };
  
  next();
};


module.exports = {
  requireUser,
  requireAdmin,
  requiredNotSent
};
