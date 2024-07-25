const isProduction = process.env.NODE_ENV === 'production';
const path = require('path');
const currentDir = path.dirname(__filename);

module.exports = {
    apps: [
      {
        name: "nextra-compiled",
        script: path.join(currentDir, 'entrypoint.js'),
        windowsHide: true,
        watch: false,
        env: {
            NODE_ENV: 'production'
        },
        cwd: currentDir,
        log_date_format: "YYYY-MM-DD HH:mm:ss",
        out_file: '../../logs/raw/nextra.stdout.log',
        error_file: '../../logs/raw/nextra.stderr.log'
      }
    ]
  };