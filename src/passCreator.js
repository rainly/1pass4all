/**
 * A password generator inspired by SuperGenPass(http://supergenpass.com)
 *
 * Copyright (c) 2012, Hui Zheng
 * License: MIT License <http://www.opensource.org/licenses/mit-license.php>
 */

var app = {
    name: "1Pass4All",
    // the following may be modified by Makefile
    version: "0.2.x",
    homeUrl: "http://hzheng.github.com/1pass4all"
};
var debug = true; // will be turned off by make

// utilities
Function.prototype.bind = function(object, moreArguments) {
    var __method__ = this;
    var prependArgs = [];
    for (var i = 1; i < arguments.length; ++i) {
        prependArgs.push(arguments[i]);
    }
    return function() {
        var args = [];
        for (var i = 0; i < prependArgs.length; ++i) {
            args.push(prependArgs[i]);
        }
        for (i = 0; i < arguments.length; ++i) {
            args.push(arguments[i]);
        }
        return __method__.apply(object, args);
    };
}; 

// auto retrieved TLD list from:
// http://mxr.mozilla.org/mozilla/source/netwerk/dns/src/effective_tld_names.dat?raw=1
var TLD_LIST = [
"ac", "com.ac", "edu.ac", "gov.ac", "net.ac", "mil.ac", "org.ac", "ad", "nom.ad", "ae", "co.ae", "net.ae", "org.ae", "sch.ae", "ac.ae", "gov.ae", "mil.ae", "aero", "accident-investigation.aero", "accident-prevention.aero", "aerobatic.aero", "aeroclub.aero", "aerodrome.aero", "agents.aero", "aircraft.aero", "airline.aero", "airport.aero", "air-surveillance.aero", "airtraffic.aero", "air-traffic-control.aero", "ambulance.aero", "amusement.aero", "association.aero", "author.aero", "ballooning.aero", "broker.aero", "caa.aero", "cargo.aero", "catering.aero", "certification.aero", "championship.aero", "charter.aero", "civilaviation.aero", "club.aero", "conference.aero", "consultant.aero", "consulting.aero", "control.aero", "council.aero", "crew.aero", "design.aero", "dgca.aero", "educator.aero", "emergency.aero", "engine.aero", "engineer.aero", "entertainment.aero", "equipment.aero", "exchange.aero", "express.aero", "federation.aero", "flight.aero", "freight.aero", "fuel.aero", "gliding.aero", "government.aero", "groundhandling.aero", "group.aero", "hanggliding.aero", "homebuilt.aero", "insurance.aero", "journal.aero", "journalist.aero", "leasing.aero", "logistics.aero", "magazine.aero", "maintenance.aero", "marketplace.aero", "media.aero", "microlight.aero", "modelling.aero", "navigation.aero", "parachuting.aero", "paragliding.aero", "passenger-association.aero", "pilot.aero", "press.aero", "production.aero", "recreation.aero", "repbody.aero", "res.aero", "research.aero", "rotorcraft.aero", "safety.aero", "scientist.aero", "services.aero", "show.aero", "skydiving.aero", "software.aero", "student.aero", "taxi.aero", "trader.aero", "trading.aero", "trainer.aero", "union.aero", "workinggroup.aero", "works.aero", "af", "gov.af", "com.af", "org.af", "net.af", "edu.af", "ag", "com.ag", "org.ag", "net.ag", "co.ag", "nom.ag", "ai", "off.ai", "com.ai", "net.ai", "org.ai", "al", "com.al", "edu.al", "gov.al", "mil.al", "net.al", "org.al", "am", "an", "com.an", "net.an", "org.an", "edu.an", "ao", "ed.ao", "gv.ao", "og.ao", "co.ao", "pb.ao", "it.ao", "aq", "com.ar", "edu.ar", "gob.ar", "gov.ar", "int.ar", "mil.ar", "net.ar", "org.ar", "tur.ar", "e164.arpa", "in-addr.arpa", "ip6.arpa", "iris.arpa", "uri.arpa", "urn.arpa", "as", "gov.as", "asia", "at", "ac.at", "co.at", "gv.at", "or.at", "biz.at", "info.at", "priv.at", "com.au", "net.au", "org.au", "edu.au", "gov.au", "csiro.au", "asn.au", "id.au", "act.edu.au", "nsw.edu.au", "nt.edu.au", "qld.edu.au", "sa.edu.au", "tas.edu.au", "vic.edu.au", "wa.edu.au", "act.gov.au", "nt.gov.au", "qld.gov.au", "sa.gov.au", "tas.gov.au", "vic.gov.au", "wa.gov.au", "aw", "com.aw", "ax", "az", "com.az", "net.az", "int.az", "gov.az", "org.az", "edu.az", "info.az", "pp.az", "mil.az", "name.az", "pro.az", "biz.az", "ba", "org.ba", "net.ba", "edu.ba", "gov.ba", "mil.ba", "unsa.ba", "unbi.ba", "co.ba", "com.ba", "rs.ba", "bb", "biz.bb", "com.bb", "edu.bb", "gov.bb", "info.bb", "net.bb", "org.bb", "store.bb", "be", "ac.be", "bf", "gov.bf", "bg", "a.bg", "b.bg", "c.bg", "d.bg", "e.bg", "f.bg", "g.bg", "h.bg", "i.bg", "j.bg", "k.bg", "l.bg", "m.bg", "n.bg", "o.bg", "p.bg", "q.bg", "r.bg", "s.bg", "t.bg", "u.bg", "v.bg", "w.bg", "x.bg", "y.bg", "z.bg", "0.bg", "1.bg", "2.bg", "3.bg", "4.bg", "5.bg", "6.bg", "7.bg", "8.bg", "9.bg", "bh", "com.bh", "bi", "co.bi", "com.bi", "edu.bi", "or.bi", "org.bi", "biz", "bj", "asso.bj", "barreau.bj", "gouv.bj", "bm", "com.bm", "edu.bm", "gov.bm", "net.bm", "org.bm", "com.bn", "edu.bn", "gov.bn", "net.bn", "org.bn", "bo", "com.bo", "edu.bo", "gov.bo", "gob.bo", "int.bo", "org.bo", "net.bo", "mil.bo", "tv.bo", "br", "adm.br", "adv.br", "agr.br", "am.br", "arq.br", "art.br", "ato.br", "bio.br", "blog.br", "bmd.br", "can.br", "cim.br", "cng.br", "cnt.br", "com.br", "coop.br", "ecn.br", "edu.br", "eng.br", "esp.br", "etc.br", "eti.br", "far.br", "flog.br", "fm.br", "fnd.br", "fot.br", "fst.br", "g12.br", "ggf.br", "gov.br", "imb.br", "ind.br", "inf.br", "jor.br", "jus.br", "lel.br", "mat.br", "med.br", "mil.br", "mus.br", "net.br", "nom.br", "not.br", "ntr.br", "odo.br", "org.br", "ppg.br", "pro.br", "psc.br", "psi.br", "qsl.br", "rec.br", "slg.br", "srv.br", "tmp.br", "trd.br", "tur.br", "tv.br", "vet.br", "vlog.br", "wiki.br", "zlg.br", "bs", "com.bs", "net.bs", "org.bs", "edu.bs", "gov.bs", "bw", "co.bw", "org.bw", "by", "gov.by", "mil.by", "com.by", "of.by", "bz", "com.bz", "net.bz", "org.bz", "edu.bz", "gov.bz", "ca", "ab.ca", "bc.ca", "mb.ca", "nb.ca", "nf.ca", "nl.ca", "ns.ca", "nt.ca", "nu.ca", "on.ca", "pe.ca", "qc.ca", "sk.ca", "yk.ca", "gc.ca", "cat", "cc", "cd", "gov.cd", "cf", "cg", "ch", "ci", "org.ci", "or.ci", "com.ci", "co.ci", "edu.ci", "ed.ci", "ac.ci", "net.ci", "go.ci", "asso.ci", "aéroport.ci", "int.ci", "presse.ci", "md.ci", "gouv.ci", "co.ck", "org.ck", "edu.ck", "gov.ck", "net.ck", "gen.ck", "biz.ck", "info.ck", "cl", "gov.cl", "gob.cl", "cm", "gov.cm", "cn", "ac.cn", "com.cn", "edu.cn", "gov.cn", "net.cn", "org.cn", "mil.cn", "公司.cn", "网络.cn", "網絡.cn", "ah.cn", "bj.cn", "cq.cn", "fj.cn", "gd.cn", "gs.cn", "gz.cn", "gx.cn", "ha.cn", "hb.cn", "he.cn", "hi.cn", "hl.cn", "hn.cn", "jl.cn", "js.cn", "jx.cn", "ln.cn", "nm.cn", "nx.cn", "qh.cn", "sc.cn", "sd.cn", "sh.cn", "sn.cn", "sx.cn", "tj.cn", "xj.cn", "xz.cn", "yn.cn", "zj.cn", "hk.cn", "mo.cn", "tw.cn", "co", "arts.co", "com.co", "edu.co", "firm.co", "gov.co", "info.co", "int.co", "mil.co", "net.co", "nom.co", "org.co", "rec.co", "web.co", "com", "ar.com", "br.com", "cn.com", "de.com", "eu.com", "gb.com", "hu.com", "jpn.com", "kr.com", "no.com", "qc.com", "ru.com", "sa.com", "se.com", "uk.com", "us.com", "uy.com", "za.com", "operaunite.com", "coop", "cr", "ac.cr", "co.cr", "ed.cr", "fi.cr", "go.cr", "or.cr", "sa.cr", "cu", "com.cu", "edu.cu", "org.cu", "net.cu", "gov.cu", "inf.cu", "cv", "cx", "gov.cx", "ac.cy", "net.cy", "gov.cy", "org.cy", "pro.cy", "name.cy", "ekloges.cy", "tm.cy", "ltd.cy", "biz.cy", "press.cy", "parliament.cy", "com.cy", "cz", "de", "dj", "dk", "dm", "com.dm", "net.dm", "org.dm", "edu.dm", "gov.dm", "do", "art.do", "com.do", "edu.do", "gob.do", "gov.do", "mil.do", "net.do", "org.do", "sld.do", "web.do", "dz", "com.dz", "org.dz", "net.dz", "gov.dz", "edu.dz", "asso.dz", "pol.dz", "art.dz", "ec", "com.ec", "info.ec", "net.ec", "fin.ec", "k12.ec", "med.ec", "pro.ec", "org.ec", "edu.ec", "gov.ec", "mil.ec", "edu", "ee", "edu.ee", "gov.ee", "riik.ee", "lib.ee", "med.ee", "com.ee", "pri.ee", "aip.ee", "org.ee", "fie.ee", "com.eg", "edu.eg", "eun.eg", "gov.eg", "mil.eg", "name.eg", "net.eg", "org.eg", "sci.eg", "com.er", "edu.er", "gov.er", "mil.er", "net.er", "org.er", "ind.er", "es", "com.es", "nom.es", "org.es", "gob.es", "edu.es", "com.et", "gov.et", "org.et", "edu.et", "net.et", "biz.et", "name.et", "info.et", "eu", "fi", "aland.fi", "iki.fi", "ac.fj", "biz.fj", "com.fj", "info.fj", "mil.fj", "name.fj", "net.fj", "org.fj", "pro.fj", "co.fk", "org.fk", "gov.fk", "ac.fk", "nom.fk", "net.fk", "fm", "fo", "fr", "com.fr", "asso.fr", "nom.fr", "prd.fr", "presse.fr", "tm.fr", "aeroport.fr", "assedic.fr", "avocat.fr", "avoues.fr", "cci.fr", "chambagri.fr", "chirurgiens-dentistes.fr", "experts-comptables.fr", "geometre-expert.fr", "gouv.fr", "greta.fr", "huissier-justice.fr", "medecin.fr", "notaires.fr", "pharmacien.fr", "port.fr", "veterinaire.fr", "ga", "gd", "ge", "com.ge", "edu.ge", "gov.ge", "org.ge", "mil.ge", "net.ge", "pvt.ge", "gf", "gg", "co.gg", "org.gg", "net.gg", "sch.gg", "gov.gg", "gh", "com.gh", "edu.gh", "gov.gh", "org.gh", "mil.gh", "gi", "com.gi", "ltd.gi", "gov.gi", "mod.gi", "edu.gi", "org.gi", "gl", "gm", "ac.gn", "com.gn", "edu.gn", "gov.gn", "org.gn", "net.gn", "gov", "gp", "com.gp", "net.gp", "mobi.gp", "edu.gp", "org.gp", "asso.gp", "gq", "gr", "com.gr", "edu.gr", "net.gr", "org.gr", "gov.gr", "gs", "com.gt", "edu.gt", "net.gt", "gob.gt", "org.gt", "mil.gt", "ind.gt", "com.gu", "net.gu", "gov.gu", "org.gu", "edu.gu", "gw", "gy", "co.gy", "com.gy", "net.gy", "hk", "com.hk", "edu.hk", "gov.hk", "idv.hk", "net.hk", "org.hk", "公司.hk", "教育.hk", "敎育.hk", "政府.hk", "個人.hk", "个人.hk", "箇人.hk", "網络.hk", "网络.hk", "组織.hk", "網絡.hk", "网絡.hk", "组织.hk", "組織.hk", "組织.hk", "hm", "hn", "com.hn", "edu.hn", "org.hn", "net.hn", "mil.hn", "gob.hn", "hr", "iz.hr", "from.hr", "name.hr", "com.hr", "ht", "com.ht", "shop.ht", "firm.ht", "info.ht", "adult.ht", "net.ht", "pro.ht", "org.ht", "med.ht", "art.ht", "coop.ht", "pol.ht", "asso.ht", "edu.ht", "rel.ht", "gouv.ht", "perso.ht", "hu", "co.hu", "info.hu", "org.hu", "priv.hu", "sport.hu", "tm.hu", "2000.hu", "agrar.hu", "bolt.hu", "casino.hu", "city.hu", "erotica.hu", "erotika.hu", "film.hu", "forum.hu", "games.hu", "hotel.hu", "ingatlan.hu", "jogasz.hu", "konyvelo.hu", "lakas.hu", "media.hu", "news.hu", "reklam.hu", "sex.hu", "shop.hu", "suli.hu", "szex.hu", "tozsde.hu", "utazas.hu", "video.hu", "ac.id", "co.id", "net.id", "or.id", "web.id", "sch.id", "mil.id", "go.id", "ie", "gov.ie", "ac.il", "co.il", "org.il", "net.il", "k12.il", "gov.il", "muni.il", "idf.il", "im", "co.im", "ltd.co.im", "plc.co.im", "net.im", "gov.im", "org.im", "nic.im", "ac.im", "in", "co.in", "firm.in", "net.in", "org.in", "gen.in", "ind.in", "nic.in", "ac.in", "edu.in", "res.in", "gov.in", "mil.in", "info", "int", "eu.int", "io", "com.io", "iq", "gov.iq", "edu.iq", "mil.iq", "com.iq", "org.iq", "net.iq", "ir", "ac.ir", "co.ir", "gov.ir", "id.ir", "net.ir", "org.ir", "sch.ir", "is", "net.is", "com.is", "edu.is", "gov.is", "org.is", "int.is", "it", "gov.it", "edu.it", "agrigento.it", "ag.it", "alessandria.it", "al.it", "ancona.it", "an.it", "aosta.it", "aoste.it", "ao.it", "arezzo.it", "ar.it", "ascoli-piceno.it", "ascolipiceno.it", "ap.it", "asti.it", "at.it", "avellino.it", "av.it", "bari.it", "ba.it", "barlettaandriatrani.it", "barletta-andria-trani.it", "belluno.it", "bl.it", "benevento.it", "bn.it", "bergamo.it", "bg.it", "biella.it", "bi.it", "bologna.it", "bo.it", "bolzano.it", "bozen.it", "balsan.it", "alto-adige.it", "altoadige.it", "suedtirol.it", "bz.it", "brescia.it", "bs.it", "brindisi.it", "br.it", "cagliari.it", "ca.it", "caltanissetta.it", "cl.it", "campobasso.it", "cb.it", "caserta.it", "ce.it", "catania.it", "ct.it", "catanzaro.it", "cz.it", "chieti.it", "ch.it", "como.it", "co.it", "cosenza.it", "cs.it", "cremona.it", "cr.it", "crotone.it", "kr.it", "cuneo.it", "cn.it", "enna.it", "en.it", "fermo.it", "ferrara.it", "fe.it", "firenze.it", "florence.it", "fi.it", "foggia.it", "fg.it", "forli-cesena.it", "forlicesena.it", "fc.it", "frosinone.it", "fr.it", "genova.it", "genoa.it", "ge.it", "gorizia.it", "go.it", "grosseto.it", "gr.it", "imperia.it", "im.it", "isernia.it", "is.it", "laquila.it", "aquila.it", "aq.it", "la-spezia.it", "laspezia.it", "sp.it", "latina.it", "lt.it", "lecce.it", "le.it", "lecco.it", "lc.it", "livorno.it", "li.it", "lodi.it", "lo.it", "lucca.it", "lu.it", "macerata.it", "mc.it", "mantova.it", "mn.it", "massa-carrara.it", "massacarrara.it", "ms.it", "matera.it", "mt.it", "messina.it", "me.it", "milano.it", "milan.it", "mi.it", "modena.it", "mo.it", "monza.it", "napoli.it", "naples.it", "na.it", "novara.it", "no.it", "nuoro.it", "nu.it", "oristano.it", "or.it", "padova.it", "padua.it", "pd.it", "palermo.it", "pa.it", "parma.it", "pr.it", "pavia.it", "pv.it", "perugia.it", "pg.it", "pescara.it", "pe.it", "pesaro-urbino.it", "pesarourbino.it", "pu.it", "piacenza.it", "pc.it", "pisa.it", "pi.it", "pistoia.it", "pt.it", "pordenone.it", "pn.it", "potenza.it", "pz.it", "prato.it", "po.it", "ragusa.it", "rg.it", "ravenna.it", "ra.it", "reggio-calabria.it", "reggiocalabria.it", "rc.it", "reggio-emilia.it", "reggioemilia.it", "re.it", "rieti.it", "ri.it", "rimini.it", "rn.it", "roma.it", "rome.it", "rm.it", "rovigo.it", "ro.it", "salerno.it", "sa.it", "sassari.it", "ss.it", "savona.it", "sv.it", "siena.it", "si.it", "siracusa.it", "sr.it", "sondrio.it", "so.it", "taranto.it", "ta.it", "teramo.it", "te.it", "terni.it", "tr.it", "torino.it", "turin.it", "to.it", "trapani.it", "tp.it", "trento.it", "trentino.it", "tn.it", "treviso.it", "tv.it", "trieste.it", "ts.it", "udine.it", "ud.it", "varese.it", "va.it", "venezia.it", "venice.it", "ve.it", "verbania.it", "vb.it", "vercelli.it", "vc.it", "verona.it", "vr.it", "vibo-valentia.it", "vibovalentia.it", "vv.it", "vicenza.it", "vi.it", "viterbo.it", "vt.it", "je", "co.je", "org.je", "net.je", "sch.je", "gov.je", "com.jm", "net.jm", "org.jm", "edu.jm", "gov.jm", "mil.jm", "jo", "com.jo", "org.jo", "net.jo", "edu.jo", "sch.jo", "gov.jo", "mil.jo", "name.jo", "jobs", "jp", "ac.jp", "ad.jp", "co.jp", "ed.jp", "go.jp", "gr.jp", "lg.jp", "ne.jp", "or.jp", "co.ke", "or.ke", "ne.ke", "go.ke", "ac.ke", "sc.ke", "me.ke", "mobi.ke", "info.ke", "kg", "org.kg", "net.kg", "com.kg", "edu.kg", "gov.kg", "mil.kg", "per.kh", "com.kh", "edu.kh", "gov.kh", "mil.kh", "net.kh", "org.kh", "ki", "edu.ki", "biz.ki", "net.ki", "org.ki", "gov.ki", "info.ki", "com.ki", "km", "org.km", "nom.km", "gov.km", "prd.km", "tm.km", "edu.km", "mil.km", "ass.km", "com.km", "coop.km", "asso.km", "presse.km", "medecin.km", "notaires.km", "pharmaciens.km", "veterinaire.km", "gouv.km", "kn", "net.kn", "org.kn", "edu.kn", "gov.kn", "kr", "ac.kr", "co.kr", "es.kr", "go.kr", "hs.kr", "kg.kr", "mil.kr", "ms.kr", "ne.kr", "or.kr", "pe.kr", "re.kr", "sc.kr", "busan.kr", "chungbuk.kr", "chungnam.kr", "daegu.kr", "daejeon.kr", "gangwon.kr", "gwangju.kr", "gyeongbuk.kr", "gyeonggi.kr", "gyeongnam.kr", "incheon.kr", "jeju.kr", "jeonbuk.kr", "jeonnam.kr", "seoul.kr", "ulsan.kr", "edu.kw", "com.kw", "net.kw", "org.kw", "gov.kw", "ky", "edu.ky", "gov.ky", "com.ky", "org.ky", "net.ky", "kz", "org.kz", "edu.kz", "net.kz", "gov.kz", "mil.kz", "com.kz", "la", "int.la", "net.la", "info.la", "edu.la", "gov.la", "per.la", "com.la", "org.la", "c.la", "com.lb", "edu.lb", "gov.lb", "net.lb", "org.lb", "lc", "com.lc", "net.lc", "co.lc", "org.lc", "edu.lc", "gov.lc", "li", "lk", "gov.lk", "sch.lk", "net.lk", "int.lk", "com.lk", "org.lk", "edu.lk", "ngo.lk", "soc.lk", "web.lk", "ltd.lk", "assn.lk", "grp.lk", "hotel.lk", "local", "com.lr", "edu.lr", "gov.lr", "org.lr", "net.lr", "ls", "co.ls", "org.ls", "lt", "gov.lt", "lu", "lv", "com.lv", "edu.lv", "gov.lv", "org.lv", "mil.lv", "id.lv", "net.lv", "asn.lv", "conf.lv", "ly", "com.ly", "net.ly", "gov.ly", "plc.ly", "edu.ly", "sch.ly", "med.ly", "org.ly", "id.ly", "ma", "co.ma", "net.ma", "gov.ma", "org.ma", "ac.ma", "press.ma", "mc", "tm.mc", "asso.mc", "md", "me", "co.me", "net.me", "org.me", "edu.me", "ac.me", "gov.me", "its.me", "priv.me", "mg", "org.mg", "nom.mg", "gov.mg", "prd.mg", "tm.mg", "edu.mg", "mil.mg", "com.mg", "mh", "mil", "mk", "com.mk", "org.mk", "net.mk", "edu.mk", "gov.mk", "inf.mk", "name.mk", "ml", "com.ml", "edu.ml", "gouv.ml", "gov.ml", "net.ml", "org.ml", "presse.ml", "mn", "gov.mn", "edu.mn", "org.mn", "mo", "com.mo", "net.mo", "org.mo", "edu.mo", "gov.mo", "mobi", "mp", "mq", "mr", "gov.mr", "ms", "com.mt", "org.mt", "net.mt", "edu.mt", "gov.mt", "mu", "com.mu", "net.mu", "org.mu", "gov.mu", "ac.mu", "co.mu", "or.mu", "museum", "academy.museum", "agriculture.museum", "air.museum", "airguard.museum", "alabama.museum", "alaska.museum", "amber.museum", "ambulance.museum", "american.museum", "americana.museum", "americanantiques.museum", "americanart.museum", "amsterdam.museum", "and.museum", "annefrank.museum", "anthro.museum", "anthropology.museum", "antiques.museum", "aquarium.museum", "arboretum.museum", "archaeological.museum", "archaeology.museum", "architecture.museum", "art.museum", "artanddesign.museum", "artcenter.museum", "artdeco.museum", "arteducation.museum", "artgallery.museum", "arts.museum", "artsandcrafts.museum", "asmatart.museum", "assassination.museum", "assisi.museum", "association.museum", "astronomy.museum", "atlanta.museum", "austin.museum", "australia.museum", "automotive.museum", "aviation.museum", "axis.museum", "badajoz.museum", "baghdad.museum", "bahn.museum", "bale.museum", "baltimore.museum", "barcelona.museum", "baseball.museum", "basel.museum", "baths.museum", "bauern.museum", "beauxarts.museum", "beeldengeluid.museum", "bellevue.museum", "bergbau.museum", "berkeley.museum", "berlin.museum", "bern.museum", "bible.museum", "bilbao.museum", "bill.museum", "birdart.museum", "birthplace.museum", "bonn.museum", "boston.museum", "botanical.museum", "botanicalgarden.museum", "botanicgarden.museum", "botany.museum", "brandywinevalley.museum", "brasil.museum", "bristol.museum", "british.museum", "britishcolumbia.museum", "broadcast.museum", "brunel.museum", "brussel.museum", "brussels.museum", "bruxelles.museum", "building.museum", "burghof.museum", "bus.museum", "bushey.museum", "cadaques.museum", "california.museum", "cambridge.museum", "can.museum", "canada.museum", "capebreton.museum", "carrier.museum", "cartoonart.museum", "casadelamoneda.museum", "castle.museum", "castres.museum", "celtic.museum", "center.museum", "chattanooga.museum", "cheltenham.museum", "chesapeakebay.museum", "chicago.museum", "children.museum", "childrens.museum", "childrensgarden.museum", "chiropractic.museum", "chocolate.museum", "christiansburg.museum", "cincinnati.museum", "cinema.museum", "circus.museum", "civilisation.museum", "civilization.museum", "civilwar.museum", "clinton.museum", "clock.museum", "coal.museum", "coastaldefence.museum", "cody.museum", "coldwar.museum", "collection.museum", "colonialwilliamsburg.museum", "coloradoplateau.museum", "columbia.museum", "columbus.museum", "communication.museum", "communications.museum", "community.museum", "computer.museum", "computerhistory.museum", "comunicações.museum", "contemporary.museum", "contemporaryart.museum", "convent.museum", "copenhagen.museum", "corporation.museum", "correios-e-telecomunicações.museum", "corvette.museum", "costume.museum", "countryestate.museum", "county.museum", "crafts.museum", "cranbrook.museum", "creation.museum", "cultural.museum", "culturalcenter.museum", "culture.museum", "cyber.museum", "cymru.museum", "dali.museum", "dallas.museum", "database.museum", "ddr.museum", "decorativearts.museum", "delaware.museum", "delmenhorst.museum", "denmark.museum", "depot.museum", "design.museum", "detroit.museum", "dinosaur.museum", "discovery.museum", "dolls.museum", "donostia.museum", "durham.museum", "eastafrica.museum", "eastcoast.museum", "education.museum", "educational.museum", "egyptian.museum", "eisenbahn.museum", "elburg.museum", "elvendrell.museum", "embroidery.museum", "encyclopedic.museum", "england.museum", "entomology.museum", "environment.museum", "environmentalconservation.museum", "epilepsy.museum", "essex.museum", "estate.museum", "ethnology.museum", "exeter.museum", "exhibition.museum", "family.museum", "farm.museum", "farmequipment.museum", "farmers.museum", "farmstead.museum", "field.museum", "figueres.museum", "filatelia.museum", "film.museum", "fineart.museum", "finearts.museum", "finland.museum", "flanders.museum", "florida.museum", "force.museum", "fortmissoula.museum", "fortworth.museum", "foundation.museum", "francaise.museum", "frankfurt.museum", "franziskaner.museum", "freemasonry.museum", "freiburg.museum", "fribourg.museum", "frog.museum", "fundacio.museum", "furniture.museum", "gallery.museum", "garden.museum", "gateway.museum", "geelvinck.museum", "gemological.museum", "geology.museum", "georgia.museum", "giessen.museum", "glas.museum", "glass.museum", "gorge.museum", "grandrapids.museum", "graz.museum", "guernsey.museum", "halloffame.museum", "hamburg.museum", "handson.museum", "harvestcelebration.museum", "hawaii.museum", "health.museum", "heimatunduhren.museum", "hellas.museum", "helsinki.museum", "hembygdsforbund.museum", "heritage.museum", "histoire.museum", "historical.museum", "historicalsociety.museum", "historichouses.museum", "historisch.museum", "historisches.museum", "history.museum", "historyofscience.museum", "horology.museum", "house.museum", "humanities.museum", "illustration.museum", "imageandsound.museum", "indian.museum", "indiana.museum", "indianapolis.museum", "indianmarket.museum", "intelligence.museum", "interactive.museum", "iraq.museum", "iron.museum", "isleofman.museum", "jamison.museum", "jefferson.museum", "jerusalem.museum", "jewelry.museum", "jewish.museum", "jewishart.museum", "jfk.museum", "journalism.museum", "judaica.museum", "judygarland.museum", "juedisches.museum", "juif.museum", "karate.museum", "karikatur.museum", "kids.museum", "koebenhavn.museum", "koeln.museum", "kunst.museum", "kunstsammlung.museum", "kunstunddesign.museum", "labor.museum", "labour.museum", "lajolla.museum", "lancashire.museum", "landes.museum", "lans.museum", "läns.museum", "larsson.museum", "lewismiller.museum", "lincoln.museum", "linz.museum", "living.museum", "livinghistory.museum", "localhistory.museum", "london.museum", "losangeles.museum", "louvre.museum", "loyalist.museum", "lucerne.museum", "luxembourg.museum", "luzern.museum", "mad.museum", "madrid.museum", "mallorca.museum", "manchester.museum", "mansion.museum", "mansions.museum", "manx.museum", "marburg.museum", "maritime.museum", "maritimo.museum", "maryland.museum", "marylhurst.museum", "media.museum", "medical.museum", "medizinhistorisches.museum", "meeres.museum", "memorial.museum", "mesaverde.museum", "michigan.museum", "midatlantic.museum", "military.museum", "mill.museum", "miners.museum", "mining.museum", "minnesota.museum", "missile.museum", "missoula.museum", "modern.museum", "moma.museum", "money.museum", "monmouth.museum", "monticello.museum", "montreal.museum", "moscow.museum", "motorcycle.museum", "muenchen.museum", "muenster.museum", "mulhouse.museum", "muncie.museum", "museet.museum", "museumcenter.museum", "museumvereniging.museum", "music.museum", "national.museum", "nationalfirearms.museum", "nationalheritage.museum", "nativeamerican.museum", "naturalhistory.museum", "naturalhistorymuseum.museum", "naturalsciences.museum", "nature.museum", "naturhistorisches.museum", "natuurwetenschappen.museum", "naumburg.museum", "naval.museum", "nebraska.museum", "neues.museum", "newhampshire.museum", "newjersey.museum", "newmexico.museum", "newport.museum", "newspaper.museum", "newyork.museum", "niepce.museum", "norfolk.museum", "north.museum", "nrw.museum", "nuernberg.museum", "nuremberg.museum", "nyc.museum", "nyny.museum", "oceanographic.museum", "oceanographique.museum", "omaha.museum", "online.museum", "ontario.museum", "openair.museum", "oregon.museum", "oregontrail.museum", "otago.museum", "oxford.museum", "pacific.museum", "paderborn.museum", "palace.museum", "paleo.museum", "palmsprings.museum", "panama.museum", "paris.museum", "pasadena.museum", "pharmacy.museum", "philadelphia.museum", "philadelphiaarea.museum", "philately.museum", "phoenix.museum", "photography.museum", "pilots.museum", "pittsburgh.museum", "planetarium.museum", "plantation.museum", "plants.museum", "plaza.museum", "portal.museum", "portland.museum", "portlligat.museum", "posts-and-telecommunications.museum", "preservation.museum", "presidio.museum", "press.museum", "project.museum", "public.museum", "pubol.museum", "quebec.museum", "railroad.museum", "railway.museum", "research.museum", "resistance.museum", "riodejaneiro.museum", "rochester.museum", "rockart.museum", "roma.museum", "russia.museum", "saintlouis.museum", "salem.museum", "salvadordali.museum", "salzburg.museum", "sandiego.museum", "sanfrancisco.museum", "santabarbara.museum", "santacruz.museum", "santafe.museum", "saskatchewan.museum", "satx.museum", "savannahga.museum", "schlesisches.museum", "schoenbrunn.museum", "schokoladen.museum", "school.museum", "schweiz.museum", "science.museum", "scienceandhistory.museum", "scienceandindustry.museum", "sciencecenter.museum", "sciencecenters.museum", "science-fiction.museum", "sciencehistory.museum", "sciences.museum", "sciencesnaturelles.museum", "scotland.museum", "seaport.museum", "settlement.museum", "settlers.museum", "shell.museum", "sherbrooke.museum", "sibenik.museum", "silk.museum", "ski.museum", "skole.museum", "society.museum", "sologne.museum", "soundandvision.museum", "southcarolina.museum", "southwest.museum", "space.museum", "spy.museum", "square.museum", "stadt.museum", "stalbans.museum", "starnberg.museum", "state.museum", "stateofdelaware.museum", "station.museum", "steam.museum", "steiermark.museum", "stjohn.museum", "stockholm.museum", "stpetersburg.museum", "stuttgart.museum", "suisse.museum", "surgeonshall.museum", "surrey.museum", "svizzera.museum", "sweden.museum", "sydney.museum", "tank.museum", "tcm.museum", "technology.museum", "telekommunikation.museum", "television.museum", "texas.museum", "textile.museum", "theater.museum", "time.museum", "timekeeping.museum", "topology.museum", "torino.museum", "touch.museum", "town.museum", "transport.museum", "tree.museum", "trolley.museum", "trust.museum", "trustee.museum", "uhren.museum", "ulm.museum", "undersea.museum", "university.museum", "usa.museum", "usantiques.museum", "usarts.museum", "uscountryestate.museum", "usculture.museum", "usdecorativearts.museum", "usgarden.museum", "ushistory.museum", "ushuaia.museum", "uslivinghistory.museum", "utah.museum", "uvic.museum", "valley.museum", "vantaa.museum", "versailles.museum", "viking.museum", "village.museum", "virginia.museum", "virtual.museum", "virtuel.museum", "vlaanderen.museum", "volkenkunde.museum", "wales.museum", "wallonie.museum", "war.museum", "washingtondc.museum", "watchandclock.museum", "watch-and-clock.museum", "western.museum", "westfalen.museum", "whaling.museum", "wildlife.museum", "williamsburg.museum", "windmill.museum", "workshop.museum", "york.museum", "yorkshire.museum", "yosemite.museum", "youth.museum", "zoological.museum", "zoology.museum", "ירושלים.museum", "иком.museum", "mv", "aero.mv", "biz.mv", "com.mv", "coop.mv", "edu.mv", "gov.mv", "info.mv", "int.mv", "mil.mv", "museum.mv", "name.mv", "net.mv", "org.mv", "pro.mv", "mw", "ac.mw", "biz.mw", "co.mw", "com.mw", "coop.mw", "edu.mw", "gov.mw", "int.mw", "museum.mw", "net.mw", "org.mw", "mx", "com.mx", "org.mx", "gob.mx", "edu.mx", "net.mx", "my", "com.my", "net.my", "org.my", "gov.my", "edu.my", "mil.my", "name.my", "adv.mz", "ac.mz", "co.mz", "org.mz", "gov.mz", "edu.mz", "na", "info.na", "pro.na", "name.na", "school.na", "or.na", "dr.na", "us.na", "mx.na", "ca.na", "in.na", "cc.na", "tv.na", "ws.na", "mobi.na", "co.na", "com.na", "org.na", "name", "nc", "asso.nc", "ne", "net", "gb.net", "se.net", "uk.net", "za.net", "nf", "com.nf", "net.nf", "per.nf", "rec.nf", "web.nf", "arts.nf", "firm.nf", "info.nf", "other.nf", "store.nf", "ac.ng", "com.ng", "edu.ng", "gov.ng", "net.ng", "org.ng", "gob.ni", "co.ni", "com.ni", "ac.ni", "edu.ni", "org.ni", "nom.ni", "net.ni", "mil.ni", "nl", "no", "fhs.no", "vgs.no", "fylkesbibl.no", "folkebibl.no", "museum.no", "idrett.no", "priv.no", "mil.no", "stat.no", "dep.no", "kommune.no", "herad.no", "aa.no", "ah.no", "bu.no", "fm.no", "hl.no", "hm.no", "jan-mayen.no", "mr.no", "nl.no", "nt.no", "of.no", "ol.no", "oslo.no", "rl.no", "sf.no", "st.no", "svalbard.no", "tm.no", "tr.no", "va.no", "vf.no", "gs.aa.no", "gs.ah.no", "gs.bu.no", "gs.fm.no", "gs.hl.no", "gs.hm.no", "gs.jan-mayen.no", "gs.mr.no", "gs.nl.no", "gs.nt.no", "gs.of.no", "gs.ol.no", "gs.oslo.no", "gs.rl.no", "gs.sf.no", "gs.st.no", "gs.svalbard.no", "gs.tm.no", "gs.tr.no", "gs.va.no", "gs.vf.no", "akrehamn.no", "åkrehamn.no", "algard.no", "ålgård.no", "arna.no", "brumunddal.no", "bryne.no", "bronnoysund.no", "brønnøysund.no", "drobak.no", "drøbak.no", "egersund.no", "fetsund.no", "floro.no", "florø.no", "fredrikstad.no", "hokksund.no", "honefoss.no", "hønefoss.no", "jessheim.no", "jorpeland.no", "jørpeland.no", "kirkenes.no", "kopervik.no", "krokstadelva.no", "langevag.no", "langevåg.no", "leirvik.no", "mjondalen.no", "mjøndalen.no", "mo-i-rana.no", "mosjoen.no", "mosjøen.no", "nesoddtangen.no", "orkanger.no", "osoyro.no", "osøyro.no", "raholt.no", "råholt.no", "sandnessjoen.no", "sandnessjøen.no", "skedsmokorset.no", "slattum.no", "spjelkavik.no", "stathelle.no", "stavern.no", "stjordalshalsen.no", "stjørdalshalsen.no", "tananger.no", "tranby.no", "vossevangen.no", "afjord.no", "åfjord.no", "agdenes.no", "al.no", "ål.no", "alesund.no", "ålesund.no", "alstahaug.no", "alta.no", "áltá.no", "alaheadju.no", "álaheadju.no", "alvdal.no", "amli.no", "åmli.no", "amot.no", "åmot.no", "andebu.no", "andoy.no", "andøy.no", "andasuolo.no", "ardal.no", "årdal.no", "aremark.no", "arendal.no", "ås.no", "aseral.no", "åseral.no", "asker.no", "askim.no", "askvoll.no", "askoy.no", "askøy.no", "asnes.no", "åsnes.no", "audnedaln.no", "aukra.no", "aure.no", "aurland.no", "aurskog-holand.no", "aurskog-høland.no", "austevoll.no", "austrheim.no", "averoy.no", "averøy.no", "balestrand.no", "ballangen.no", "balat.no", "bálát.no", "balsfjord.no", "bahccavuotna.no", "báhccavuotna.no", "bamble.no", "bardu.no", "beardu.no", "beiarn.no", "bajddar.no", "bájddar.no", "baidar.no", "báidár.no", "berg.no", "bergen.no", "berlevag.no", "berlevåg.no", "bearalvahki.no", "bearalváhki.no", "bindal.no", "birkenes.no", "bjarkoy.no", "bjarkøy.no", "bjerkreim.no", "bjugn.no", "bodo.no", "bodø.no", "badaddja.no", "bådåddjå.no", "budejju.no", "bokn.no", "bremanger.no", "bronnoy.no", "brønnøy.no", "bygland.no", "bykle.no", "barum.no", "bærum.no", "bo.telemark.no", "bø.telemark.no", "bo.nordland.no", "bø.nordland.no", "bievat.no", "bievát.no", "bomlo.no", "bømlo.no", "batsfjord.no", "båtsfjord.no", "bahcavuotna.no", "báhcavuotna.no", "dovre.no", "drammen.no", "drangedal.no", "dyroy.no", "dyrøy.no", "donna.no", "dønna.no", "eid.no", "eidfjord.no", "eidsberg.no", "eidskog.no", "eidsvoll.no", "eigersund.no", "elverum.no", "enebakk.no", "engerdal.no", "etne.no", "etnedal.no", "evenes.no", "evenassi.no", "evenášši.no", "evje-og-hornnes.no", "farsund.no", "fauske.no", "fuossko.no", "fuoisku.no", "fedje.no", "fet.no", "finnoy.no", "finnøy.no", "fitjar.no", "fjaler.no", "fjell.no", "flakstad.no", "flatanger.no", "flekkefjord.no", "flesberg.no", "flora.no", "fla.no", "flå.no", "folldal.no", "forsand.no", "fosnes.no", "frei.no", "frogn.no", "froland.no", "frosta.no", "frana.no", "fræna.no", "froya.no", "frøya.no", "fusa.no", "fyresdal.no", "forde.no", "førde.no", "gamvik.no", "gangaviika.no", "gáŋgaviika.no", "gaular.no", "gausdal.no", "gildeskal.no", "gildeskål.no", "giske.no", "gjemnes.no", "gjerdrum.no", "gjerstad.no", "gjesdal.no", "gjovik.no", "gjøvik.no", "gloppen.no", "gol.no", "gran.no", "grane.no", "granvin.no", "gratangen.no", "grimstad.no", "grong.no", "kraanghke.no", "kråanghke.no", "grue.no", "gulen.no", "hadsel.no", "halden.no", "halsa.no", "hamar.no", "hamaroy.no", "habmer.no", "hábmer.no", "hapmir.no", "hápmir.no", "hammerfest.no", "hammarfeasta.no", "hámmárfeasta.no", "haram.no", "hareid.no", "harstad.no", "hasvik.no", "aknoluokta.no", "ákŋoluokta.no", "hattfjelldal.no", "aarborte.no", "haugesund.no", "hemne.no", "hemnes.no", "hemsedal.no", "heroy.more-og-romsdal.no", "herøy.møre-og-romsdal.no", "heroy.nordland.no", "herøy.nordland.no", "hitra.no", "hjartdal.no", "hjelmeland.no", "hobol.no", "hobøl.no", "hof.no", "hol.no", "hole.no", "holmestrand.no", "holtalen.no", "holtålen.no", "hornindal.no", "horten.no", "hurdal.no", "hurum.no", "hvaler.no", "hyllestad.no", "hagebostad.no", "hægebostad.no", "hoyanger.no", "høyanger.no", "hoylandet.no", "høylandet.no", "ha.no", "hå.no", "ibestad.no", "inderoy.no", "inderøy.no", "iveland.no", "jevnaker.no", "jondal.no", "jolster.no", "jølster.no", "karasjok.no", "karasjohka.no", "kárášjohka.no", "karlsoy.no", "galsa.no", "gálsá.no", "karmoy.no", "karmøy.no", "kautokeino.no", "guovdageaidnu.no", "klepp.no", "klabu.no", "klæbu.no", "kongsberg.no", "kongsvinger.no", "kragero.no", "kragerø.no", "kristiansand.no", "kristiansund.no", "krodsherad.no", "krødsherad.no", "kvalsund.no", "rahkkeravju.no", "ráhkkerávju.no", "kvam.no", "kvinesdal.no", "kvinnherad.no", "kviteseid.no", "kvitsoy.no", "kvitsøy.no", "kvafjord.no", "kvæfjord.no", "giehtavuoatna.no", "kvanangen.no", "kvænangen.no", "navuotna.no", "návuotna.no", "kafjord.no", "kåfjord.no", "gaivuotna.no", "gáivuotna.no", "larvik.no", "lavangen.no", "lavagis.no", "loabat.no", "loabát.no", "lebesby.no", "davvesiida.no", "leikanger.no", "leirfjord.no", "leka.no", "leksvik.no", "lenvik.no", "leangaviika.no", "leaŋgaviika.no", "lesja.no", "levanger.no", "lier.no", "lierne.no", "lillehammer.no", "lillesand.no", "lindesnes.no", "lindas.no", "lindås.no", "lom.no", "loppa.no", "lahppi.no", "láhppi.no", "lund.no", "lunner.no", "luroy.no", "lurøy.no", "luster.no", "lyngdal.no", "lyngen.no", "ivgu.no", "lardal.no", "lerdal.no", "lærdal.no", "lodingen.no", "lødingen.no", "lorenskog.no", "lørenskog.no", "loten.no", "løten.no", "malvik.no", "masoy.no", "måsøy.no", "muosat.no", "muosát.no", "mandal.no", "marker.no", "marnardal.no", "masfjorden.no", "meland.no", "meldal.no", "melhus.no", "meloy.no", "meløy.no", "meraker.no", "meråker.no", "moareke.no", "moåreke.no", "midsund.no", "midtre-gauldal.no", "modalen.no", "modum.no", "molde.no", "moskenes.no", "moss.no", "mosvik.no", "malselv.no", "målselv.no", "malatvuopmi.no", "málatvuopmi.no", "namdalseid.no", "aejrie.no", "namsos.no", "namsskogan.no", "naamesjevuemie.no", "nååmesjevuemie.no", "laakesvuemie.no", "nannestad.no", "narvik.no", "narviika.no", "naustdal.no", "nedre-eiker.no", "nes.akershus.no", "nes.buskerud.no", "nesna.no", "nesodden.no", "nesseby.no", "unjarga.no", "unjárga.no", "nesset.no", "nissedal.no", "nittedal.no", "nord-aurdal.no", "nord-fron.no", "nord-odal.no", "norddal.no", "nordkapp.no", "davvenjarga.no", "davvenjárga.no", "nordre-land.no", "nordreisa.no", "raisa.no", "ráisa.no", "nore-og-uvdal.no", "notodden.no", "naroy.no", "nærøy.no", "notteroy.no", "nøtterøy.no", "odda.no", "oksnes.no", "øksnes.no", "oppdal.no", "oppegard.no", "oppegård.no", "orkdal.no", "orland.no", "ørland.no", "orskog.no", "ørskog.no", "orsta.no", "ørsta.no", "os.hedmark.no", "os.hordaland.no", "osen.no", "osteroy.no", "osterøy.no", "ostre-toten.no", "østre-toten.no", "overhalla.no", "ovre-eiker.no", "øvre-eiker.no", "oyer.no", "øyer.no", "oygarden.no", "øygarden.no", "oystre-slidre.no", "øystre-slidre.no", "porsanger.no", "porsangu.no", "porsáŋgu.no", "porsgrunn.no", "radoy.no", "radøy.no", "rakkestad.no", "rana.no", "ruovat.no", "randaberg.no", "rauma.no", "rendalen.no", "rennebu.no", "rennesoy.no", "rennesøy.no", "rindal.no", "ringebu.no", "ringerike.no", "ringsaker.no", "rissa.no", "risor.no", "risør.no", "roan.no", "rollag.no", "rygge.no", "ralingen.no", "rælingen.no", "rodoy.no", "rødøy.no", "romskog.no", "rømskog.no", "roros.no", "røros.no", "rost.no", "røst.no", "royken.no", "røyken.no", "royrvik.no", "røyrvik.no", "rade.no", "råde.no", "salangen.no", "siellak.no", "saltdal.no", "salat.no", "sálát.no", "sálat.no", "samnanger.no", "sande.more-og-romsdal.no", "sande.møre-og-romsdal.no", "sande.vestfold.no", "sandefjord.no", "sandnes.no", "sandoy.no", "sandøy.no", "sarpsborg.no", "sauda.no", "sauherad.no", "sel.no", "selbu.no", "selje.no", "seljord.no", "sigdal.no", "siljan.no", "sirdal.no", "skaun.no", "skedsmo.no", "ski.no", "skien.no", "skiptvet.no", "skjervoy.no", "skjervøy.no", "skierva.no", "skiervá.no", "skjak.no", "skjåk.no", "skodje.no", "skanland.no", "skånland.no", "skanit.no", "skánit.no", "smola.no", "smøla.no", "snillfjord.no", "snasa.no", "snåsa.no", "snoasa.no", "snaase.no", "snåase.no", "sogndal.no", "sokndal.no", "sola.no", "solund.no", "songdalen.no", "sortland.no", "spydeberg.no", "stange.no", "stavanger.no", "steigen.no", "steinkjer.no", "stjordal.no", "stjørdal.no", "stokke.no", "stor-elvdal.no", "stord.no", "stordal.no", "storfjord.no", "omasvuotna.no", "strand.no", "stranda.no", "stryn.no", "sula.no", "suldal.no", "sund.no", "sunndal.no", "surnadal.no", "sveio.no", "svelvik.no", "sykkylven.no", "sogne.no", "søgne.no", "somna.no", "sømna.no", "sondre-land.no", "søndre-land.no", "sor-aurdal.no", "sør-aurdal.no", "sor-fron.no", "sør-fron.no", "sor-odal.no", "sør-odal.no", "sor-varanger.no", "sør-varanger.no", "matta-varjjat.no", "mátta-várjjat.no", "sorfold.no", "sørfold.no", "sorreisa.no", "sørreisa.no", "sorum.no", "sørum.no", "tana.no", "deatnu.no", "time.no", "tingvoll.no", "tinn.no", "tjeldsund.no", "dielddanuorri.no", "tjome.no", "tjøme.no", "tokke.no", "tolga.no", "torsken.no", "tranoy.no", "tranøy.no", "tromso.no", "tromsø.no", "tromsa.no", "romsa.no", "trondheim.no", "troandin.no", "trysil.no", "trana.no", "træna.no", "trogstad.no", "trøgstad.no", "tvedestrand.no", "tydal.no", "tynset.no", "tysfjord.no", "divtasvuodna.no", "divttasvuotna.no", "tysnes.no", "tysvar.no", "tysvær.no", "tonsberg.no", "tønsberg.no", "ullensaker.no", "ullensvang.no", "ulvik.no", "utsira.no", "vadso.no", "vadsø.no", "cahcesuolo.no", "čáhcesuolo.no", "vaksdal.no", "valle.no", "vang.no", "vanylven.no", "vardo.no", "vardø.no", "varggat.no", "várggát.no", "vefsn.no", "vaapste.no", "vega.no", "vegarshei.no", "vegårshei.no", "vennesla.no", "verdal.no", "verran.no", "vestby.no", "vestnes.no", "vestre-slidre.no", "vestre-toten.no", "vestvagoy.no", "vestvågøy.no", "vevelstad.no", "vik.no", "vikna.no", "vindafjord.no", "volda.no", "voss.no", "varoy.no", "værøy.no", "vagan.no", "vågan.no", "voagat.no", "vagsoy.no", "vågsøy.no", "vaga.no", "vågå.no", "valer.ostfold.no", "våler.østfold.no", "valer.hedmark.no", "våler.hedmark.no", "com.np", "edu.np", "gov.np", "mil.np", "net.np", "org.np", "nr", "biz.nr", "info.nr", "gov.nr", "edu.nr", "org.nr", "net.nr", "com.nr", "nu", "ac.nz—Tertiary", "co.nz—Organisations", "geek.nz", "gen.nz", "maori.nz", "net.nz", "org.nz", "school.nz", "com.om", "co.om", "edu.om", "ac.om", "sch.om", "gov.om", "net.om", "org.om", "mil.om", "museum.om", "biz.om", "pro.om", "med.om", "org", "ae.org", "za.org", "pa", "ac.pa", "gob.pa", "com.pa", "org.pa", "sld.pa", "edu.pa", "net.pa", "ing.pa", "abo.pa", "med.pa", "nom.pa", "pe", "edu.pe", "gob.pe", "nom.pe", "mil.pe", "org.pe", "com.pe", "net.pe", "pf", "com.pf", "org.pf", "edu.pf", "com.pg", "net.pg", "ac.pg", "gov.pg", "mil.pg", "org.pg", "ph", "com.ph", "net.ph", "org.ph", "gov.ph", "edu.ph", "ngo.ph", "mil.ph", "i.ph", "pk", "com.pk", "net.pk", "edu.pk", "org.pk", "fam.pk", "biz.pk", "web.pk", "gov.pk", "gob.pk", "gok.pk", "gon.pk", "gop.pk", "gos.pk", "info.pk", "pl", "aid.pl", "agro.pl", "atm.pl", "auto.pl", "biz.pl", "com.pl", "edu.pl", "gmina.pl", "gsm.pl", "info.pl", "mail.pl", "miasta.pl", "media.pl", "mil.pl", "net.pl", "nieruchomosci.pl", "nom.pl", "org.pl", "pc.pl", "powiat.pl", "priv.pl", "realestate.pl", "rel.pl", "sex.pl", "shop.pl", "sklep.pl", "sos.pl", "szkola.pl", "targi.pl", "tm.pl", "tourism.pl", "travel.pl", "turystyka.pl", "6bone.pl", "art.pl", "mbone.pl", "gov.pl", "uw.gov.pl", "um.gov.pl", "ug.gov.pl", "upow.gov.pl", "starostwo.gov.pl", "so.gov.pl", "sr.gov.pl", "po.gov.pl", "pa.gov.pl", "ngo.pl", "irc.pl", "usenet.pl", "augustow.pl", "babia-gora.pl", "bedzin.pl", "beskidy.pl", "bialowieza.pl", "bialystok.pl", "bielawa.pl", "bieszczady.pl", "boleslawiec.pl", "bydgoszcz.pl", "bytom.pl", "cieszyn.pl", "czeladz.pl", "czest.pl", "dlugoleka.pl", "elblag.pl", "elk.pl", "glogow.pl", "gniezno.pl", "gorlice.pl", "grajewo.pl", "ilawa.pl", "jaworzno.pl", "jelenia-gora.pl", "jgora.pl", "kalisz.pl", "kazimierz-dolny.pl", "karpacz.pl", "kartuzy.pl", "kaszuby.pl", "katowice.pl", "kepno.pl", "ketrzyn.pl", "klodzko.pl", "kobierzyce.pl", "kolobrzeg.pl", "konin.pl", "konskowola.pl", "kutno.pl", "lapy.pl", "lebork.pl", "legnica.pl", "lezajsk.pl", "limanowa.pl", "lomza.pl", "lowicz.pl", "lubin.pl", "lukow.pl", "malbork.pl", "malopolska.pl", "mazowsze.pl", "mazury.pl", "mielec.pl", "mielno.pl", "mragowo.pl", "naklo.pl", "nowaruda.pl", "nysa.pl", "olawa.pl", "olecko.pl", "olkusz.pl", "olsztyn.pl", "opoczno.pl", "opole.pl", "ostroda.pl", "ostroleka.pl", "ostrowiec.pl", "ostrowwlkp.pl", "pila.pl", "pisz.pl", "podhale.pl", "podlasie.pl", "polkowice.pl", "pomorze.pl", "pomorskie.pl", "prochowice.pl", "pruszkow.pl", "przeworsk.pl", "pulawy.pl", "radom.pl", "rawa-maz.pl", "rybnik.pl", "rzeszow.pl", "sanok.pl", "sejny.pl", "siedlce.pl", "slask.pl", "slupsk.pl", "sosnowiec.pl", "stalowa-wola.pl", "skoczow.pl", "starachowice.pl", "stargard.pl", "suwalki.pl", "swidnica.pl", "swiebodzin.pl", "swinoujscie.pl", "szczecin.pl", "szczytno.pl", "tarnobrzeg.pl", "tgory.pl", "turek.pl", "tychy.pl", "ustka.pl", "walbrzych.pl", "warmia.pl", "warszawa.pl", "waw.pl", "wegrow.pl", "wielun.pl", "wlocl.pl", "wloclawek.pl", "wodzislaw.pl", "wolomin.pl", "wroclaw.pl", "zachpomor.pl", "zagan.pl", "zarow.pl", "zgora.pl", "zgorzelec.pl", "gda.pl", "gdansk.pl", "gdynia.pl", "med.pl", "sopot.pl", "gliwice.pl", "krakow.pl", "poznan.pl", "wroc.pl", "zakopane.pl", "pn", "gov.pn", "co.pn", "org.pn", "edu.pn", "net.pn", "pr", "com.pr", "net.pr", "org.pr", "gov.pr", "edu.pr", "isla.pr", "pro.pr", "biz.pr", "info.pr", "name.pr", "est.pr", "prof.pr", "ac.pr", "pro", "aca.pro", "bar.pro", "cpa.pro", "jur.pro", "law.pro", "med.pro", "eng.pro", "ps", "edu.ps", "gov.ps", "sec.ps", "plo.ps", "com.ps", "org.ps", "net.ps", "pt", "net.pt", "gov.pt", "org.pt", "edu.pt", "int.pt", "publ.pt", "com.pt", "nome.pt", "pw", "co.pw", "ne.pw", "or.pw", "ed.pw", "go.pw", "belau.pw", "org.py", "edu.py", "mil.py", "gov.py", "net.py", "com.py", "coop.py", "com.qa", "net.qa", "org.qa", "gov.qa", "edu.qa", "mil.qa", "name.qa", "sch.qa", "re", "com.re", "asso.re", "nom.re", "ro", "com.ro", "org.ro", "tm.ro", "nt.ro", "nom.ro", "info.ro", "rec.ro", "arts.ro", "firm.ro", "store.ro", "www.ro", "rs", "co.rs", "org.rs", "edu.rs", "ac.rs", "gov.rs", "in.rs", "ru", "ac.ru", "com.ru", "edu.ru", "int.ru", "net.ru", "org.ru", "pp.ru", "adygeya.ru", "altai.ru", "amur.ru", "arkhangelsk.ru", "astrakhan.ru", "bashkiria.ru", "belgorod.ru", "bir.ru", "bryansk.ru", "buryatia.ru", "cbg.ru", "chel.ru", "chelyabinsk.ru", "chita.ru", "chukotka.ru", "chuvashia.ru", "dagestan.ru", "dudinka.ru", "e-burg.ru", "grozny.ru", "irkutsk.ru", "ivanovo.ru", "izhevsk.ru", "jar.ru", "joshkar-ola.ru", "kalmykia.ru", "kaluga.ru", "kamchatka.ru", "karelia.ru", "kazan.ru", "kchr.ru", "kemerovo.ru", "khabarovsk.ru", "khakassia.ru", "khv.ru", "kirov.ru", "koenig.ru", "komi.ru", "kostroma.ru", "krasnoyarsk.ru", "kuban.ru", "kurgan.ru", "kursk.ru", "lipetsk.ru", "magadan.ru", "mari.ru", "mari-el.ru", "marine.ru", "mordovia.ru", "mosreg.ru", "msk.ru", "murmansk.ru", "nalchik.ru", "nnov.ru", "nov.ru", "novosibirsk.ru", "nsk.ru", "omsk.ru", "orenburg.ru", "oryol.ru", "palana.ru", "penza.ru", "perm.ru", "pskov.ru", "ptz.ru", "rnd.ru", "ryazan.ru", "sakhalin.ru", "samara.ru", "saratov.ru", "simbirsk.ru", "smolensk.ru", "spb.ru", "stavropol.ru", "stv.ru", "surgut.ru", "tambov.ru", "tatarstan.ru", "tom.ru", "tomsk.ru", "tsaritsyn.ru", "tsk.ru", "tula.ru", "tuva.ru", "tver.ru", "tyumen.ru", "udm.ru", "udmurtia.ru", "ulan-ude.ru", "vladikavkaz.ru", "vladimir.ru", "vladivostok.ru", "volgograd.ru", "vologda.ru", "voronezh.ru", "vrn.ru", "vyatka.ru", "yakutia.ru", "yamal.ru", "yaroslavl.ru", "yekaterinburg.ru", "yuzhno-sakhalinsk.ru", "amursk.ru", "baikal.ru", "cmw.ru", "fareast.ru", "jamal.ru", "kms.ru", "k-uralsk.ru", "kustanai.ru", "kuzbass.ru", "magnitka.ru", "mytis.ru", "nakhodka.ru", "nkz.ru", "norilsk.ru", "oskol.ru", "pyatigorsk.ru", "rubtsovsk.ru", "snz.ru", "syzran.ru", "vdonsk.ru", "zgrad.ru", "gov.ru", "mil.ru", "test.ru", "rw", "gov.rw", "net.rw", "edu.rw", "ac.rw", "com.rw", "co.rw", "int.rw", "mil.rw", "gouv.rw", "com.sa", "net.sa", "org.sa", "gov.sa", "med.sa", "pub.sa", "edu.sa", "sch.sa", "sb", "com.sb", "edu.sb", "gov.sb", "net.sb", "org.sb", "sc", "com.sc", "gov.sc", "net.sc", "org.sc", "edu.sc", "sd", "com.sd", "net.sd", "org.sd", "edu.sd", "med.sd", "gov.sd", "info.sd", "se", "a.se", "ac.se", "b.se", "bd.se", "brand.se", "c.se", "d.se", "e.se", "f.se", "fh.se", "fhsk.se", "fhv.se", "g.se", "h.se", "i.se", "k.se", "komforb.se", "kommunalforbund.se", "komvux.se", "l.se", "lanbib.se", "m.se", "n.se", "naturbruksgymn.se", "o.se", "org.se", "p.se", "parti.se", "pp.se", "press.se", "r.se", "s.se", "sshn.se", "t.se", "tm.se", "u.se", "w.se", "x.se", "y.se", "z.se", "sg", "com.sg", "net.sg", "org.sg", "gov.sg", "edu.sg", "per.sg", "sh", "si", "sk", "sl", "com.sl", "net.sl", "edu.sl", "gov.sl", "org.sl", "sm", "sn", "art.sn", "com.sn", "edu.sn", "gouv.sn", "org.sn", "perso.sn", "univ.sn", "sr", "st", "co.st", "com.st", "consulado.st", "edu.st", "embaixada.st", "gov.st", "mil.st", "net.st", "org.st", "principe.st", "saotome.st", "store.st", "su", "edu.sv", "gob.sv", "com.sv", "org.sv", "red.sv", "sy", "edu.sy", "gov.sy", "net.sy", "mil.sy", "com.sy", "org.sy", "sz", "co.sz", "ac.sz", "org.sz", "tc", "td", "tel", "tf", "tg", "th", "ac.th", "co.th", "go.th", "in.th", "mi.th", "net.th", "or.th", "tj", "ac.tj", "biz.tj", "co.tj", "com.tj", "edu.tj", "go.tj", "gov.tj", "int.tj", "mil.tj", "name.tj", "net.tj", "nic.tj", "org.tj", "test.tj", "web.tj", "tk", "tl", "gov.tl", "tm", "tn", "com.tn", "ens.tn", "fin.tn", "gov.tn", "ind.tn", "intl.tn", "nat.tn", "net.tn", "org.tn", "info.tn", "perso.tn", "tourism.tn", "edunet.tn", "rnrt.tn", "rns.tn", "rnu.tn", "mincom.tn", "agrinet.tn", "defense.tn", "turen.tn", "to", "com.to", "gov.to", "net.to", "org.to", "edu.to", "mil.to", "com.tr", "gen.tr", "org.tr", "biz.tr", "info.tr", "av.tr", "dr.tr", "pol.tr", "bel.tr", "tsk.tr", "bbs.tr", "k12.tr", "edu.tr", "name.tr", "net.tr", "gov.tr", "web.tr", "tel.tr", "tv.tr", "nc.tr", "travel", "tt", "co.tt", "com.tt", "org.tt", "net.tt", "biz.tt", "info.tt", "pro.tt", "int.tt", "coop.tt", "jobs.tt", "mobi.tt", "travel.tt", "museum.tt", "aero.tt", "name.tt", "gov.tt", "edu.tt", "tv", "com.tv", "net.tv", "org.tv", "gov.tv", "tw", "edu.tw", "gov.tw", "mil.tw", "com.tw", "net.tw", "org.tw", "idv.tw", "game.tw", "ebiz.tw", "club.tw", "網路.tw", "組織.tw", "商業.tw", "ac.tz", "co.tz", "go.tz", "ne.tz", "or.tz", "ua", "com.ua", "edu.ua", "gov.ua", "in.ua", "net.ua", "org.ua", "cherkassy.ua", "chernigov.ua", "chernovtsy.ua", "ck.ua", "cn.ua", "crimea.ua", "cv.ua", "dn.ua", "dnepropetrovsk.ua", "donetsk.ua", "dp.ua", "if.ua", "ivano-frankivsk.ua", "kh.ua", "kharkov.ua", "kherson.ua", "khmelnitskiy.ua", "kiev.ua", "kirovograd.ua", "km.ua", "kr.ua", "ks.ua", "kv.ua", "lg.ua", "lugansk.ua", "lutsk.ua", "lviv.ua", "mk.ua", "nikolaev.ua", "od.ua", "odessa.ua", "pl.ua", "poltava.ua", "rovno.ua", "rv.ua", "sebastopol.ua", "sumy.ua", "te.ua", "ternopil.ua", "uzhgorod.ua", "vinnica.ua", "vn.ua", "zaporizhzhe.ua", "zp.ua", "zhitomir.ua", "zt.ua", "ug", "co.ug", "ac.ug", "sc.ug", "go.ug", "ne.ug", "or.ug", "ac.uk", "co.uk", "gov.uk", "judiciary.uk", "ltd.uk", "me.uk", "mod.uk", "net.uk", "nhs.uk", "nic.uk", "org.uk", "parliament.uk", "plc.uk", "police.uk", "sch.uk", "us", "dni.us", "fed.us", "isa.us", "kids.us", "nsn.us", "ak.us", "al.us", "ar.us", "as.us", "az.us", "ca.us", "co.us", "ct.us", "dc.us", "de.us", "fl.us", "ga.us", "gu.us", "hi.us", "ia.us", "id.us", "il.us", "in.us", "ks.us", "ky.us", "la.us", "ma.us", "md.us", "me.us", "mi.us", "mn.us", "mo.us", "ms.us", "mt.us", "nc.us", "nd.us", "ne.us", "nh.us", "nj.us", "nm.us", "nv.us", "ny.us", "oh.us", "ok.us", "or.us", "pa.us", "pr.us", "ri.us", "sc.us", "sd.us", "tn.us", "tx.us", "ut.us", "vi.us", "vt.us", "va.us", "wa.us", "wi.us", "wv.us", "wy.us", "com.uy", "edu.uy", "gub.uy", "net.uy", "mil.uy", "org.uy", "uz", "com.uz", "co.uz", "va", "vc", "com.vc", "net.vc", "org.vc", "gov.vc", "mil.vc", "edu.vc", "com.ve", "net.ve", "org.ve", "info.ve", "co.ve", "web.ve", "vg", "vi", "co.vi", "com.vi", "k12.vi", "net.vi", "org.vi", "vn", "com.vn", "net.vn", "org.vn", "edu.vn", "gov.vn", "int.vn", "ac.vn", "biz.vn", "info.vn", "name.vn", "pro.vn", "health.vn", "vu", "ws", "com.ws", "net.ws", "org.ws", "gov.ws", "edu.ws", "com.ye", "co.ye", "ltd.ye", "me.ye", "net.ye", "org.ye", "plc.ye", "gov.ye", "ac.za", "city.za", "co.za", "edu.za", "gov.za", "law.za", "mil.za", "nom.za", "org.za", "school.za", "ac.zm", "co.zm", "com.zm", "edu.zm", "gov.zm", "net.zm", "org.zm", "sch.zm", "co.zw", "ac.zw", "org.zw", "gov.zw"
];

function getDomain(url) {
    var tlds = TLD_LIST.join("|").replace(/\./g, "\\.");
    url = url || location.hostname;
    var domain = new RegExp("\\.?([^\\.]+)\\.(" + tlds + ")$").exec(url);
    return domain ? domain[1] : null;
}

function extend(destProps, srcProps) {
    if (!srcProps) {return destProps;}

    for (var i in srcProps) {
        if (srcProps.hasOwnProperty(i)) {
            var prop = srcProps[i];
            if (prop !== undefined) {
                destProps[i] = prop;
            }
        }
    }
    return destProps;
}

function log(msg) {
    if (debug) {
        try {
            console.log(msg);
        } catch (e) {
            alert(msg);
        }
    }
}

function handleError(e, context) {
    var msg = e.message || "NO_MSG";
    log("exception happened(" + context + "): " + msg);
    alert(msg);
}

function isVisible(e) {
    if (e.offsetWidth === 0 || e.offsetHeight === 0) {return false;}

    while (e.nodeName.toLowerCase() != 'body' &&
            (!e.style.display || e.style.display.toLowerCase() != 'none') &&
            (!e.style.visibility || e.style.visibility.toLowerCase() != 'hidden')) {
        e = e.parentNode;
    }
    return e.nodeName.toLowerCase() == 'body';
}
 
function setStyles(e, styles) {
    function camelize(attr) {
        return attr.replace(/-([a-z])/gi, function(s, letter) {
            return letter.toUpperCase();
        });
    }

    for (var i in styles) {
        if (styles.hasOwnProperty(i)) {
            e.style[camelize(i)] = styles[i];
            if (i == 'cssFloat') {
                e.style.styleFloat = styles[i]; // for IE
            }
        }
    }
}

function setAttributes(e, attrs) {
    for (var i in attrs) {
        if (attrs.hasOwnProperty(i)) {
            if (i == "className") {
                e.className = attrs[i];
            } else {
                e.setAttribute(i, attrs[i]);
            }
        }
    }
}

function addEvent(e, eventType, handler) {
    if (e.addEventListener) {
       e.addEventListener(eventType, handler, true);
    } else if (e.attachEvent) {
       e.attachEvent("on" + eventType, handler);
    } else {
       e["on" + eventType] = handler;
    }
}

function createElement(tagName, parent, htm, styles, attrs) {
    var el = tagName || "div";
    if (attrs && ("type" in attrs) && document.all) { // IE cannot change type
        el = "<" + el + " type=" + attrs.type + ">";
        delete attrs.type;
    }
    var e = document.createElement(el);
    (parent || document.body).appendChild(e);
    if (htm) {e.innerHTML = htm;}
    if (styles) {setStyles(e, styles);}
    if (attrs) {setAttributes(e, attrs);}
    return e;
}

function clearFloat(parent, extraStyle) {
    createElement('div', parent, null, extend({clear: "both"}, extraStyle));
}

function addCss(cssText) {
    var css = document.createElement("style");
    css.type = "text/css";
    if (css.styleSheet) { // IE
        css.styleSheet.cssText = cssText;
    } else {
        css.appendChild(document.createTextNode(cssText));
        //css.innerHTML = cssText;
    }
    document.body.appendChild(css);
}

// messages in different languages
var messages = {
    lang: window.navigator.userLanguage || window.navigator.language,

    _msgs: {
        cmd_gen_pass: {
            en: "Generate password",
            zh: "生成密码"
        },
        cmd_clear_pass: {
            en: "Clear password",
            zh: "清除密码"
        },
        label_domain: {
            en: "Domain(*)",
            zh: "域名（*）"
        },
        label_user: {
            en: "Username",
            zh: "用户名"
        },
        label_master_pass: {
            en: "Master password(*)",
            zh: "主密码（*）"
        },
        label_pass_len: {
            en: "Password length",
            zh: "密码长度"
        },
        label_iteration: {
            en: "Iteration",
            zh: "迭代次数"
        },
        label_salt: {
            en: "Salt",
            zh: "盐（salt）"
        },
        label_pass_base: {
            en: "Password charset",
            zh: "密码字符集"
        },
        label_pass_base94: {
            en: "printable characters",
            zh: "所有可打印字符"
        },
        label_pass_base64: {
            en: "letters, digits, + and /",
            zh: "字母、数字以及+和/"
        },
        label_pass_base62: {
            en: "letters and digits",
            zh: "字母和数字"
        },
        label_pass_base10: {
            en: "digits only",
            zh: "只含数字"
        },
        label_result: {
            en: "Actual password:",
            zh: "实际密码："
        },
        info_generating: {
            en: "generating password...",
            zh: "正在生成密码…"
        },
        error_no_domain: {
            en: "No domain found",
            zh: "未找到域名"
        },
        error_empty_domain: {
            en: "Domain is empty",
            zh: "域名为空"
        },
        error_invalid_domain: {
            en: "Domain is invalid",
            zh: "无效域名"
        },
        error_empty_pass: {
            en: "Password is empty",
            zh: "密码为空"
        },
        error_masterpass_too_short: {
            en: "Master password is too short(less than 6)",
            zh: "主密码过短（小于6位）"
        },
        error_empty_user: {
            en: "User field is empty",
            zh: "用户名为空"
        },
        error_iteration_not_number: {
            en: "Hash iteration is not a number",
            zh: "hash迭代次数应为数字"
        }
    },

    add: function(newMsgs) {
        extend(this._msgs, newMsgs);
    },

    get: function(msgId) {
        var msg = this._msgs[msgId] || "";
        if (msg) {
            var lang = this.lang;
            var hyphen = lang.indexOf("-");
            if (hyphen > 0) { // currently, just ignore the country part
                lang = lang.substring(0, hyphen);
            }
            msg = msg[lang] || msg.en;
        }
        return msg;
    }
};

// password generator
var passCreator = {
    // constants
    PANEL_ID: "onePassForAll",
    FLD_CLASS: "fld",
    MIN_MASTER_PASS_LEN: 6,
    MIN_PASS_LEN: 6,
    MAX_PASS_LEN: 26,
    MAX_ITERATION: 9999,
    VALID_PASS_RETRY: 100,

    /** mobile version or not? */
    isMobile: false,

    /** Validate password */
    validate: function(pwd, base) {
        log("validating password " + pwd);
        if (base === "10") {return true;}

        if (!this._pwdPattern) {
            this._pwdPattern = new RegExp("^(?=.*\\d)(?=.*[a-z])(?=.*[A-Z]).{" +
                    this.MIN_PASS_LEN + "," + this.MAX_PASS_LEN + "}$");
        }
        return this._pwdPattern.test(pwd);
    },

    _getInfo: function(domain, user, otherArgs) {
        var info = "";
        for (var i = 0; i < arguments.length; ++i) {
            info += arguments[i] || "";
        }
        return info;
    },

    /**
     * Generate password(the core function)
     * domain: the internet domain with TLD stripped
     */
    generate: function(pwdValues) {
        var masterPwd = pwdValues.pass;
        var domain = pwdValues.domain.toLowerCase();
        var user = pwdValues.user ? pwdValues.user.toLowerCase() : "";
        var len = pwdValues.passLen;
        var iteration = pwdValues.iteration || parseInt(this.settings.iteration, 10);
        var salt = pwdValues.salt;
        var base = pwdValues.passBase || this.settings.passBase;
        log("pwd=" + masterPwd + ";domain=" + domain + ";user=" + user +
                ";len=" + len + ";iteration=" + iteration + ";salt=" + salt +
                ";base=" + base);
        if (!len) {
            len = this.settings.passLen;
        }
        if (len < this.MIN_PASS_LEN) {
            len = this.MIN_PASS_LEN;
        } else if (len > this.MAX_PASS_LEN) {
            len = this.MAX_PASS_LEN;
        }
        masterPwd += (salt || this.settings.salt || "");
        log("salted master pass: " + masterPwd);
        var info = this._getInfo(domain, user); 
        info = hasher.sha224In94(info);
        log("hashed info: " + info);

        var pwd = "";

        var preHashIteration = Math.min(iteration, this.MAX_ITERATION) - 1;
        log("pre-hash " + preHashIteration + " times...");
        for (var i = preHashIteration; i > 0; --i) { // 1 hash remaining
            pwd = hasher.hmacSha224In94(pwd + masterPwd, info);
        }
        log("last round hash...");
        var algo = "hmacSha224In" + base;
        for (var retry = 0; ; ++retry) {
            pwd = hasher[algo](pwd + masterPwd, info);
            log("retry " + retry + "; generated pass len=" + pwd.length);
            var subPwd = pwd.substring(0, len);
            if ((retry > this.VALID_PASS_RETRY) ||
                    (pwd.length >= len && this.validate(subPwd, "" + base))) {
                return subPwd;
            }
        }
    },

    createInput: function(container, attrs) {
        var wrapper = createElement(null, container, null, null,
                {className: this.FLD_CLASS});
        var input = createElement('input', wrapper, null, null, attrs);
        var that = this;
        addEvent(input, "keypress", function(evt) {
                evt = evt || window.event;
                if (evt.keyCode == 13) {
                    that._genPass();
                }
            });
        return input;
    },

    contextCss: function(selector, cssText) {
        return cssText ?
            "#" + this.PANEL_ID + " " + selector + "{" + cssText + "}" :
            "";
    },

    createPasswordPanel: function(container, settings, pwdValues) {
        var cssText = settings.outerCss || "";
        cssText += this.contextCss("", settings.panelCss);
        cssText += this.contextCss("label", settings.labelCss);
        cssText += this.contextCss("." + this.FLD_CLASS, settings.fldCss);
        cssText += this.contextCss("input", settings.inputCss);
        cssText += this.contextCss("select", settings.selectCss);
        cssText += this.contextCss("button", settings.buttonCss);
        addCss(cssText);

        var panel = createElement(null, container, null, null, {id: this.PANEL_ID});
        this._panel = panel;
        if (!this.isMobile) {
            var titleBar = createElement('div', panel, null, settings.titleBarStyle);
            // add title text and close button
            createElement('span', titleBar, this.settings.title, settings.titleStyle);
            var hideBtn = createElement('a', titleBar, "&times", settings.topBtnStyle);
            hideBtn.onclick = this._hide.bind(this);
            var moreBtn = createElement('a', titleBar, "+", settings.topBtnStyle);
            this._moreBtn = moreBtn;
            moreBtn.onclick = this._toggleMore.bind(this);
            var helpBtn = createElement('a', titleBar, "?", settings.topBtnStyle);
            helpBtn.onclick = function(){window.open(app.homeUrl, '_blank');};
            clearFloat(titleBar);
        }
        var inputRegion = createElement('div', panel, null, settings.inputRegionStyle);
        createElement('label', inputRegion, messages.get('label_domain'));
        this._domainField = this.createInput(inputRegion, 
                {value: pwdValues && pwdValues.domain || ""});
        clearFloat(inputRegion, settings.fldSepStyle);
        createElement('label', inputRegion, messages.get('label_user'));
        this._userField = this.createInput(inputRegion, 
                {value: pwdValues && pwdValues.user || ""});
        clearFloat(inputRegion, settings.fldSepStyle);
        createElement('label', inputRegion, messages.get('label_master_pass'));
        this._masterPassField = this.createInput(inputRegion, 
                {type: "password", value: pwdValues && pwdValues.pass || ""});
        clearFloat(inputRegion, settings.fldSepStyle);
        createElement('label', inputRegion, messages.get('label_pass_len'));
        var passLenSelect = createElement('select', inputRegion);
        this._passLenSelect = passLenSelect;
        var passLen = pwdValues && pwdValues.passLen || this.settings.passLen;
        for (var i = this.MIN_PASS_LEN; i <= this.MAX_PASS_LEN; ++i) {
            var option = createElement('option', passLenSelect, i, null, {value: i});
            if (i == passLen) {
                option.setAttribute('selected', "true");
            }
        }
        clearFloat(inputRegion, settings.fldSepStyle);
        var advancedDiv = createElement('div', inputRegion, null, settings.advancedDivStyle); 
        this._advancedDiv = advancedDiv; 
        createElement('label', advancedDiv, messages.get('label_pass_base'));
        var passBaseSelect = createElement('select', advancedDiv);
        this._passBaseSelect = passBaseSelect;
        var passBase = pwdValues && pwdValues.passBase || this.settings.passBase;
        var baseOpts = [94, 64, 62, 10];
        for (i = 0; i < baseOpts.length; ++i) {
            var base = baseOpts[i];
            option = createElement('option', passBaseSelect, 
                    messages.get("label_pass_base" + base), null, {value: base});
            if (base == passBase) {
                option.setAttribute('selected', "true");
            }
        }
        clearFloat(advancedDiv, settings.fldSepStyle);
        createElement('label', advancedDiv, messages.get('label_iteration'));
        this._iterationField = this.createInput(advancedDiv, 
                {value: pwdValues && pwdValues.iteration || this.settings.iteration,
                    maxlength: 4});
        clearFloat(advancedDiv, settings.fldSepStyle);
        createElement('label', advancedDiv, messages.get('label_salt'));
        this._saltField = this.createInput(advancedDiv, 
                {value: pwdValues && pwdValues.salt || this.settings.salt});

        var cmdDiv = createElement('div', panel, null, settings.cmdDivStyle);
        var genBtn = createElement('button', cmdDiv, messages.get('cmd_gen_pass'),
                settings.genBtnStyle);
        genBtn.onclick = this._genPass.bind(this);
        var clearBtn = createElement('button', cmdDiv, messages.get('cmd_clear_pass'),
                settings.clearBtnStyle);
        clearBtn.onclick = this._clearPass.bind(this);
        clearFloat(cmdDiv);
        this._msgDiv = createElement('div', panel, null, settings.msgDivStyle);
        this._msgFld = createElement('input', this._msgDiv, null,
                settings.msgFldStyle, {readonly: "true"});
        this._resultDiv = createElement('div', panel, null, settings.resultDivStyle);
        this._resultFld = createElement('input', this._resultDiv, null,
                settings.resultFldStyle,
                this.isMobile ? null : {readonly: "true"});
    },

    _toggleMore: function() {
        var e = this._advancedDiv;
        if (e.style.display == "none") {
            e.style.display = "block";
            this._moreBtn.innerHTML = "--";
        } else {
            e.style.display = "none";
            this._moreBtn.innerHTML = "+";
        }
    },

    _hide: function() {
        if (this._panel) {
            this._panel.style.display = "none";
        }
    },

    _genPass: function() {
        var domain = this._domainField.value;
        if (!domain) {
            this.showMessage('error_empty_domain');
            return;
        }
        if (domain.indexOf(".") >= 0) {
            domain = getDomain(domain);
            if (!domain) {
                this.showMessage('error_invalid_domain');
                return;
            }
        }
        var masterPwd = this._masterPassField.value;
        if (masterPwd.length < this.MIN_MASTER_PASS_LEN) {
            this.showMessage('error_masterpass_too_short');
            return;
        }
        var iteration = this._iterationField.value;
        if (isNaN(iteration)) {
            this.showMessage('error_iteration_not_number');
            return;
        }

        this.showMessage("info_generating");
        var that = this;
        setTimeout(function() { // make sure to display the message 
            var result = that.generate({
                pass: masterPwd, domain: domain,
                user: that._userField.value, passLen: that._passLenSelect.value,
                iteration: parseInt(iteration, 10), salt: that._saltField.value,
                passBase: that._passBaseSelect.value
            });
            that.showResult(result);
        }, 1);
    },

    _clearPass: function() {
        this._resultFld.value = "";
        this._resultDiv.style.display = "none";
    },

    showResult: function(result) {
        this._msgDiv.style.display = "none";
        this._resultFld.value = result;
        this._resultDiv.style.display = "block";
    },

    showMessage: function(msgId) {
        this._resultDiv.style.display = "none";
        this._msgFld.value = messages.get(msgId);
        this._msgDiv.style.display = "block";
    },

    // customizable settings
    settings: {
        title: app.name + " " + app.version,
        // the following may be modified by Makefile
        passLen: "10",
        passBase: "94",
        iteration: "100",
        salt: "QMrxUarMQcNvW9n4MKtsM0hY5iNlzriO"
    }
};
