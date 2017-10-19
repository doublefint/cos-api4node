const test = require( 'tape' )
const conn = require('../conn')
const API = require('../api')

test( 'createAndDelete', assert => {

    const samples = Object.assign( {}, conn, { ns: 'SAMPLES' } )
    const api = API( samples )
    const docClassName = 'Junk.UselessTempClass'
    const docName = docClassName + '.cls'
    const desc = {
        enc: false,
        content: [
            `Class ${ docClassName }`,
            `{`,
            ``,
            `ClassMethod Test() As %Status`,
            `{`,
            `    return 1`,
            `}`,
            ``,
            `}`,
            ``
        ]
    }

    let json;

    api.putDoc( docName, desc, ( err, data ) => {

        assert.true( (err && err.code === 409) || !err , 'Doc created or conflicted' )

        try {
            json = JSON.parse( data )
        } catch (e) {
            assert.true(false, 'putDoc response must have a body')
        }

        assert.true( json.result, 'has result' )
        assert.true( json.result && json.result.name, 'has name' )
        assert.true( json.result && json.result.ts, 'has timestamp' )

        const timestamp = json.result.ts

        api.putDoc( docName, desc, ( err, data ) => {

            assert.true( err && err.code === 409, 'Doc must conflict' )

            api.putDoc( docName, desc, { 'If-None-Match': timestamp }, ( err, data ) => {

                assert.true( !err, 'No conflict when If-None-Match defined' )

                api.putDoc( docName, desc, { 'ignoreConflict': true }, ( err, data ) => {

                    assert.true( !err, 'No conflict when ignoreConflict defined' )

                    api.deleteDocs( docName, (err, res) => {

                        assert.true( !err, 'Successfully deletes document' )
                        assert.end()

                    } )

                } )

            } )

        } )

    })

})