// server.js
const express = require('express');
const session = require('express-session');
const { google } = require('googleapis');
const path = require('path');
const cors = require('cors');
const multer = require('multer');
const fs = require('fs');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('public'));
app.use(session({ secret: 'munimji-secret', resave: false, saveUninitialized: true }));

// Google OAuth2 setup
const oauth2Client = new google.auth.OAuth2(
  process.env.CLIENT_ID,
  process.env.CLIENT_SECRET,
  process.env.REDIRECT_URI
);

const drive = google.drive({ version: 'v3', auth: oauth2Client });

// Upload setup
const upload = multer({ dest: 'uploads/' });

// Routes
app.get('/login', (req, res) => {
  const url = oauth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: ['https://www.googleapis.com/auth/drive.file', 'https://www.googleapis.com/auth/userinfo.email']
  });
  res.redirect(url);
});

app.get('/auth/google/callback', async (req, res) => {
  const { code } = req.query;
  const { tokens } = await oauth2Client.getToken(code);
  oauth2Client.setCredentials(tokens);
  req.session.tokens = tokens;
  res.redirect('/chat');
});

app.post('/upload', upload.single('file'), async (req, res) => {
  const fileMetadata = {
    name: req.file.originalname,
    parents: [process.env.GOOGLE_DRIVE_FOLDER_ID]
  };
  const media = {
    mimeType: req.file.mimetype,
    body: fs.createReadStream(req.file.path)
  };

  try {
    oauth2Client.setCredentials(req.session.tokens);
    const driveRes = await drive.files.create({
      resource: fileMetadata,
      media,
      fields: 'id'
    });
    fs.unlinkSync(req.file.path); // cleanup local file
    res.json({ success: true, fileId: driveRes.data.id });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

app.get('/chat', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(PORT, () => console.log(`Munim ji server running on port ${PORT}`));
