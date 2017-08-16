const fetch = require('isomorphic-fetch')

module.exports = {
  exportPathMap() {
    return {
      "/": {
        page: "/"
      }
    }
  },
  webpack(cfg) {
    cfg.plugins = cfg.plugins.filter(plugin => {
      if (plugin.constructor.name === 'UglifyJsPlugin') {
        return false;
      } else {
        return true;
      }
    });

    return cfg;
  }
};
