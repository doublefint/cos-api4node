/** Atelier REST API wrapper 
* http://docs.intersystems.com/latest/csp/docbook/DocBook.UI.Page.cls?KEY=GSCF_ref#GSCF_C29114
*/ 
const httpModule = require('http')
const httpsModule = require('https')

module.exports = ( conn ) => {

    const { host, port, username, password, path, version, ns, https } = conn

    /*const headers = {
        'Authorization': 'Basic ' + new Buffer( auth ).toString( 'base64' )
    }*/
    const auth = `${username}:${password}`

    const ok = ( res ) => res.statusCode == '200' || res.statusCode == '201'
    const http = https ? httpsModule : httpModule

    // factory
    const OnResp = ( cb ) => ( res ) => {

        let data = ''
        res.on( 'data', chunk => { data += chunk }) //collect data
        res.on( 'end', () => {

            let parsed;
            if ( data ) try {
                parsed = JSON.parse( data )
            } catch ( e ) {
                parsed = data
            }

            if ( !ok( res ) ){
                const err = { code: res.statusCode, message: res.statusMessage }
                return cb( err, parsed )
            }
            cb( null, parsed )

        })

    }

    const headServer = ( cb ) => {

        http.request( 
                { method: 'HEAD', host, port, path, auth },
                res => cb( !ok( res ) ) //without payload
            )
            .on( 'error', cb )
            .end()

    }

    const getServer = ( cb ) => {

        http.request( { host, port, path, auth }, OnResp( cb ) )
            .on( 'error', cb ) 
            .end()

    }

    const getDocNames = ( opts, cb ) => {

        opts = opts || {}
        let generated = +opts.generated || 0
        const url = `${path}${version}/${ns}/docnames?generated=${generated}`

        http.request( { host, port, 'path': url, auth }, OnResp( cb ) )
            .on( 'error', cb )
            .end()

    }

    const getDoc = ( doc, cb ) => {

        const url = `${path}${version}/${ns}/doc/${doc}`
        http.request( { host, port, 'path': url, auth }, OnResp( cb ) )
            .on( 'error', cb )
            .end()

    }

    const putDoc = ( name, doc, params, cb ) => {

        if (typeof name !== "string")
            throw new Error(`Document name must be a string (${ name })`);
        if (!doc || typeof doc['enc'] === 'undefined' || !doc['content'])
            throw new Error(`Invalid document data ${ JSON.stringify(doc) }`);
        if (typeof params === "function" || !params) {
            cb = params;
            params = {};
        }

        const url = `${path}${version}/${ns}/doc/${name}${ 
            typeof params.ignoreConflict !== 'undefined' 
                ? '?ignoreConflict=' + +params.ignoreConflict
                : ''
        }`
        const body = JSON.stringify(doc)

        const headers = {
            'Content-Type': 'application/json',
            'Content-Length': Buffer.byteLength(body, "utf8")
        }

        if ( params['If-None-Match'] ) {
            headers['If-None-Match'] = params['If-None-Match']
        }

        const req = http.request( {
            method: 'PUT', host, port, path: url, headers, auth
        } , cb ? OnResp( cb ) : undefined )
        
        if (cb) {
            req.on( 'error', cb )
        }
            
        req.write( body )
        req.end()

    }

    const compile = ( docNames, cb ) => {

        if (typeof docNames === 'string')
            docNames = [ docNames ];
        if (!(docNames instanceof Array))
            throw new Error(`Document names must be an array (${ docNames })`);

        const url = `${path}${version}/${ns}/action/compile`
        const body = JSON.stringify(docNames)
        const req = http.request( {
            method: 'POST',
            host, port, path: url,
            auth, 
            headers: {
                'Content-Type': 'application/json',
                'Content-Length': Buffer.byteLength(body, "utf8")
            }
        } , cb ? OnResp( cb ) : undefined )
        if (cb)
            req.on( 'error', cb )
        req.write( body )
        req.end()

    }

    const deleteDocs = ( docNames, cb ) => {

        if (typeof docNames === 'string')
            docNames = [ docNames ];
        if (!(docNames instanceof Array))
            throw new Error(`Document names must be an array (${ docNames })`);

        const url = `${path}${version}/${ns}/docs`
        const body = JSON.stringify(docNames)
        const req = http.request( {
            method: 'DELETE',
            host, port, path: url,
            auth, 
            headers: {
                'Content-Type': 'application/json',
                'Content-Length': Buffer.byteLength(body, "utf8")
            }
            
        } , cb ? OnResp( cb ) : undefined )
        if (cb)
            req.on( 'error', cb )
        req.write( JSON.stringify(docNames) )
        req.end()

    }

    return {
        compile,
        deleteDocs,
        getServer,
        getDocNames,
        getDoc,
        headServer,
        putDoc
    }

}