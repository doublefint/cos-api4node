const test = require( 'tape' )
const conn = require('../conn')
const API = require('../api')

test( 'getDoc', assert => {
    
    const samples = Object.assign( {}, conn, { ns: 'SAMPLES' } )
    const api = API( samples )
    const doc = 'HoleFoods.Country.cls'

    api.getDoc( doc, ( err, data ) => {
        
        assert.ok( !err, 'response code' )
        
        const json = JSON.parse( data )
        const lines = json.result.content
        
        assert.true( lines.length, 'has lines' )
        assert.end()

    })

})