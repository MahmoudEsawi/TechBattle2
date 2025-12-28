// Run immediately or wait for DOM
(function() {
    // Sound effects
    var wrongSound = new Audio("../assets/sounds/wrong_answer.mp3");
    var correctSound = new Audio("../assets/sounds/correct_answer.mp3");

    // Use questions - prioritize match-specific questions
    let questions;
    if (typeof MATCH_QUESTIONS !== 'undefined' && MATCH_QUESTIONS.wdyk) {
        questions = MATCH_QUESTIONS.wdyk;
    } else if (typeof WDYK_QUESTIONS !== 'undefined') {
        questions = WDYK_QUESTIONS;
    } else {
        questions = [
            "Press N to start!",
            "Name a programming language",
            "Name a database management system"
        ];
    }

    let questionIndex = 0;
    let strikesA = 0;
    let strikesB = 0;
    let gameOver = false;

    // Update question display
    function updateQuestion() {
        document.getElementById("wdyk-question").textContent = questions[questionIndex];
    }

    // Update strikes display for a team
    function updateStrikes(team) {
        let strikes = team === 'A' ? strikesA : strikesB;
        
        for (let i = 1; i <= 3; i++) {
            let strikeEl = document.getElementById(`strike${team}${i}`);
            if (i <= strikes) {
                strikeEl.classList.add('active');
            } else {
                strikeEl.classList.remove('active');
            }
        }
        
        document.getElementById(`strikes${team}`).textContent = strikes;
    }

    // Add strike to a team
    function addStrike(team) {
        if (gameOver) return;

        wrongSound.currentTime = 0;
        wrongSound.play();
        showWrongAnswerImage();

        if (team === 'A') {
            strikesA++;
            updateStrikes('A');
            if (strikesA >= 3) {
                teamLost('A');
            }
        } else {
            strikesB++;
            updateStrikes('B');
            if (strikesB >= 3) {
                teamLost('B');
            }
        }
    }

    // Team lost - 3 strikes
    function teamLost(team) {
        gameOver = true;
        let losingTeam = team;
        let winningTeam = team === 'A' ? 'B' : 'A';

        document.getElementById(`status${losingTeam}`).textContent = "LOST!";
        document.getElementById(`status${losingTeam}`).classList.add('loser');
        document.querySelector(`.team-${losingTeam.toLowerCase()}`).classList.add('lost');

        document.getElementById(`status${winningTeam}`).textContent = "WINS THE POINT!";
        document.getElementById(`status${winningTeam}`).classList.add('winner');

        correctSound.currentTime = 0;
        correctSound.play();
        
        // Record win in scoreboard
        try {
            const winningTeamName = document.getElementById(team === 'A' ? 'teamBName' : 'teamAName').textContent;
            const losingTeamName = document.getElementById(team === 'A' ? 'teamAName' : 'teamBName').textContent;
            
            // Load scoreboard functions
            if (typeof window.addPoints !== 'undefined') {
                window.addPoints(winningTeamName, 1);
            } else {
                // Fallback: use localStorage directly
                const scores = JSON.parse(localStorage.getItem('teamScores') || '{}');
                if (!scores[winningTeamName]) scores[winningTeamName] = { total: 0, wins: 0, games: 0 };
                scores[winningTeamName].total += 1;
                scores[winningTeamName].wins += 1;
                scores[winningTeamName].games += 1;
                if (!scores[losingTeamName]) scores[losingTeamName] = { total: 0, wins: 0, games: 0 };
                scores[losingTeamName].games += 1;
                localStorage.setItem('teamScores', JSON.stringify(scores));
            }
        } catch(e) {
            console.log('Scoreboard not available:', e);
        }
    }

    // Reset the game
    function resetGame() {
        strikesA = 0;
        strikesB = 0;
        gameOver = false;

        updateStrikes('A');
        updateStrikes('B');

        document.getElementById('statusA').textContent = '';
        document.getElementById('statusA').classList.remove('winner', 'loser');
        document.getElementById('statusB').textContent = '';
        document.getElementById('statusB').classList.remove('winner', 'loser');

        document.querySelector('.team-a').classList.remove('lost');
        document.querySelector('.team-b').classList.remove('lost');
    }

    // Show wrong answer image
    function showWrongAnswerImage() {
        const imageContainer = document.getElementById("wrong-answer-image-container");
        imageContainer.style.display = "block";

        setTimeout(function() {
            imageContainer.style.display = "none";
        }, 800);
    }

    // Next question
    function nextQuestion() {
        resetGame();
        questionIndex++;
        if (questionIndex >= questions.length) {
            questionIndex = 0;
        }
        updateQuestion();
    }

    // Previous question
    function prevQuestion() {
        resetGame();
        questionIndex--;
        if (questionIndex < 0) {
            questionIndex = questions.length - 1;
        }
        updateQuestion();
    }

    // Keyboard controls
    document.addEventListener("keydown", function(event) {
        const key = event.key.toLowerCase();

        switch(key) {
            case 'a':
                addStrike('A');
                break;
            case 'b':
                addStrike('B');
                break;
            case 'r':
                resetGame();
                break;
            case 'n':
                nextQuestion();
                break;
            case 'p':
                prevQuestion();
                break;
            case 't':
                window.location.href = "./tournament.html";
                break;
            case 'h':
                window.location.href = "../index.html";
                break;
        }
    });

    // Initialize
    updateQuestion();
    console.log('What Do You Know loaded! Questions:', questions.length);
})();

