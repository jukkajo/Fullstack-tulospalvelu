#from data import data
from operator import itemgetter
from functools import wraps
from flask import Flask, flash, render_template, redirect, url_for, session, make_response, request, config, jsonify
from authlib.integrations.flask_client import OAuth
from flask_wtf.csrf import CSRFProtect
from flask_cors import CORS, cross_origin
import datetime as d
import os
import json
import hashlib
import requests
import firebase_admin
from firebase_admin import credentials
from firebase_admin import firestore

glob_id = 1
app = Flask(__name__)
k_lista = []
#app.secret_key = '!secret'
csrf = CSRFProtect(app)
csrf.init_app(app)

app.config.from_object('config')
G="GET"
P="GET"
CORS(app)
#laitetaanpas specifimmäksi tätä
#cors = CORS(app, origins=["http://localhost:3000", "http://127.0.0.1:3000", "http://127.0.0.1", "https://www.googleapis.com/oauth2/v3/userinfo"], methods=["GET"], resources={r"/api/*": {"origins": "*"}}, supports_credentials=True)
app.config["SECRET_KEY"] = "merkkijono, ei kovin pitkä"
app.config["CORS_HEADERS"] = "Content-Type"

cors = CORS(app, resources={r"/foo": {"origins": "http://localhost:3000"}})



CONF_URL = 'https://accounts.google.com/.well-known/openid-configuration'
oauth = OAuth(app)
oauth.register(
    name='google',
    server_metadata_url=CONF_URL,
    client_kwargs={
        'scope': 'openid email profile'
    }
)

# fs tili käyttöön
cred = credentials.Certificate("./TP2022.json")
firebase_admin.initialize_app(cred)
db = firestore.client()

@app.route("/api/ret_ses_tunnus", methods=[G, P])
@cross_origin(origin='localhost',headers=['Content- Type','Authorization'])
def ret_ses_tunnus():
    global k_lista
    """
    if "email_info" in session:
        response = jsonify({"email_info" : session["email_info"]})
    else:
        response = jsonify({"email_info" : session})
    print(session)
    """
    #return response
    return jsonify({"email_info": k_lista})
 
              
@app.route("/api/noudaLoginUrl", methods=[G])
def noudaLoginUrl():
    response = jsonify({"login_url" : "".join([request.base_url[:len("/noudaLoginUrl")-1], "1:8080/api/login"])})
    return response

@app.route("/api/poista")
def poista():
    return {"sessio": session}

#varmentaa oikeuden päästä käsiksi resursseihin
def varmenna_lupa(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        if not "user" in session:
            #paluu sivulle jolla kirjaudutaan
            return redirect(url_for("login"))
        return f(*args, **kwargs)
    return decorated


@app.route("/api/auth")
def auth():
    global k_lista
    tk = oauth.google.authorize_access_token()
    u = tk.get("access_token")
    rq = requests.get("https://www.googleapis.com/oauth2/v3/userinfo", params={"access_token": u})
    sposti = rq.json()
    
    k_lista.append(sposti["email"])
    session["email_info"] = sposti["email"]
    return redirect("http://localhost:3000/")

#sessio tyhjäksi ja u-kirj.
@app.route("/api/logout")
def logout():
    session.clear()
    return redirect("http://localhost:3000/")

#ohjataan googlen tunnistautumiseen
@app.route("/api/login")
def login():
    redirect_uri = url_for("auth", _external=True)
    return oauth.google.authorize_redirect(redirect_uri)

#haetaan sarjat ja niiden joukkueet kisanimen perusteella
@app.route("/api/k_d_t/<kisanimi>")
def k_d_t(kisanimi):
    temp = db.collection(u'kilpailut').where(u'kisanimi', u'==', kisanimi).stream()
    print(temp)
    sailo = []
    sailo_j = []
    sailo_s = []
    joukkueet = []
    #
    lopullinen = []
    #
    for doc in temp:
            sailo.append(doc.to_dict())
    id = sailo[0]["id"]
    temp_s = db.collection(u'sarjat').where(u'kilpailu', u'==', id).stream()
    for doc in temp_s:
         sailo_s.append(doc.to_dict())
         
    temp_j = db.collection(u'joukkueet').stream()
    for doc in temp_j:
         sailo_j.append(doc.to_dict())
    for joukkue in sailo_j:
        if kisanimi in joukkue["kilpailut"]:
            ali_t = []
            ali_t.append(joukkue["nimi"])
            for sarjanimi in joukkue["kilpailut"][kisanimi]:
                ali_t.append(sarjanimi)
            joukkueet.append(ali_t)
    
    for sar in sailo_s:
        sj = []
        sj.append(sar["sarjanimi"])
        for joukkue in joukkueet:
            for ind in range(1,len(joukkue)):
                #print(joukkue[ind], " : ",sar["sarjanimi"])
                if joukkue[ind] == sar["sarjanimi"]:
                    sj.append(joukkue[0])
        lopullinen.append(sj)
        #
        lopullinen.append('+')
        
    response = jsonify({"Kooste" : lopullinen})        
    return response

@app.route("/api/poista/<sposti>/<kilpailu>/<sarja>", methods=[G])
def poista_sarjasta(sposti, kilpailu, sarja):
    query = db.collection("joukkueet").where('omistaja', '==', sposti)
    docs = query.get()
    jnimi = ""
    for doc in docs:
        if doc.exists:
            jnimi = doc.data["nimi"]
    
    dref = db.collection("joukkueet").where("nimi", "==", jnimi)
    res = dref.get()
    try:
        for doc in res:
            doc.reference.update({
                f"kilpailut.{kilpailu}": firebase_admin.firestore.DELETE_FIELD
            })
        return jsonify({"onnistuiko" : True})

    except ValueError:
        return jsonify({"onnistuiko" : False})

    else:
        return jsonify({"onnistuiko" : False})

    
    
#kilpailu = id / int
@app.route("/api/<kilpailu>/joukkueet", methods=[G])
def nouda_kilp_joukkueet(kilpailu):
    joukkueet = db.collection(u'joukkueet').stream()
    sailo = []
    for doc in joukkueet:
        if doc.id == kilpailu:
            sailo.append(doc.to_dict())
    response = jsonify({"joukkueet" : sailo})        
    return response
    
#kilpailu = id / int
@app.route("/api/kilpailut", methods=[G])
def nouda_kilpailut():
    joukkueet = db.collection(u'kilpailut').stream()
    sailo = []
    for doc in joukkueet:
        sailo.append(doc.to_dict())
    response = jsonify({"kilpailut" : sailo})        
    return response

@app.route("/api/sarjat", methods=[G])
def nouda_sarjat():
    sarjat = db.collection(u'sarjat').stream()
    sailo = []
    for doc in sarjat:
        sailo.append(doc.to_dict())
    response = jsonify({"sarjat" : sailo})        
    return response

#haetaan kilpailut ja sarjat joihin liitetty annettu g-tunnus
@app.route("/api/ilmot/<sposti>", methods=[G])
def nouda_ilmot(sposti):
    kil = db.collection(u'kilpailut').stream()
    sar = db.collection(u'sarjat').stream()
    jou = db.collection(u'joukkueet').stream()
    sailo_k, sailo_s, sailo_j, tmp = {}, {}, {}, {}
    t = ""
    luku=0
    res=None
    
    for doc in kil:
        sailo_k[str(luku)] = doc.to_dict()    
        luku += 1
    luku=0
    for doc in sar:
        sailo_s[str(luku)] = doc.to_dict()
        luku += 1
    luku=0
    for doc in jou:
        sailo_j[str(luku)] = doc.to_dict()
        luku += 1
        
    #knimet = []
    for i in range(len(sailo_j)):
        if sailo_j[str(i)]["omistaja"] == sposti:
            tmp = sailo_j[str(i)]["kilpailut"]

    res = jsonify({"ilm": tmp})
    return res

@app.route("/api/db_pjs/<sarja_valittu>", methods=[G])
def palauta_s_joukkueet(sarja_valittu):
    docs = db.collection(u'joukkueet').stream()
    sailo = []
    kil_j = []
    temp = []
    for doc in docs:
        sailo.append(doc.to_dict())
    for joukkue in sailo:
        for avain in joukkue["kilpailut"].keys():
           for i in joukkue["kilpailut"][avain]:
                if sarja_valittu in i:
                    temp.append(joukkue["nimi"])
                 
    return {"sarjan_joukkueet" : temp}

#response true jos onnistui, muuten false
# erotin -> '_'
#tällä lisätään joukkue firestoren firebaseen
@app.route("/api/db_l_j/<jasen_mjono>/<kilpailu>/<jnimi>/<sarja>/<gtunnus>", methods=[G])
def lisaa_tai_poista_joukkue(jasen_mjono, kilpailu, jnimi, sarja, gtunnus):
    global glob_id
    t_v_e = True
    jas_t = jasen_mjono.split('_')
    kasvu = 1
    jasenet = []
    for ind in jas_t:
        jasenet.append({("jasen"+str(kasvu)) : ind})
    
    dok_ref = db.collection(u'joukkueet').document(str(glob_id))
    glob_id += 1
    
    doc_ref.set({
    u'jasenet': jasenet,
    u'kilpailu': kilpailu,
    u'nimi': jnimi,
    u'sarja': sarja,
    u'omistaja' : gtunnus
    })
    
        
    response = jsonify({"onnistuiko" : t_v_e})        
    return response
"""

#tällä luotiin firestoren hierarkia ja sinne tiedot
def luo_tkanta():
    d = data()
    
    d.alusta('k')
    d.lisaaja()
    
    d.alusta('s')
    d.lisaaja()
    
    d.alusta('r')
    d.lisaaja()
"""
   
if __name__ == '__main__':
    
    #luo_tkanta()
    #väri jako 60/30/10
    #lokaali testaus
    app.run(host="127.0.0.1", port=8080, debug=True)
