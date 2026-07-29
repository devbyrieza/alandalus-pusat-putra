const fs = require('fs');
const path = 'C:/Users/itpua/Dev/Work/al-andalus/andalus-pusat-putra/src/app/daftar/page.tsx';
let code = fs.readFileSync(path, 'utf8');

// 1. Ganti semua sessionStorage menjadi localStorage, dan key-nya
code = code.replace(/sessionStorage\.getItem\((["'])pendaftaran_form\1\)/g, "localStorage.getItem('andalus_putra_daftar_draft')");
code = code.replace(/sessionStorage\.setItem\((["'])pendaftaran_form\1/g, "localStorage.setItem('andalus_putra_daftar_draft'");
code = code.replace(/sessionStorage\.removeItem\((["'])pendaftaran_form\1\)/g, "localStorage.removeItem('andalus_putra_daftar_draft')");

// 2. Cari tempat formData dideklarasikan, lalu sisipkan useEffect autosave
const searchRegex = /(const \[formData, setFormData\] = useState<FormData>\(\{[\s\S]*?\}\);)/;
const insertStr = `
  // AUTOSAVE IMPLEMENTATION (Rule AGENTS.md)
  useEffect(() => {
    if (typeof window !== 'undefined' && formData) {
      localStorage.setItem('andalus_putra_daftar_draft', JSON.stringify(formData));
    }
  }, [formData]);
`;

if (searchRegex.test(code) && !code.includes('AUTOSAVE IMPLEMENTATION')) {
  code = code.replace(searchRegex, "$1\n" + insertStr);
}

fs.writeFileSync(path, code);
console.log('Autosave disuntikkan!');
