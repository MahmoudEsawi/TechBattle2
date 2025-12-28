/*
 * Buzzer Game Logic
 */

(function() {
    // Sound
    const buzzerSound = document.getElementById('buzzerSound');
    
    // Get round info from localStorage
    const currentRound = localStorage.getItem('currentBuzzerRound') || 'qf';
    const currentMatchNum = localStorage.getItem('currentBuzzerMatch') || '1';
    const teamAName = localStorage.getItem('currentTeamA') || 'Team A';
    const teamBName = localStorage.getItem('currentTeamB') || 'Team B';
    
    // Set team names
    document.getElementById('teamAName').textContent = teamAName;
    document.getElementById('teamBName').textContent = teamBName;
    
    // Set round title
    let roundTitle = 'Match';
    if (currentRound === 'qf') {
        roundTitle = `Quarter Final ${currentMatchNum}`;
    } else if (currentRound === 'sf') {
        roundTitle = `Semi Final ${currentMatchNum}`;
    } else if (currentRound === 'final') {
        roundTitle = '🏆 FINAL';
    }
    document.getElementById('roundTitle').textContent = roundTitle;
    
    // Get questions - first try MATCH_QUESTIONS.buzzer, then fallback to old system
    let questions = getQuestions();
    
    let questionIndex = 0;
    let scoreA = 0;
    let scoreB = 0;
    
    // Get questions - prioritize match-specific questions
    function getQuestions() {
        // First: Try match-specific questions from MATCH_QUESTIONS
        if (typeof MATCH_QUESTIONS !== 'undefined' && MATCH_QUESTIONS.buzzer) {
            return MATCH_QUESTIONS.buzzer;
        }
        
        // Fallback: Use old round-based system
        if (currentRound === 'qf') {
            if (currentMatchNum === '1' && typeof BUZZER_QUESTIONS_A !== 'undefined') {
                return BUZZER_QUESTIONS_A;
            } else if (currentMatchNum === '2' && typeof BUZZER_QUESTIONS_B !== 'undefined') {
                return BUZZER_QUESTIONS_B;
            } else if (currentMatchNum === '3' && typeof BUZZER_QUESTIONS_C !== 'undefined') {
                return BUZZER_QUESTIONS_C;
            } else if (currentMatchNum === '4' && typeof BUZZER_QUESTIONS_D !== 'undefined') {
                return BUZZER_QUESTIONS_D;
            }
        } else if (currentRound === 'sf') {
            if (currentMatchNum === '1' && typeof BUZZER_SEMI_A !== 'undefined') {
                return BUZZER_SEMI_A;
            } else if (currentMatchNum === '2' && typeof BUZZER_SEMI_B !== 'undefined') {
                return BUZZER_SEMI_B;
            }
        } else if (currentRound === 'final') {
            if (typeof BUZZER_FINAL !== 'undefined') {
                return BUZZER_FINAL;
            }
        }
        
        // Default questions
        return ["No questions loaded for this round"];
    }
    
    // Update display
    function updateDisplay() {
        document.getElementById('buzzerQuestion').textContent = questions[questionIndex];
        document.getElementById('teamAScore').textContent = scoreA;
        document.getElementById('teamBScore').textContent = scoreB;
    }
    
    // Add point to team
    function addPoint(team) {
        buzzerSound.currentTime = 0;
        buzzerSound.play();
        
        const teamBox = document.getElementById(team === 'A' ? 'teamA' : 'teamB');
        const scoreEl = document.getElementById(team === 'A' ? 'teamAScore' : 'teamBScore');
        
        if (team === 'A') {
            scoreA++;
        } else {
            scoreB++;
        }
        
        // Visual feedback
        teamBox.classList.add('buzzed');
        scoreEl.classList.add('score-updated');
        
        setTimeout(() => {
            teamBox.classList.remove('buzzed');
            scoreEl.classList.remove('score-updated');
        }, 500);
        
        // Record point in scoreboard
        try {
            const teamName = document.getElementById(team === 'A' ? 'teamAName' : 'teamBName').textContent;
            if (typeof window.addPoints !== 'undefined') {
                window.addPoints(teamName, 1);
            } else {
                // Fallback: use localStorage directly
                const scores = JSON.parse(localStorage.getItem('teamScores') || '{}');
                if (!scores[teamName]) scores[teamName] = { total: 0, wins: 0, games: 0 };
                scores[teamName].total += 1;
                scores[teamName].wins += 1;
                scores[teamName].games += 1;
                localStorage.setItem('teamScores', JSON.stringify(scores));
            }
        } catch(e) {
            console.log('Scoreboard not available:', e);
        }
        
        updateDisplay();
    }
    
    // Next question
    function nextQuestion() {
        questionIndex++;
        if (questionIndex >= questions.length) {
            questionIndex = 0;
        }
        updateDisplay();
    }
    
    // Previous question
    function prevQuestion() {
        questionIndex--;
        if (questionIndex < 0) {
            questionIndex = questions.length - 1;
        }
        updateDisplay();
    }
    
    // Reset game
    function resetGame() {
        scoreA = 0;
        scoreB = 0;
        questionIndex = 0;
        updateDisplay();
    }
    
    // Keyboard controls
    document.addEventListener('keydown', function(e) {
        const key = e.key.toLowerCase();
        
        switch(key) {
            case '1':
                addPoint('A');
                break;
            case '2':
                addPoint('B');
                break;
            case 'n':
                nextQuestion();
                break;
            case 'p':
                prevQuestion();
                break;
            case 'r':
                resetGame();
                break;
            case 't':
                window.location.href = './tournament.html';
                break;
            case 'h':
                window.location.href = '../index.html';
                break;
        }
    });
    
    // Initialize
    updateDisplay();
    console.log('Buzzer loaded! Questions:', questions.length);
})();

