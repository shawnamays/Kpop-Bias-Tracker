module.exports = function (app, passport, db) {

  // normal routes ===============================================================

  // show the home page (will also have our login links)


  app.get('/', function (req, res) {
    res.render('index.ejs');
  });

  // PROFILE SECTION =========================
  // this retrieves the profile route from the ejs file
  app.get('/profile', isLoggedIn, function (req, res) {
    db.collection('kpopGroups').find().toArray((err, result) => {
      if (err) return console.log(err)
      //the filter runs through every value inside of the array
      //then it sets it to a variable which in this case is kpopBias
      //the result is the array
      //kpopBias are the results inside of the array
    const data = result.filter( kpopBias => {
      //the variables we established in the query is in the request of the current route
      if (kpopBias.groupName == req.query.groupName) {
        return true;
      }

    } ) 
      console.log(result, data)
      
      res.render('profile.ejs', {
        user: req.user,
        messages: result,
        groupData: data
      })
    })
  });

  // LOGOUT ==============================
  // get is the read in CRUD
  app.get('/logout', function (req, res) {
    req.logout();
    res.redirect('/');
    // the backslash is the home page
  });

  // message board routes ===============================================================

  // create part of crud 
  //this is going to create a new post



//this is going to grab our data from our kpopgroups collect and turn it into an array
  app.get('/', (req, res) => {

    db.collection('kpopGroups').find.toArray()
    .then(results => {
      console.log(results)
    })
    .catch(error => console.error(error))
  })

  //this is going to render our results in our profile.ejs page so that we can see it

app.get('/', (req, res) => {
  db.collection('kpopGroups').find().toArray()
  .then(/*.....*/)
  .catch(/*.....*/)
  res.render('profile.ejs', {})

})

//this is going to save the form input into our database
  app.post('/kpopGroups', (req, res) => {

    db.collection('kpopGroups').save({
      //this is establishing a variable the "name" value
      name: req.body.name,
      groupName: req.body.groupName,
     
    }, (err, result) => {
      if (err) return console.log(err)
      console.log('saved to database')
      //put the variable into the query in order to know what to grab
      res.redirect(`/profile?groupName=${req.body.groupName}&name=${req.body.name}`)
      
    })
  })


  app.put('/kpopGroups', (req, res) => {
    db.collection('kpopGroups').findOneAndUpdate({
      name: req.body.name,
      groupName: req.body.groupName,
    }, {
      $set: {
   
      }
    }, {
      sort: { _id: -1 },
      upsert: true
    }, (err, result) => {
      if (err) return res.send(err)
      res.send(result)
    })
  })




  

  //THIS ROUTE SPECIFIES THAT WE WANT TO DELETE THE COMMENT

  app.delete('/kpopGroups', (req, res) => {
    console.log(req.body)
    db.collection('kpopGroups').findOneAndDelete({
      name: req.body.name
     
    }, (err, result) => {
      if (err) return res.send(500, err)
      res.send('Message deleted!')
    })
  })

  // =============================================================================
  // AUTHENTICATE (FIRST LOGIN) ==================================================
  // =============================================================================

  // locally --------------------------------
  // LOGIN ===============================
  // show the login form
  app.get('/login', function (req, res) {
    res.render('login.ejs', { message: req.flash('loginMessage') });
  });

  // process the login form
  app.post('/login', passport.authenticate('local-login', {
    successRedirect: '/profile', // redirect to the secure profile section
    failureRedirect: '/login', // redirect back to the signup page if there is an error
    failureFlash: true // allow flash messages
  }));

  // SIGNUP =================================
  // show the signup form
  app.get('/signup', function (req, res) {
    res.render('signup.ejs', { message: req.flash('signupMessage') });
  });

  // process the signup form
  app.post('/signup', passport.authenticate('local-signup', {
    successRedirect: '/profile', // redirect to the secure profile section
    failureRedirect: '/signup', // redirect back to the signup page if there is an error
    failureFlash: true // allow flash messages
  }));

  // =============================================================================
  // UNLINK ACCOUNTS =============================================================
  // =============================================================================
  // used to unlink accounts. for social accounts, just remove the token
  // for local account, remove email and password
  // user account will stay active in case they want to reconnect in the future

  // local -----------------------------------
  app.get('/unlink/local', isLoggedIn, function (req, res) {
    var user = req.user;
    user.local.email = undefined;
    user.local.password = undefined;
    user.save(function (err) {
      res.redirect('/profile');
    });
  });

};



// route middleware to ensure user is logged in
function isLoggedIn(req, res, next) {
  if (req.isAuthenticated())
    return next();

  res.redirect('/');
}
