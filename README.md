# Swym Demo App
A very basic node js app built using web-sockets and graphQL.


## Requirements
1. NodeJS
2. npm

## Tech Stack
1. Node.js
2. Web Sockets
3. Express
4. GraphQL   

## Setup
1. Use `npm i` to install dependencies

View the website at: http://localhost:3312

This is where a user will be loggin into app. The user will be prompted to enter name nad location which will be used for the identifaiton acorss the app. This data will be sent to the server as websocket event.

## Admin Panel
http://localhost:3312/admin


The Admin panel an admin can set the Tweet limit alert as to how many tweet a user will need to post in order to be elegible for the reward. System will then count tweets of each user, as they hit the LIMIT, the tweet will be highlighted with different color. 

## GraphQL console 
http://localhost:3312/graphql


## Example 1
1. Goto  http://localhost:3312
2. Enter details and click submit. For Ex. UserA
3. Run http://localhost:3312 in another tab/window 
4. Enter details and click submit For Ex. UserB
5. Goto  http://localhost:3312/admin
   1. Set the Tweet limit to 5
   2. Set the Location to 'Pune'
6. Tweet 5 tweets from UserA
   1. Observe the 5th Tweet to have differnt color
   2. Also on the Admin Panel in the Model Tweet.add method, trigger whatever action that we want to trigger.


## Example 2

After performing all actions of Example 1
1. Goto  http://localhost:3312/admin. (keep dev console open by clicking right click -> inspenct element and goto 'network' tab)
2. In your Page's search bar, enter "3 tweets from user UserA"
3. In the devconsole -> network tab, observe that you will see 3 tweets from the requestd user
4. #hashtag -> In the search bar just add "#my-hashtag", If any tweet matches the #hashtag you will see the results