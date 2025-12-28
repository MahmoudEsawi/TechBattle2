/*
 * Tournament Bracket System - Two Groups Layout
 */

// All teams
const allTeams = ["AI", "CIS", "CSD", "CS", "ISE", "CE", "Mystery 1", "Mystery 2"];

// Tournament state - Mystery teams are pre-placed
let tournament = {
    matches: {
        qf1: { top: null, bottom: null, winner: null },
        qf2: { top: null, bottom: "Mystery 1", winner: null },  // Mystery 1 locked in Group A
        qf3: { top: null, bottom: null, winner: null },
        qf4: { top: null, bottom: "Mystery 2", winner: null },  // Mystery 2 locked in Group B
        sf1: { top: null, bottom: null, winner: null },
        sf2: { top: null, bottom: null, winner: null },
        final: { top: null, bottom: null, winner: null }
    },
    placedTeams: ["Mystery 1", "Mystery 2"],  // Already placed
    drawn: false
};

// Locked positions (cannot be changed)
const lockedPositions = {
    'qf2-bottom': 'Mystery 1',
    'qf4-bottom': 'Mystery 2'
};

// Drop zones (excluding locked positions)
const dropZones = [
    'qf1-top', 'qf1-bottom',
    'qf2-top',  // qf2-bottom is locked (Mystery 1)
    'qf3-top', 'qf3-bottom',
    'qf4-top'   // qf4-bottom is locked (Mystery 2)
];

// Wait for DOM
document.addEventListener("DOMContentLoaded", function() {
    
    // Load saved state
    loadState();
    
    // Setup buttons
    document.getElementById('drawBtn').onclick = draw;
    document.getElementById('resetBtn').onclick = resetTournament;
    
    // Setup drag and drop
    setupDragDrop();
    
    // Setup click handlers
    setupClickHandlers();
    
    // Setup keyboard
    document.addEventListener('keydown', function(e) {
        const key = e.key.toLowerCase();
        
        if (key === 'd') {
            e.preventDefault();
            draw();
        } else if (key === 'r') {
            e.preventDefault();
            resetTournament();
        } else if (key >= '1' && key <= '7') {
            e.preventDefault();
            selectWinner(parseInt(key));
        }
    });
    
    // Initial display
    updateDisplay();
    
    console.log('Tournament loaded!');
});

// ========================================
//    STATE MANAGEMENT
// ========================================

function saveState() {
    localStorage.setItem('tournamentState', JSON.stringify(tournament));
}

function loadState() {
    const saved = localStorage.getItem('tournamentState');
    if (saved) {
        try {
            tournament = JSON.parse(saved);
        } catch(e) {
            console.log('Error loading state');
        }
    }
}

// ========================================
//    DRAG AND DROP
// ========================================

let draggedTeam = null;
let draggedFromZone = null;

function setupDragDrop() {
    // Setup draggable badges
    document.querySelectorAll('.team-badge').forEach(badge => {
        badge.ondragstart = function(e) {
            if (this.classList.contains('used') || this.classList.contains('locked-badge')) {
                e.preventDefault();
                return false;
            }
            draggedTeam = this.dataset.team;
            draggedFromZone = null; // Coming from badge list
            this.classList.add('dragging');
            e.dataTransfer.setData('text/plain', draggedTeam);
            e.dataTransfer.setData('fromZone', '');
        };
        
        badge.ondragend = function() {
            this.classList.remove('dragging');
            draggedTeam = null;
            draggedFromZone = null;
        };
    });
    
    // Setup drop zones (both for dropping and dragging out)
    dropZones.forEach(zoneId => {
        const zone = document.getElementById(zoneId);
        if (!zone) return;
        
        // Make placed teams draggable
        zone.draggable = true;
        
        zone.ondragstart = function(e) {
            const parts = zoneId.split('-');
            const matchKey = parts[0];
            const position = parts[1];
            const team = tournament.matches[matchKey] && tournament.matches[matchKey][position];
            
            // Don't allow dragging locked positions or empty slots
            if (!team || lockedPositions[zoneId]) {
                e.preventDefault();
                return false;
            }
            
            draggedTeam = team;
            draggedFromZone = zoneId;
            this.classList.add('dragging');
            e.dataTransfer.setData('text/plain', team);
            e.dataTransfer.setData('fromZone', zoneId);
        };
        
        zone.ondragend = function() {
            this.classList.remove('dragging');
            draggedTeam = null;
            draggedFromZone = null;
        };
        
        zone.ondragover = function(e) {
            e.preventDefault();
            if (!lockedPositions[zoneId]) {
                this.classList.add('drag-over');
            }
        };
        
        zone.ondragleave = function() {
            this.classList.remove('drag-over');
        };
        
        zone.ondrop = function(e) {
            e.preventDefault();
            this.classList.remove('drag-over');
            
            // Don't drop on locked positions
            if (lockedPositions[zoneId]) return;
            
            const team = e.dataTransfer.getData('text/plain');
            const fromZone = e.dataTransfer.getData('fromZone');
            
            if (!team) return;
            
            const parts = zoneId.split('-');
            const matchKey = parts[0];
            const position = parts[1];
            
            // If dropping on same zone, do nothing
            if (fromZone === zoneId) return;
            
            // If coming from another zone, swap or move
            if (fromZone) {
                const fromParts = fromZone.split('-');
                const fromMatchKey = fromParts[0];
                const fromPosition = fromParts[1];
                
                // Get current team in target zone
                const targetTeam = tournament.matches[matchKey][position];
                
                // Move team from source to target
                tournament.matches[matchKey][position] = team;
                
                // If target had a team, move it to source (swap)
                if (targetTeam && !lockedPositions[fromZone]) {
                    tournament.matches[fromMatchKey][fromPosition] = targetTeam;
                } else {
                    // Just clear the source
                    tournament.matches[fromMatchKey][fromPosition] = null;
                    if (!targetTeam) {
                        // Team moved, not swapped - placedTeams stays same
                    }
                }
            } else {
                // Coming from badge list
                if (tournament.placedTeams.includes(team)) return;
                
                // Remove old team if exists in target
                if (tournament.matches[matchKey][position]) {
                    const oldTeam = tournament.matches[matchKey][position];
                    tournament.placedTeams = tournament.placedTeams.filter(t => t !== oldTeam);
                }
                
                // Place team
                tournament.matches[matchKey][position] = team;
                tournament.placedTeams.push(team);
            }
            
            tournament.drawn = tournament.placedTeams.length === 8;
            updateDisplay();
            saveState();
        };
    });
    
    // Setup trash zone (drop outside to remove)
    document.body.ondragover = function(e) {
        e.preventDefault();
    };
    
    document.body.ondrop = function(e) {
        const fromZone = e.dataTransfer.getData('fromZone');
        const team = e.dataTransfer.getData('text/plain');
        
        // If dropped on body (not on a zone) and came from a zone, remove the team
        if (fromZone && team && !lockedPositions[fromZone]) {
            const fromParts = fromZone.split('-');
            const fromMatchKey = fromParts[0];
            const fromPosition = fromParts[1];
            
            // Check if not dropped on a valid zone
            if (!e.target.closest('.team.drop-zone') && !e.target.closest('.team.has-team')) {
                tournament.matches[fromMatchKey][fromPosition] = null;
                tournament.placedTeams = tournament.placedTeams.filter(t => t !== team);
                tournament.drawn = false;
                updateDisplay();
                saveState();
            }
        }
    };
}

// ========================================
//    CLICK HANDLERS
// ========================================

function setupClickHandlers() {
    document.querySelectorAll('.match').forEach(matchEl => {
        matchEl.querySelectorAll('.team').forEach(teamEl => {
            teamEl.onclick = function() {
                const matchId = matchEl.id;
                const matchNum = parseInt(matchId.replace('match', ''));
                const isTop = this.classList.contains('team-top');
                selectWinner(matchNum, isTop ? 'top' : 'bottom');
            };
        });
    });
}


// ========================================
//    DRAW
// ========================================

function draw() {
    console.log('Drawing...');
    
    // Teams without Mystery teams (6 teams to distribute)
    const regularTeams = ["AI", "CIS", "CSD", "CS", "ISE", "CE"];
    const shuffledRegular = shuffle(regularTeams);
    
    // Group A: 3 regular teams (Mystery 1 already locked)
    // Group B: 3 regular teams (Mystery 2 already locked)
    const groupARegular = [shuffledRegular[0], shuffledRegular[1], shuffledRegular[2]];
    const groupBRegular = [shuffledRegular[3], shuffledRegular[4], shuffledRegular[5]];
    
    let count = 0;
    const interval = setInterval(() => {
        // Animation - random shuffle for effect
        const tempA = shuffle(regularTeams.slice(0, 3));
        const tempB = shuffle(regularTeams.slice(3, 6));
        
        setText('qf1-top', tempA[0]);
        setText('qf1-bottom', tempA[1]);
        setText('qf2-top', tempA[2]);
        // qf2-bottom stays Mystery 1
        
        setText('qf3-top', tempB[0]);
        setText('qf3-bottom', tempB[1]);
        setText('qf4-top', tempB[2]);
        // qf4-bottom stays Mystery 2
        
        count++;
        if (count >= 15) {
            clearInterval(interval);
            
            // Set final - Group A (Mystery 1 stays in qf2-bottom)
            tournament.matches.qf1 = { top: groupARegular[0], bottom: groupARegular[1], winner: null };
            tournament.matches.qf2 = { top: groupARegular[2], bottom: "Mystery 1", winner: null };
            
            // Set final - Group B (Mystery 2 stays in qf4-bottom)
            tournament.matches.qf3 = { top: groupBRegular[0], bottom: groupBRegular[1], winner: null };
            tournament.matches.qf4 = { top: groupBRegular[2], bottom: "Mystery 2", winner: null };
            
            tournament.matches.sf1 = { top: null, bottom: null, winner: null };
            tournament.matches.sf2 = { top: null, bottom: null, winner: null };
            tournament.matches.final = { top: null, bottom: null, winner: null };
            
            tournament.placedTeams = [...allTeams];
            tournament.drawn = true;
            
            updateDisplay();
            saveState();
            console.log('Draw complete! Mystery 1 in Group A, Mystery 2 in Group B');
        }
    }, 80);
}

function shuffle(arr) {
    const a = [...arr];
    for (let i = a.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
}

// ========================================
//    SELECT WINNER
// ========================================

function selectWinner(matchNum, position) {
    let matchKey;
    switch(matchNum) {
        case 1: matchKey = 'qf1'; break;
        case 2: matchKey = 'qf2'; break;
        case 3: matchKey = 'qf3'; break;
        case 4: matchKey = 'qf4'; break;
        case 5: matchKey = 'sf1'; break;
        case 6: matchKey = 'sf2'; break;
        case 7: matchKey = 'final'; break;
        default: return;
    }
    
    const match = tournament.matches[matchKey];
    if (!match.top || !match.bottom) {
        console.log('Match not ready');
        return;
    }
    
    if (position === 'top') {
        match.winner = match.top;
    } else if (position === 'bottom') {
        match.winner = match.bottom;
    } else {
        // Toggle
        if (!match.winner) {
            match.winner = match.top;
        } else if (match.winner === match.top) {
            match.winner = match.bottom;
        } else {
            match.winner = match.top;
        }
    }
    
    updateDisplay();
    saveState();
    
    // Record points in scoreboard
    try {
        const winner = match.winner;
        const loser = match.winner === match.top ? match.bottom : match.top;
        
        // Points based on round
        let points = 1; // Quarter Final
        if (matchKey.startsWith('sf')) points = 2; // Semi Final
        if (matchKey === 'final') points = 3; // Final
        
        // Use scoreboard functions if available
        if (typeof window.addPoints !== 'undefined') {
            window.addPoints(winner, points);
            if (typeof window.recordLoss !== 'undefined') {
                window.recordLoss(loser);
            }
        } else {
            // Fallback: use localStorage directly
            const scores = JSON.parse(localStorage.getItem('teamScores') || '{}');
            
            // Winner
            if (!scores[winner]) scores[winner] = { total: 0, wins: 0, games: 0 };
            scores[winner].total += points;
            scores[winner].wins += 1;
            scores[winner].games += 1;
            
            // Loser
            if (!scores[loser]) scores[loser] = { total: 0, wins: 0, games: 0 };
            scores[loser].games += 1;
            
            localStorage.setItem('teamScores', JSON.stringify(scores));
        }
    } catch(e) {
        console.log('Scoreboard not available:', e);
    }
    
    // If this is the final match, show celebration!
    if (matchKey === 'final' && match.winner) {
        setTimeout(() => {
            showCelebration(match.winner);
        }, 300);
    }
}

// ========================================
//    RESET
// ========================================

function resetTournament() {
    console.log('Resetting...');
    
    // Mystery teams stay locked
    tournament = {
        matches: {
            qf1: { top: null, bottom: null, winner: null },
            qf2: { top: null, bottom: "Mystery 1", winner: null },
            qf3: { top: null, bottom: null, winner: null },
            qf4: { top: null, bottom: "Mystery 2", winner: null },
            sf1: { top: null, bottom: null, winner: null },
            sf2: { top: null, bottom: null, winner: null },
            final: { top: null, bottom: null, winner: null }
        },
        placedTeams: ["Mystery 1", "Mystery 2"],
        drawn: false
    };
    
    // Reset text (Mystery teams stay)
    setText('qf1-top', 'TBD');
    setText('qf1-bottom', 'TBD');
    setText('qf2-top', 'TBD');
    setText('qf2-bottom', '🔒 Mystery 1');
    setText('qf3-top', 'TBD');
    setText('qf3-bottom', 'TBD');
    setText('qf4-top', 'TBD');
    setText('qf4-bottom', '🔒 Mystery 2');
    
    setText('sf1-top', 'Winner M1');
    setText('sf1-bottom', 'Winner M2');
    setText('sf2-top', 'Winner M3');
    setText('sf2-bottom', 'Winner M4');
    
    setText('f-top', 'Winner A');
    setText('f-bottom', 'Winner B');
    
    const champ = document.querySelector('#champion .champion-name');
    if (champ) champ.textContent = '?';
    
    // Reset classes
    document.querySelectorAll('.team').forEach(el => {
        el.classList.remove('winner', 'loser', 'has-team');
    });
    
    dropZones.forEach(id => {
        const el = document.getElementById(id);
        if (el) el.classList.add('drop-zone');
    });
    
    document.querySelectorAll('.team-badge').forEach(badge => {
        badge.classList.remove('used', 'eliminated');
        badge.draggable = true;
    });
    
    localStorage.removeItem('tournamentState');
    console.log('Reset complete!');
}

// ========================================
//    UPDATE DISPLAY
// ========================================

function updateDisplay() {
    // QF
    updateMatch('qf1', 'qf1-top', 'qf1-bottom');
    updateMatch('qf2', 'qf2-top', 'qf2-bottom');
    updateMatch('qf3', 'qf3-top', 'qf3-bottom');
    updateMatch('qf4', 'qf4-top', 'qf4-bottom');
    
    // SF - Group A
    const sf1Top = tournament.matches.qf1.winner || 'Winner M1';
    const sf1Bottom = tournament.matches.qf2.winner || 'Winner M2';
    setText('sf1-top', sf1Top);
    setText('sf1-bottom', sf1Bottom);
    
    if (tournament.matches.qf1.winner && tournament.matches.qf2.winner) {
        tournament.matches.sf1.top = tournament.matches.qf1.winner;
        tournament.matches.sf1.bottom = tournament.matches.qf2.winner;
    }
    
    // SF - Group B
    const sf2Top = tournament.matches.qf3.winner || 'Winner M3';
    const sf2Bottom = tournament.matches.qf4.winner || 'Winner M4';
    setText('sf2-top', sf2Top);
    setText('sf2-bottom', sf2Bottom);
    
    if (tournament.matches.qf3.winner && tournament.matches.qf4.winner) {
        tournament.matches.sf2.top = tournament.matches.qf3.winner;
        tournament.matches.sf2.bottom = tournament.matches.qf4.winner;
    }
    
    updateMatch('sf1', 'sf1-top', 'sf1-bottom');
    updateMatch('sf2', 'sf2-top', 'sf2-bottom');
    
    // Final
    const fTop = tournament.matches.sf1.winner || 'Winner A';
    const fBottom = tournament.matches.sf2.winner || 'Winner B';
    setText('f-top', fTop);
    setText('f-bottom', fBottom);
    
    if (tournament.matches.sf1.winner && tournament.matches.sf2.winner) {
        tournament.matches.final.top = tournament.matches.sf1.winner;
        tournament.matches.final.bottom = tournament.matches.sf2.winner;
    }
    
    updateMatch('final', 'f-top', 'f-bottom');
    
    // Champion
    const champ = document.querySelector('#champion .champion-name');
    if (champ) {
        champ.textContent = tournament.matches.final.winner || '?';
    }
    
    // Update badges
    updateBadges();
    
    // Update drop zones
    dropZones.forEach(id => {
        const el = document.getElementById(id);
        if (!el) return;
        const parts = id.split('-');
        const matchKey = parts[0];
        const pos = parts[1];
        
        if (tournament.matches[matchKey] && tournament.matches[matchKey][pos]) {
            el.classList.remove('drop-zone');
            el.classList.add('has-team');
        } else {
            el.classList.add('drop-zone');
            el.classList.remove('has-team');
        }
    });
}

function updateMatch(matchKey, topId, bottomId) {
    const match = tournament.matches[matchKey];
    const topEl = document.getElementById(topId);
    const bottomEl = document.getElementById(bottomId);
    
    if (!topEl || !bottomEl || !match) return;
    
    if (match.top) {
        topEl.querySelector('.team-name').textContent = match.top;
        topEl.classList.add('has-team');
    }
    if (match.bottom) {
        bottomEl.querySelector('.team-name').textContent = match.bottom;
        bottomEl.classList.add('has-team');
    }
    
    topEl.classList.remove('winner', 'loser');
    bottomEl.classList.remove('winner', 'loser');
    
    if (match.winner) {
        if (match.winner === match.top) {
            topEl.classList.add('winner');
            bottomEl.classList.add('loser');
        } else {
            bottomEl.classList.add('winner');
            topEl.classList.add('loser');
        }
    }
}

function updateBadges() {
    const eliminated = [];
    
    ['qf1', 'qf2', 'qf3', 'qf4', 'sf1', 'sf2', 'final'].forEach(key => {
        const match = tournament.matches[key];
        if (match && match.winner) {
            const loser = match.winner === match.top ? match.bottom : match.top;
            if (loser) eliminated.push(loser);
        }
    });
    
    document.querySelectorAll('.team-badge').forEach(badge => {
        const team = badge.dataset.team;
        badge.classList.remove('used', 'eliminated');
        badge.draggable = true;
        
        if (eliminated.includes(team)) {
            badge.classList.add('eliminated');
            badge.draggable = false;
        } else if (tournament.placedTeams.includes(team)) {
            badge.classList.add('used');
            badge.draggable = false;
        }
    });
}

function setText(id, text) {
    const el = document.getElementById(id);
    if (el) {
        const nameEl = el.querySelector('.team-name');
        if (nameEl) nameEl.textContent = text;
    }
}

// ========================================
//    VICTORY CELEBRATION
// ========================================

function showCelebration(winnerName) {
    const overlay = document.getElementById('victoryOverlay');
    const nameEl = document.getElementById('winnerName');
    const sound = document.getElementById('victorySound');
    
    if (!overlay || !nameEl) return;
    
    // Set winner name
    nameEl.textContent = winnerName;
    
    // Show overlay
    overlay.classList.remove('hidden');
    
    // Play sound
    if (sound) {
        sound.currentTime = 0;
        sound.play().catch(() => {});
    }
    
    // Create confetti
    createConfetti();
}

function closeCelebration() {
    const overlay = document.getElementById('victoryOverlay');
    if (overlay) {
        overlay.classList.add('hidden');
    }
    
    // Clear confetti
    const confettiContainer = document.getElementById('confetti');
    if (confettiContainer) {
        confettiContainer.innerHTML = '';
    }
}

function createConfetti() {
    const container = document.getElementById('confetti');
    if (!container) return;
    
    container.innerHTML = '';
    
    const colors = ['#FFD700', '#FFA300', '#FF6B6B', '#4CAF50', '#00BFFF', '#9b59b6', '#fff', '#ff69b4'];
    const confettiCount = 200;
    
    for (let i = 0; i < confettiCount; i++) {
        const confetti = document.createElement('div');
        confetti.className = 'confetti';
        confetti.style.left = Math.random() * 100 + '%';
        confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
        confetti.style.animationDuration = (Math.random() * 2 + 3) + 's';
        // Stagger start times so confetti keeps falling continuously
        confetti.style.animationDelay = (Math.random() * 5) + 's';
        
        // Random shapes
        const shape = Math.random();
        if (shape > 0.6) {
            confetti.style.borderRadius = '50%';
            confetti.style.width = '10px';
            confetti.style.height = '10px';
        } else if (shape > 0.3) {
            confetti.style.width = '8px';
            confetti.style.height = '16px';
        } else {
            confetti.style.width = '12px';
            confetti.style.height = '8px';
        }
        
        container.appendChild(confetti);
    }
}

// Make closeCelebration global
window.closeCelebration = closeCelebration;
