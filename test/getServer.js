const conn = require('../conn')
const API = require('../api')
const test = require( 'tape' )

test( 'getServer', assert => {
    
    const api = API( conn )
    
    api.getServer( ( err, data ) => {
        assert.false( !!err, 'default connection' )
        assert.end()
    })

})
