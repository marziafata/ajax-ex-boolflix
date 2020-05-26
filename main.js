$(document).ready(function() {

    //dichiaro le variabili che mi serviranno con Handlebars
    var source = $('#entry-template').html();
    var template = Handlebars.compile(source);

    //intercetto i tasti nel campo ricerca
    $('#testo-ricerca').keypress(function(event) {
        if (event.which == 13) {
            // l'utente ha premuto invio
            ricerca_utente();
        } //fine if agganciato al evento keypress invio
    });

    // intercetto il click sul pulsante di ricerca
    $('#pulsante-ricerca').click(function(){

        // eseguo la funzione di ricerca
        ricerca_utente();

    });//fine funzione click

//funzione di tutto quello che deve eseguire il programma al momento della ricerca (posso spezzettarla in + funzioni piccole)
function ricerca_utente() {
    //leggo il testo nell'input
    var ricerca = $('#testo-ricerca').val().trim();

    //controllo che l'utente abbia digitato qualcosa
    if (ricerca.length >= 2) { //oppure potevo mettere ricerca != diverso da '' stringa vuota

        //inserisco il testo cercato dall'utente nel titolo della pagina
        $('span.ricerca-utente').text(ricerca);

        // resetto l'input
        $('#testo-ricerca').val('');

        //nascondo il titolo
        $('.titolo-ricerca').removeClass('visible');

        //svuoto il container dai risultati precedenti
        // $('.scheda-film').remove(); //rischioso se ho stessa classe da altre parti. meglio mettere un selettore davanti
        // $('.container').html(''); // setta l'html del container a svuoto
        $('.ricerca').empty(''); //svuota il container
        // il reset dell'input e del container meglio farli sempre vicini

        //faccio partire la chiamata ajax
        $.ajax({
            'url': 'https://api.themoviedb.org/3/search/movie',//questo non basta per avere una risposta dall'api. ha bisogno anche della chiave api key e della query (il valore della ricerca), altrimenti non mi restituisce niente
            'method': 'GET',
            'data': {
                'api_key': '702eb04790fdfb1eb76d04db48beddc9',
                //con il testo letto vado a compilare la mia query
                'query': ricerca,
                'language': 'it'
            },//questo data è un oggetto che non ha nulla a che vedere con la funzione (data)
            'success': function (data) {

                //aggiungo la classe visible al titolo per visualizzarlo
                $('.titolo-ricerca').addClass('visible');
                var film = data.results;

                //ciclo l'array per leggere tutti gli oggetti all'interno
                for (var i = 0; i < film.length; i++) {
                    var film_corrente = film[i];

                    //mi tiro fuori tutte le proprietà che mi servono:
                    var titolo = film_corrente.title;
                    var titolo_originale = film_corrente.original_title;
                    var lingua = film_corrente.original_language;
                    var voto = film_corrente.vote_average;

                    //trasformo il voto da base 10 a base 5 e lo arrotondo
                    console.log(titolo);
                    var voto_massimo = 5;
                    var voto_su_cinque = (voto / 2);
                    var voto_arrotondato = Math.round(voto_su_cinque);

                    //creo le variabili che rappresentano le stringhe delle stelle vuote e piene
                    var stella_piena = '<i class="fas fa-star"></i>';
                    var stella_vuota = '<i class="far fa-star"></i>';

                    //imposto la variabile che visualizzerà la somma delle stelle sia piene che vuote
                    var somma_stelle = '';

                    //ciclo i voti arrotondati per mettere tante stelle quante sono le unità che compongono i voti
                    for (var star = 1; star <= voto_massimo; star++) {

                        // devo decidere quanto mettere stella piena e quando vuota:
                        // finchè la mia variabile star (i) è minore o oguale al voto, metto le stelle piene
                        if (star <= voto_arrotondato) {

                            somma_stelle += stella_piena;

                        // quando raggiunge il voto mette tante stelle vuote fino ad arrivare a voto massimo che è 5
                        } else {
                            somma_stelle += stella_vuota;
                        }// fine if stelline

                    }; //fine ciclo for stelle


                    function bandierine(lingua) {
                        //creo un array con le lingue di cui ho le bandierine
                        var bandiere = ['de', 'el', 'en', 'es', 'fi', 'fr', 'it', 'no', 'pl', 'br' ];
                        //creo una variabile con la stringa che mi serve
                        var bandiera_corrente = '<img src="img/flag_' + lingua + '.png" alt="' + lingua + '">'
                        console.log(bandiera_corrente);

                        if (bandiere.includes(lingua)) {
                            // se la ho la foto della bandierina mi restituisce l'immagine
                         return bandiera_corrente;

                        } else {
                         // altrimenti mostra il codice lingua
                            return lingua;
                        }// fine if bandiere incluse
                        }; // fine funzione bandierine


                    // ESEMPIO PER APPENDERE HTML senza HANDLEBARS ma poco elegante, quindi sconsigliato
                    // var dati_film = '<ul>';
                    // dati_film += '<li>' + titolo + '</li>';//+= serve a creare e concatenare contemporaneamente una variabile: prende quello che c'era già salvato nella variabile e ci aggiunge il nuovo valore.
                    // dati_film += '<li>' + titolo_originale + '</li>';
                    // dati_film += '<li>' + lingua + '</li>';
                    // dati_film += '<li>' + voto + '</li>';
                    // dati_film = '</ul>';
                    // $('.container').append(dati_film);


                    // imposto le proprietà dell'oggetto context e le compilo con le proprietà recuperate da ogni film corrente
                    var context = {
                        "titolo" : titolo,
                        "titolo-originale" : titolo_originale,
                        "lingua" : bandierine(lingua),
                        "voto" : somma_stelle
                    };//fine context


                    //compilo il template con le proprietà inserite dentro context
                    var scheda_film = template(context);

                    //...e per ognuno di essi disegnare in pagina una card utilizzando handlebars.
                    $('.ricerca').append(scheda_film);

                }//fine ciclo for

            },// fine success
            'error': function () {
                alert('Si è verificato un errore...');
            }// fine error

        }); //fine ajax

    } else {

        alert('Digita qualcosa di sensato!');
    }; //fine if else controllo testo inserito dall'utente

};//fine funzione ricerca_utente()

});//fine document ready
