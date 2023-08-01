import { registerAs } from '@nestjs/config'
export default registerAs('appConfig', () => ({

    port: process.env.PORT || 3000,
    axios: {
        timeOut: process.env.AXIOS_TIME_OUT || 5000
    },
    rabbitConfig: {
        config: {
            timeOut: process.env.RABBIT_TIME_OUT || 5000,
            uri: process.env.RABBIT_URI || 'amqp://guest:guest@localhost:5672'
        },
        queues: process.env.RABBIT_QUEUES || 'users-requested',
        exchange: {
            name: process.env.RABBIT_EXCHANGE || 'users'
        }
    }

}));