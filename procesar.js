$(document).ready(function() {

    var db = new PouchDB('transacciones');

    $('.registrar').click(function(e) {
        var fecha = new Date();
        var venta = {
            _id: new Date().getTime().toString(),
            fecha: encriptar(fecha.getDate() + "-" + fecha.getMonth() + "-" + fecha.getYear() + " " + fecha.getHours() + "-" + fecha.getMinutes() + "-" + fecha.getSeconds()),
            referencia: encriptar($("#referencia").val()),
            producto: encriptar($("#producto").val()),
            unidades: encriptar($("#unidades").val()),
            valor: encriptar($("#valor").val()),
            peso: encriptar($("#peso").val()),
        }

        db.put(venta, function callback(err, result) {
            if (!err) {
                console.log('Escrito en PouchDB');
            }
        });

        var syncDom = document.getElementById('sync-wrapper');
        var remoteCouch = 'http://juan:jdavid@127.0.0.1:5984/transacciones/';

        function sync() {
            syncDom.setAttribute('data-sync-state', 'syncing');
            var opts = { live: true };
            db.replicate.to(remoteCouch, opts, syncError);
            console.log('Replicado en CouchDB');
            //db.replicate.from(remoteCouch, opts, syncError);
        }
        sync();

        $("#formularioVenta")[0].reset();
    });



    function syncError() {
        $('#sync-wrapper').attr('data-sync-state', 'error');
        $('#sync-span').html('Error sincronizando a la base de datos remota. Los datos se guardarán localmente hasta que restablesca la conexión.');
        $('#sync-wrapper').css("background-color", "red");
    }


    function encriptar(contenido) {
        var public_key = '-----BEGIN PUBLIC KEY-----';
        public_key += 'MFwwDQYJKoZIhvcNAQEBBQADSwAwSAJBAKaOP3kuN2UqTTLSqTTdD3d2HaF9CEUQ';
        public_key += 'mwv+n5iQ+ufRRGItvAJpxN8vUQxvq/+D/6aAPMt3+j7La+Q4AgPeZLMCAwEAAQ==';
        public_key += '-----END PUBLIC KEY-----';
        var encrypt = new JSEncrypt();
        encrypt.setPublicKey(public_key);
        var encrypted = encrypt.encrypt(contenido);
        console.log(encrypted);
        return encrypted;
    }


});