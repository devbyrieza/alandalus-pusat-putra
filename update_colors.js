const fs = require('fs');
const files = [
    'public/poster-mosa-cup/poster_wali_santri.html',
    'public/poster-mosa-cup/poster_asatidzah.html',
    'public/poster-mosa-cup/poster_status_wa.html',
    'mosa_cup_poster.html'
];

const tailwindConfig = `    <script>
        tailwind.config = {
            theme: {
                extend: {
                    colors: {
                        brand: {
                            50: '#fdf8f6',
                            100: '#f2e8e5',
                            300: '#e5d1b3',
                            400: '#ddc192', /* Krem Emas */
                            500: '#d4af37',
                            700: '#8b0000',
                            800: '#770000',
                            900: '#550000', /* Merah Maroon */
                            950: '#3d0000'
                        },
                        gold: {
                            300: '#e5d1b3',
                            400: '#ddc192',
                            500: '#c5a365'
                        }
                    },
                    fontFamily: {
                        sans: ['Inter', 'sans-serif'],
                        display: ['Oswald', 'sans-serif'],
                    }
                }
            }
        }
    </script>`;

files.forEach(file => {
    if (!fs.existsSync(file)) return;
    let content = fs.readFileSync(file, 'utf8');

    // Replace the existing tailwind config block
    content = content.replace(/<script>\s*tailwind\.config[\s\S]*?<\/script>/, tailwindConfig);

    // General replacements for colors
    content = content.replace(/slate-950/g, 'brand-950');
    content = content.replace(/slate-900/g, 'brand-900');
    content = content.replace(/slate-800/g, 'brand-800');
    content = content.replace(/blue-950/g, 'brand-950');
    content = content.replace(/blue-900/g, 'brand-900');
    content = content.replace(/blue-700/g, 'brand-700');
    content = content.replace(/blue-600/g, 'brand-700');
    content = content.replace(/blue-400/g, 'brand-400');
    content = content.replace(/blue-50/g, 'brand-50');
    content = content.replace(/amber-500/g, 'gold-500');
    content = content.replace(/amber-400/g, 'gold-400');
    content = content.replace(/amber-300/g, 'gold-300');
    content = content.replace(/amber-50/g, 'brand-50');
    
    fs.writeFileSync(file, content, 'utf8');
    console.log('Updated ' + file);
});
