const test = require( 'tape' )
const conn = require('../conn')
const API = require('../api')

test( 'putDoc+deleteDocs', assert => {

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

    api.putDoc( docName, desc, ( err, json ) => {

        assert.true( (err && err.code === 409) || !err , 'Doc created or conflicted' )

        assert.true( json && json.result, 'has result' )
        assert.true( json.result && json.result.name, 'has name' )
        assert.true( json.result && json.result.ts, 'has timestamp' )

        const timestamp = json.result.ts

        api.putDoc( docName, desc, ( err ) => {

            assert.true( err && err.code === 409, 'Doc must conflict' )

            api.putDoc( docName, desc, { 'If-None-Match': timestamp }, ( err ) => {

                assert.true( !err, 'No conflict when If-None-Match defined' )

                api.putDoc( docName, desc, { 'ignoreConflict': true }, ( err ) => {

                    assert.true( !err, 'No conflict when ignoreConflict defined' )

                    api.deleteDocs( docName, (err) => {

                        assert.true( !err, 'Successfully deletes document' )
                        assert.end()

                    } )

                } )

            } )

        } )

    })

})