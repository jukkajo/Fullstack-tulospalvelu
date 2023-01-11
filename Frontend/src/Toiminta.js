import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics"
import { doc, onSnapshot } from "firebase/firestore";
import React, { useState, useEffect } from 'react';
import MenuItem from '@mui/material/MenuItem';
import Select from 'react-select';
import { getFirestore, collection, getDocs, addDoc } from 'firebase/firestore/lite';

const firebaseConfig = {
  //nämä on kaikki muutettu, ei pidetä arkaluontoista dataa täällä :D
  apiKey: "AIeqSyCsTT9kdLt9XiWfT5qUmTYZx3HB7XG2X)",
  authDomain: "TP2022-366906.firebaseapp.com",
  projectId: "TP2022-366906",
  storageBucket: "TP2022-366906.appspot.com",
  messagingSenderId: "252646584541",
  appId: "1:258459587731:web:daf7e7a8c5a7723469ryt4",
  measurementId: "G-B6S432H8TJ" //tätä ei tarvittaisi välttämättä
};

const app = initializeApp(firebaseConfig);
// Alustetaan Firebase
const db = getFirestore(app);
const analytics = getAnalytics(app); //olkoon nämäkin tässä vaikken varmaan analytiikkaa tarvitse

//laitetaan ehdolla, googlen uudelleenohjausta ajatellen
if (localStorage.getItem("nakyma") === null) {
    window.localStorage.setItem("nakyma", 1);
}

class Tulospalvelu extends React.PureComponent {
constructor(props) {
    super(props);

this.valMetodi = this.valMetodi.bind(this);
this.jnimiVal = this.jnimiVal.bind(this);
this.jas1Val = this.jas1Val.bind(this);
this.jas2Val = this.jas2Val.bind(this);
this.jas3Val = this.jas3Val.bind(this);
this.jas4Val = this.jas4Val.bind(this);
this.jas5Val = this.jas5Val.bind(this);
this.g_tunnus_Val = this.g_tunnus_Val.bind(this);
//this.kil_val = this.kil_val.bind(this);
this.muutos = this.muutos.bind(this);
this.muutos2 = this.muutos2.bind(this);
this.noudaEmInfo = this.noudaEmInfo.bind(this);
this.spTarkistin = this.spTarkistin.bind(this);
this.lomakkeenKasittelija_sPa = this.lomakkeenKasittelija_sPa.bind(this);
this.lomakkeenKasittelija = this.lomakkeenKasittelija.bind(this);
this.f_k = this.f_k.bind(this);
this.f_s = this.f_s.bind(this);
this.j_poisto = this.j_poisto.bind(this);
this.gen_jas_olio = this.gen_jas_olio.bind(this);
this.iteroi_optiot = this.iteroi_optiot.bind(this);
this.gen_jas_jono = this.gen_jas_jono.bind(this);
this.nouda_lisays_status = this.nouda_lisays_status.bind(this);
this.paivita = this.paivita.bind(this);
this.k_d_t = this.k_d_t.bind(this);
this.ul_gen = this.ul_gen.bind(this);
this.takaisin = this.takaisin.bind(this);

//tila ennen käyttäjän kirjautumista, tehdään jäsenet "tyhmästi", kun 5 henk maksimi
this.state = {
    joukkueennimi: "",
    jasenien_lkm : 0,
    jas1: "",
    jas2: "",
    jas3: "",
    jas4: "",
    jas5: "",
    virheilmoitukset_ja_infot: ["Kenttä ei saa olla tyhjä, eikä nimi koostua vain välilyönneistä",
                       "Joukkueessa oltava väh. 2 jäsentä, eikä nimet saa koostua vain välilyönneistä",
                       "Joukkuuen nimi ei voi olla tyhjä, eikä sisältää vain välilyöntejä",
                       "Anna tähän validi G-tunnus, myöhemmin sinut ohjataan googlen tunnistautumiseen, käytä kummassakin samaa tunnusta",
                       "Et palauttaa tyhjää, tarvitaan G-tunnus",
                       "Anna validit tiedot kaikkiin kenttiin"],
    sarjojen_ilm: [], //sidonnainen kilpailuihin
    kilpailujen_ilm: [],
    kirjautunut: window.sessionStorage.getItem("kirjautunut"),
    //tämän arvon mukaan generoidaan näkymät
    nakyma: window.localStorage.getItem("nakyma"),
    //kilpailujen data
    kilpailut: [],
    kilpailu_valittu: "",
    sarja_valittu: "",
    joukkueet: [],
    sarjat: [],
    sarjat_kaikki: [],
    options_sarjat: [],
    g_tunnus: "",
    options: [],
    poistetaanko: false
};}

async k_d_t(kisanimi) {
    console.log("kisanimi: ", kisanimi);
    let url = new URL("http://127.0.0.1:8080/api/k_d_t/" + kisanimi);
    let resp = await fetch(url);
    if (!resp.ok) {
        throw new Error(`HTTP error! status: ${resp.status}`);
    }
    let data = await resp.json();
    return await data["Kooste"]
}

// Kintturogaining
ul_gen(lista, ind) {
    let ul_ja_ind = [];
    let s_ul = [];
            console.log("iii ", ind);
    for (let i = (ind); i < lista.length; i++) {
        let lis_id = "l" + String(i) + "_" + (Math.random() + 1).toString(36).substring(9);
        if (lista[i] == "+") {
            ul_ja_ind.push(s_ul);
            ul_ja_ind.push(i-1);
            console.log(ul_ja_ind);
            return ul_ja_ind
        }
        if (lista[i] != "+") {
            s_ul.push(
            <ul className="lista_ul2" key={lis_id}>{lista[i]}</ul>
            );
        }
        
    }

    console.log(ul_ja_ind);
    return ul_ja_ind
}

paivita() {
   this.setState({nakyma: window.localStorage.getItem("nakyma")});
   this.setState({kilpailu_valittu: window.localStorage.getItem("kilpailu_valittu")});
   this.setState({sarja_val: window.localStorage.getItem("sarja_val")});
}

//simppeli tarkistin spostille, palauttaa truen tai falsen
/*
spTarkistin(sposti) {
 if (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(sposti)) {
    return true
 }
    return false
}
*/
spTarkistin(sposti) {
    let reg = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/g;
    if(sposti.match(reg)) {
        return true
    }
    return false
}

async noudaEmInfo() {
    //haetaan promise ja käsitellään sen sisältö
    let response = await fetch("http://127.0.0.1:8080/api/ret_ses_tunnus");
    
    if (!response.ok) {
        /*
        Promise { <state>: "pending" }
        Started request…
        Received response: 404
        */
        throw new Error("Http error! status: ${response.status}");
    }
        
    //kaikki ok, joten kokeillaanpa jsoniksi
    let sailo = await response.json();
    //console.log(sailo["email_info"]);   
    window.sessionStorage.setItem("email_info", sailo);
    
    if (sailo["email_info"].length > 0) {
        window.sessionStorage.setItem("kirjautunut", "true");
    }
    else {
        window.sessionStorage.setItem("kirjautunut", "false");
    }
}

componentDidMount() {
   window.addEventListener("load", this.noudaEmInfo);
   window.addEventListener("load", this.f_k);
   if (window.localStorage.getItem("nakyma") === 3) {
       this.setState({nakyma: 3});
   }
   let intvid = setInterval(this.paivita, 400); 
   this.setState({intvid: intvid});
}

componentWillUnmount() { 
  window.removeEventListener("load", this.noudaEmInfo);
  window.removeEventListener("load", this.f_k);
  clearInterval(this.state.intvid);
}
//haetaan klpailut palvelimelta
async f_k() {
    //haetaan promise ja käsitellään sen sisältö
    let response = await fetch("http://127.0.0.1:8080/api/kilpailut");
    
    if (!response.ok) {
        throw new Error("Http error! status: ${response.status}");
    }   
    //kaikki ok, joten kokeillaanpa jsoniksi
    let sailo = await response.json();
    let kil=[];
    let optiot = [];
    /*korvataan tilan kilpailut joka kerta uudestaan
    sillä erovaisuuksien vertailu veisi enemmän resursseja kuin korvaaminen,
    palvelin hoitaa muun*/
    for (var ind in sailo.kilpailut) {
        //console.log(sailo.kilpailut[ind].kisanimi);
        kil.push(sailo.kilpailut[ind].kisanimi);
        optiot.push({ value: String(sailo.kilpailut[ind].id), label: String(sailo.kilpailut[ind].kisanimi) });
    }
    this.state.kilpailut = kil;
    this.setState({options : optiot});
    console.log(this.state.options); 
}

//haetaan sarjat palvelimelta
async f_s() {
    //haetaan promise ja käsitellään sen sisältö
    let response = await fetch("http://127.0.0.1:8080/api/sarjat");
    
    if (!response.ok) {
        throw new Error("Http error! status: ${response.status}");
    }   
    //kaikki ok, joten kokeillaanpa jsoniksi
    let sailo = await response.json();
    let sar=[];
    let optiot = [];
    /*korvataan tilan kilpailut joka kerta uudestaan
    sillä erovaisuuksien vertailu veisi enemmän resursseja kuin korvaaminen,
    palvelin hoitaa muun*/
    for (let ind in sailo.sarjat) {
        //console.log(sailo.kilpailut[ind].kisanimi);
        sar.push(sailo.sarjat[ind]);
        optiot.push({ value: String(sailo.sarjat[ind].id), label: String(sailo.sarjat[ind].sarjanimi) });
    }
    this.state.sarjat_kaikki = sar;
    
    if (this.state.kilpailu_valittu != "") {
        let s = [];
        let id = 0;
        
        for (let in_d in this.state.kilpailut) {
            
            if (this.state.kilpailut[in_d] == this.state.kilpailu_valittu) {
                id = this.state.options[in_d].value;
                //console.log(this.state.kilpailut[in_d], " ", this.state.kilpailu_valittu, " ", id);
            }
        }

        for (let ind in this.state.sarjat_kaikki) {
            if (this.state.sarjat_kaikki[ind].kilpailu == id) {
                console.log(this.state.sarjat_kaikki[ind].kilpailu, " ", this.state.sarjat_kaikki[ind].sarjanimi);
                s.push({ value: String(this.state.sarjat_kaikki[ind].kilpailu), label: String(this.state.sarjat_kaikki[ind].sarjanimi) }); 
            }
        }    
        console.log(s);
        this.setState({options_sarjat : s});
    }
    
    //console.log(this.state.options_sarjat);
}

//tarkistin jäsen kentille, jos syöte validi, palauttaa true
valMetodi(mjono) {
    //jos tosi, niin vain numeroita
    let t_vai_f = mjono.match(/^[0-9]+$/) !== null;
    if((mjono.trim()).length == 0 || t_vai_f === true) {
        return false
    }
    return true
    
}

//en keksi nyt parempaa tähän, 2:lle ekalle jäs.kentälle oma validointi, niin on specifisempi
//voisi kai tähän jonkin div-pohjaisen ajtuksen toteuttaa
jas1Val(event) {
    this.setState({jas1 : event.target.value });

    if(this.state.jas1.length === 0 || this.valMetodi(event.target.value) === false) {
        event.target.setCustomValidity(this.state.virheilmoitukset_ja_infot[0]);
        event.target.reportValidity();
    } else {
        event.target.setCustomValidity("");
    }
}
jas2Val(event) {
    this.setState({jas2 : event.target.value });
    if(this.state.jas2.length === 0 || this.valMetodi(event.target.value) === false) {
        event.target.setCustomValidity(this.state.virheilmoitukset_ja_infot[1]);
        event.target.reportValidity();
    } else {
        event.target.setCustomValidity("");
    }
}

//kentissä 3-5, eroina se, että mikäli tyhjiä, ei suoriteta tarkistuksia
jas3Val(event) {
    this.setState({jas3 : event.target.value });
    
    if(this.state.jas3.length !== 0) {
        if(this.valMetodi(event.target.value) === false) {
            event.target.setCustomValidity(this.state.virheilmoitukset_ja_infot[0]);
            event.target.reportValidity();
        } else {
              event.target.setCustomValidity("");
          } 
    }
}
jas4Val(event) {
    this.setState({jas4 : event.target.value });
    
    if(this.state.jas4.length !== 0) {
        if(this.valMetodi(event.target.value) === false) {
            event.target.setCustomValidity(this.state.virheilmoitukset_ja_infot[0]);
            event.target.reportValidity();
        } else {
              event.target.setCustomValidity("");
          } 
    }
}

jas5Val(event) {
    this.setState({jas5 : event.target.value });
    
    if(this.state.jas5.length !== 0) {
        if(this.valMetodi(event.target.value) === false) {
            event.target.setCustomValidity(this.state.virheilmoitukset_ja_infot[0]);
            event.target.reportValidity();
        } else {
              event.target.setCustomValidity("");
          } 
    }  
}

jnimiVal(event) {
    this.setState({joukkueennimi : event.target.value });
    if(this.state.joukkueennimi.length < 2 || this.valMetodi(event.target.value) === false) {
            event.target.setCustomValidity(this.state.virheilmoitukset_ja_infot[2]);
            event.target.reportValidity();
     } else {
           event.target.setCustomValidity("");
       } 
}
//pyydetään g-tunnus erikseen frontend käyttöön, tämä varmistaa, että annettu tunnus on validi
g_tunnus_Val(event) {
    this.setState({g_tunnus : event.target.value });
    //laitetaan tännekin, hävinnee tilasta googlen uudelleen ohjauksessa
    window.localStorage.setItem("g_tunnus", event.target.value);
    
    if(this.state.g_tunnus.length > 0 && this.spTarkistin(event.target.value) === true){
          event.target.setCustomValidity("");
          window.localStorage.setItem("nakyma", 2);
    } else {
          event.target.setCustomValidity(this.state.virheilmoitukset_ja_infot[3]);
          event.target.reportValidity();
    }
}

//validointi hoidettu, tällä vaihdetaan sovelluksen tilaa/näkymää
lomakkeenKasittelija_sPa(event) {
    let p = document.getElementById("nakyma1_p");
    
    if(this.state.g_tunnus.length === 0) {
        p.textContent = this.state.virheilmoitukset_ja_infot[4]
    } else {
          this.setState({nakyma : 2 });
          p.textContent = ""
    }
}

//haetaan palvelimelta oikean kilpailun joukkueet ja suoritetaan vertailu
iteroi_joukkueet(jnimi, k_id) {
    let url = new URL("http://127.0.0.1:8080/api/" + k_id + "/joukkueet");
    fetch(url).then(function(response) {return response.json();}).then(function(joukkue_olio){
    try {
        this.setState({joukkueet : joukkue_olio.joukkueet});
    }
    catch (error) {
        console.log("Virhe/joukkueiden haku", error);
    }
    });
    
    for (let i = 0; i < this.state.joukkueet.length; i++) {
        
        if (this.state.joukkueet[i]["nimi"] == jnimi) {
            return true;
        }
    }
    return false;
} 

async nouda_kilp_joukkueet() {
    //haetaan promise ja käsitellään sen sisältö
    let response = await fetch("http://127.0.0.1:8080/api/");
    if (!response.ok) {
        throw new Error("Http error! status: ${response.status}");
    }
        
    //kaikki ok, joten kokeillaanpa jsoniksi
    let sailo = await response.json();
    console.log(sailo);   
}

//jäsenet tietorakenteeksi firestoren collectionia varten
//koska jäseniä rajattu määrä, tehdään tämä tyhmästi
gen_jas_olio() {
    let jas_olio = [];
    if(this.state.jas1.length < 2 && this.state.jas2.length < 2) {
        jas_olio.push({jasen1 : this.state.jas1}, {jasen2 : this.state.jas2});
        
        if(this.state.jas3.length < 2) {
            jas_olio.push({ jasen3 : this.state.jas3});
            if(this.state.jas4.length < 2) {
                jas_olio.push({ jasen4 : this.state.jas4});
                if(this.state.jas5.length < 2) {
                    jas_olio.push({ jasen5 : this.state.jas5});
                }   
            }
        }
    }
    
    return jas_olio;
}

iteroi_optiot() {
    let id = 0;
    for (let ind in this.state.otiot) {
        if(this.state.kilpailu_valittu == this.state.optiot.label) { id = this.state.optiot.value; }
    }    
    return id;
}
//jäsenlistasta url kelpoinen parametri
gen_jas_jono(t) {
    let jas_jono = t.join('_');
    return jas_jono;
}

async nouda_lisays_status(url) {
   let response = await fetch(url);
   return response
}

//varmistaa ettei samaa joukkuetta jo kilpailussa & varmistaa että jäseniä väh. kaksi
//jäsen-kenttien arvot tallennettu tilaan, joten käytetään sitä vertailuun
//Jos aiempia validoinnin virheitä, näytetään lomakkeen lähetyksen yhteydessä 
lomakkeenKasittelija(event) {
    //haetaan localstoragesta g_tunnus ja säiltään tilaan
    let g_t = window.localStorage.getItem("g_tunnus");
    this.setState({ g_tunnus : g_t });
     
    event.preventDefault();
    const span_elem = document.getElementById("lomake_sm_vi");
    //täytyy kuitenkin erikseen tarkistaa, että pakollisiin kenttiin vastattu
    
    console.log("tänne päästiin");
    if(this.state.jas1 != "" && this.state.jas2 != "" && this.state.joukkueennimi != "" && this.state.kirjautunut === true && this.state.kilpailu_valittu != "" && this.state.sarja_valittu != "" && this.state.g_tunnus != "") {

        this.setState({lomake_sm_vi : "" });
        let onko_olemassa = this.iteroi_joukkueet(this.state.joukkueennimi, event.target.value);
        if(onko_olemassa === false) {
        
            let url = "http://127.0.0.1:8080/api/db_l_j/" + this.gen_jas_jono(this.gen_jas_olio()) + '/'
            + this.iteroi_optiot() + '/' + this.state.joukkueennimi + '/' + this.state.sarja_valittu + '/' + this.state.g_tunnus; 
            let response = this.nouda_lisays_status(url);
            
            if (!response.ok) {
                throw new Error("Http error! status: ${response.status}");
            }
        
            //kaikki ok, joten kokeillaanpa jsoniksi
            let sailo = response.json();
            console.log("url: ", url);  
            console.log(sailo);  
            if (sailo === true) {
                this.setState({lomake_sm_vi : "Joukkueesi lisätty!" });
            }
            else  {
                this.setState({lomake_sm_vi : "Virhe, joukkuettasi ei lisätty :(" });
            }
    
        }
    }
    if(this.state.jas1 != "" || this.state.jas2 != "" || this.state.joukkueennimi != "" || this.state.kirjautunut === true || this.state.kilpailu_valittu != "" || this.state.sarja_valittu != "" || this.state.g_tunnus != "") {
        this.setState({lomake_sm_vi : "Vastaa pakollisiin kenttiin (vapaaehtoiset: poisto, jasenet 3-5)" });
        console.log( window.localStorage.getItem("g_tunnus"));
    }
    
    else {
        this.setState({lomake_sm_vi : "Virhe, joukkuettasi ei lisätty :(" });
    }
}

//päivittää valitun kilpailun tilaan
muutos(kilpailu_valittu) {
    //Nyt kilpailu tiedossa, joten päivitetään mahdolliset sarjat
    this.f_s();
    this.setState({ kilpailu_valittu : kilpailu_valittu.label }, () =>
      console.log("Nyt ei voi olla enää undefined: ", this.state.kilpailu_valittu)
    );
}

//päivittää valitun kilpailun sarjan tilaan
muutos2(sarja_valittu) {
     this.setState({ sarja_valittu : sarja_valittu.label }, () =>
     console.log("Nyt ei voi olla enää undefined: ", this.state.sarja_valittu)
    );
}

//päivittää poiston totuusarvon tilaan
j_poisto(event) {
    let laskuri = 0; 
    
    this.setState({poistetaanko : !this.state.poistetaanko});
    console.log("True vai jtn muuta:", this.state.poistetaanko, " ", event.target.value);
}

takaisin() {
   window.localStorage.setItem("nakyma", 3);
}

//===========================
render() {
    
        //const {kilpailu_valittu} = this.state;
    let nmp = window.localStorage.getItem("nakyma");
    if(nmp !== "4") {
        if (this.state.kilpailut.length === 0) {
            this.f_k();
        }
        
        if (this.state.sarjat_kaikki.length === 0) {
            this.f_s();
        }
        
        if(this.state.nakyma == 1) {
            return (
                <div id="ud">
                <form id="lomake_sPa" onSubmit={this.lomakkeenKasittelija_sPa}>
                    <label id="g_tunnus_lab">Anna G-tunnus:
                    <input type="text" id="g_tunnus_inp" name="g_tunnus" value={this.state.g_tunnus} onChange={this.g_tunnus_Val}/>
                    </label>
                    <input id="tallenna" type="submit" form="lomake_sPa" value="Varmista" />
                    <p id="nakyma1_p"></p>
                </form>
                </div>
            );
        } else if(this.state.nakyma == 2) {
             
             //haetaan kirjautumisen osoite flask sovellukselta
             function NoudaLoginUrl() {
             
                 const [data, aseta] = useState([{}])
                 useEffect(() => {

                     fetch("http://127.0.0.1:8080/api/noudaLoginUrl").then((response) => response.json()).then(
                         data => {
                             aseta(data);
                             //console.log(data);
                             
                         }
                     )
                 }, [])
                 
                 
                     // ei pitäisi olla undefined, mutta laitetaan nyt kuitenkin
                     if (typeof data.login_url === "undefined") {
                         return (
                             <p>Tapahtui jotain odottamatonta :(</p>
                         );
                     }
                     
                     // ajastus mahdollistamaan käytöliittymän tilan vaihdon tunnisteen säilömin
                     // istuntoon
                     
                     const ajasta = (e) => {
                         //ei ole mahdollista päivittää, joten poistetaan ja lisätään uudella arvolla
                         e.preventDefault();
                         window.localStorage.removeItem(localStorage.nakyma);
                         window.localStorage.setItem("nakyma", 3);
                         const ajastin = setTimeout(() => 1000);
                         clearTimeout(ajastin);
                         window.location.replace(data.login_url);
                     };
                     
                     return (
                         <a href={data.login_url} onClick={ajasta}>Kirjaudu G-tunnuksella</a>
                     );
                     
             }
             
              return (
                <div id="g_linkki">
                   <p>{this.state.kirjautunut}</p> 
                   <NoudaLoginUrl  />
                </div>
                );
	  }
        
        
        else {
        
        if(!!this.state.kirjautunut === true) {
            if(this.state.nakyma == 3) {
                    
                return (
                     <div id="ul_n3">
                     <form id="lomake" onSubmit={this.lomakkeenKasittelija}>
                         
                         <div id="lomakkeen_spac">
                         <label id="jnimi_lab">Joukkueen nimi
                         <input type="text" id="jnimi_inp" name="jnimi" value={this.state.joukkueennimi} onChange={this.jnimiVal}/>
                         </label><br></br>
                         
                         <label id="sel_kil_lab">Valitse kilpailu
                         <Select
                         id="kil_sel"
                         onChange={this.muutos}
                         options={this.state.options}
                         />
                         </label>
     
                         <label id="sel_sar_lab">Valitse sarja
                         <Select
                         id="sar_sel"
                         onChange={this.muutos2}
                         options={this.state.options_sarjat}
                         />

                         </label>                         
                         <br></br>

                         <div id="valinnat" >
                             <input id="cb" onChange={this.j_poisto} type="checkbox" value={this.state.poistetaanko} />
                             <label id="cb_lab">Poista Joukkue:</label>
                         </div> 
                         
                         <br></br>
                         <div id="pelaajat">
                             <label id="jas1_lab">Jäsen 1
                             <input type="text" id="jas1_inp" name="jas1" value={this.state.jas1} onChange={this.jas1Val} required />
                             </label><br></br>
                             
                             <label id="jas2_lab">Jäsen 2
                             <input type="text" id="jas2_inp" name="jas2" value={this.state.jas2} onChange={this.jas2Val} required />
                             </label><br></br>
                                                         
                             <label id="jas3_lab">Jäsen 3
                             <input type="text" id="jas3_inp" name="jas3" value={this.state.jas3} onChange={this.jas3Val}/>
                             </label><br></br>
                             
                             <label id="jas4_lab">Jäsen 4
                             <input type="text" id="jas4_inp" name="jas4" value={this.state.jas4} onChange={this.jas4Val}/>
                             </label><br></br>
                             
                             <label id="jas5_lab">Jäsen 5
                             <input type="text" id="jas5_inp" name="jas5" value={this.state.jas5} onChange={this.jas5Val}/>
                             </label>
                         </div>
                         <input id="tallenna" type="submit" form="lomake" value="Tallenna" /><span id="lomake_sm_vi">{this.state.lomake_sm_vi}</span>
                         </div>
                         </form>
                         <ul id="lista_uloin">
                             <Listaus />
                         </ul>
                         </div>

	         );
	     }
	             
        }
    
    }
    }
    
    if(nmp === "4") {
        let li = [];
        let k_dt = window.localStorage.getItem("kilpailu_valittu"); 
        if(k_dt !== undefined) {
            console.log(k_dt);
            let kaks_d_t = undefined;
            let kdt = this.k_d_t(window.localStorage.getItem("kilpailu_valittu"));

            let url = new URL("http://127.0.0.1:8080/api/k_d_t/" + window.localStorage.getItem("kilpailu_valittu"));
            fetch(url)
            .then(function(response) {
            return response.json();
            }).then(function(data) {
                window.localStorage.setItem("data", data["Kooste"]); 
            })
            let temp = window.localStorage.getItem("data");
            let temp12 = temp.split(',');
            let temp2 = ["+"].concat(temp12);
            console.log(temp2);
            for (let i = 0; i < temp2.length; i++) {
                let lis_id = "l" + String(i) + "_" + (Math.random() + 1).toString(36).substring(9);
                
                if(temp2[i] == "+") {
                    i += 1;
                    let ind2 = i + 1;
                    let kd = this.ul_gen(temp2, ind2);
                    console.log(kd);
                    li.push(<li className="lista_li2" key={lis_id}>{temp2[i]}{kd[0]}
                    </li>);
                    i = kd[1];
                }
                
              }
            }
            li.pop();
        return (
        <div id="kil_lis">
        <button id="takaisin" onClick={this.takaisin}>Takaisin</button>
        <ul>{li}
        </ul>
        </div>
        );
        }
        
        if(nmp === "5") {
            let sarja = window.localStorage.getItem("sarja_val");
            let url = new URL("http://127.0.0.1:8080/api/db_pjs/" + sarja);
            fetch(url)
            .then(function(response) {
            return response.json();
            }).then(function(data) {
                window.localStorage.setItem("s_data", data["sarjan_joukkueet"]); 
            })
            let li = [];
            let tmp = window.localStorage.getItem("s_data");
            let temp = tmp.split(',');
            //console.log(temp[0]);
            
            for (let i = 0; i < temp.length; i++) {
                let sl_k = "sl" + String(i) + "_" + (Math.random() + 1).toString(36).substring(9);
                li.push(
                <li className="s_j_lis" key={sl_k}>{temp[i]}</li>        
                );        
            }
            return (
            <div id="s_j_li">
            <button id="takaisin" onClick={this.takaisin}>Takaisin</button>
            <ul id="s_n5_ul">{li}
            </ul>
            </div>);
        }

    }
    
}


class Listaus extends React.PureComponent {
    constructor(props) {
        super(props);
        
    this.ta_gen = this.ta_gen.bind(this);
    this.listaus = this.listaus.bind(this);
    this.sarja_updt = this.sarja_updt.bind(this);
    //this.pituus_ret = this.pituus_ret.bind(this);
    this.ret_ul = this.ret_ul.bind(this);
    this.poista_ilm = this.poista_ilm.bind(this);
    
        this.state = {
            g_tunnus: window.localStorage.getItem("g_tunnus"), 
            kartta_olio: undefined,
            kilpailu_valittu: "",
        };
    }
    /*
    pituus_ret(kdtaul) {
        return kdtaul.join(',').split(',').length;
    }
    */
    sarja_updt(event) {
      let a_mjonot = event.target.innerText.split(" ");
      let ka = [a_mjonot[0], a_mjonot[1]];
      let sarja = "";
      if(ka[0].length > 2) { sarja = ka[0]; }
      else { sarja = ka.join(" "); }
      //alert(sarja);
      window.localStorage.setItem("sarja_val", sarja);
      window.localStorage.setItem("nakyma", 5);
      
    }
    
    listaus(event) {
      let t = event.target.innerText.match(/[^\r\n]+/g);
      //alert(event.target.innerText.substring(0, event.target.innerText.indexOf(' ')));
      //alert(t[0]);
      this.setState({kilpailu_valittu: t[0]});
      window.localStorage.setItem("kilpailu_valittu", t[0]);  
      window.localStorage.setItem("nakyma", 4);  
    }
    
    ret_ul(lista) {
       let ul = [];           
       for (let j = 1; j < lista.length; j++) {
           let id_a_ul = String(j) + "a_ul";
           //nyt ei tule helpolla duplikaatteja tunnisteita
           let painike_id = "painike" + String(j) + "_" + (Math.random() + 1).toString(36).substring(9);
           ul.push(
           <a id={id_a_ul} href="#" onClick={this.sarja_updt}>
           <ul className="lista_ul" key={j}>{lista[j]} <button id={painike_id} onClick={this.poista_ilm}>Poista ilmoittautuminen</button>
           </ul>
           </a>
           );
       }
       return ul;

    }
    
    // istuntoon avaimia ja niille taulukoita, käytetään myöhemmin
    ta_gen() {
        let url = new URL("http://127.0.0.1:8080/api/ilmot/" + this.state.g_tunnus);
        let undef = undefined;
        let sailo =  [];
        
        fetch(url).then(function(response) {return response.json();}).then(function(kartta_olio){
        try { 
            let luku = 1;
            for (let [avain, arvo_t] of Object.entries(kartta_olio.ilm)) {
               console.log(`${avain}: ${arvo_t}`);
               let ali_t = [];
               ali_t.push(avain);
               
               let ta = ali_t.concat(arvo_t);
               window.localStorage.setItem(("o"+String(luku)), JSON.stringify(ta));
               luku+=1
            }
        }
        catch (error) {
            console.log("Virhe/ilmottautumisten nouto", error);
        }
        });
        
      
    }
    
    //poiston käsittelijä
    async poista_ilm(event) {
        if (window.confirm("Poistetaanko joukkueesi sarjasta?")) {
            let a_mjonot = event.target.closest('a').innerText.split(" ");
            let ka = [a_mjonot[0], a_mjonot[1]];
            let sarja = "";
            let sposti =  window.localStorage.getItem("g_tunnus");
            if(ka[0].length > 2) { sarja = ka[0]; }
            else { sarja = ka.join(" "); }
            
            //alert(sarja);
            let temp = event.target.closest('li').innerText.split("\n");
            let kilpailu = temp[0];
            
            let url = new URL("http://127.0.0.1:8080/api/poista/" + sposti + "/" + kilpailu + "/" + sarja);
            let resp = await fetch(url);
            if (!resp.ok) {
                throw new Error(`HTTP error! status: ${resp.status}`);
            }
            let data = await resp.json();
            console.log(url);
 

    }

    }
    
    componentDidMount() {
        window.addEventListener("load", this.ta_gen);
    }

    componentWillUnmount() { 
        window.removeEventListener("load", this.ta_gen);
    }
    
    render() {

    if(this.state.kilpailu_valittu == "") {
        if (this.state.kartta_olio === undefined) {
           this.ta_gen();
           let k_s = [];
           for (let avain in window.localStorage){
               //localstoragen avainten eka kirjain o varattu listaukseen, tässä ehto sille
               if(avain.charAt(0) == 'o'){
                   //console.log(avain);
                   k_s.push(JSON.parse(window.localStorage.getItem(avain)));
               }
           }
           this.state.kartta_olio = k_s;
           console.log(this.state.kartta_olio[0]);
            
        }
        
        let li = [];
        let ul = [];
        if(this.state.kartta_olio !== undefined) {
            this.ta_gen();
            //tämä on pituuden funktio sinänsä turha, kun korjasin ongelman johon tämä yritti vastata, mutta jääköön nyt siihen
            //let pituus =  this.pituus_ret(this.state.kartta_olio);
            
            let temp = this.state.kartta_olio;

            let avain_a_luku = temp.length;
            for (let i = 0; i < temp.length; i++) {
                let id_a_li = String(i) + "a_li";
                li.push(<li className="lista_li" key={i}>
                        <a id={id_a_li} href="#" onClick={this.listaus}>{temp[i][0]}</a>
                        {this.ret_ul(temp[i])}
                        </li>
                        
                );
            }
        }

        
        return li;
    }
    
    }
    
}


export default Tulospalvelu
