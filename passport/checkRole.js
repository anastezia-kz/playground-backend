  
const checkRoles = (role) => {
  return (req, res, next) => {
    console.log(req.user)
    if(req.isAuthenticated() && req.user.role === role) {
      next()
    } else {
      res.status(403).json({message: "please authenticate"})
    }
  }
}

module.exports = checkRoles