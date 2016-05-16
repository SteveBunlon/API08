var mongoose = require('mongoose');

var commandSchema = new mongoose.Schema({
    date: {type:Date, required: true},
    annalNumber: {type:String, required: true}
})

var userSchema = new mongoose.Schema({
    mail:  {type: String, required: true, unique: true },
    accountType: {type: String, required: true, default: "user"},
    lastname: {type:String, required: true},
    firstname: {type:String, required: true},
    commands: [commandSchema],
    password: {type:String},
    from: {type:String, enum:["cas", "ext"],required:true},
    casUsername: {type:String}
});

// Bcrypt middleware on UserSchema
/*userSchema.pre('save', function(next) {
  console.log("encrypting password, be quiet");
  var user = this;
 
  if (!user.isModified('password')) return next();
 
  bcrypt.genSalt(SALT_WORK_FACTOR, function(err, salt) {
    if (err) return next(err);
 
    bcrypt.hash(user.password, salt, function(err, hash) {
        if (err) return next(err);
        user.password = hash;
        console.log(user);
        next();
    });
  });  
});*/

// Bcrypt middleware on UserSchema
/*userSchema.pre('update', function(next) {
  console.log("encrypt password update", this);
  var userpassword = this._update.$set.password;
  var user = this;
  //if (!user.isModified('password')) return next();
  this.findOne({_id:this._update.$set._id},function (err,user){
      if(err){
      }
      else{                         
          if(user.password == userpassword){
            console.log("do not update password");
            next();
          }                           
          else
          {
            console.log("update old password : " + user.password + " new password " + userpassword);
            bcrypt.genSalt(SALT_WORK_FACTOR, function(err, salt) {
              if (err) 
                {
                  console.log(err);
                  return next(err);
                }
            console.log("salt generated : " + salt + " password : " + userpassword);
              bcrypt.hash(userpassword, salt, function(err, hash) {
                  if (err) 
                  {
                    console.log(err);
                    return next(err);
                  }
                  user.update({},{ $set: { password: hash } });
                  console.log(user._update.$set.password);
                  next();
              });
            });
          }
      }
    });
});*/
 
//Password verification
/*userSchema.methods.comparePassword = function(password, cb) {
    bcrypt.compare(password, this.password, function(err, isMatch) {
        if (err) return cb(err);
        cb(isMatch);
    });
};*/

module.exports = mongoose.model("User", userSchema);
