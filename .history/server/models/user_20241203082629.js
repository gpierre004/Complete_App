// models/user.js
module.exports = (sequelize, DataTypes) => {
    const User = sequelize.define('User', {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      password: {
        type: DataTypes.STRING(255),
        allowNull: false
      },
      email: {
        type: DataTypes.STRING(255),
        allowNull: false,
        unique: true
      },
      name: {
        type: DataTypes.STRING(50),
        allowNull: true
      }
    }, {
      tableName: 'users'
    });
  
    return User;
  };
  
  // models/company.js
  module.exports = (sequelize, DataTypes) => {
    const Company = sequelize.define('Company', {
      ticker: {
        type: DataTypes.STRING(10),
        primaryKey: true
      },
      name: {
        type: DataTypes.STRING(255),
        allowNull: false
      },
      sector: DataTypes.STRING(255),
      industry: DataTypes.STRING(255),
      active: {
        type: DataTypes.BOOLEAN,
        defaultValue: true
      }
    }, {
      tableName: 'companies'
    });
  
    return Company;
  };
  
  // models/stockPrice.js
  module.exports = (sequelize, DataTypes) => {
    const StockPrice = sequelize.define('StockPrice', {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      date: {
        type: DataTypes.DATE,
        allowNull: false
      },
      open: DataTypes.DOUBLE,
      high: DataTypes.DOUBLE,
      low: DataTypes.DOUBLE,
      close: DataTypes.DOUBLE,
      volume: DataTypes.BIGINT,
      adjusted_close: DataTypes.DOUBLE,
      ticker: {
        type: DataTypes.STRING(10),
        allowNull: false
      },
      change: {
        type: DataTypes.VIRTUAL,
        get() {
          return this.close - this.open;
        }
      }
    }, {
      tableName: 'stock_prices'
    });
  
    return StockPrice;
  };
  
  // models/transaction.js
  module.exports = (sequelize, DataTypes) => {
    const Transaction = sequelize.define('Transaction', {
      purchase_id: {
        type: DataTypes.BIGINT,
        primaryKey: true,
        autoIncrement: true
      },
      ticker: {
        type: DataTypes.STRING(10),
        allowNull: false
      },
      purchase_date: DataTypes.DATEONLY,
      quantity: DataTypes.DECIMAL(10, 5),
      type: DataTypes.CHAR(4),
      comment: DataTypes.STRING(200),
      purchase_price: DataTypes.DECIMAL(10, 2),
      portfolio_id: DataTypes.INTEGER,
      current_price: DataTypes.DECIMAL(10, 2),
      AccountId: DataTypes.INTEGER,
      Description: DataTypes.STRING(200),
      remaining_shares: {
        type: DataTypes.DECIMAL(10, 5),
        defaultValue: null
      },
      cost_basis: {
        type: DataTypes.DECIMAL(10, 2),
        defaultValue: null
      },
      realized_gain_loss: {
        type: DataTypes.DECIMAL(10, 2),
        defaultValue: null
      }
    }, {
      tableName: 'transactions'
    });
  
    return Transaction;
  };
  
  // models/watchlist.js
  module.exports = (sequelize, DataTypes) => {
    const Watchlist = sequelize.define('Watchlist', {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      date_added: {
        type: DataTypes.DATEONLY,
        allowNull: false
      },
      reason: DataTypes.TEXT,
      ticker: DataTypes.STRING(100),
      userid: DataTypes.INTEGER,
      currentPrice: {
        type: DataTypes.DOUBLE,
        defaultValue: 0
      },
      weekHigh52: {
        type: DataTypes.DOUBLE,
        defaultValue: 0
      },
      percentBelow52WeekHigh: {
        type: DataTypes.DOUBLE,
        defaultValue: 0
      },
      avgClose: {
        type: DataTypes.DOUBLE,
        defaultValue: 0
      },
      sector: {
        type: DataTypes.STRING(100),
        defaultValue: ''
      },
      priceWhenAdded: {
        type: DataTypes.DOUBLE,
        defaultValue: 0
      },
      priceChange: DataTypes.DOUBLE,
      lastUpdated: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW
      },
      interested: DataTypes.BOOLEAN,
      metrics: DataTypes.JSONB,
      industry: DataTypes.STRING(255),
      UserId: DataTypes.INTEGER
    }, {
      tableName: 'watchlists'
    });
  
    return Watchlist;
  };