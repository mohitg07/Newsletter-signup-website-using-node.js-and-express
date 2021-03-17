// here we have installed 3 modules i.e. express, body-parser and request
// that's why we have to require all the 3 modules inside app.js
const express = require("express");
const bodyParser = require('body-parser');
const request = require("request");
const https = require('https');

// in order to store our data in the mailchimp API, I have installed the module i.e. @mailchimp/mailchimp_marketing
const client = require("@mailchimp/mailchimp_marketing");

const app = express();
app.use(bodyParser.urlencoded({extended: true}));

// in order to serve all the static files, we have to use express.static(). I have put all my static files in a separate folder i.e. "public"
// as we are running our website on server so static files can be added in our project only with this method
app.use(express.static("public"));

// you need to create account on mailchimp https://mailchimp.com/ so that you can use their api services
client.setConfig({
  apiKey: "<put your api key here>"",
  server: "<put your server here>",
});


app.get("/", function(req,res){
  res.sendFile(__dirname + "/signup.html");
});


// in this case, I don't request mailchimp api to send me some data back rather I am requesting it to store my data
app.post("/", function(req,res){
     const firstName = req.body.firstName;
     const lastName = req.body.lastName;
     const email = req.body.email;

                   // below code is written so that I can store my data in mailchimp api
                   // the data which I want to store is user's firstName, lastName and email
     const subscribingUser = {
       firstName: firstName,
       lastName: lastName,
       email: email
     }

    const run = async () => {
      // I want to add all the list members to my mailchimp list-ID
      const response = await client.lists.addListMember("<put your mailchimp list-id here>", {
        email_address: subscribingUser.email,
        status: "subscribed",
        merge_fields: {
            FNAME: subscribingUser.firstName,
            LNAME: subscribingUser.lastName
        }
      });

      console.log(response); // (optional)

      // after successful subscription by the user, I will render some different HTML page to the user
      res.sendFile(__dirname + "/success.html");

    };


    // this is the final command to store data in mailchimp api
    run();

});

// Here I have mentioned a dynamic port that Heroku will define on the go
// and I have also mentioned my own port so that I can test my website on my localhost too
app.listen(process.env.PORT || 3000, function(){
  console.log("server starts running at 3000");
});
