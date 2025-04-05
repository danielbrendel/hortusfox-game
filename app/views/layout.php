<!doctype html>
<html lang='{{ getLocale() }}'>
    <head>
        <meta charset='utf-8'>
        <meta name='viewport' content='width=device-with, initial-scale=1.0'>
        
        <title>{{ env('APP_NAME') }}</title>

        <link rel="manifest" href="{{ asset('manifest.json') }}"/>

        <link rel="icon" type="image/png" href="{{ asset('img/logo.png') }}"/>

        <script src="{{ asset('js/fontawesome.js') }}"></script>
        <script src="{{ asset('js/app.js') }}"></script>
        <script src="{{ asset('game/game.js') }}"></script>
    </head>

    <body>
        {%content%}

        <script>
            window.onload = function() {
                if ('serviceWorker' in navigator) {
                    navigator.serviceWorker.register('./serviceworker.js', { scope: '/' })
                        .then(function(registration){
                            window.serviceWorkerEnabled = true;
                        }).catch(function(err){
                            window.serviceWorkerEnabled = false;
                            console.error(err);
                        });
                }
            };
        </script>
    </body>
</html>
