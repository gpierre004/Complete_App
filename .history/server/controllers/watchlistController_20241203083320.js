// controllers/watchlistController.js
const { Watchlist } = require('../models');

exports.getWatchlist = async (req, res) => {
  try {
    const userId = req.user.id;
    const watchlist = await Watchlist.findAll({
      where: { userid: userId }
    });
    res.json(watchlist);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.addToWatchlist = async (req, res) => {
  try {
    const userId = req.user.id;
    const { ticker, reason } = req.body;

    const watchlistItem = await Watchlist.create({
      userid: userId,
      ticker,
      reason,
      date_added: new Date()
    });

    res.status(201).json(watchlistItem);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};