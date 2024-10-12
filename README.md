# STARCASINO - CS50 FINAL PROJECT 2023

#### See it in action in this [Video Demo](https://www.youtube.com/watch?v=i77VHynfw1E)

This was my final project for Harvard's CS50 course. This was completed in the Summer of 2023 and included a very large commit history of over 1,000 commits showcasing my learning process. This work was done within the cs50 codespace. I have now migrated this project to my own personal public repository. Although private, commits were done in 2023 and can be seen on my 2023 GitHub commit graph. 

At the time of creation, this was one of my first big projects that I created from scratch. A video demo is linked above!

![CS50 CERTIFICATE](/CS50x.png)


# What is STARCASINO?
STARCASINO is a web app that simulates an online casino. It's current implementation features only one game, European-styled roulette. This web app allows users to register an account and log in with a loaded account balance of 10,000 credits. Users can then navigate to the roulette page where they are able to indulge in exciting sessions of European roulette. Not only does European roulette provide better odds of winning, but this simple colored implementation offers a user-friendly approach to what would normally seem like a complex casino game. In this version, users can only bet on the colors red, green, and black. Although the game provides data on which number was victorious, this is strictly for aesthetics. Users place bets by inputing a whole number value into the respective bet input fields to wager a portion of their credit balance. Users can simultaneously bet on multiple colors if they so desire. Users may not bet negative values, decimal values, leave the bet fields blank, or have their total wager equate to more than their current account balance. A winning wager on red returns 2:1 spoils. This is also true for wagers on black. A winning wager on green returns 35:1. Of course, net spoils are calculated based on the return minus the total wager amount. After entering the desired wager, the user is able to click spin and watch the roulette wheel spin. After the animation is complete, the user is presented with a big centered and numbered circle in the respective winning color. To the left of the game wheel, users can see all the information of that round. This includes the number of degrees the wheel had spun, winning color, winning number, total wager, wager spoils, and the net spoils of the wager. In the bottom right corner, users can see their dynamically updating account balance. Similarly, in the statistics tab users can see all of this data as well as data from their previous rounds (spins) with the addition of a timestamp ordered in descending order. After a session of fun, users can log out using the log out button at the top right of the page located within the navigation bar. In the footer of every page, users are warned: "WARNING: Gambling involves risks: debt, loneliness, and addiction. Please play responsibly."

# Structure / Design of Web App
STARCASINO is written in python using the flask framework, html, css, and javascript. An SQLite database is used as well. At the head of every page is a navigation bar which features the STARCASINO logo as well as tabs which redirect to the roulette game, user statistics, and includes a log out button.

## The Five Main Accessible Pages

* *login.html* - This is the page that is displayed when a user loads the site. Users must log in to continue to the index/home page. No account? A nav bar at the top of the page allows users to click on the register button which redirects to the registration page.
* *register.html* - Register is a page users utilize to register a new account for STARCASINO. Users must enter a new username, password, and confirm their password.
* *index.html* - This is the home/index page that greets the user. It lets the user know to navigate the web app using the nav bar above, as well as mentions the free 10,000 credits awarded to new users of STARCASINO.
* *roulette.html* - This is the roulette game page. Users input their wager(s) and click spin to play. Information is listed for each round and an account credit balance is dynamically updated once the round reaches completion.
* *statistics.html* - This is the statistics page that showcases every round played containing wagers above 0. Each row showcases whether the user won or lost, round winning color, wager amount on red, green, black, total wager amount, wager spoils, total net spoils, users balance after the round, and finally a timestamp of the round. This table of data was designed so users could analyze previous bets and formulate new strategies for future gameplay. All possible useful data is provided in this clear and visually appealing table.

## Main and Supporting Files

* *app.py* - This is the main back-end python file which utilizes flask. It handles all the routes and needed mathematics to properly keep track of and update the correct tables in the database. The roulette route is the most code intense route and features essential mathematics and logical game mechanics.
* *helpers.py* - This file provides a helper function for the login functionality of the web app.
* *script.js* - This is a crucial file in the functionality of the roulette game. It provides the logic and functionality of the game animations as well as prevents users from stumbling upon game breaking and dangerous edge-cases.
* *styles.css* - The web app style sheet and style guide. The STARCASINO theme includes red, gold, gray, and white.
* *game.db* - An SQLite database which features 2 main tables: One for storing all users, ids, usernames, hashed passwords, and respective credit balances. Another table is used to store the statistics of each round a user plays. This second table references the users table through the userid foreign key.
* *image files* - These are all the necessary files for the front-end development of the web app UI. Included are the roulette wheel, arrow, home banner, and various colored winning circles.

# Future Development
Since this is an online casino, it would only make sense for it have many more games available for the user to play. The current roulette implementation is European themed, however an American themed wheel could also be added. Additional games such as coin flip, dice, and blackjack could be implemented. The front-end UI could also be updated to a more modern and appealing look. Of course, features for depositing and withdrawing credits would need to be implemented as well if this was a live product.

# Notes
This project has pushed me to further explore the inner workings of web development, and software engineering as a whole!