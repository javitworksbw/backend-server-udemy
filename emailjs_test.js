var email 	= require("emailjs");
var server 	= email.server.connect({
   user:    "javitempab@gmail.com", 
   password:"", 
   host:    "smtp.gmail.com", 
   ssl:     false
});
 
// send the message and get a callback with an error or details of the message that was sent
server.send({
   text:    "i hope this works", 
   from:    "javitempab@gmail.com", 
   to:      "javitempab@gmail.com",
   cc:      "",
   subject: "testing emailjs"
}, function(err, message) { console.log(err || message); });