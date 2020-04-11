
var userIdFromSession = function(req){
  if (!req.session.user) {
    return 0
  }
  return req.session.user.id
}

module.exports = userIdFromSession
