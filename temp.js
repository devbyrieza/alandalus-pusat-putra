
        const PIN_SECRET = "7678";
        let isAdmin = false;

        // Team definitions
        const teams = ["Badar", "Uhud", "Khandaq", "Khaibar", "Tabuk"];
        
        // Players Database
        const playersData = {
            "Badar": ["Andi Ibra Faeyza", "Haidar Ayyubi", "M Fazril Alkais", "Favian Radi", "Raylan Akbar", "Fanni Hariri", "Lalu M. Rizky", "Syeh Al Bani", "Yasser Ali Nurdin", "Pandi Rianto"],
            "Uhud": ["M Hafidz Reo Afelano", "Azka Panji Kusuma", "Muh Asrorin Da Silva", "Fiqri Ramdan Handoko", "Abdurrahim Pati Raja", "Panji Ahmad", "Hibban", "Zakaria", "Dicky Dwy AP", "Salman Abdul Rahim"],
            "Khandaq": ["M Yahya Ayyash", "Naufal Dzakiy", "M Rifqi Hamid", "M Azzam Al Hafiz", "Abdullah Rasyid", "Daffa Muammar Dzaki", "Muhammad Rizky", "Miizan Alghifary", "Muhammad Abdurrahman", "Radil"],
            "Khaibar": ["Abdul Hakim", "Khalish", "Rifqi Arsyad Fadilah", "Labibullah El Fatih", "Wahyu Hidayat", "Farid", "M Rasyid Ridho", "M Hafidz Abdurrahman", "Muhammad Abdurrahim", "Muhammad Habib Rizky"],
            "Tabuk": ["Ahmad Farros Al Barqy", "Fariq Malaibui", "Abdul Aziz Ali", "Atqanul Ummah", "M Khoirul Azzam", "Ken Alfarezha", "Khubaib Abdul Aziz", "Nurcahya Eka Putra", "M Naufal Alfaniri", "Syafiq Karimalay"]
        };

        // Matches definition
        const matchesData = [
            { id: 'm1', day: 1, home: 'Badar', away: 'Uhud' },
            { id: 'm2', day: 1, home: 'Khandaq', away: 'Khaibar' },
            { id: 'm3', day: 1, home: 'Tabuk', away: 'Badar' },
            { id: 'm4', day: 2, home: 'Uhud', away: 'Khandaq' },
            { id: 'm5', day: 2, home: 'Khaibar', away: 'Tabuk' },
            { id: 'm6', day: 2, home: 'Badar', away: 'Khandaq' },
            { id: 'm7', day: 2, home: 'Uhud', away: 'Khaibar' },
            { id: 'm8', day: 3, home: 'Khandaq', away: 'Tabuk' },
            { id: 'm9', day: 3, home: 'Badar', away: 'Khaibar' },
            { id: 'm10', day: 3, home: 'Uhud', away: 'Tabuk' },
        ];

        let scores = {};
        let goals = {};
        let attendance = {}; // { 'day_team_player': 'hadir'|'alpha'|'belum' }
        let currentAbsensiDay = 1;

        // Load data & admin state
        async function loadData() {
            const adminSession = localStorage.getItem('mosa_admin_session');
            if (adminSession === 'true') {
                isAdmin = true;
            }
            updateAdminUI(); refreshIcons();

            try {
                const res = await fetch('/api/mosa-cup');
                if (res.ok) {
                    const data = await res.json();
                    if (data.scores) scores = data.scores;
                    if (data.goals) goals = data.goals;
                    if (data.attendance) attendance = data.attendance;
                }
            } catch(e) {
                console.error("Gagal memuat data dari server:", e);
                // Fallback to local storage if offline
                const savedScores = localStorage.getItem('mosa_scores_draft');
                if (savedScores) { try { scores = JSON.parse(savedScores); } catch(e) { scores = {}; } }
                const savedGoals = localStorage.getItem('mosa_goals_draft');
                if (savedGoals) { try { goals = JSON.parse(savedGoals); } catch(e) { goals = {}; } }
                const savedAttendance = localStorage.getItem('mosa_attendance_draft');
                if (savedAttendance) { try { attendance = JSON.parse(savedAttendance); } catch(e) { attendance = {}; } }
            }
            
            renderMatches(); refreshIcons();
            calculateStandings();
            renderTopScorers(); refreshIcons();
            renderAbsensi(); refreshIcons();
        }

        function saveData() {
            localStorage.setItem('mosa_scores_draft', JSON.stringify(scores));
            localStorage.setItem('mosa_goals_draft', JSON.stringify(goals));
            localStorage.setItem('mosa_attendance_draft', JSON.stringify(attendance));
            calculateStandings();
            renderTopScorers(); refreshIcons();

            fetch('/api/mosa-cup', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ scores, goals, attendance })
            }).catch(e => console.error("Gagal sinkronisasi data ke server", e));
        }

        // Admin Auth
        function toggleAdminMode() {
            if (isAdmin) {
                logoutAdmin();
            } else {
                document.getElementById('pin-modal').classList.remove('hidden');
                document.getElementById('pin-input').focus();
            }
        }

        function closePinModal() {
            document.getElementById('pin-modal').classList.add('hidden');
            document.getElementById('pin-input').value = '';
            document.getElementById('pin-error').classList.add('hidden');
        }

        function submitPin() {
            const pin = document.getElementById('pin-input').value;
            if (pin === PIN_SECRET) {
                isAdmin = true;
                localStorage.setItem('mosa_admin_session', 'true');
                closePinModal();
                updateAdminUI(); refreshIcons();
                renderMatches(); refreshIcons();
                renderTopScorers(); refreshIcons();
            } else {
                document.getElementById('pin-error').classList.remove('hidden');
            }
        }

        function logoutAdmin() {
            isAdmin = false;
            localStorage.removeItem('mosa_admin_session');
            updateAdminUI(); refreshIcons();
            renderMatches(); refreshIcons();
            renderTopScorers(); refreshIcons();
        }

        function updateAdminUI() {
            const modeBadge = document.getElementById('mode-badge');
            const modeText = document.getElementById('mode-text');
            const adminBtnIcon = document.getElementById('admin-btn-icon');
            const adminBtnText = document.getElementById('admin-btn-text');
            const adminBanner = document.getElementById('admin-banner');
            const resetBtn = document.getElementById('reset-btn');
            const topScorerBox = document.getElementById('top-scorer-input-box');
            const tsActionHeader = document.getElementById('ts-action-header');
            const absensiNote = document.getElementById('absensi-admin-note');

            if (isAdmin) {
                modeBadge.className = "px-3.5 py-1.5 rounded-full text-xs font-bold bg-amber-400 text-brand-900 border border-amber-300 flex items-center gap-1.5";
                modeText.innerHTML = `<i data-lucide="unlock" class="w-4 h-4 inline-block"></i> Mode Panitia (Edit Aktif)`;
                adminBtnIcon.innerHTML = `<i data-lucide="lock" class="w-4 h-4 inline-block"></i>`;
                adminBtnText.innerText = "Keluar Admin";
                adminBanner.classList.remove('hidden');
                resetBtn.classList.remove('hidden');
                topScorerBox.classList.remove('hidden');
                tsActionHeader.classList.remove('hidden');
                absensiNote.classList.remove('hidden');
            } else {
                modeBadge.className = "px-3.5 py-1.5 rounded-full text-xs font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-400/40 flex items-center gap-1.5";
                modeText.innerHTML = `<i data-lucide="eye" class="w-4 h-4 inline-block"></i> Mode Penonton (Read-Only)`;
                adminBtnIcon.innerHTML = `<i data-lucide="key" class="w-4 h-4 inline-block"></i>`;
                adminBtnText.innerText = "Login Panitia";
                adminBanner.classList.add('hidden');
                resetBtn.classList.add('hidden');
                topScorerBox.classList.add('hidden');
                tsActionHeader.classList.add('hidden');
                absensiNote.classList.add('hidden');
            }
            renderAbsensi(); refreshIcons();
        }

        function resetData() {
            if(confirm("Apakah Anda yakin ingin menghapus semua data (Skor Laga, Top Skor, & Absensi)?")) {
                scores = {};
                goals = {};
                attendance = {};
                localStorage.removeItem('mosa_scores_draft');
                localStorage.removeItem('mosa_goals_draft');
                localStorage.removeItem('mosa_attendance_draft');
                renderMatches(); refreshIcons();
                calculateStandings();
                renderTopScorers(); refreshIcons();
                renderAbsensi(); refreshIcons();
            }
        }

        // Render match inputs or read-only view
        function renderMatches() {
            [1, 2, 3].forEach(day => {
                const container = document.getElementById(`day${day}-matches`);
                container.innerHTML = '';
                
                matchesData.filter(m => m.day === day).forEach(match => {
                    const homeScore = scores[`${match.id}_home`] !== undefined ? scores[`${match.id}_home`] : '';
                    const awayScore = scores[`${match.id}_away`] !== undefined ? scores[`${match.id}_away`] : '';
                    const homePen = scores[`${match.id}_home_pen`] !== undefined ? scores[`${match.id}_home_pen`] : '';
                    const awayPen = scores[`${match.id}_away_pen`] !== undefined ? scores[`${match.id}_away_pen`] : '';
                    
                    const isDraw = homeScore !== '' && awayScore !== '' && homeScore === awayScore;

                    let centerContent = '';
                    let penContent = '';
                    if (isAdmin) {
                        centerContent = `
                            <div class="mx-2 md:mx-4 flex items-center gap-1.5">
                                <input type="number" min="0" data-match="${match.id}" data-team="home" value="${homeScore}"
                                    class="score-input w-9 md:w-11 h-9 md:h-11 text-center font-bold text-base md:text-lg border-2 border-gray-300 rounded-lg focus:border-brand-500 outline-none bg-white">
                                <span class="text-gray-400 font-bold text-xs">VS</span>
                                <input type="number" min="0" data-match="${match.id}" data-team="away" value="${awayScore}"
                                    class="score-input w-9 md:w-11 h-9 md:h-11 text-center font-bold text-base md:text-lg border-2 border-gray-300 rounded-lg focus:border-brand-500 outline-none bg-white">
                            </div>
                        `;
                        penContent = `
                            <div id="pen-container-${match.id}" class="${isDraw ? '' : 'hidden'} w-full mt-2 pt-2 border-t border-gray-200 flex items-center justify-center gap-2">
                                <span class="text-xs font-bold text-gray-500 uppercase tracking-widest">Penalti:</span>
                                <input type="number" min="0" data-match="${match.id}" data-team="home_pen" value="${homePen}" placeholder="0"
                                    class="score-input w-8 h-8 text-center font-bold text-sm border-2 border-amber-300 bg-amber-50 rounded focus:border-brand-500 outline-none">
                                <span class="text-gray-400 font-bold text-xs">-</span>
                                <input type="number" min="0" data-match="${match.id}" data-team="away_pen" value="${awayPen}" placeholder="0"
                                    class="score-input w-8 h-8 text-center font-bold text-sm border-2 border-amber-300 bg-amber-50 rounded focus:border-brand-500 outline-none">
                            </div>
                        `;
                    } else {
                        const scoreDisplay = (homeScore !== '' && awayScore !== '') ? `${homeScore} - ${awayScore}` : `VS`;
                        const bgDisplay = (homeScore !== '' && awayScore !== '') ? `bg-brand-900 text-white font-black` : `bg-gray-100 text-gray-500 font-bold`;
                        centerContent = `
                            <div class="mx-3 px-3 py-1 rounded-lg text-xs md:text-sm ${bgDisplay} tracking-wider">
                                ${scoreDisplay}
                            </div>
                        `;
                        if (isDraw && homePen !== '' && awayPen !== '') {
                            penContent = `
                                <div class="w-full mt-1.5 pt-1.5 border-t border-gray-200 flex items-center justify-center">
                                    <span class="text-[10px] font-black text-amber-700 bg-amber-100 px-2 py-0.5 rounded-full border border-amber-200 tracking-wide uppercase">
                                        Penalti: ${homePen} - ${awayPen}
                                    </span>
                                </div>
                            `;
                        }
                    }

                    const html = `
                        <div class="p-3 bg-gray-50 rounded-xl border border-gray-200 flex flex-col">
                            <div class="flex items-center justify-between">
                                <div class="flex-1 text-right font-semibold text-xs md:text-sm ${homeScore !== '' && homeScore > awayScore ? 'text-brand-700 font-extrabold' : 'text-gray-700'}">${match.home}</div>
                                ${centerContent}
                                <div class="flex-1 text-left font-semibold text-xs md:text-sm ${awayScore !== '' && awayScore > homeScore ? 'text-brand-700 font-extrabold' : 'text-gray-700'}">${match.away}</div>
                            </div>
                            ${penContent}
                        </div>
                    `;
                    container.insertAdjacentHTML('beforeend', html);
                });
            });

            if (isAdmin) {
                document.querySelectorAll('.score-input').forEach(input => {
                    input.addEventListener('input', (e) => {
                        const matchId = e.target.getAttribute('data-match');
                        const teamType = e.target.getAttribute('data-team');
                        const val = e.target.value;
                        
                        if (val === '') {
                            delete scores[`${matchId}_${teamType}`];
                        } else {
                            scores[`${matchId}_${teamType}`] = parseInt(val, 10);
                        }
                        
                        // Show or hide pen container dynamically
                        if (teamType === 'home' || teamType === 'away') {
                            const h = scores[`${matchId}_home`];
                            const a = scores[`${matchId}_away`];
                            const penContainer = document.getElementById(`pen-container-${matchId}`);
                            if (h !== undefined && a !== undefined && h === a) {
                                if(penContainer) penContainer.classList.remove('hidden');
                            } else {
                                if(penContainer) penContainer.classList.add('hidden');
                                delete scores[`${matchId}_home_pen`];
                                delete scores[`${matchId}_away_pen`];
                            }
                        }
                        
                        saveData();
                    });
                });
            }
        }

        // Calculate and render standings with automatic H2H tie-breaker
        function calculateStandings() {
            let table = {};
            teams.forEach(t => {
                table[t] = { name: t, p: 0, w: 0, d: 0, l: 0, gf: 0, ga: 0, gd: 0, pts: 0 };
            });

            matchesData.forEach(match => {
                const hScore = scores[`${match.id}_home`];
                const aScore = scores[`${match.id}_away`];

                if (hScore !== undefined && aScore !== undefined) {
                    table[match.home].p += 1;
                    table[match.away].p += 1;
                    
                    table[match.home].gf += hScore;
                    table[match.home].ga += aScore;
                    table[match.away].gf += aScore;
                    table[match.away].ga += hScore;

                    if (hScore > aScore) {
                        table[match.home].w += 1;
                        table[match.home].pts += 3;
                        table[match.away].l += 1;
                    } else if (aScore > hScore) {
                        table[match.away].w += 1;
                        table[match.away].pts += 3;
                        table[match.home].l += 1;
                    } else {
                        table[match.home].d += 1;
                        table[match.away].d += 1;
                        
                        const hPen = scores[`${match.id}_home_pen`];
                        const aPen = scores[`${match.id}_away_pen`];
                        
                        if (hPen !== undefined && aPen !== undefined && hPen !== aPen) {
                            if (hPen > aPen) {
                                table[match.home].pts += 2;
                                table[match.away].pts += 1;
                            } else {
                                table[match.away].pts += 2;
                                table[match.home].pts += 1;
                            }
                        } else {
                            table[match.home].pts += 1;
                            table[match.away].pts += 1;
                        }
                    }
                }
            });

            Object.values(table).forEach(t => {
                t.gd = t.gf - t.ga;
            });

            // Sorting with FIFA H2H tie-breaker
            const sorted = Object.values(table).sort((a, b) => {
                if (b.pts !== a.pts) return b.pts - a.pts;
                if (b.gd !== a.gd) return b.gd - a.gd;
                if (b.gf !== a.gf) return b.gf - a.gf;

                // Automatic Head-to-Head Check
                const h2hMatch = matchesData.find(m => 
                    (m.home === a.name && m.away === b.name) || 
                    (m.home === b.name && m.away === a.name)
                );
                if (h2hMatch) {
                    const hScore = scores[`${h2hMatch.id}_home`];
                    const aScore = scores[`${h2hMatch.id}_away`];
                    if (hScore !== undefined && aScore !== undefined) {
                        if (h2hMatch.home === a.name) {
                            if (hScore > aScore) return -1;
                            if (aScore > hScore) return 1;
                        } else {
                            if (aScore > hScore) return -1;
                            if (hScore > aScore) return 1;
                        }
                    }
                }
                return 0;
            });

            const tbody = document.getElementById('standings-body');
            tbody.innerHTML = '';

            sorted.forEach((team, index) => {
                let rowBg = "bg-white";
                let rankBadge = `${index + 1}`;
                
                if (index < 2) {
                    rowBg = "bg-green-50/50";
                    rankBadge = `<span class="inline-flex items-center justify-center w-6 h-6 rounded-full bg-green-600 text-white font-bold text-xs">${index + 1}</span>`;
                } else if (index < 4) {
                    rowBg = "bg-blue-50/30";
                    rankBadge = `<span class="inline-flex items-center justify-center w-6 h-6 rounded-full bg-blue-500 text-white font-bold text-xs">${index + 1}</span>`;
                } else {
                    rankBadge = `<span class="inline-flex items-center justify-center w-6 h-6 rounded-full bg-gray-200 text-gray-700 font-bold text-xs">${index + 1}</span>`;
                }

                const tr = `
                    <tr class="${rowBg} border-b border-gray-100 hover:bg-gray-100/60 transition-colors">
                        <td class="px-4 py-3.5 text-center">${rankBadge}</td>
                        <td class="px-4 py-3.5 font-bold text-gray-900">${team.name}</td>
                        <td class="px-2 py-3.5 text-center font-medium">${team.p}</td>
                        <td class="px-2 py-3.5 text-center text-green-600 font-semibold">${team.w}</td>
                        <td class="px-2 py-3.5 text-center text-gray-500">${team.d}</td>
                        <td class="px-2 py-3.5 text-center text-red-500">${team.l}</td>
                        <td class="px-2 py-3.5 text-center text-gray-600">${team.gf}</td>
                        <td class="px-2 py-3.5 text-center text-gray-600">${team.ga}</td>
                        <td class="px-2 py-3.5 text-center font-bold ${team.gd > 0 ? 'text-green-600' : team.gd < 0 ? 'text-red-500' : 'text-gray-400'}">${team.gd > 0 ? '+' + team.gd : team.gd}</td>
                        <td class="px-4 py-3.5 text-center font-black text-brand-900 text-lg">${team.pts}</td>
                    </tr>
                `;
                tbody.insertAdjacentHTML('beforeend', tr);
            });
        }

        // Top Scorer Logic
        function updatePlayerDropdown() {
            const team = document.getElementById('ts-team').value;
            const playerSelect = document.getElementById('ts-player');
            playerSelect.innerHTML = '<option value="">-- Pilih Pemain --</option>';
            
            if (team && playersData[team]) {
                playerSelect.disabled = false;
                playersData[team].forEach(player => {
                    playerSelect.insertAdjacentHTML('beforeend', `<option value="${player}">${player}</option>`);
                });
            } else {
                playerSelect.disabled = true;
            }
        }

        function addGoal() {
            const team = document.getElementById('ts-team').value;
            const player = document.getElementById('ts-player').value;
            
            if (!team || !player) {
                alert("Silakan pilih Tim dan Pemain terlebih dahulu!");
                return;
            }
            
            if (!goals[player]) {
                goals[player] = { team: team, count: 0 };
            }
            goals[player].count += 1;
            saveData();
            
            document.getElementById('ts-team').value = "";
            updatePlayerDropdown();
        }

        function removeGoal(player) {
            if (goals[player]) {
                goals[player].count -= 1;
                if (goals[player].count <= 0) {
                    delete goals[player];
                }
                saveData();
            }
        }

        function renderTopScorers() {
            const tbody = document.getElementById('top-scorer-body');
            tbody.innerHTML = '';
            
            const sortedScorers = Object.entries(goals)
                .map(([name, data]) => ({ name, team: data.team, count: data.count }))
                .sort((a, b) => b.count - a.count);
                
            if (sortedScorers.length === 0) {
                tbody.innerHTML = `<tr><td colspan="5" class="px-4 py-8 text-center text-gray-400 italic">Belum ada pencetak gol tercatat</td></tr>`;
                return;
            }

            sortedScorers.forEach((scorer, index) => {
                let badgeClass = "bg-gray-100 text-gray-600";
                if (index === 0) badgeClass = "bg-gold-500 text-brand-900 font-black shadow-sm";
                else if (index === 1) badgeClass = "bg-gray-300 text-gray-800 shadow-sm";
                else if (index === 2) badgeClass = "bg-amber-200 text-amber-900 shadow-sm";

                const actionCol = isAdmin ? `
                    <td class="px-4 py-3 text-center">
                        <button onclick="removeGoal('${scorer.name}')" class="text-xs text-red-500 hover:text-red-700 hover:bg-red-50 px-2 py-1 rounded border border-red-100 transition-colors">-1 Gol</button>
                    </td>
                ` : '';

                const tr = `
                    <tr class="hover:bg-brand-50/30 bg-white transition-colors">
                        <td class="px-4 py-3 text-center whitespace-nowrap">
                            <span class="inline-flex items-center justify-center w-6 h-6 rounded-full font-bold text-xs ${badgeClass}">${index + 1}</span>
                        </td>
                        <td class="px-4 py-3 font-semibold text-gray-900">${scorer.name}</td>
                        <td class="px-4 py-3 text-gray-600 text-xs md:text-sm">${scorer.team}</td>
                        <td class="px-4 py-3 text-center font-black text-brand-700 text-lg">${scorer.count}</td>
                        ${actionCol}
                    </tr>
                `;
                tbody.insertAdjacentHTML('beforeend', tr);
            });
        }

        // =============================================
        // ABSENSI MODULE
        // =============================================
        const teamColors = {
            'Badar':   { bg: 'bg-blue-50',   border: 'border-blue-300',   header: 'bg-blue-600',   icon: '<i data-lucide="shield-half" class="w-4 h-4 inline-block"></i>' },
            'Uhud':    { bg: 'bg-green-50',  border: 'border-green-300',  header: 'bg-green-600',  icon: '<i data-lucide="shield-half" class="w-4 h-4 inline-block"></i>' },
            'Khandaq': { bg: 'bg-amber-50',  border: 'border-amber-300',  header: 'bg-amber-500',  icon: '<i data-lucide="shield-half" class="w-4 h-4 inline-block"></i>' },
            'Khaibar': { bg: 'bg-purple-50', border: 'border-purple-300', header: 'bg-purple-600', icon: '<i data-lucide="shield-half" class="w-4 h-4 inline-block"></i>' },
            'Tabuk':   { bg: 'bg-slate-50',  border: 'border-slate-300',   header: 'bg-slate-700',   icon: '<i data-lucide="shield-half" class="w-4 h-4 inline-block"></i>' },
        };

        function getAttKey(day, team, player) {
            return `${day}__${team}__${player}`;
        }

        function getAttStatus(day, team, player) {
            return attendance[getAttKey(day, team, player)] || 'belum';
        }

        function cycleAttendance(day, team, player) {
            if (!isAdmin) return;
            const key = getAttKey(day, team, player);
            const current = attendance[key] || 'belum';
            const next = current === 'belum' ? 'hadir' : current === 'hadir' ? 'telat' : current === 'telat' ? 'alpha' : 'belum';
            attendance[key] = next;
            saveData();
            renderAbsensi(); refreshIcons();
        }

        function switchAbsensiDay(day) {
            currentAbsensiDay = day;
            [1,2,3,4].forEach(d => {
                const tab = document.getElementById(`day-tab-${d}`);
                if (d === day) tab.classList.add('active-tab');
                else tab.classList.remove('active-tab');
            });
            renderAbsensi(); refreshIcons();
        }

        function renderAbsensi() {
            const day = currentAbsensiDay;
            const grid = document.getElementById('absensi-teams-grid');
            const summary = document.getElementById('absensi-summary');
            grid.innerHTML = '';

            let totalHadir = 0, totalTelat = 0, totalAlpha = 0, totalBelum = 0;

            teams.forEach(team => {
                const players = playersData[team];
                const c = teamColors[team];

                let teamHadir = 0, teamTelat = 0, teamAlpha = 0;
                let playersHtml = '';

                players.forEach(player => {
                    const status = getAttStatus(day, team, player);
                    if (status === 'hadir') { teamHadir++; totalHadir++; }
                    else if (status === 'telat') { teamTelat++; totalTelat++; }
                    else if (status === 'alpha') { teamAlpha++; totalAlpha++; }
                    else totalBelum++;

                    const labelMap = { hadir: '<i data-lucide="check-circle-2" class="w-3 h-3 inline-block"></i> Hadir', telat: '<i data-lucide="alert-triangle" class="w-3 h-3 inline-block"></i> Telat', alpha: '<i data-lucide="x-circle" class="w-3 h-3 inline-block"></i> Tidak', belum: '• Belum' };
                    const classMap = { hadir: 'att-hadir', telat: 'att-telat', alpha: 'att-alpha', belum: 'att-belum' };
                    const btnClass = `att-btn ${classMap[status]} ${isAdmin ? '' : 'readonly'}`;
                    const clickAttr = isAdmin ? `onclick="cycleAttendance(${day}, '${team}', '${player}')"` : '';

                    playersHtml += `
                        <div class="flex items-center justify-between py-1.5 border-b border-gray-100 last:border-0">
                            <span class="text-xs font-medium text-gray-700 truncate mr-2" title="${player}">${player}</span>
                            <button class="${btnClass}" ${clickAttr}>${labelMap[status]}</button>
                        </div>`;
                });

                const cardHtml = `
                    <details class="rounded-xl border-2 ${c.border} ${c.bg} overflow-hidden group">
                        <summary class="${c.header} px-4 py-2.5 flex justify-between items-center cursor-pointer list-none">
                            <span class="font-bold text-white text-sm flex items-center gap-2">
                                ${c.icon} TIM ${team.toUpperCase()}
                                <span class="text-[10px] group-open:rotate-180 transition-transform">▼</span>
                            </span>
                            <div class="flex gap-1.5 text-xs">
                                <span class="bg-white/20 text-white rounded-full px-2 py-0.5 font-bold"><i data-lucide="check-circle-2" class="w-3 h-3 inline-block"></i> ${teamHadir}</span>
                                <span class="bg-amber-400/80 text-amber-900 rounded-full px-2 py-0.5 font-bold"><i data-lucide="alert-triangle" class="w-3 h-3 inline-block"></i> ${teamTelat}</span>
                                <span class="bg-red-400/40 text-white rounded-full px-2 py-0.5 font-bold"><i data-lucide="x-circle" class="w-3 h-3 inline-block"></i> ${teamAlpha}</span>
                            </div>
                        </summary>
                        <div class="px-4 py-2 border-t border-white/20">${playersHtml}</div>
                    </details>`;
                grid.insertAdjacentHTML('beforeend', cardHtml);
            });

            // Update summary bar
            summary.innerHTML = `
                <div class="px-3 py-3 text-center">
                    <div class="text-xl md:text-2xl font-black text-emerald-700">${totalHadir}</div>
                    <div class="text-[10px] md:text-xs text-gray-500 font-semibold"><i data-lucide="check-circle-2" class="w-3 h-3 inline-block"></i> Hadir</div>
                </div>
                <div class="px-3 py-3 text-center">
                    <div class="text-xl md:text-2xl font-black text-amber-600">${totalTelat}</div>
                    <div class="text-[10px] md:text-xs text-gray-500 font-semibold"><i data-lucide="alert-triangle" class="w-3 h-3 inline-block"></i> Telat</div>
                </div>
                <div class="px-3 py-3 text-center">
                    <div class="text-xl md:text-2xl font-black text-red-600">${totalAlpha}</div>
                    <div class="text-[10px] md:text-xs text-gray-500 font-semibold"><i data-lucide="x-circle" class="w-3 h-3 inline-block"></i> Tidak</div>
                </div>
                <div class="px-3 py-3 text-center">
                    <div class="text-xl md:text-2xl font-black text-gray-400">${totalBelum}</div>
                    <div class="text-[10px] md:text-xs text-gray-500 font-semibold"><i data-lucide="clock" class="w-3 h-3 inline-block"></i> Belum</div>
                </div>
            `;
        }

        // Enter key for PIN modal
        document.getElementById('pin-input')?.addEventListener('keyup', (e) => {
            if (e.key === 'Enter') submitPin();
        });

        function refreshIcons() { if(window.lucide) { lucide.createIcons(); } }

        // Init
        loadData();

    