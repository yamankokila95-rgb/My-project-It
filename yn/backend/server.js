
const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
app.use(cors());
app.use(bodyParser.json());

const db = new sqlite3.Database('./mindcare.db');

db.serialize(()=>{
  db.run(`CREATE TABLE IF NOT EXISTS moods(
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    mood TEXT,
    note TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )`);
});

app.post('/api/mood',(req,res)=>{
  const {mood,note} = req.body;
  db.run("INSERT INTO moods(mood,note) VALUES(?,?)",[mood,note],function(err){
    if(err) return res.status(500).json(err);
    res.json({id:this.lastID});
  });
});

app.get('/api/moods',(req,res)=>{
  db.all("SELECT * FROM moods ORDER BY created_at DESC",[],(err,rows)=>{
    if(err) return res.status(500).json(err);
    res.json(rows);
  });
});

const PORT = 5000;
app.listen(PORT,()=>{
  console.log("Server running on http://localhost:"+PORT);
});
