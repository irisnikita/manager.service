const redis = require('redis');

const PORT_REDIS = process.env.PORT || 6379;

const redis_client = redis.createClient({
    port: PORT_REDIS,
    host: '104.248.231.127'
})
redis_client.on('error', (error) => {
    console.log(error)
})

module.exports = redis_client