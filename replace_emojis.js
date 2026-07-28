const fs = require('fs');

let html = fs.readFileSync('public/mosa_cup.html', 'utf8');

// 1. Add Lucide script
if (!html.includes('unpkg.com/lucide')) {
    html = html.replace('</head>', '    <script src="https://unpkg.com/lucide@latest"></script>\n</head>');
}

// 2. Add lucide.createIcons() call helper
if (!html.includes('function refreshIcons()')) {
    html = html.replace('// Init', 'function refreshIcons() { if(window.lucide) { lucide.createIcons(); } }\n\n        // Init');
    html = html.replace(/renderMatches\(\);/g, 'renderMatches(); refreshIcons();');
    html = html.replace(/renderAbsensi\(\);/g, 'renderAbsensi(); refreshIcons();');
    html = html.replace(/renderTopScorers\(\);/g, 'renderTopScorers(); refreshIcons();');
    html = html.replace(/updateAdminUI\(\);/g, 'updateAdminUI(); refreshIcons();');
}

// Map replacements
const replacements = [
    [/⚽/g, '<i data-lucide="dribbble" class="w-5 h-5 md:w-6 md:h-6 inline-block"></i>'],
    [/👁️/g, '<i data-lucide="eye" class="w-4 h-4 inline-block"></i>'],
    [/🔑/g, '<i data-lucide="key" class="w-4 h-4 inline-block"></i>'],
    [/🔓/g, '<i data-lucide="unlock" class="w-4 h-4 inline-block"></i>'],
    [/🔒/g, '<i data-lucide="lock" class="w-4 h-4 inline-block"></i>'],
    [/📋/g, '<i data-lucide="clipboard-list" class="w-6 h-6 inline-block"></i>'],
    [/✏️/g, '<i data-lucide="pencil" class="w-3 h-3 inline-block"></i>'],
    [/✅/g, '<i data-lucide="check-circle-2" class="w-3 h-3 inline-block"></i>'],
    [/⚠️/g, '<i data-lucide="alert-triangle" class="w-3 h-3 inline-block"></i>'],
    [/❌/g, '<i data-lucide="x-circle" class="w-3 h-3 inline-block"></i>'],
    [/⏳/g, '<i data-lucide="clock" class="w-3 h-3 inline-block"></i>'],
    [/⏰/g, '<i data-lucide="alarm-clock" class="w-4 h-4 inline-block"></i>'],
    [/🔥/g, '<i data-lucide="flame" class="w-4 h-4 inline-block"></i>'],
    [/🏆/g, '<i data-lucide="trophy" class="w-4 h-4 inline-block"></i>'],
    [/🥉/g, '<i data-lucide="medal" class="w-4 h-4 inline-block"></i>'],
    [/🔵/g, '<i data-lucide="shield-half" class="w-4 h-4 inline-block"></i>'],
    [/🟢/g, '<i data-lucide="shield-half" class="w-4 h-4 inline-block"></i>'],
    [/🟡/g, '<i data-lucide="shield-half" class="w-4 h-4 inline-block"></i>'],
    [/🟣/g, '<i data-lucide="shield-half" class="w-4 h-4 inline-block"></i>'],
    [/⚫/g, '<i data-lucide="shield-half" class="w-4 h-4 inline-block"></i>'],
];

replacements.forEach(([regex, replace]) => {
    html = html.replace(regex, replace);
});

fs.writeFileSync('public/mosa_cup.html', html);
console.log('Icons replaced successfully!');
