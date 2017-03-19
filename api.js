//Atelier REST API wrapper
const http = require('http')

module.exports = ( conn ) => {

    const { host, port, username, password, path, ns } = conn
    const headers = { 'Authorization': 'Basic ' + new Buffer( username + ':' + password ).toString( 'base64' ) }
    
    const ok = ( res ) => res.statusCode == '200' 
    
    const headServer = ( cb ) => {
        
        http.request( 
                    { method: 'HEAD', headers, host, port, path },
                    res => cb( !ok( res ) ) //without payload
                )
                .on( 'error', cb )
                .end()

    }
    
    const getServer = ( cb ) => {

        const onresp = ( res ) => {
            if ( !ok( res ) ) return cb( { code: res.statusCode } )
            var data = ''
            res.on( 'data', chunk => { data += chunk } ) //collect data
            res.on( 'end', () => cb( null, data ) )
        }

        http.request( { headers, host, port, path }, onresp )
                .on( 'error', cb ) //
                .end()

    } 
        
    return { headServer, getServer }

}
