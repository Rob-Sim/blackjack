//@ No idea why - but AD doesnt show its image. It isnt the memory slot - it is called the same way as the rest. The image is there in storage an when inspected it is pointed to, but it doesnt show. It isnt the name
let deck = [
    "AC", "2C", "3C", "4C", "5C", "6C", "7C", "8C", "9C", "TC", "JC", "KC", "QC",
    "2D", "3D", "4D", "5D", "6D", "7D", "8D", "9D", "TD", "JD", "KD", "QD",
    "AS", "2S", "3S", "4S", "5S", "6S", "7S", "8S", "9S", "TS", "JS", "KS", "QS",
    "AH", "2H", "3H", "4H", "5H", "6H", "7H", "8H", "9H", "TH", "JH", "KH", "QH"];

//Both used in the next card display only. Convert non number cards to text instead of value characters
const cardName = {
    "T": "10",
    "J": "Jack",
    "K": "King",
    "Q": "Queen",
    "A": "Ace"
};

const cardType = {
    "S": "Spades",
    "C": "Clubs",
    "H": "Hearts",
    "D": "Diamonds",
}

var userRecCards = []

var cardDisplayText;

//Controls which player is playing (cpu or user) in the case that an ace is recieved
var player;
let bail = false
//W, D, L, D, L, W. etc.
let gameRecord = [];

//Used to grasp the amount of record bar tags that can be displayed given the viewport height
let viewHeight = Math.max(document.documentElement.clientHeight || 0, window.innerHeight || 0)
//Counts the current amount of recordBar tags there are. Taken away from when one is removed
let recordBarCount = 0;
//When a tag is created, we need to point at it to be able to set its colour. Its ID is given to the tag with this pointer
let recordBarPointer = 0;

//These are to be added to each pass and displayed in the footer.
//Hits over 13 total
let riskyCount = 0;
let winCount = 0;
let drawCount = 0;
let lossCount = 0;
let wrongStickCount = 0;
//Twenty One count (perfect score)
let toCount = 0;
let bustCount = 0;

//Stake based variables
let stakesPlaced = 0;
//Controls initial funds number
let funds = 400;
//Relative stake increases incramentally corrosponding to funds
var relStake;

//variables containing getElements in order of apperance within HTML
const header = document.getElementById("header__name")
const headerBlack = document.getElementById("header__name--black")
const headerLeft = document.getElementById("header__twoTone--left")
const headerRight = document.getElementById("header__twoTone--right")

const recordContainer = document.getElementById("recordBar__items");
const recordBar = document.getElementById("recordBar__items")

const currentScore = document.getElementById("userScore__currentScore")
const cardAdded = document.getElementById("userScore__cardAdded")

const userCards = document.getElementById("userCards")
const cpuCards = document.getElementById("cpuCards__container")

const hitButton = document.getElementById("hitButton")
const stickButton = document.getElementById("stickButton")

const stakeBar = document.getElementById("stakeBar__elements")
const stakesNumBtn = document.getElementById("stakeBar__enter")
const allInBtn = document.getElementById("stakeBar__allIn")

const stakeBarStatus = document.getElementById("stakeBar__gameStatus")

const BULhide = document.getElementById("bustUserLost")
const BULstatus = document.getElementById("bustUserLost--pastTotalStatus")
const pastTotalDisplay = document.getElementById("pastTotal")

const statusBar = document.getElementById("statusHidden")
const stakeDisplay = document.getElementById("statusBar__fundsDisplayGame")
const fundsNum = document.getElementById("funds__num")
const stickBust = document.getElementById("statusBar__stickBust")
const winLoss = document.getElementById("statusBar__winLoss")
const fundsDisplay = document.getElementById("statusBar__moneyInOut")
const reset = document.getElementById("reset")

const infoButton = document.getElementById("header__infoButton");
const infoBox = document.getElementById("infoBox");
const infoBoxRecord = document.getElementById("infoBox__record")