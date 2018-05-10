const test = require( 'tape' )
const conn = require('../conn')
const API = require('../api')

// https://github.com/doublefint/cos-api4node/issues/3
test( 'getdocnames-compile-getdocnames', assert => {

    const samples = Object.assign( {}, conn, { ns: 'SAMPLES' } )
    const api = API( samples )
    const doc = 'HoleFoods.Country.cls'

    const compile = next => api.compile( doc, ( err, json ) => {
        assert.ok( !err, 'compile response code' )
        assert.true( json.console.length, 'compile response has lines' )
        assert.true( json.result.content instanceof Array, 'compile response has content' )
        if ( next ) next()
    })

    const getdocnames = next => api.getDocNames( { generated: 0 }, ( err, json ) => {
        assert.ok( !err, 'getdocnames status ok' )
        const docs = json.result.content
        assert.true( docs.length, 'getdocnames has sources' )
        if ( next ) next()
    })

    getdocnames( ()=>compile( ()=>getdocnames( ()=>assert.end() ) ) )

})