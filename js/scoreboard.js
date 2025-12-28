/*
 * Scoreboard Logic
 */

// All teams
const ALL_TEAMS = ['AI', 'CIS', 'CSD', 'CS', 'ISE', 'CE', 'Mystery 1', 'Mystery 2'];

// Team colors mapping
const TEAM_COLORS = {
    'AI': 'team-ai',
    'CIS': 'team-cis',
    'CSD': 'team-csd',
    'CS': 'team-cs',
    'ISE': 'team-ise',
    'CE': 'team-ce',
    'Mystery 1': 'team-mystery1',
    'Mystery 2': 'team-mystery2'
};

// Initialize scores
function initScores() {
    const scores = localStorage.getItem('teamScores');
    if (!scores) {
        const initialScores = {};
        ALL_TEAMS.forEach(team => {
            initialScores[team] = {
                total: 0,
                wins: 0,
                games: 0
            };
        });
        localStorage.setItem('teamScores', JSON.stringify(initialScores));
        return initialScores;
    }
    return JSON.parse(scores);
}

// Get scores
function getScores() {
    return JSON.parse(localStorage.getItem('teamScores') || '{}');
}

// Save scores
function saveScores(scores) {
    localStorage.setItem('teamScores', JSON.stringify(scores));
}

// Add points to a team
function addPoints(teamName, points = 1) {
    const scores = getScores();
    if (!scores[teamName]) {
        scores[teamName] = { total: 0, wins: 0, games: 0 };
    }
    scores[teamName].total += points;
    scores[teamName].games += 1;
    if (points > 0) {
        scores[teamName].wins += 1;
    }
    saveScores(scores);
    return scores[teamName].total;
}

// Record win
function recordWin(teamName) {
    addPoints(teamName, 1);
}

// Record loss (no points, but counts as game)
function recordLoss(teamName) {
    const scores = getScores();
    if (!scores[teamName]) {
        scores[teamName] = { total: 0, wins: 0, games: 0 };
    }
    scores[teamName].games += 1;
    saveScores(scores);
}

// Reset all scores
function resetAllScores() {
    if (confirm('Are you sure you want to reset ALL scores?')) {
        const initialScores = {};
        ALL_TEAMS.forEach(team => {
            initialScores[team] = {
                total: 0,
                wins: 0,
                games: 0
            };
        });
        saveScores(initialScores);
        displayScoreboard();
    }
}

// Display scoreboard
function displayScoreboard() {
    const scores = getScores();
    const grid = document.getElementById('scoreboardGrid');
    
    if (!grid) return;
    
    // Convert to array and sort by total score
    const teamsArray = ALL_TEAMS.map(team => ({
        name: team,
        score: scores[team]?.total || 0,
        wins: scores[team]?.wins || 0,
        games: scores[team]?.games || 0
    })).sort((a, b) => b.score - a.score);
    
    grid.innerHTML = '';
    
    if (teamsArray.length === 0) {
        grid.innerHTML = `
            <div class="empty-state">
                <h2>NO SCORES YET</h2>
                <p>Start playing games to see scores!</p>
            </div>
        `;
        return;
    }
    
    teamsArray.forEach((team, index) => {
        const rank = index + 1;
        const rankClass = rank <= 3 ? `rank-${rank}` : '';
        const teamClass = TEAM_COLORS[team.name] || '';
        
        const card = document.createElement('div');
        card.className = `team-score-card ${teamClass} ${rankClass}`;
        
        let rankText = `#${rank}`;
        if (rank === 1) rankText = '🥇 #1';
        else if (rank === 2) rankText = '🥈 #2';
        else if (rank === 3) rankText = '🥉 #3';
        
        card.innerHTML = `
            <div class="team-rank ${rankClass}">${rankText}</div>
            <div class="team-name">${team.name}</div>
            <div class="team-score-value" id="score-${team.name}">${team.score}</div>
            <div class="score-label">POINTS</div>
            <div class="team-stats">
                <div class="stat-item">
                    <span class="stat-label">Wins:</span>
                    <span class="stat-value">${team.wins}</span>
                </div>
                <div class="stat-item">
                    <span class="stat-label">Games:</span>
                    <span class="stat-value">${team.games}</span>
                </div>
                <div class="stat-item">
                    <span class="stat-label">Win Rate:</span>
                    <span class="stat-value">${team.games > 0 ? Math.round((team.wins / team.games) * 100) : 0}%</span>
                </div>
            </div>
        `;
        
        grid.appendChild(card);
    });
}

// Keyboard controls
document.addEventListener('keydown', function(e) {
    const key = e.key.toLowerCase();
    
    if (key === 'r' && e.ctrlKey) {
        e.preventDefault();
        resetAllScores();
    } else if (key === 'h') {
        window.location.href = '../index.html';
    }
});

// Initialize on load
document.addEventListener('DOMContentLoaded', function() {
    initScores();
    displayScoreboard();
    
    // Auto-refresh every 2 seconds
    setInterval(displayScoreboard, 2000);
    
    console.log('Scoreboard loaded!');
});

// Export functions for use in other scripts
if (typeof window !== 'undefined') {
    window.addPoints = addPoints;
    window.recordWin = recordWin;
    window.recordLoss = recordLoss;
    window.getScores = getScores;
}

