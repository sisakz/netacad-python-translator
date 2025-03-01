import cors from "cors";
import express from "express";
import sqlite3 from "sqlite3";

const sqlite3V = sqlite3.verbose();
const db = new sqlite3V.Database("./database.sqlite");

// db.serialize(() => {
//   db.run(
//     "CREATE TABLE IF NOT EXISTS translations (english TEXT, hungarian TEXT, englishRaw TEXT, englishFile TEXT, hungarianFile TEXT)"
//   );

//   const englishPath = path.join(__dirname, "public", "Python2", "01 ANGOL");
//   const hungarianPath = path.join(__dirname, "public", "Python2", "02 MAGYAR");

//   const moduleNames = [
//     "NetAcad ABOUT",
//     "PE2 -- Module 0 About",
//     "PE2 -- Module 1",
//     "PE2 -- Module 2",
//     "PE2 -- Module 3",
//     "PE2 -- Module 4",
//     "PE2 -- Module 5 Course Completion",
//     // path.join("Module 1 (2.0)", "Module completion"),
//   ];

//   for (const moduleName of moduleNames) {
//     const englishModulePath = path.join(englishPath, moduleName);
//     const hungarianModulePath = path.join(hungarianPath, moduleName);

//     // these two are the same
//     const englishFiles = fs.readdirSync(englishModulePath);
//     const hungarianFiles = fs.readdirSync(hungarianModulePath);

//     for (let i = 0; i < englishFiles.length; i++) {
//       if (!englishFiles[i].endsWith(".txt")) continue;
//       if (!englishFiles[i] || !hungarianFiles[i]) continue;
//       if (englishFiles[i] !== hungarianFiles[i]) continue;

//       const englishFile = fs.readFileSync(
//         path.join(englishModulePath, englishFiles[i]),
//         "utf-8"
//       );
//       const hungarianFile = fs.readFileSync(
//         path.join(hungarianModulePath, hungarianFiles[i]),
//         "utf-8"
//       );

//       const splitEnglishFile = splitFileContent(englishFile);
//       const splitHungarianFile = splitFileContent(hungarianFile);

//       for (let j = 0; j < splitEnglishFile.length; j++) {
//         const englishWithoutHTML = stripHtmlTags(splitEnglishFile[j])
//           .trim()
//           .toLowerCase();
//         if (!englishWithoutHTML) continue;

//         const dto = {
//           english: splitEnglishFile[j],
//           hungarian: splitHungarianFile[j],
//           englishRaw: englishWithoutHTML,
//           englishFile: `01 ANGOL/${moduleName}/${englishFiles[i]}`,
//           hungarianFile: `02 MAGYAR/${moduleName}/${hungarianFiles[i]}`,
//         };

//         db.run(
//           "INSERT INTO translations VALUES (?, ?, ?, ?, ?)",
//           Object.values(dto)
//         );
//       }
//     }
//   }

//   function splitFileContent(content: string) {
//     let splitted = content
//       .split("\r\n")
//       .map((x) => (x.trim() === "" ? "######" : x))
//       .join("\r\n");

//     return splitted
//       .split("######")
//       .filter((x) => !!x.trim())
//       .filter((x) => x !== "\r\n");
//   }

//   function stripHtmlTags(str: string) {
//     return str.replace(/<\/?([^<>]+)>/g, "");
//   }
// });

const app = express();

app.use(cors());
app.use(express.json());

app.use("/", express.static("public"));

app.post("/api/search", (req, res) => {
  let { query } = req.body;
  query = query.toLowerCase().trim();

  db.all(
    "SELECT * FROM translations WHERE englishRaw LIKE ?",
    [`%${query}%`],
    (err, rows) => {
      if (err) {
        res.sendStatus(500);
        return;
      }
      return res.json(rows);
    }
  );
});

app.listen(8081, () => {
  console.log("Server running on port 8081");
});
