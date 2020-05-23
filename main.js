$(document).ready(function() {

    //input testuale e pulsante
    // quando l'utente clicca il pulsante leggo il testo
    // con quel testo lì vado a compilare la mia query
    // devo stampare titolo titolo originale lingua e voto
    //BONUS: scelta risultati lingua

    //dichiaro le variabili che mi serviranno con Handlebars
    var source = $('#entry-template').html();
    var template = Handlebars.compile(source);
    // intercetto il click sul pulsante di ricerca
    $('#pulsante-ricerca').click(function(){

        //leggo il testo nell'input
        var ricerca = $('#testo-ricerca').val();

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
                var film = data.results;
                console.log(film);

                //ciclo l'array per leggere tutti gli oggetti all'interno
                for (var i = 0; i < film.length; i++) {
                    var film_corrente = film[i];

                    //mi tiro fuori tutte le proprietà che mi servono:
                    var titolo = film_corrente.title;
                    var titolo_originale = film_corrente.original_title;
                    var lingua = film_corrente.original_language;
                    var voto = film_corrente.vote_average;


                    // imposto le proprietà dell'oggetto context e le compilo con le proprietà recuperate da ogni film corrente
                    var context = {
                        "titolo" : titolo,
                        "titolo-originale" : titolo_originale,
                        "lingua" : lingua,
                        "voto" : voto
                    };//fine context


                    //compilo il template con le proprietà inserite dentro context
                    var scheda_film = template(context);
                    console.log(scheda_film);

                    //...e per ognuno di essi disegnare in pagina una card utilizzando handlebars.
                    $('.container').append(scheda_film);

                }//fine ciclo for

            },
            'error': function () {
                console.log('errore');
            }


        }); //fine ajax

    });//fine funzione click





});//fine document ready
