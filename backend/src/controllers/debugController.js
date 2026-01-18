export const getServerIp = async (req, res) => {
  try {
    const r = await fetch('https://api.ipify.org?format=json');
    const data = await r.json();
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch IP' });
  }
};
