#APIList for devTinder
# we will group diff APIs into a router

# authRouter
-POST /signup
-POST /login
-POST /logout

# profileRouter
-GET /profile/view
-PATCH /profile/edit
-PATCH /profile/password

# requestRouter
-POST /request/send/interested/:userID
-POST /request/send/ignored/:userID
-POST /request/review/accepted/:requestedID
-POST /request/review/rejected/:requestedID

# userRouter
-GET /user/connections
-GET /user/requests
-GET /user/feed -gets you profile of other users

status-accepted,ignored,rejected,interested