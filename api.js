/** Atelier REST API wrapper 
* http://docs.intersystems.com/latest/csp/docbook/DocBook.UI.Page.cls?KEY=GSCF_ref#GSCF_C29114
*/ 
const http = require('http')

module.exports = ( conn ) => {

    const { host, port, username, password, path, version, ns } = conn
    const headers = { 'Authorization': 'Basic ' + new Buffer( username + ':' + password ).toString( 'base64' ) }
    
    const ok = ( res ) => res.statusCode == '200' 
    
    // factory 
    const OnResp = ( cb ) => ( res ) => {
        if ( !ok(res) ) return cb({ code: res.statusCode })
        var data = ''
        res.on( 'data', chunk => { data += chunk } ) //collect data
        res.on( 'end', () => cb( null, data ) )
    }

    
    const headServer = ( cb ) => {
        
        http.request( 
                    { method: 'HEAD', headers, host, port, path },
                    res => cb( !ok( res ) ) //without payload
                )
                .on( 'error', cb )
                .end()

    }
    
    const getServer = ( cb ) => {

        http.request( { headers, host, port, path }, OnResp( cb ) )
                .on( 'error', cb ) 
                .end()

    }

    const getDocNames = ( opts, cb ) => {
        
        opts = opts || {}
        let generated = opts.generated || 0
        const url = `${path}${version}/${ns}/docnames?generated=${generated}`

        http.request( { headers, host, port, 'path': url }, OnResp( cb ) )
                .on( 'error', cb )
                .end()

    }

    const getDoc = ( doc, cb ) => {

        const url = `${path}${version}/${ns}/doc/${doc}`
        http.request( { headers, host, port, 'path': url }, OnResp( cb ) )
                .on( 'error', cb )
                .end()

    }
        
    return {
        headServer, 
        getServer,
        getDocNames,
        getDoc
    }

}
