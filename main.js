$(document).ready(function() {

    // creo delle variabili che so essere costanti
    var api_key = '702eb04790fdfb1eb76d04db48beddc9';
    var radice_url = 'https://api.themoviedb.org/3/';
    var radice_url_img = 'https://image.tmdb.org/t/p/';
    var img_dimensione = "w342";

    //dichiaro le variabili che mi serviranno con Handlebars
    var source = $('#video-template').html();
    var template = Handlebars.compile(source);

    //intercetto i tasti nel campo ricerca
    $('#testo-ricerca').keypress(function(event) {
        if (event.which == 13) {

            // l'utente ha premuto invio
            // eseguo la funzione di ricerca
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

        gestisciInput(ricerca);

        //faccio partire la chiamata ajax per i film
        $.ajax({
            'url': radice_url + 'search/movie',//questo non basta per avere una risposta dall'api. ha bisogno anche della chiave api key e della query (il valore della ricerca), altrimenti non mi restituisce niente
            'method': 'GET',
            'data': {
                'api_key': api_key,
                //con il testo letto vado a compilare la mia query
                'query': ricerca,
                'language': 'it'
            },//questo data è un oggetto che non ha nulla a che vedere con la funzione (data)
            'success': function (data) {

                $('.titolo-ricerca').addClass('visible');

                // gli passo i parametri che mi servono: i dati dell'api e se è serie o film
                compila_scheda(data, 'film');

            },// fine success
            'error': function () {
                alert('Si è verificato un errore...');
            }// fine error

        }); //fine ajax film

        //faccio partire la chiamata ajax per le serie tv
        $.ajax({
            'url': radice_url + 'search/tv',//questo non basta per avere una risposta dall'api. ha bisogno anche della chiave api key e della query (il valore della ricerca), altrimenti non mi restituisce niente
            'method': 'GET',
            'data': {
                'api_key': api_key,
                //con il testo letto vado a compilare la mia query
                'query': ricerca,
                'language': 'it'
            },//questo data è un oggetto che non ha nulla a che vedere con la funzione (data)
            'success': function (data) {

                // gli passo i parametri che mi servono: i dati dell'api e se è serie o film
                compila_scheda(data, 'serie-tv');

            },// fine success
            'error': function () {
                alert('Si è verificato un errore...');
            }// fine error

        }); //fine ajax serie tv


    } else {

        alert('Digita qualcosa di sensato!');
    }; //fine if else controllo testo inserito dall'utente

};//fine funzione ricerca_utente()

function compila_scheda(data, tipologia) {
    //leggo i risultati dell'api
    var video = data.results;

    //ciclo i risultati restituiti
    for (var i = 0; i < video.length; i++) {
        var video_corrente = video[i];

        // se è un film
        if (tipologia == 'film') {
            //tiro fuori le specifiche dei film
            var titolo = video_corrente.title;
            var titolo_originale = video_corrente.original_title;
            var classe = 'scheda-film';

        // altrimenti è una serie tv
        } else if (tipologia == 'serie-tv'){
            //tiro fuori le specifiche delle serie tv
            var titolo = video_corrente.name;
            var titolo_originale = video_corrente.original_name;
            var classe = 'scheda-serie';
        }// fine if tipologia film o serie tv

        //mi tiro fuori tutte altre le proprietà in comune che mi servono:
        var locandina = video_corrente.poster_path;
        var lingua = video_corrente.original_language;
        var voto = video_corrente.vote_average;

        //prevedo una variabile se l'immagine non è disponibile
        var locandina_mancante = 'netflix_black.png';

        // verifico se c'è la locandina
        if (locandina == null) {
            // se la locandina non c'è metto l'immagine locandina mancante
            var poster = locandina_mancante

        } else {
            // altrimenti metto l'immagine restituita da api
            var poster = radice_url_img + img_dimensione + locandina;

        }// fine if

        // imposto le proprietà dell'oggetto context e le compilo con le proprietà recuperate da ogni elemento (serietv o film)
        var context = {
            "locandina": poster,
            "titolo" : titolo,
            "titolo-originale" : titolo_originale,
            "lingua" : bandierine(lingua),
            "voto" : starRating(voto),
            "classe": classe
        };//fine context

        //compilo il template con le proprietà inserite dentro context
        var scheda = template(context);

        if (classe == 'scheda-serie') {
            $('.ricerca.serietv').append(scheda);
        } else {
            //...e per ognuno di essi disegnare in pagina una card utilizzando handlebars.
            $('.ricerca.film').append(scheda);
        }



    }// fine ciclo for

    // $('.ricerca .card').mouseenter(function(){
    //
    //     $(this).find('.poster').addClass('invisible');
    //
    //     $(this).find('.dettagli').removeClass('invisible').addClass('visible');
    // })

    // $('.ricerca .card').mouseleave(function(){
    //
    //     $(this).find('.dettagli').removeClass('visible');
    //
    //     $(this).find('.dettagli').addClass('invisible');
    //
    //     $(this).find('.poster').removeClass('invisible');
    //
    //     $(this).find('.poster').addClass('visible');
    //
    //
    // })
}// fine funzione per compilare la scheda



function bandierine(lingua) {
    //creo un array con le lingue di cui ho le bandierine
    var bandiere = ['de', 'el', 'en', 'es', 'fi', 'fr', 'it', 'no', 'pl', 'br' ];
    //creo una variabile con la stringa che mi serve
    var bandiera_corrente = '<img src="img/flag_' + lingua + '.png" alt="' + lingua + '">'

    if (bandiere.includes(lingua)) {
        // se la ho la foto della bandierina mi restituisce l'immagine
        return bandiera_corrente;

    } else {
     // altrimenti mostra il codice lingua
        return lingua;
    }// fine if bandiere incluse
    }; // fine funzione bandierine


    function starRating(voto) {
        //trasformo il voto da base 10 a base 5 e lo arrotondo
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

        return somma_stelle;
    }// fine funzione star starRating

    function gestisciInput(ricerca) {
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
    }// fine gestisciInput


});//fine document ready
