const Hapi = require('hapi')
const Context = require('./src/db/strategies/base/contextStrategy')
const MongoDB = require('./src/db/strategies/mongodb/mongoDbStrategy')
const HeroSchema = require('./src/db/strategies/mongodb/schemas/heroSchema')
const HeroRoutes = require('./src/routes/heroRoutes')
const AuthRoutes = require('./src/routes/authRoutes')

const HapiSwagger = require('hapi-swagger')
const Inert = require('inert')
const Vision = require('vision')

const HapiJwt = require('hapi-auth-jwt2')
const JWT_SECRET = 'MEU_SEGREDAO_123'

const swaggerConfig = {
    info: {
        title: '#CursoNodeBR - API Herois',
        version: 'v1.0'
    },
    lang: 'pt'

}

const app = new Hapi.Server({
    port: 4000
})

function mapRoutes(instance, methods) {
    return methods.map(method => instance[method]())
}

async function main() {
    const connection = MongoDB.connect()
    const mongoDb = new Context(new MongoDB(connection, HeroSchema))

    await app.register([
        HapiJwt,
        Inert,
        Vision,
        {
            plugin: HapiSwagger,
            options: swaggerConfig
        }
    ])

    app.auth.strategy('jwt', 'jwt', {
        key: JWT_SECRET,
        validate: (dado, request) => {
            return {
                isValid: true // caso nõa seja valido é false
            }
        }
    })

    app.auth.default('jwt')
    app.route([
        ...mapRoutes(new HeroRoutes(mongoDb), HeroRoutes.methods()),
        ...mapRoutes(new AuthRoutes(JWT_SECRET), AuthRoutes.methods())
    ])

    await app.start()
    console.log('server running at', app.info.port)

    return app;
}
module.exports = main()