# Fullstack-tulospalvelu

Sovellus kilpailujen (suunnistus jne.) ylläpitoon, sovellus käyttää Googlen OAUTH-v2 tunnistautumista. Käyttäjälle(joukkueen "omistaja") esitetään kaksijakoisena linkki-listana kilpailut ja sarjat joihin hänen omistamansa joukkue on ilmoitettu. Sarjan vieressä on "poista" painike, jolla käyttäjä voi poistaa joukkueen, painettaessa varmennus käyttäjältä erillisellä dialogilla. Joukkue:en/iden muokkaamiseen ja ilmoittamiseen tarjotaan lomake, jolle toteutettu välttämättömät validoinnit: väh.kaksi jäsentä, uniikki joukkueennimi (sovellus tarkistaa) jne.

Sovellus jakautuu kahdeksi erilliseksi sovellukseksi Googlen app-enginen hostattavaksi. Näistä frontend on yksi staattinen www-sivu, ts. sivu ei lataannu uudestaan toimiakseen, ellei käyttäjä pyydä resursseja uudelleen. Frontend:in toiminnallisuus on toteututtu React:illa ja Javascriptillä, toiminta perustuu
Reactin tilaan ja selaimen sessioon/localstorageen säilöttyyn dataan. Sovelluksen on määrä poistaa kaikki säilömänsä informaatio, kun sessio päättyy. Frontend pyytää tarvittaessa tietoja Backend:iltä Fetch-rajapinnan kautta, tai lähettää tallennettavaksi haluttavan datan url-parametreinä.

Backend on koostettu Python:in Flask-Framework:illa, Backend keskustelee tietokannan kanssa ja varmentaa käyttäjän oikeuden päästä resursseihin. Tietokanta hyödyntää Googlen Firebasen Firestorea. Backend vastaanottaa url-parametreinä tietoa, jota se käsittelee ja tallentaan tietokantaa. Resurssit, joita Frontend pyytää, toteutetaan specifiseen URL:iin sidottuna "Response:na", json-muotoisena datana.

Sovellus ei ole täysin toimiva ja nojaa hyvin specifiseen Firestoren hierarkiaan. Sovellus Github:iin lähinnä näytteeksi, vaikea löytää oikeita intressejä tälläisen ylläpitoon.
