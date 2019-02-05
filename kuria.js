

window.onload = function () {
    showPoem();
};

function renderLine(obj, stanza, line, overNum) {
    var ili = document.createElement("li");
    ili.setAttribute("id", "p" + stanza + line);
    if (overNum)
        ili.setAttribute("value", stanza);
    if (overNum)
        ili.innerHTML = line + ": ";
    //ili.innerHTML += Object.keys(obj)[0];
    var lb = document.createElement("label");
    lb.setAttribute("for", "pcb" + stanza + line);
    lb.innerHTML = Object.keys(obj)[0];
    if (Object.keys(obj).indexOf("mission") >= 0) {
        if (obj["desc"]!= "")
            lb.innerHTML += "*";
    }
    ili.appendChild(lb);
    var lcb = document.createElement("input");
    lcb.setAttribute("type", "checkbox");
    lcb.setAttribute("id", "pcb" + stanza + line);
    lcb.onclick = checkLine;
    ili.appendChild(lcb);
    var div = document.createElement("div");
    div.setAttribute("id", "pcb" + stanza + line + "_div");
    for (var j = 0; j < Object.values(obj)[0].length; j++) {
        var span = document.createElement("a");
        span.innerHTML = Object.values(obj)[0][j];
        span.style.display = "block";
        span.href = "javascript:;";
        span.setAttribute("img", Object.values(obj)[0][j]);
        if (Object.keys(obj).indexOf("desc") >= 0) {
            span.setAttribute("desc", obj["desc"][j]);
            if (obj["desc"][j] != "")
                span.innerHTML += "*";
        }
        if (Object.keys(obj).indexOf("mission") >= 0) {
            span.setAttribute("mission", obj["mission"]);
        }
        span.onclick = function (ev) {
            document.getElementById("image").src = "kuria_files/" + ev.target.getAttribute("img");
            document.getElementById("desc").innerHTML = ev.target.getAttribute("desc");
            document.getElementById("mission").innerHTML = ev.target.getAttribute("mission");
        }
        div.appendChild(span);
    }
    ili.appendChild(div);
    if (localStorage.getItem("pcb" + stanza + line + "_div") == "true") {
        lcb.checked = true;
        div.style.display = "none";
    }
    return ili;
}

function checkStanza(ev) {
    if (ev.target.checked) {
        document.getElementById(ev.target.id + "_list").style.display = "none";
        var cbs = ev.target.parentElement.getElementsByTagName("input");
        for (var i = 0; i < cbs.length; i++) {
            if (cbs[i].id != ev.target.id) {
                cbs[i].click();
            }
        }
    }
    else {
        document.getElementById(ev.target.id + "_list").style.display = "";
    }
    localStorage.setItem(ev.target.id + "_list", ev.target.checked);
}

function checkLine(ev) {
    if (ev.target.checked) {
        document.getElementById(ev.target.id + "_div").style.display = "none";
    }
    else {
        document.getElementById(ev.target.id + "_div").style.display = "";
    }
    localStorage.setItem(ev.target.id + "_div", ev.target.checked);
}

function showPoem() {
    var ol = document.getElementById("outlist");
    if (ol != null)
        ol.remove();

    ol = document.createElement("ol");
    ol.setAttribute("id", "outlist");

    for (var i = 0; i < poem.length; i++) {
        var iol = document.createElement("ol");
        iol.setAttribute("id", "cbp" + i + "_list");
        for (var j = 0; j < poem[i].length; j++) {
            iol.appendChild(renderLine(poem[i][j], i + 1, j + 1));
        }
        var li = document.createElement("li");
        var cb = document.createElement("input");
        cb.setAttribute("type", "checkbox");
        cb.setAttribute("id", "cbp" + i);
        cb.onchange = checkStanza;
        var lb = document.createElement("label");
        lb.setAttribute("for", "cbp" + i);
        lb.innerHTML = "Completed";
        li.appendChild(cb);
        li.appendChild(lb);
        li.appendChild(iol);
        ol.appendChild(li);
        if (localStorage.getItem("cbp" + i + "_list") == "true"){
            cb.checked = true;
            iol.style.display = "none";
        }
    }
    document.getElementById("poem").appendChild(ol);
}

function showLocation() {
    var ol = document.getElementById("outlist");
    if (ol != null)
        ol.remove();

    ol = document.createElement("ul");
    ol.setAttribute("id", "outlist");

    var tilesets = [];
    var tslines = {};

    for (var i = 0; i < poem.length; i++) {
        for (var j = 0; j < poem[i].length; j++) {
            if (poem[i][j].tileset) {
                tilesets.push(poem[i][j].tileset);
                if (!tslines[poem[i][j].tileset])
                    tslines[poem[i][j].tileset] = [];

                tslines[poem[i][j].tileset].push({
                    "obj": poem[i][j],
                    "stanza": i + 1,
                    "line": j + 1,
                });
            }
        }
    }

    // distinct
    tilesets = tilesets.filter(function (v, i, a) { return a.indexOf(v) == i; });

    for (var t = 0; t < tilesets.length; t++) {
        var iol = document.createElement("ol");
        iol.setAttribute("id", "cbl" + t + "_list");

        for (var i = 0; i < tslines[tilesets[t]].length; i++) {
            var l = tslines[tilesets[t]][i];
            iol.appendChild(renderLine(l.obj, l.stanza, l.line));
        }

        var li = document.createElement("li");
        var cb = document.createElement("input");
        cb.setAttribute("type", "checkbox");
        cb.setAttribute("id", "cbl" + t);
        cb.onchange = checkStanza;
        var lb = document.createElement("label");
        lb.setAttribute("for", "cbl" + t);
        lb.innerHTML = tilesets[t];
        li.appendChild(cb);
        li.appendChild(lb);
        li.appendChild(iol);
        ol.appendChild(li);
        
        if (localStorage.getItem("cbl" + t + "_list") == "true") {
            cb.checked = true;
            iol.style.display = "none";
        }
    }

    document.getElementById("poem").appendChild(ol);
}
