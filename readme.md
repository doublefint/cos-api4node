# cos-api4node

[InterSystems](https://www.intersystems.com/) [Atelier REST API](http://docs.intersystems.com/latest/csp/docbook/DocBook.UI.Page.cls?KEY=GSCF_ref#GSCF_C29114)
wrapper for NodeJS. Supports `v1` Atelier API.

Installation
------------

Install this package as a dependency using npm: 

```bash
npm install cos-api4node
```

Usage
-----

```javascript
const api4node = require('cos-api4node');

const api = api4node({
    host: '127.0.0.1',
    port: 57772, 
    path: '/api/atelier/',
    version: 'v1', 
    ns: 'USER', 
    username: '_SYSTEM',
    password: 'SYS'
});

// Get info about server
api.getServer((error, server) => {
    console.log(server);
});
```

Supported API
-------------

+ [compile](http://docs.intersystems.com/latest/csp/docbook/DocBook.UI.Page.cls?KEY=GSCF_ref#GSCF_ref_compile)`(docs, [callback])`
   + Compile all docs listed in the given array `docs` (for example, `["My.Class.cls", "Program.mac", ...]`). `docs` also can be a single string meaning one document to compile.
+ [deleteDocs](http://docs.intersystems.com/latest/csp/docbook/DocBook.UI.Page.cls?KEY=GSCF_ref#GSCF_ref_deletedocs)`(docs, [callback])`
   + Delete all docs listed in the given array `docs` (for example, `["My.Class.cls", "Program.mac", ...]`). `docs` also can be a single string meaning one document to delete.
+ [getServer](http://docs.intersystems.com/latest/csp/docbook/DocBook.UI.Page.cls?KEY=GSCF_ref#GSCF_ref_headserver)`(callback)`
   + Returns information about the server, including Caché Source Code File REST API version and namespaces that are available on the server.
+ [getDoc](http://docs.intersystems.com/latest/csp/docbook/DocBook.UI.Page.cls?KEY=GSCF_ref#GSCF_ref_getdoc)`(doc, callback)`
   + Returns the data of the given `doc`. For example, `doc` can be a `'Routine.mac'` or `'Class.Name.cls'`.
+ [getDocNames](http://docs.intersystems.com/latest/csp/docbook/DocBook.UI.Page.cls?KEY=GSCF_ref#GSCF_ref_getdocnames)`(options, callback)`
   + Returns a list of source code file names. Following options can be specified:
      + `options.generated` Specifies that generated source code files should be included.
+ [headServer](http://docs.intersystems.com/latest/csp/docbook/DocBook.UI.Page.cls?KEY=GSCF_ref#GSCF_ref_headserver)`(callback)`
   + Returns the HttpHeader for the server.
+ [putDoc](http://docs.intersystems.com/latest/csp/docbook/DocBook.UI.Page.cls?KEY=GSCF_ref#GSCF_ref_putdoc)`(name, doc, [options], [callback])`
   + Creates or updates document `name` with data `doc`. Returns the updated document. See official [docs](http://docs.intersystems.com/latest/csp/docbook/DocBook.UI.Page.cls?KEY=GSCF_ref#GSCF_ref_putdoc) for more info. The following optional `options` can be specified:
      + `options['If-None-Match']` Specifies the version (`ts`) of the document to overwrite if the document already exists. If the given timestamp (`ts`) does not match server's one, the `409 Conflict` will occur. You can bypass this check with `ignoreConflict` option.
      + `options['ignoreConflict']` Forces the source code file to be written to the server even if the file has changed since you previously accessed it.
