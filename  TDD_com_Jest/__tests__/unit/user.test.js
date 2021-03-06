const factory = require('../utils/factories')

const bcrypt = require('bcryptjs')
const truncate = require('../utils/truncate')

describe('User', () => {
    beforeEach(async () => {
        await truncate();
    })

    it('should encrypt user password', async () => {
        const user = await factory.create('User', {
            password: '123456'
        })
        
        console.log(user)

        const compareHash = await bcrypt.compare('123456', user.password_hash)

        expect(compareHash).toBe(true)
    })
})