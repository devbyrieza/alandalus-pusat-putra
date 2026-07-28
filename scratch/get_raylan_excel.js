const xlsx = require('xlsx');

function findRaylan() {
  try {
    const workbook = xlsx.readFile('c:\\Users\\itpua\\Dev\\Work\\al-andalus\\alandalus-alimam\\public\\documents\\Data_Siswa_CRM_Al_Imam_TERISI.xlsx');
    const sheet_name_list = workbook.SheetNames;
    const data = xlsx.utils.sheet_to_json(workbook.Sheets[sheet_name_list[0]]);
    const raylan = data.find(row => {
      for (const key in row) {
        if (String(row[key]).toLowerCase().includes('raylan akbar')) {
          return true;
        }
      }
      return false;
    });
    console.log("From CRM:", raylan);
  } catch (e) {
    console.error("Error CRM:", e);
  }

  try {
    const workbook2 = xlsx.readFile('c:\\Users\\itpua\\Dev\\Work\\al-andalus\\alandalus-alimam\\public\\documents\\Data Pendaftar - dari web.xlsx');
    const sheet_name_list2 = workbook2.SheetNames;
    const data2 = xlsx.utils.sheet_to_json(workbook2.Sheets[sheet_name_list2[0]]);
    const raylan2 = data2.find(row => {
      for (const key in row) {
        if (String(row[key]).toLowerCase().includes('raylan akbar')) {
          return true;
        }
      }
      return false;
    });
    console.log("From Web:", raylan2);
  } catch (e) {
    console.error("Error Web:", e);
  }
}

findRaylan();
