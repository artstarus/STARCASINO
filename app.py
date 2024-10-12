import os
import re

from cs50 import SQL
from flask import Flask, flash, redirect, render_template, request, session, jsonify
from flask_session import Session
from tempfile import mkdtemp
from werkzeug.security import check_password_hash, generate_password_hash

from helpers import login_required

# Configure application
app = Flask(__name__)

# Configure session to use filesystem (instead of signed cookies)
app.config["SESSION_PERMANENT"] = False
app.config["SESSION_TYPE"] = "filesystem"
Session(app)

# Configure CS50 Library to use SQLite database
db = SQL("sqlite:///game.db")


@app.after_request
def after_request(response):
    """Ensure responses aren't cached"""
    response.headers["Cache-Control"] = "no-cache, no-store, must-revalidate"
    response.headers["Expires"] = 0
    response.headers["Pragma"] = "no-cache"
    return response


@app.route("/")
@login_required
def index():
    return render_template("index.html")


@app.route("/login", methods=["GET", "POST"])
def login():
    """Log user in"""

    # Forget any user_id
    session.clear()

    # User reached route via POST (as by submitting a form via POST)
    if request.method == "POST":

        # Query database for username
        rows = db.execute(
            "SELECT * FROM users WHERE username = ?", request.form.get("username")
        )

        # Ensure username exists and password is correct
        if len(rows) != 1 or not check_password_hash(
            rows[0]["hash"], request.form.get("password")
        ):
            error_statement = "Authentication failed. Please check your username/password."
            return render_template("login.html", error_statement = error_statement)

        # Remember which user has logged in
        session["user_id"] = rows[0]["id"]

        # Redirect user to home page
        return redirect("/")

    # User reached route via GET (as by clicking a link or via redirect)
    else:
        error_statement = "hello"
        return render_template("login.html")


@app.route("/logout", methods=["GET", "POST"])
def logout():
    """Log user out"""

    # Forget any user_id
    session.clear()

    # Redirect user to login form
    return redirect("/")


@app.route("/register", methods=["GET", "POST"])
def register():
    """Register user"""
    if request.method == "GET":
        return render_template("register.html")

    if request.method == "POST":
        if not request.form.get("confirmation") == request.form.get("password"):
            error_statement = "Please make sure your confirmation matches your password."
            return render_template("register.html", error_statement = error_statement)

        rows = db.execute(
            "SELECT * FROM users WHERE username = ?", request.form.get("username")
        )
        if len(rows) == 1:
            error_statement = "Username already taken."
            return render_template("register.html", error_statement = error_statement)

        hash = generate_password_hash(
            request.form.get("password"), method="pbkdf2", salt_length=16
        )
        username = request.form.get("username")

        db.execute("INSERT INTO users (username, hash) VALUES (?, ?)", username, hash)

    return redirect("/login")


@app.route("/statistics")
@login_required
def statistics():
    """Show statistics of rounds"""
    stats = db.execute(
        "SELECT * FROM statistics WHERE user_id = :user_id ORDER BY timestamp DESC",
        user_id=session["user_id"],
    )
    return render_template("statistics.html", stats=stats)


@app.route("/roulette", methods=["GET", "POST"])
@login_required
def roulette():
    """Roulette game implementation"""
    cash = db.execute("SELECT cash FROM users WHERE id = :user_id", user_id=session["user_id"])[0]["cash"]

    if request.method == "GET":
        print("Cash before bet:", cash)
        return render_template("roulette.html", cash = cash)

    if request.method == "POST":
        data = request.get_json()

        redBet = 0
        greenBet = 0
        blackBet = 0

        redBet = int(data.get('redAmount'))
        greenBet = int(data.get('greenAmount'))
        blackBet = int(data.get('blackAmount'))

        # Needed for the stats table
        redBetINFO = redBet
        greenBetINFO = greenBet
        blackBetINFO = blackBet
        wagerTotal = redBetINFO + greenBetINFO + blackBetINFO

        # Don't think this is necessary annymore since script.js checks these things
        if ((cash < redBet + greenBet + blackBet) or redBet < 0 or greenBet < 0 or blackBet < 0):
            error_statement = "Invalid Bet."
            return render_template("roulette.html", error_statement = error_statement)

        print("Red Bet:", redBet)
        print("Green Bet:", greenBet)
        print("Black Bet:", blackBet)
        cash = cash - redBet - blackBet - greenBet

        print("Cash After Bet:", cash)

        db.execute(
            "UPDATE users SET cash = :cash WHERE id = :user_id",
            cash=cash,
            user_id=session["user_id"])

        winningColor = data.get('circleColor')
        print("Winning Color:", winningColor)

        if winningColor == "-": # just in case it starts at the begining before spin. maybe delete this?
            redBet = redBet
            blackBet = blackBet
            greenBet = greenBet
        if winningColor == "Red":
            redBet = redBet * 2
            blackBet = 0
            greenBet = 0
        if winningColor == "Black":
            redBet = 0
            blackBet = blackBet * 2
            greenBet = 0
        if winningColor == "Green":
            redBet = 0
            blackBet = 0
            greenBet = greenBet * 35

        wagerSpoils = redBet + blackBet + greenBet
        cash = cash + wagerSpoils
        print("Cash After Spin:", cash)

        # Updates users cash balance
        db.execute(
            "UPDATE users SET cash = :cash WHERE id = :user_id",
            cash=cash,
            user_id=session["user_id"])

        # Checks outcome of round in relation to the users bets
        outcome = ""
        if wagerSpoils > wagerTotal:
            outcome = "Win"
        elif wagerSpoils < wagerTotal:
            outcome = "Loss"
        elif wagerSpoils == wagerTotal:
            outcome = "Tie"

        netSpoils = wagerSpoils - wagerTotal

        # Ensure db does not store games with no wagers
        if wagerTotal > 0:
            db.execute(
                "INSERT INTO statistics (user_id, outcome, winning_color, red_bet, green_bet, black_bet, wager_total, wager_spoils, net_spoils, balance) VALUES (:user_id, :outcome, :winning_color, :red_bet, :green_bet, :black_bet, :wager_total, :wager_spoils, :net_spoils, :balance)",
                user_id=session["user_id"],
                outcome=outcome,
                winning_color=winningColor,
                red_bet=redBetINFO,
                green_bet=greenBetINFO,
                black_bet=blackBetINFO,
                wager_total=wagerTotal,
                wager_spoils=wagerSpoils,
                net_spoils = netSpoils,
                balance=cash
            )

        return render_template("roulette.html", cash = cash)


    ######## Nothing left to fix! Congrats! Done!
    
    ######## POTENTIAL FUTURE FEATURES:
            # American Roulette
            # Other games
            # Nicer UI

