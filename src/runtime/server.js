const express = require('express');
const path = require('path');
const progress = require('./progress');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json({ limit: '50mb' }));

// Serve frontend
app.use('/frontend', express.static(path.join(__dirname, '..', 'frontend')));

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'frontend', 'main.html'));
});

// --- Generator API ---
const generator = require('../generator');

app.post('/api/generate', async (req, res) => {
  try {
    const { title, images, scenes } = req.body;
    const outputPath = path.join(__dirname, '..', '..', 'output', `${title || 'game'}.zip`);

    const parsedImages = (images || []).map((img) => ({
      name: img.name,
      data: Buffer.from(img.data, 'base64'),
      group: img.group || 'default',
    }));

    const result = await generator.generate({
      outputPath,
      title: title || 'GalGame',
      images: parsedImages,
      scenes: scenes || [],
    });

    res.json({ success: true, path: result });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// --- Progress API ---
app.get('/api/progress', (req, res) => {
  try {
    const data = progress.load();
    res.json({ success: true, data });
  } catch (err) {
    res.json({ success: true, data: null });
  }
});

app.post('/api/progress', (req, res) => {
  try {
    progress.save(req.body);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// --- Runtime ZIP API ---
app.post('/api/runtime/load', (req, res) => {
  const { zipPath } = req.body;
  if (!zipPath) {
    return res.status(400).json({ success: false, error: 'zipPath is required' });
  }
  try {
    const data = progress.loadFromZip(zipPath);
    res.json({ success: true, data });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

app.post('/api/runtime/save', (req, res) => {
  const { zipPath, progressData } = req.body;
  if (!zipPath) {
    return res.status(400).json({ success: false, error: 'zipPath is required' });
  }
  try {
    progress.saveToZip(zipPath, progressData);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

app.listen(PORT, () => {
  console.log(`GalBundler running at http://localhost:${PORT}`);
});

module.exports = app;
