//Seperate file contining constant variables outside of game. So win count etc. Stuff the game adds to but doesnt need to be reset at any time. Also getElementsBy
//@ Developer notes for inefficiencies

//@Too many global variables used. Rewrite functions with local.

//Code sorted logically into the following sections:

//Card generation functions - Shuffle the deck, generate a card and get the number value, get the percentage, ace recieved, flip card
//Stake functions - Showing the stakeBar, relative stake, add, minus, allIn, enter stake
//User play functions - Hit, stick, display card, bust, remove buttons
//Cpu play functions - generate cpu card, display cpu card
//Post game functions - Win state (comparators), end game displays, next card display, update record bar
//Game reset functions - Reset variables, reset visuals, reset cards, recordbar item colour
//Misc functions - showInfo()

//Inside of sections sorted logically by apperance with necessary descriptions



//*CARD GENERATION FUNCTIONS*
//shuffleDeck()
//generateCard()
//cardNum()
//percentage()
//aceRecieved()
//flipCard()


//Fisher yates shuffle algorithm
//Shuffle the deck at each reset (each game the deck is shuffled)
//The algorithm works so deck is thoroughly shuffled each time. For insurance shuffle thrice
function shuffleDeck(){
    var j, x, i;
    for(t = 0; t < 3; t++){
        for (i = deck.length - 1; i > 0; i--) {
            j = Math.floor(Math.random() * (i + 1))
            x = deck[i]
            deck[i] = deck[j]
            deck[j] = x
        }
        console.log(deck)
    }
    return deck
}

//Generate the users card.
function generateCard(){
    //After deck shuffle -first item is top of the deck. Incramental pointer, the number of cards in play dictates pointer
    //cardsInPlay (array containing which cards are in play, cleared at reset)
    window.card = deck[cardsInPlay.length]
    //If the card is in the cardsInPlay array - retake a card. Run until this isnt the case
    //@ revisions to the way in which cards are generated make this line obsolete, keep as failsafe
    if ((cardsInPlay.indexOf(card)) != (-1)){
        generateCard();
    } else{
        //Once we have a card that isn't in the array, add it to the array and get the number of the card
        cardsInPlay.push(card)};
        cardNum()
}

//Generated card is in the form of a string (number+suit). This function extracts its number
function cardNum(checkCard){
    //set the value to the first character (the number)
    //checkCard is only true when the percentage is being calculated
    if(checkCard){
        window.cardValue = checkCard.charAt(0);
    }else{
        window.cardValue = card.charAt(0);
    }
    //If the first character isnt a number - i.e T,Q,J,K,A
    if (isNaN(cardValue)){
        //if it isnt a number or an ACE, its worth 10
        if (cardValue !== "A"){
            // (T,Q,J,K)
            window.cardValue = 10
        }else{
            //if the card is a special card but not TQJK - its an ace - run the ace function
            aceRecieved()
        }
    }
}

//Shows the safety probability above userCards. Relative percentage, not general statistic
//@Runs through every avalible card in the deck and checks whether the user can take it and remain under 21. Generates a percentage of it. This may be slightly inefficient
//@Does not accomadate for the cpu's cards as the user does not know them. The cards are treated like they are still in the deck
function percentage(){
    //Set known deck as initial deck
    let knownDeck = deck

    //Create a knownDeck by removing each card the user has from the deck. The user knows these cards are still in the deck
    for(i = 0; i < userCards.length; i++){
        knownDeck.splice(knownDeck.indexOf(userCards[i]),1)
    }

    //what is the likelihood that the user gets a card over the gap to 21
    //Set player to user when the cardNum function is run for aces
    player = "user"
    let lessThan = 0
    //Run for every card left in the known deck
    for(i = 0; i < knownDeck.length; i++){
        var checkCard = knownDeck[i]
        //Check the value for each card in the knownDeck
        cardNum(checkCard)
        //Cards less than the gap to 21 i.e. the cards the user can take
        if(cardValue <= (21 - userTotal)){
            lessThan++
        }
    }
    //reset checkCard. When cardNum is run later with hits and cpu - it checks if the checkCard var is empty
    var checkCard
    //Take the amount of lessThan cards found, find the percentage of those cards in the deck. Display to 2 decimal places
    var probOfBust = Math.round(((lessThan / knownDeck.length) * 100) * 100 ) / 100
    document.getElementById("safeProbability__percentage").innerHTML = probOfBust
}

//@This can be shortened - currently, the player is passed through
//So if an ace is recieved, we need to dictate its value based on the current total - so if they can take an 11, take it. Based on user
function aceRecieved(){
    //if the (player) has a total under 11, the card value is 11. if not it is 1
    if (player === "cpu"){
        if(cpuTotal < 11){
            window.cardValue = 11
        }else{
            window.cardValue = 1
        }
    }
    if (player === "user"){
        if(userTotal < 11){
            window.cardValue = 11
        }else{
            window.cardValue = 1
        }
    }
}

//Flip cards adding a class containing the animation
//@Currently flips all cards, could change that
function flipCard(){
    document.getElementById("card" + cardIndexNum + "__side--back").classList.add("flipCardBackClass")
    document.getElementById("card" + cardIndexNum + "__side--front").classList.add("flipCardFrontClass")
}



//*STAKE FUNCTIONS*

//checkRelStake()
//toggleStakeBar()
//stakePlacedDisplayToggle()
//addStake()
//minusStake()
//allInStake()
//enterStake()

//relative stake. When the user has loads of money, itd take a while for them to add to stake with such a small addition in comparison to funds. This increases add based on funds
//checked upon reset
function checkRelStake(){
    //If they dont have over 1000 funds, just make the relStake 50
    relStake = 50
    if(funds > 1000){
        //If their funds are over 1000, make the relstake proprtionate to the 1000th num (1000 = 100, 2000 = 200)
        relStake = (String(funds).charAt(0) * 100)
    }
}

//Toggles the stake bar on the right at reset and enter of stake
function toggleStakeBar(){
    stakeBarStatus.classList.toggle("hidden")
    stakesNumBtn.innerHTML = "0"
    stakeBar.classList.toggle("hidden")
    stakeBar.style.animation = "fadeIn .6s ease-out"
    allInBtn.classList.toggle("hidden")
    //stakeBar is the elements, this ID stakebar is the container around that. Toggle the prompt flash on that 
    document.getElementById("stakeBar").classList.toggle("promptFlash")
    stakePlacedDisplayToggle()
}

//Called seperately from toggleStakeBar
function stakePlacedDisplayToggle(){
    stakeDisplay.innerHTML = stakesPlaced
    stakeDisplay.classList.toggle("hidden")
}

//click event listener for plus stake. Adds relStake to stakePlaced and displays it
document.getElementById("stakesBtnPlus").addEventListener("click", addStake)
function addStake(){
    //Alert fot insufficient funs
    if (stakesPlaced >= funds){
        alert("You're too poor bud")
    }else{
        //Takes the stakes away from the avalible funds.
        stakesPlaced = stakesPlaced + relStake
        stakesNumBtn.innerHTML = stakesPlaced
        fundsNum.innerText = funds - stakesPlaced
    }
}

//click event listener for minus stake. Subtracts relStake to stakePlaced and displays it
document.getElementById("stakesBtnMinus").addEventListener("click", minusStake)
function minusStake(){
    //If the user tries to go below 0 on bet, alert error
    if (stakesPlaced <= 0){
        alert("I think you know it doesn't work like that...")
    }else{
        //Adds the stakes to the avalible funds display
        stakesPlaced = stakesPlaced - relStake
        stakesNumBtn.innerHTML = stakesPlaced
        fundsNum.innerText = funds - stakesPlaced
    }
}

//All funds placed as bet on press of the allIn button
document.getElementById("stakeBar__allIn").addEventListener("click", allInStake)
function allInStake(){
    stakesPlaced = funds
    stakesNumBtn.innerHTML = stakesPlaced
    fundsNum.innerText = "0"
}

//Button enters the stake
stakesNumBtn.addEventListener("click", enterStake)
function enterStake(){
    //Hide the stakeBar
    toggleStakeBar()
    stakeDisplay.style.animation = "fadeIn .4s ease-in, moveDown .5s ease-out"
    //Show the game buttons so the user can play
    toggleGameButtons()
}



//*USER PLAY FUNCTIONS*
//hitButtons()
//stickButtons()
//cardAddedDisplay()
//percentage()
//bust()
//toggleGameButtons()


//Invoked when hitButton is pressed
hitButton.addEventListener("click", hitButtons)
function hitButtons(){
    //So if the users total is over 13 and hits, I consider it risky and add to riskyHit display
    if (userTotal > 13){
        riskyCount ++
        document.getElementById("gameInfo__riskyHits").innerHTML = riskyCount
        document.getElementById("gameInfo__riskyHits").style.color = "#333"
    }

    //Generate a card
    player = "user"
    generateCard();
    //add card to total
    userTotal = userTotal + Number(cardValue);
    //Display it, then flip it
    cardAddedDisplay()
    flipCard()
    //Wait for the card to flip and then display the userTotal
    setTimeout(() => {
        currentScore.innerHTML = userTotal
        cardAdded.innerHTML = ("+ " + cardValue)
    },1000)

    window.lastCardBust = cardValue
    window.pastTotal = userTotal - cardValue
    //Timeout used for suspense in the case of a bust
    setTimeout(() => {
        percentage()
        //If the user goes bust after hit - run bust function, let the cpuPlay, then end
        if (userTotal > 21){
            bust();
            toggleGameButtons()
            endGame()
        }else{
            //If they didnt go bust- do nothing but show the percentage decrease
            userRecCards.push(card)
        }
    },1000)
}

//Invoked when stickButton is pressed - one of 2 ways to reach end game (stick, bust)
stickButton.addEventListener("click", stickButtons)
function stickButtons(){
    stickBust.innerHTML = "stick"
    stakeBarStatus.classList.toggle("hidden")
    //remove buttons, run end game
    toggleGameButtons()
    endGame()
}

//This takes the card and creates an HTML element in the cardContainer of the card with sides.
function cardAddedDisplay(){
    cardIndexNum++
    userCards.innerHTML = userCards.innerHTML +
    "<div id='card"+ cardIndexNum +"' class='card'><!-- front side of card --><div id='card"
    + cardIndexNum +
    "__side--front' class='card__side card__side--front'><img src='assets/images/red_back.png' class='cardImg redBack'></div><!-- Back side of card --><div id='card"
    + cardIndexNum +
    "__side--back' class='card__side card__side--back'><img src='assets/images/"
    + card +
    ".png' alt=' " + card + " 'title = '"+ card + "'class='cardImg cardType'></div></div>";

    //Card HTML created:

    //<!-- Card container-->
    //"<div id='card+cardIndexNum' class='card'>
         //<!-- front side of card --><div id='card + cardIndexNum + __side--front' class='card__side card__side--front'>
             //<img src='assets/images/red_back.png' class='cardImg redBack'>
         //</div>

         //<!-- Back side of card -->
         //<div id='card+cardIndexNum+__side--back' class='card__side card__side--back'>
             //<img src='assets/images/+ card +.png' alt=' + card + 'title = '+ card + 'class='cardImg cardType'>
         //</div>
    //</div>;
}

//If the user goes bust on hit
function bust(){
    window.userBust = true
    bustCount++
    document.getElementById("gameInfo__busts").innerHTML = bustCount
    document.getElementById("gameInfo__busts").style.color = "var(--colour-redStatus)"

    stickBust.innerHTML = "bust"
    stakeBarStatus.innerHTML = "bust"
}

//Remove the game buttons - hit and stick
function toggleGameButtons(){
    hitButton.classList.toggle("hidden")
    stickButton.classList.toggle("hidden")
    hitButton.style.animation = "buttonHidingHit 2s ease-in forwards"
    stickButton.style.animation = "buttonHidingStick 2s ease-in forwards"
}



//*CPU PLAY FUNCTIONS*
//Called when the user goes bust or when they stick

//cpuPlay()
//cpuCard()

function cpuPlay(){
    //2sec timeout for the cpu to play, adds suspense
    setTimeout(() => {
    //We want to flip those two initial cards the cpu got at the start first. With the index of 3 and 4
        cpuCardIndexNum = cardIndexNum
        for(cardIndexNum = 3; cardIndexNum <= 4; cardIndexNum++){
            flipCard()
        }
        cardIndexNum = cpuCardIndexNum
        //the cpu will take another card while their score is lower than range
        //This range is random between 17 and 13, dictating cpu difficulty
        //Range dictates frequency of cpuBust, low scores for cpu
        let cpuPlayRange = (Math.floor(Math.random() * (17 - 13) + 13))

        while (cpuTotal < cpuPlayRange){
            player = "cpu"
            generateCard();
            cpuCard()
            flipCard()
        }
    },1600)

    //3.4sec timeout to show the cpu's score to user at endgame
    setTimeout(() => {
    document.getElementById("cpuCards__total--display").innerHTML = cpuTotal
    if (cpuTotal > 21){
        window.cpuBust = true
        document.getElementById("cpuCards__total--display").innerHTML = "Bust"
    }
    },2800)
}

//Handles the display of the cpu's cards
//@Make into one function with userCardValue function
function cpuCard(){
    cpuTotal = Number(cpuTotal) + Number(cardValue);
    cardIndexNum++
    //Create the html card for the cpu
    cpuCards.innerHTML = cpuCards.innerHTML +
    "<div id='card"+ cardIndexNum +"' class='card'><!-- Front side of card --><div id='card"+ cardIndexNum +
    "__side--front' class='card__side card__side--front'><img src='assets/images/red_back.png' class='cardImg redBack'></div><!-- Back side of card --><div id='card"+ 
    cardIndexNum +"__side--back' class='card__side card__side--back card__side--back-2'><img src='assets/images/"+ card +
    ".png' class='cardImg cardType' alt=' " + card + "' title=' " + card + " '></div></div>"
}



//*POST GAME FUNCTIONS*
//endGame()
//comparators()
//finish() function
//nextCardDisplay()
// bustUserLossWHW()
//updateRecordBar()

//Holds comparators that dictate loss,win,draw. Invokes the final function passing corrosponding paramater

function endGame(){
    cpuPlay()
    comparators()
    nextCardDisplay()
}

function comparators(){
    //Used for suspense. The user awaits whether they won or lost
    setTimeout(() => {
        var result;
        if((!userBust) && ((userTotal > cpuTotal) || (cpuBust))){
            result = "WIN"
        } 
        else if((userTotal === cpuTotal) || ((userBust) && (cpuBust))){
            result = "DRAW"
        }
        // else((!cpuBust) && ((userTotal < cpuTotal) || (userBust))){
        else{
            result = "LOSS"
        }
            
        finish(result)
        gameRecord.push(result)
    },2800)
}

//Final function will display various things based on if they won etc.
function finish(wdl){
    //Show the status bar
    statusBar.classList.toggle("hidden")
    statusBar.style.animation = "fadeIn .4s linear forwards"
    document.getElementById("statusBar__elementsID").classList.toggle("promptFlash")
    stakePlacedDisplayToggle()

    //If statements handle visuals based on wdl, as well as funds
    if(wdl === "WIN"){
        winCount++
        header.style.background = "linear-gradient(to bottom right, rgba(0, 128, 0, 1),var(--colour-greenStatus)"
        headerBlack.style.background = "#222"
        headerLeft.style.background = "linear-gradient(to bottom right,green,rgba(172, 255, 47, 0.25))"
        headerRight.style.background = "linear-gradient(to top left,green,rgba(172, 255, 47, 0.25))"

        document.getElementById("gameInfo__wins").innerHTML = winCount
        document.getElementById("gameInfo__wins").style.color = "var(--colour-greenStatus)"
        document.getElementById("gameInfo__winPercentage").style.color = "var(--colour-greenStatus)"

        winLoss.style.color = "var(--colour-greenStatus)"

        funds = funds + stakesPlaced
        fundsDisplay.innerHTML = "+" + stakesPlaced
        fundsDisplay.style.color = "var(--colour-greenStatus)"
    }

    if(wdl === "DRAW"){
        drawCount++

        document.getElementById("gameInfo__draws").innerHTML = drawCount
        document.getElementById("gameInfo__draws").style.color = "#333"
        document.getElementById("gameInfo__winPercentage").style.color = "#333"

        winLoss.style.color = "#333"

        fundsDisplay.innerHTML = "0"
        fundsDisplay.style.color = "var(--colour-modelM)"
    }

    if(wdl === "LOSS"){
        lossCount++
        header.style.background = "linear-gradient(to bottom right, darkred,var(--colour-redStatus)"
        headerBlack.style.background = "#222"
        headerLeft.style.background = "linear-gradient(to top right,var(--colour-redStatus),darkred)"
        headerRight.style.background = "linear-gradient(to bottom left,darkred,var(--colour-redStatus))"

        document.getElementById("gameInfo__losses").innerHTML = lossCount
        document.getElementById("gameInfo__losses").style.color = "var(--colour-redStatus)"
        document.getElementById("gameInfo__winPercentage").style.color = "var(--colour-redStatus)"

        winLoss.style.color = "var(--colour-redStatus)"

        funds = funds - stakesPlaced
        fundsDisplay.innerHTML = "-" + stakesPlaced
        fundsDisplay.style.color = "var(--colour-redStatus)"
    }
    //If the user went bust, check if they would have won without that last card
    if(userBust){
        bustUserLossWHW()
    }
    winLoss.innerHTML = wdl

    //Calculate win rate percentage
    let gamesPlayed = winCount + drawCount + lossCount
    winPercentage = Math.floor((winCount / gamesPlayed) * 100)
    document.getElementById("gameInfo__winPercentage").innerHTML = winPercentage

    fundsDisplay.style.animation = "moveUp 4s ease-in forwards"

    //If they got a perfect score, record it
    if (userTotal === 21){
        toCount ++
        document.getElementById("gameInfo__21s").innerHTML = toCount
        document.getElementById("gameInfo__21s").style.color = "green"
        document.getElementById("gameInfo__21s").style.transform = "scale(1.1)"
    }
    updateRecordBar()
}

 //pastTotal is the total the user would have had if they didnt take the card that made them bust
function bustUserLossWHW(){
    stakeBarStatus.classList.add("hidden")
    BULhide.classList.remove("hidden")
    if((pastTotal > 21) || (pastTotal < cpuTotal)){
        //It doesnt matter if they took that card or not, they would have lost anyway
        BULstatus.innerHTML = "Lost"
        BULstatus.style.color = "var(--colour-redStatus)"
    }
    else if((pastTotal > cpuTotal) || cpuBust){
        //If they didnt take that last card they would have won
        BULstatus.innerHTML = "Won"
        BULstatus.style.color = "var(--colour-greenStatus)"
    }
    // else if(pastTotal === cpuTotal)
    else{
        //They would have drawn if they didnt take the last card
        BULstatus.innerHTML = "Drawn"
        BULstatus.style.color = "var(--colour-modelM)"
    }
    document.getElementById("BUL--card").innerHTML = lastCardBust
    pastTotalDisplay.innerHTML = pastTotal
}

//What card would the user have gotten if they didnt stick? Would they have won with it?
function nextCardDisplay(){
    if(!userBust){
        generateCard()
        document.getElementById("nextCard").classList.toggle("hidden")
        document.getElementById("nextCard").style.animation = "fadeIn .7s linear forwards"
    
        // document.getElementById("nextCard__label").innerHTML = card
        if (isNaN(card.charAt(0))){
            cardDisplayText = cardName[card.charAt(0)] + " of " + cardType[card.charAt(1)]
        }else{
            cardDisplayText = cardValue + " of " + cardType[card.charAt(1)]
        }
        document.getElementById("nextCard__label").innerHTML = cardDisplayText
        document.getElementById("nextCard__img").src = ("assets/images/" + card + ".png")
    
        if((Number(userTotal) + Number(cardValue)) > 21){
            document.getElementById("nextCard__status--word").innerHTML = "Bust"
        }else{
            document.getElementById("nextCard__status--word").innerHTML = "Safe"
            wrongStickCount ++
            document.getElementById("gameInfo__wrongSticks").innerHTML = wrongStickCount
            document.getElementById("gameInfo__wrongSticks").style.color = "var(--colour-redStatus)"
        }
    }
}

//Updates the record bar. This acts as a queue, first in last out. Things are shifted down the bar as items are added, with the last being removed.
function updateRecordBar(){
    //@REDO this, the record bar height changes, and the size of one tag changes with vp
    //calculate the amount of record bar tags that can be shown by viewport height
    let vh = Math.max(document.documentElement.clientHeight || 0, window.innerHeight || 0)
    //vh = viewport height. 65% of the vh is the record bar height. 70px is the height of an individual record tag
    visNum = (Math.floor((vh * .65) / 70) - 1)

    if (recordBarCount > visNum){
        recordContainer.removeChild(recordContainer.childNodes[visNum - 1]);
        recordBarCount - 1
    }
    //recordBarCount keeps track of number of items in the record bar.
    //RecordBarPointer keeps track of individual items in the record bar by their id

    //Add an item to the record bar with the most recent item in gameRecord array
    //each time we pass here, there is one item added to the list. Therefore if we were to ++ to a variable when one is added, and we - each time one is removed- we can keep track of the number of items in the html
    let recordBarElement = document.createElement("p")
    recordBarElement.classList.add("recordBar__tag")
    recordBarPointer++
    recordBarElement.id = ("recordItem" + recordBarPointer)
    recordContainer.insertBefore(recordBarElement, recordContainer.firstChild);
    recordBarElement.innerHTML = stakesPlaced;
    document.getElementById("recordItem" + recordBarPointer).style.animation= "fadeIn .2s ease-in"
}



//*GAME RESET FUNCTIONS*

//resetGame()
//visualsReset()
//gameResetCards()
//recordBarColour()

//ResetGame run when button is pressed, and on start
reset.addEventListener("click", resetGame)
function resetGame(){
    //If the user went bust, ill give them 250 funds. If i already did this - theyre can no longer place bets.
    if (funds === 0){
        if (bail){
            alert("You're completely penniless and friendless, no more betting. BlackJack isnt for you. You owe me.")
        }else{
            alert("You're straight broke. I feel kinda bad. I'll give you 250. Don't lose it.")
            funds = 250
            bail = true
        }
    }

    //These are all game variables set. Variables changed in game need to be reset. Reset upon restart.
    //Some visuals are reset
    recordBarColour()
    shuffleDeck()
    stakesPlaced = 0
    window.cardsInPlay = [];
    //This keeps track of how many cards are in play, and allows to point to specific ones.
    window.cardIndexNum = 0
    window.userTotal = 0;
    window.cpuTotal = 0;
    window.userBust = false
    window.cpuBust = false
    visualsReset()
}

//All visuals changed at end game need to be reset
function visualsReset(){
    headerBlack.style.background = "var(--colour-primary)"
    currentScore.innerHTML = 0
    cardAdded.innerHTML = " + 0"
    statusBar.classList.toggle("hidden")
    stakeBarStatus.classList.toggle("hidden")
    stakeBarStatus.innerHTML = "safe"
    document.getElementById("statusBar__elementsID").classList.toggle("promptFlash")
    fundsNum.innerText = funds
    stakePlacedDisplayToggle()
    BULhide.classList.add("hidden")
    toggleStakeBar()
    //reset displayed cards
    userCards.innerHTML="";
    cpuCards.innerHTML="";
    gameResetCards()
    header.style.background = "linear-gradient(to right, var(--colour-primary), var(--colour-modelM))"
    // header.style.background = "linear-gradient(to bottom right, var(--colour-primary),rgba(216, 215, 211, 0.4), var(--colour-modelM))"
    headerLeft.style.background = "linear-gradient(to right, var(--colour-primary),var(--colour-grayBlue))"
    headerRight.style.background = "linear-gradient(to left,var(--colour-modelM),var(--colour-grayBlue))"
    document.getElementById("gameInfo__riskyHits").style.color = "var(--colour-modelM)"
    document.getElementById("gameInfo__wrongSticks").style.color = "var(--colour-modelM)"
    document.getElementById("gameInfo__wins").style.color = "var(--colour-modelM)"
    document.getElementById("gameInfo__winPercentage").style.color = "var(--colour-modelM)"
    document.getElementById("gameInfo__draws").style.color = "var(--colour-modelM)"
    document.getElementById("gameInfo__losses").style.color = "var(--colour-modelM)"
    document.getElementById("gameInfo__21s").style.color = "var(--colour-modelM)"
    document.getElementById("gameInfo__busts").style.color = "var(--colour-modelM)"

    document.getElementById("nextCard").classList.add("hidden")

    document.getElementById("cpuCards__total--display").innerHTML = "-"
}

//generate the two initial cards for each user. layout says user, cpu, user, cpu
function gameResetCards(){
    for(i = 0; i < 2; i++){
        //timing functions here for some reason. Idk why. It doesnt work if theyre not here, dont touch
        setTimeout(() => {
            player = "user"
            generateCard()
            //add the card to the user's total
            userTotal = Number(userTotal) + Number(cardValue)
            //display and flip the card
            cardAddedDisplay()
            flipCard()
            userRecCards.push(card)
            //visuals
            currentScore.innerHTML = userTotal
            cardAdded.innerHTML = ("+ " + cardValue)
            percentage()
    
            setTimeout(() => {
                player = "cpu"
                generateCard()
                cpuCard()
            },100)
         },100)
    }
    //check the relative stake
    checkRelStake()
}

//Change the colour of the recent record bar tag. Add a tag into the infobox. Must be done on reset
function recordBarColour(){
    if(gameRecord[0] == "WIN"){
        document.getElementById("recordItem" + recordBarPointer).style.color = "var(--colour-greenStatus)"
    }
    if(gameRecord[0] == "DRAW"){
        document.getElementById("recordItem" + recordBarPointer).style.color = "var(--colour-primary)"
    }
    if(gameRecord[0] == "LOSS"){
        document.getElementById("recordItem" + recordBarPointer).style.color = "var(--colour-redStatus)"
    }

    //add the new record to the infoBox. 
    //check if they have played yet
    if(gameRecord[0]){
        let infoBoxTag = document.createElement("p")
        infoBoxTag.classList.add("infoBox__recordBar--tag")
        //Check the recent record, get the first character of it and make use it as the innerHTML
        infoBoxTag.innerHTML = (gameRecord[0]).charAt(0);
        infoBoxRecord.insertBefore(infoBoxTag, infoBoxRecord.firstChild);
    }
    //Clear the gameRecord
    gameRecord.shift()
    recordBarCount++
}



//*MISC FUNCTIONS*
//showInfo()


//Infobox toggle hidden on button press
let showInfoCount = 0
infoButton.addEventListener("click", showInfo)
function showInfo(){
    //If the showInfoCount is even- the infoBox is hidden, so run the appear animation
    //If the showInfoCount is odd- the infoBox is showing, so run the hiding animation
    //each time the showInfo button is pressed, the showInfoCount is added to
    showInfoCount++
    if(showInfoCount % 2){
        infoBox.style.animation = "infoBoxAppear .7s ease-out forwards"
    }else{
        infoBox.style.animation = "infoBoxHiding .7s ease-in forwards"
    }
}


//Runs the game
resetGame()