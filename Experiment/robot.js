var Cylon = require('cylon');

 Cylon.robot({
  connections: {
    neurosky: { adaptor: 'neurosky', port: '/dev/rfcomm0' }
  },

  devices: {
    headset: { driver: 'neurosky' }
  },

  work: function(my) {
    my.headset.on('attention', function(data) {
      Logger.info("attention:" + data);
    });

    my.headset.on('meditation', function(data) {
      Logger.info("meditation:" + data);
    });
  }
}).start();