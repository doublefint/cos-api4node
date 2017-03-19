const conn = require('../conn')
const API = require('../api')
const test = require( 'tape' )

test( 'headServer', assert => {
    
    const api = API( conn )
    
    api.headServer( err => {
        assert.false( !!err, 'default connection' )
        assert.end()
    })

})

test( 'headServer', assert => {
    
    const api = API( {} )
    
    api.headServer( err => {
        //assert.comment( JSON.stringify( err ) )
        assert.true( !!err, 'empty connection' )
        assert.end()
    })

})