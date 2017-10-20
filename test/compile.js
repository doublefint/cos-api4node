const test = require( 'tape' )
const conn = require('../conn')
const API = require('../api')

test( 'compile', assert => {

    const samples = Object.assign( {}, conn, { ns: 'SAMPLES' } )
    const api = API( samples )
    const doc = 'HoleFoods.Country.cls'

    api.compile( doc, ( err, json ) => {

        assert.ok( !err, 'response code' )

        assert.true( json.console.length, 'has lines' )
        assert.true( json.result.content instanceof Array, 'has content' )
        assert.end()

    })

})