const { Company, StockPrice } = require('../models');
const { Op } = require('sequelize');

const stockController = {
  getCompanies: async (req, res) => {
    try {
      const companies = await Company.findAll();
      res.json(companies);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  getStockPrices: async (req, res) => {
    try {
      const { ticker, startDate, endDate } = req.query;
      const prices = await StockPrice.findAll({
        where: {
          ticker,
          date: {
            [Op.between]: [startDate, endDate]
          }
        },
        order: [['date', 'ASC']]
      });
      res.json(prices);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
};

module.exports = stockController;