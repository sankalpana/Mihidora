<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">
    <head>
        <!-- Google tag (gtag.js) -->
        <script async src="https://www.googletagmanager.com/gtag/js?id=G-CYGPP6ED2T"></script>
        <script>
        window.dataLayer = window.dataLayer || [];
        function gtag(){dataLayer.push(arguments);}
        gtag('js', new Date());

        gtag('config', 'G-CYGPP6ED2T');
        </script>
        <meta charset="utf-8">
        <meta name="viewport" content="initial-scale=1, width=device-width"/>
        <meta name="csrf-token" content="{{ csrf_token() }}">
        <title>MIHIDORA Environment Portal</title>
        <link rel="preconnect" href="https://fonts.googleapis.com">
        <link rel="stylesheet" href="//cdnjs.cloudflare.com/ajax/libs/leaflet.draw/1.0.4/leaflet.draw.css"/>
        <link rel="preconnect" href="https://fonts.googleapis.com">
        <link href="https://fonts.googleapis.com/css2?family=Manrope:wght@200;400;800&display=swap" rel="stylesheet">
        <link rel="stylesheet" href="https://unpkg.com/leaflet@1.0.1/dist/leaflet.css" />
    </head>
    
    <body>
        <script>
            var baseUrl = '{{ env('APP_URL') }}';
        </script>
        <div id="app"></div>       
        <script src="{{asset('js/app.js')}}"></script>
        <div id="google_translate_element" class="notranslate"></div>
        <!-- <script type="text/javascript">
        function googleTranslateElementInit() {
        new google.translate.TranslateElement({pageLanguage: 'en'}, 'google_translate_element');
        }
        </script> -->
        <script type="text/javascript">
        function googleTranslateElementInit() {
            const userLanguage = navigator.language;
            console.log(userLanguage);
            const desiredLanguage = 'en'; // The language you want to enforce
            const displayLanguage = userLanguage === desiredLanguage ? userLanguage : desiredLanguage;
            
            new google.translate.TranslateElement({
            // includedLanguages: 'en,si,ta', // Add more languages if needed
            layout: google.translate.TranslateElement.InlineLayout.SIMPLE,
            autoDisplay: false,
            }, 'google_translate_element');
        }
        </script>

    <script type="text/javascript" src="//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit"></script>

    </body>

</html>