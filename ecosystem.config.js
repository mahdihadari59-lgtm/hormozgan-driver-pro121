module.exports = {
  apps: [{
    name: 'hormozgan-driver',
    script: 'server-v8.js',
    instances: 2,
    exec_mode: 'cluster',
    env: {
      NODE_ENV: 'production',
      PORT: 8080
    }
  }]
}
