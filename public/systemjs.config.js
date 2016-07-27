var isPublic = typeof window != "undefined";

(function(global) {
    // map tells the System loader where to look for things
    var map = {
        'app':                    'client', // 'dist',
        '@angular':               (isPublic) ? 'node/@angular' : 'node_modules/@angular',
        '@angular/router':        (isPublic) ? 'node/@angular/router' : 'node_modules/@angular/router',
        'rxjs':                   (isPublic) ? 'node/rxjs' : 'node_modules/rxjs'
    };
    // packages tells the System loader how to load when no filename and/or no extension
    var packages = {
        'app':                    { main: 'main.js',  defaultExtension: 'js' },
        'rxjs':                   { defaultExtension: 'js' }
    };
    var ngPackageNames = [
        'common',
        'forms',
        'compiler',
        'core',
        'http',
        'platform-browser',
        'platform-browser-dynamic',
        'router-deprecated',
        'upgrade',
    ];
    // Individual files (~300 requests):
    function packIndex(pkgName) {
        packages['@angular/'+pkgName] = { main: 'index.js', defaultExtension: 'js' };
    }
    // Bundled (~40 requests):
    function packUmd(pkgName) {
        packages['@angular/'+pkgName] = { main: 'bundles/' + pkgName + '.umd.js', defaultExtension: 'js' };
    }

    packages['@angular/router'] = { main: 'index.js', defaultExtension: 'js' };

    // Most environments should use UMD; some (Karma) need the individual index files
    var setPackageConfig = System.packageWithIndex ? packIndex : packUmd;
    // Add package entries for angular packages
    ngPackageNames.forEach(setPackageConfig);
    var config = {
        map: map,
        packages: packages
    };
    System.config(config);
})(this);