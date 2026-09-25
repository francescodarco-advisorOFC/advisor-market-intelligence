"""Genera i documenti iniziali (squadre + lega) per il database dell'artefatto.

Rose e quotazioni sono stime basate sulle rose note fino a giugno 2026:
vanno verificate e aggiornate importando il listone ufficiale dalla scheda "Dati".
"""
import json, os, re, unicodedata

TEAMS = {
 "ATA": ("Atalanta", """P Carnesecchi 16|P Sportiello 1|P Rossi F. 1|D Kossounou 8|D Djimsiti 8|D Hien 8|D Scalvini 7|D Kolasinac 7|D Bellanova 10|D Zappacosta 9|D Bernasconi 5|D Ahanor 5|C De Roon 9|C Ederson 11|C Pasalic 9|C Musah 7|C Zalewski 9|C Brescianini 6|C De Ketelaere 20|C Samardzic 8|C Maldini 8|C Sulemana K. 6|A Lookman 24|A Scamacca 18|A Krstovic 18"""),
 "BOL": ("Bologna", """P Skorupski 13|P Ravaglia 3|D Holm 6|D De Silvestri 3|D Lucumi 8|D Heggem 6|D Casale 5|D Vitik 5|D Miranda 7|D Lykogiannis 5|D Zortea 7|C Freuler 8|C Ferguson 10|C Pobega 7|C Moro 6|C Fabbian 8|C Orsolini 22|C Odgaard 10|C Cambiaghi 10|C Bernardeschi 9|C Rowe 10|A Castro 18|A Immobile 13|A Dallinga 12"""),
 "CAG": ("Cagliari", """P Caprile 12|P Ciocci 1|D Zappa 6|D Palestra 8|D Mina 6|D Luperto 5|D Rodriguez Ju. 4|D Obert 5|D Idrissi 5|D Ze Pedro 5|C Adopo 5|C Prati 5|C Deiola 5|C Folorunsho 10|C Gaetano 8|C Felici 7|C Mazzitelli 5|A Esposito S. 15|A Borrelli 12|A Belotti 10|A Kilicsoy 8|A Luvumbo 7"""),
 "COM": ("Como", """P Butez 14|P Vigorito 1|D Smolcic 6|D Kempf 7|D Ramon 7|D Diego Carlos 6|D Valle 8|D Vojvoda 6|D Van der Brempt 5|D Moreno 5|C Perrone 7|C Da Cunha 8|C Caqueret 7|C Sergi Roberto 7|C Baturina 13|C Paz 28|C Kuhn 8|C Addai 6|C Rodriguez Je. 12|A Diao 13|A Morata 15|A Douvikas 13"""),
 "FIO": ("Fiorentina", """P De Gea 16|P Martinelli 2|D Dodo 10|D Pongracic 7|D Comuzzo 7|D Ranieri 7|D Mari 5|D Gosens 10|D Parisi 7|C Fagioli 9|C Mandragora 10|C Ndour 6|C Sohm 7|C Nicolussi Caviglia 7|C Fazzini 7|C Richardson 6|A Gudmundsson A. 18|A Kean 28|A Piccoli 16|A Dzeko 12"""),
 "FRO": ("Frosinone", """P Palmisani 5|P Cerofolini 1|D Monterisi 4|D Calvani 4|D Bracaglia 3|D Oyono 4|C Calo 5|C Koutsoupias 5|C Ghedjemis 5|C Kvernadze 7|A Raimondo 9"""),
 "GEN": ("Genoa", """P Leali 11|P Siegrist 2|D Norton-Cuffy 6|D Marcandalli 5|D Vasquez 6|D Ostigard 6|D Otoa 4|D Martin 7|D Sabelli 4|C Frendrup 7|C Masini 5|C Malinovskyi 9|C Thorsby 6|C Stanciu 6|C Ellertsson 5|C Carboni V. 6|A Vitinha 11|A Colombo 11|A Ekhator 7|A Ekuban 5|A Messias 5"""),
 "INT": ("Inter", """P Sommer 16|P Martinez Jo. 10|D Bisseck 8|D Akanji 11|D Acerbi 7|D Bastoni 13|D De Vrij 6|D Dimarco 18|D Dumfries 14|D Carlos Augusto 8|D Darmian 3|D Luis Henrique 8|C Barella 15|C Calhanoglu 16|C Mkhitaryan 10|C Zielinski 8|C Frattesi 9|C Sucic 9|C Diouf 6|A Lautaro 34|A Thuram 27|A Esposito F.P. 16|A Bonny 14"""),
 "JUV": ("Juventus", """P Di Gregorio 14|P Perin 3|D Kalulu 9|D Bremer 10|D Gatti 8|D Kelly 7|D Cambiaso 12|D Cabal 7|D Joao Mario 6|C Locatelli 10|C Thuram K. 9|C McKennie 10|C Koopmeiners 11|C Zhegrova 14|C Conceicao 16|A Yildiz 30|A Vlahovic 24|A David 20|A Openda 16"""),
 "LAZ": ("Lazio", """P Provedel 13|P Mandas 5|D Marusic 7|D Lazzari 7|D Gila 9|D Romagnoli 8|D Provstgaard 4|D Tavares 10|D Pellegrini Lu. 6|D Patric 4|C Guendouzi 9|C Rovella 8|C Cataldi 6|C Vecino 5|C Dele-Bashiru 6|C Belahyane 4|C Zaccagni 18|C Isaksen 12|C Pedro 8|C Cancellieri 8|A Castellanos 17|A Dia 15|A Noslin 8"""),
 "LEC": ("Lecce", """P Falcone 13|P Fruchtl 1|D Veiga 5|D Gaspar 6|D Tiago Gabriel 5|D Siebert 4|D Gallo 6|C Coulibaly L. 6|C Ramadani 6|C Berisha M. 5|C Pierret 6|C Helgason 5|C Maleh 5|C Morente 7|C Pierotti 9|C Banda 8|A Camarda 10|A Stulic 11|A N'Dri 6"""),
 "MIL": ("Milan", """P Maignan 17|P Terracciano 3|D Tomori 7|D Gabbia 8|D Pavlovic 8|D De Winter 6|D Estupinan 8|D Bartesaghi 7|D Athekame 5|C Saelemaekers 11|C Modric 13|C Fofana 10|C Rabiot 14|C Loftus-Cheek 10|C Ricci 8|C Jashari 8|C Pulisic 26|A Leao 25|A Nkunku 17|A Gimenez 18"""),
 "MON": ("Monza", """P Thiam 4|D Izzo 5|D Birindelli 5|D Carboni A. 5|D Delli Carri 4|C Pessina 7|C Ciurria 7|A Mota 9|A Petagna 8"""),
 "NAP": ("Napoli", """P Milinkovic-Savic V. 14|P Meret 10|D Di Lorenzo 12|D Rrahmani 10|D Buongiorno 9|D Juan Jesus 4|D Beukema 8|D Olivera 8|D Spinazzola 7|D Gutierrez 7|C Lobotka 10|C Anguissa 14|C McTominay 26|C De Bruyne 22|C Gilmour 7|C Elmas 7|C Politano 12|C Lang 12|C Neres 12|A Hojlund 22|A Lukaku 16|A Lucca 12"""),
 "PAR": ("Parma", """P Suzuki 12|P Corvi 3|D Delprato 6|D Circati 6|D Valenti 5|D Britschgi 5|D Valeri 6|C Keita 7|C Bernabe 7|C Estevez 6|C Sorensen 6|C Ordonez 5|C Oristanio 6|C Almqvist 6|A Pellegrino 14|A Cutrone 10"""),
 "ROM": ("Roma", """P Svilar 18|P Gollini 2|D Celik 8|D Mancini 9|D Ndicka 9|D Hermoso 7|D Angelino 8|D Wesley 10|D Tsimikas 7|D Ghilardi 5|C Cristante 8|C Kone 9|C El Aynaoui 8|C Pellegrini Lo. 10|C Pisilli 6|C Soule 18|C El Shaarawy 7|C Baldanzi 7|A Dovbyk 14|A Ferguson E. 12|A Dybala 16|A Bailey 12"""),
 "SAS": ("Sassuolo", """P Muric 11|P Turati 4|D Walukiewicz 6|D Muharemovic 6|D Idzes 5|D Cande 5|D Doig 7|D Coulibaly W. 5|C Matic 7|C Thorstvedt 7|C Kone I. 7|C Lipani 5|C Boloca 4|C Volpato 7|A Berardi 20|A Laurienté 15|A Pinamonti 14|A Fadera 7"""),
 "TOR": ("Torino", """P Israel 10|P Paleari 8|D Pedersen 6|D Maripan 6|D Coco 6|D Ismajli 5|D Tameze 5|D Lazaro 7|D Biraghi 6|D Nkounkou 5|C Ilic 7|C Casadei 7|C Gineitis 6|C Vlasic 12|C Asllani 6|C Anjorin 5|A Simeone 12|A Zapata 12|A Adams 13|A Ngonge 10|A Aboukhlal 6"""),
 "UDI": ("Udinese", """P Okoye 12|P Sava 4|D Kristensen 6|D Solet 8|D Kabasele 5|D Zemura 6|D Zanoli 6|D Ehizibue 5|D Goglichidze 5|C Karlstrom 6|C Ekkelenkamp 7|C Atta 9|C Zarraga 5|C Lovric 6|C Piotrowski 5|A Davis 12|A Zaniolo 12|A Buksa 8|A Bayo 7|A Bravo 7"""),
 "VEN": ("Venezia", """D Haps 5|D Svoboda 5|D Sverko 4|D Candela 4|C Busio 6|C Doumbia 5|C Perez K. 5|A Yeboah 8|A Adorante 9"""),
}
LOW_CONFIDENCE = {"FRO", "MON", "VEN"}

def slug(s):
    s = unicodedata.normalize("NFD", s)
    s = "".join(c for c in s if unicodedata.category(c) != "Mn").lower()
    return re.sub(r"[^a-z0-9]+", "-", s).strip("-")

out = os.path.join(os.path.dirname(__file__), "out")
os.makedirs(out, exist_ok=True)
seen = set()
for tid, (nome, raw) in TEAMS.items():
    gioc = []
    for item in raw.split("|"):
        r, rest = item.split(" ", 1)
        name, q = rest.rsplit(" ", 1)
        pid = slug(name)
        assert pid not in seen, pid
        seen.add(pid)
        gioc.append({"id": pid, "n": name, "r": r, "q": int(q), "st": "ok", "v": {}})
    doc = {"nome": nome, "sigla": tid, "giocatori": gioc,
           "fonte": "Stima iniziale (rose note a giugno 2026): da verificare",
           "incompleta": tid in LOW_CONFIDENCE}
    json.dump(doc, open(os.path.join(out, f"squadra-{tid}.json"), "w"), ensure_ascii=False)
print(len(seen), "giocatori")
