$(document).ready(function() {
    //input testuale e pulsante
    // quando l'utente clicca il pulsante leggo il testo
    // con quel testo lì vado a compilare la mia query
    // devo stampare titolo titolo originale lingua e voto
    //BONUS: scelta risultati lingua

    var ricerca = 'batman'

$.ajax({
    'url': 'https://api.themoviedb.org/3/search/movie',//questo non basta per avere una risposta dall'api. ha bisogno anche della chiave api key e della query (il valore della ricerca), altrimenti non mi restituisce niente
    'method': 'GET',
    'data': {
        'api_key': '702eb04790fdfb1eb76d04db48beddc9',
        'query': ricerca
        //'language': ''
    }//questo data è un oggetto che non ha nulla a che vedere con la funzione (data)
    'success': function (data) {
        console.log(data);
    },
    'error': function () {
        console.log('errore');
    }


}); //fine ajax

});//fine document ready
