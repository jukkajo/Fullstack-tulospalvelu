from firebase_admin import firebase_admin
from firebase_admin import credentials
from firebase_admin import firestore

cred = credentials.Certificate("./TP2022.json")
firebase_admin.initialize_app(cred)

db = firestore.client()

#luokka datan tallennukseen firestoreen
class data:

    kilpailut = [{"id": 1, "kisanimi":"Kevät19", "loppuaika": "2019-03-17 20:00:00", "alkuaika": "2019-03-15 09:00:00"},
                 {"id": 2, "kisanimi":"Talvi16", "loppuaika": "2016-03-17 20:00:00", "alkuaika": "2016-03-15 09:00:00"},
                 {"id": 3, "kisanimi":"Syys-suunnistus", "loppuaika": "2017-03-18 20:00:00", "alkuaika": "2017-03-18 09:00:00"},
                 {"id": 99, "kisanimi":"Kesä2021", "loppuaika": "2021-05-01 20:00:00", "alkuaika": "2021-05-01 12:00:00"}]

    sarjat = [{"sarjanimi":"4 h", "kilpailu": 1, "kesto": 4},
              {"sarjanimi":"2 h", "kilpailu": 1, "kesto": 2},
              {"sarjanimi":"8 h", "kilpailu": 1, "kesto": 8},
              {"sarjanimi":"Pikkusarja", "kilpailu": 3, "kesto": 4},
              {"sarjanimi":"8 h", "kilpailu": 3, "kesto": 8},
              {"sarjanimi":"Isosarja", "kilpailu": 3, "kesto": 8},
              {"sarjanimi":"Pääsarja", "kilpailu": 2, "kesto": 4},
              {"sarjanimi":"2 h", "kilpailu": 2, "kesto": 2}]
              
    rastit = [{"lat": 62.13028, "lon": 25.666688, "koodi": "Tuntematon"},
              {"lat": 62.120776, "lon": 25.542413, "koodi": "66"},
              {"lat": 62.156532, "lon": 25.496872, "koodi": "6D"},
              {"lat": 62.112172, "lon": 25.714338, "koodi": "91"}, 
              {"lat": 62.099795, "lon": 25.544984, "koodi": "48"}, 
              {"lat": 62.133029, "lon": 25.737019, "koodi": "31"}, 
              {"lat": 62.110562, "lon": 25.518665, "koodi": "85"}, 
              {"lat": 62.115047, "lon": 25.615203, "koodi": "69"}, 
              {"lat": 62.088183, "lon": 25.729848, "koodi": "99"}, 
              {"lat": 62.11183, "lon": 25.644512, "koodi": "60"}, 
              {"lat": 62.148123, "lon": 25.618079, "koodi": "63"}, 
              {"lat": 62.134681, "lon": 25.605762, "koodi": "70"}, 
              {"lat": 62.13028, "lon": 25.666688, "koodi": "LAHTO"}, 
              {"lat": 62.10393, "lon": 25.63595, "koodi": "90"}, 
              {"lat": 62.122986, "lon": 25.573049, "koodi": "34"}, 
              {"lat": 62.11906, "lon": 25.628228, "koodi": "37"}, 
              {"lat": 62.089674, "lon": 25.652877, "koodi": "5C"}, 
              {"lat": 62.129767, "lon": 25.626533, "koodi": "44"}, 
              {"lat": 62.086189, "lon": 25.695688, "koodi": "79"}, 
              {"lat": 62.127323, "lon": 25.597278, "koodi": "82"}, 
              {"lat": 62.095187, "lon": 25.628236, "koodi": "64"}, 
              {"lat": 62.141243, "lon": 25.509358, "koodi": "6F"}, 
              {"lat": 62.136462, "lon": 25.668097, "koodi": "41"}, 
              {"lat": 62.153864, "lon": 25.540227, "koodi": "40"}, 
              {"lat": 62.102194, "lon": 25.673997, "koodi": "5A"}, 
              {"lat": 62.144852, "lon": 25.493141, "koodi": "92"}, 
              {"lat": 62.118784, "lon": 25.718561, "koodi": "5B"}, 
              {"lat": 62.121247, "lon": 25.678314, "koodi": "49"}, 
              {"lat": 62.111294, "lon": 25.553191, "koodi": "78"}, 
              {"lat": 62.098636, "lon": 25.691051, "koodi": "56"}, 
              {"lat": 62.078212, "lon": 25.733259, "koodi": "42"}, 
              {"lat": 62.139918, "lon": 25.535011, "koodi": "67"}, 
              {"lat": 62.138397, "lon": 25.56252, "koodi": "7C"}, 
              {"lat": 62.091567, "lon": 25.680401, "koodi": "96"}, 
              {"lat": 62.13232, "lon": 25.498431, "koodi": "53"}, 
              {"lat": 62.132964, "lon": 25.57761, "koodi": "95"}, 
              {"lat": 62.142319, "lon": 25.590916, "koodi": "76"}, 
              {"lat": 62.15146, "lon": 25.50711, "koodi": "46"}, 
              {"lat": 62.126591, "lon": 25.704639, "koodi": "58"}, 
              {"lat": 62.147298, "lon": 25.665822, "koodi": "83"}, 
              {"lat": 62.125561, "lon": 25.558017, "koodi": "51"}, 
              {"lat": 62.087827, "lon": 25.671071, "koodi": "97"}, 
              {"lat": 62.147942, "lon": 25.563169, "koodi": "5E"}, 
              {"lat": 62.124222, "lon": 25.649234, "koodi": "94"}, 
              {"lat": 62.100104, "lon": 25.586932, "koodi": "47"}, 
              {"lat": 62.153364, "lon": 25.52873, "koodi": "74"}, 
              {"lat": 62.099512, "lon": 25.522034, "koodi": "73"}, 
              {"lat": 62.126639, "lon": 25.750133, "koodi": "7B"}, 
              {"lat": 62.141674, "lon": 25.718473, "koodi": "6A"}, 
              {"lat": 62.107914, "lon": 25.61344, "koodi": "43"}, 
              {"lat": 62.093545, "lon": 25.716227, "koodi": "71"}, 
              {"lat": 62.101185, "lon": 25.565572, "koodi": "77"}, 
              {"lat": 62.153435, "lon": 25.560594, "koodi": "33"}, 
              {"lat": 62.09468, "lon": 25.647515, "koodi": "6E"}, 
              {"lat": 62.100413, "lon": 25.728135, "koodi": "80"}, 
              {"lat": 62.131251, "lon": 25.540316, "koodi": "7E"}, 
              {"lat": 62.149572, "lon": 25.597308, "koodi": "68"}, 
              {"lat": 62.134123, "lon": 25.682473, "koodi": "7A"}, 
              {"lat": 62.109962, "lon": 25.7288, "koodi": "89"}, 
              {"lat": 62.115924, "lon": 25.569589, "koodi": "45"}, 
              {"lat": 62.135094, "lon": 25.523811, "koodi": "57"}, 
              {"lat": 62.147825, "lon": 25.513792, "koodi": "38"}, 
              {"lat": 62.113906, "lon": 25.668757, "koodi": "81"}, 
              {"lat": 62.141654, "lon": 25.628636, "koodi": "50"}, 
              {"lat": 62.081466, "lon": 25.686679, "koodi": "7D"}, 
              {"lat": 62.108717, "lon": 25.589347, "koodi": "54"}, 
              {"lat": 62.146315, "lon": 25.645642, "koodi": "72"}, 
              {"lat": 62.095246, "lon": 25.732937, "koodi": "62"}, 
              {"lat": 62.149229, "lon": 25.576022, "koodi": "86"}, 
              {"lat": 62.123662, "lon": 25.531059, "koodi": "5D"}, 
              {"lat": 62.142258, "lon": 25.526039, "koodi": "88"}, 
              {"lat": 62.144101, "lon": 25.694017, "koodi": "32"}, 
              {"lat": 62.125632, "lon": 25.49602, "koodi": "6B"}, 
              {"lat": 62.131769, "lon": 25.669574, "koodi": "MAALI"}, 
              {"lat": 62.115241, "lon": 25.743788, "koodi": "65"}, 
              {"lat": 62.093203, "lon": 25.606234, "koodi": "55"}, 
              {"lat": 62.117266, "lon": 25.694911, "koodi": "75"}, 
              {"lat": 62.156431, "lon": 25.519131, "koodi": "93"}, 
              {"lat": 62.147942, "lon": 25.531926, "koodi": "61"}, 
              {"lat": 62.128162, "lon": 25.724837, "koodi": "36"}, 
              {"lat": 62.118778, "lon": 25.524245, "koodi": "39"}, 
              {"lat": 62.115914, "lon": 25.503483, "koodi": "59"}, 
              {"lat": 62.140919, "lon": 25.648821, "koodi": "35"}, 
              {"lat": 62.094023, "lon": 25.661916, "koodi": "84"}, 
              {"lat": 62.120424, "lon": 25.599044, "koodi": "52"}, 
              {"lat": 62.131207, "lon": 25.650436, "koodi": "98"}, 
              {"lat": 62.127514, "lon": 25.674748, "koodi": "5F"}, 
              {"lat": 62.10758, "lon": 25.687644, "koodi": "6C"}]
              
    def __init__(self):
        self.tyyppi = ""
        self.dataolio = []
        self.spes_data = ""
    
    def alusta(self, ch):
        if ch == "k":
            self.tyyppi = "kilpailut"
            self.dataolio = self.kilpailut
            self.spes_data = ""
        elif ch == "s":
            self.tyyppi = "sarjat"
            self.dataolio = self.sarjat
            self.spes_data = ""
        elif ch == "r":
            self.tyyppi = "rastit"
            self.dataolio = self.rastit
            #pätee kaikille rasteille
            self.spes_data = self.kilpailut[0]["id"]
            
    def lisaaja(self):
        c = 1
        for ind in self.dataolio:

            id = ""
            if self.tyyppi == "kilpailut":
                id = str(ind["id"])
            elif self.tyyppi == "sarjat":
                id = ind["sarjanimi"]
            elif self.tyyppi == "rastit":
                id = ind["koodi"]
 
            lisattava = db.collection(self.tyyppi).document(id)
            if not self.spes_data:
                lisattava.set(ind)
            
            #===koskee vain rasteja== 
            if self.spes_data:
                ind["kilpailu"] = self.spes_data
                lisattava.set(ind)
                
            c += 1
            
