let definMode = true

let searchBar;
let searchButton;

let statusBar;

let results;
let originalLang;
let translatedLang;
let switchLang;
let currTransLang = 'french-english'; // translation

let entryE;
let redirectE;
let wordE;

let didyoumeanE;

let conjugation;
let verb;
let verbWord;
let conjugationContent;

let spinner;

const abbreviations = {
    "abrév": ["abbreviation", "abréviation"],
    "adj": ["adjective", "adjectival phrase", "adjectif"],
    "adv": ["adverb", "adverbial phrase", "adverbe"],
    "approx": ["approximately", "approximativement"],
    "attrib": ["predicative", "attribut"],
    "aux": ["auxiliary", "auxiliaire"],
    "comp": ["compound", "in compounds", "mots composés"],
    "compar": ["comparative", "comparatif"],
    "cond": ["conditional", "conditionnel"],
    "conj": ["conjunction", "conjonction"],
    "déf": ["definite", "défini"],
    "dém": ["demonstrative", "démonstratif"],
    "dim": ["diminutive", "diminutif"],
    "dir": ["direct", "direct"],
    "eg": ["for example", "par exemple"],
    "épith": ["before noun", "épithète"],
    "esp": ["especially", "surtout"],
    "etc": ["etcetera", "et cetera"],
    "euph": ["euphemism", "euphémisme"],
    "ex": ["for example", "par exemple"],
    "excl": ["exclamation", "exclamation"],
    "f": ["feminine", "féminin"],
    "fig": ["figuratively", "figuré"],
    "fpl": ["feminine plural", "féminin pluriel"],
    "frm": ["formal language", "formel", "langue soignée"],
    "fut": ["future", "futur"],
    "gén": ["in general", "generally", "en général", "généralement"],
    "impér": ["imperative", "impératif"],
    "impers": ["impersonal", "impersonnel"],
    "indéf": ["indefinite", "indéfini"],
    "indic": ["indicative", "indicatif"],
    "indir": ["indirect", "indirect"],
    "infin": ["infinitive", "infinitif"],
    "insep": ["inseparable", "inséparable"],
    "interj": ["interjection", "interjection"],
    "interrog": ["interrogative", "interrogatif"],
    "inv": ["invariable", "invariable"],
    "iro": ["ironic", "ironique"],
    "irrég": ["irregular", "irrégulier"],
    "Ling": ["linguistics", "linguistique"],
    "lit": ["literally", "littéral", "au sens propre"],
    "littér": ["literary", "littéraire"],
    "Littérat": ["literature", "littérature"],
    "loc": ["locution", "locution"],
    "m": ["masculine", "masculine"],
    "mf": ["masculine and feminine", "masculin et féminin"],
    "Mil": ["military", "militaire"],
    "mpl": ["masculine plural", "masculin pluriel"],
    "Mytol": ["mythology", "mythologie"],
    "n": ["noun", "nom"],
    "nég": ["negative", "négatif"],
    "nf": ["feminine noun", "nom féminin"],
    "nm": ["masculine noun", "nom masculin"],
    "nmf": ["masculine and feminine noun", "nom masculin et féminin"],
    "nm, f": ["masculine, feminine noun", "nom masculin, féminin"],
    "NonC": ["uncountable", "non comptable"],
    "npl": ["plural noun", "nom pluriel"],
    "nsg": ["singular noun", "nom singulier"],
    "obj": ["object", "objet"],
    "opp": ["opposite", "oppose"],
    "o.s.": ["oneself", "emploi réfléchi"],
    "pass": ["passive", "passif"],
    "péj": ["pejorative", "péjoratif"],
    "pers": ["personal", "personnel"],
    "pl": ["plural", "pluriel"],
    "poss": ["possessive", "possessif"],
    "préf": ["prefix", "préfixe"],
    "prép": ["preposition", "préposition"],
    "prét": ["preterit", "prétérit"],
    "pron": ["pronoun", "pronom"],
    "Prov": ["proverb", "proverbe"],
    "prp": ["present participle", "participe présent"],
    "pt": ["past tense", "temps du passe"],
    "ptp": ["past participle", "participe passe"],
    "qch": ["something", "quelque chose"],
    "qn": ["somebody", "someone", "quelqu'un"],
    "®": ["registered trademark", "marque déposée"],
    "rel": ["relative", "relatif"],
    "sb": ["somebody, someone", "quelqu'un"],
    "sep": ["separable", "séparable"],
    "sg": ["singular", "singulier"],
    "SPÉC": ["specialist term", "terme de spécialiste"],
    "sth": ["something", "quelque chose"],
    "subj": ["subjunctive", "subjonctif"],
    "suf": ["suffix", "suffixe"],
    "superl": ["superlative", "superlatif"],
    "Tech": ["technical", "technique"],
    "vb": ["verb", "verbe"],
    "vi": ["intransitive verb", "verbe intransitif"],
    "vpr": ["pronominal verb", "verbe pronominal"],
    "vt": ["transitive verb", "verbe transitif"],
    "vti": ["transitive and intransitive verb", "verbe transitif et intransitif"],
    "vt indir": ["indirect transitive verb", "verbe transitif indirect"],
    "*": ["informal language", "langage familier"],
    "**": ["very informal language", "langage très familier"],
    "***": ["offensive language", "langage vulgaire"],
}

function returnAbbreviation(term) {
    for (const abbr in abbreviations) {
        if (abbreviations[abbr].includes(term)) {
            return abbr;
        }
    }
    return term;
}

document.addEventListener('DOMContentLoaded', () => {    
    searchBar = document.getElementById("searchbar");
    searchBar.addEventListener("keyup", (event) => {
        if (event.key == "Enter") {
            if (/[a-z0-9]/i.test(searchBar.value.toLowerCase())) { // if searchBar has letters in it
                callAPI(currTransLang, "best-matching", searchBar.value.toLowerCase())
            }
        }
    });
    searchBar.addEventListener("input", (event) => {
        searchBar.value = searchBar.value.replace(/[\/\\.]/g, '')
    });
    searchButton = document.getElementById('searchbutton');
    searchButton.addEventListener("click", (event) => {
        switchMode();
    });
    
    statusBar = document.getElementById('status');
    statusBar.innerHTML = "Search results will appear here... ";

    results = document.getElementById("results");
    originalLang = document.getElementById("original-lang");
    translatedLang = document.getElementById('translated-lang');
    switchLang = document.getElementById('switch-lang');
    switchLang.addEventListener("click", (event) => {
        setLang();
    });
    conjugation = document.getElementById('conjugation');
    verb = document.getElementById('verb');
    verb.addEventListener("click", (event) => {
        switchMode();
    });
    verbWord = document.getElementById('verbword');
    hint = document.getElementById('hint');
    conjugationContent = document.getElementById("conjugation-content");

    entryE = document.getElementById('entry');
    wordE = document.getElementById('word');

    didyoumeanE = document.getElementById('did-you-mean');

    spinner = document.getElementById("spinner");

    redirectE = document.getElementById("redirect");
    redirectE.addEventListener("click", (event) => {
        redirectWordReference()
    })

    searchBar.focus()
})

document.addEventListener('keyup', (event) => {
    if (event.key == '/') {
        switchMode();
    } else if (event.key == ".") {
        setLang();
    } else if (event.key == "Enter") {
        searchBar.focus()
    }
})

function switchMode() {
    definMode = !definMode
        if (definMode == true) {
            searchButton.innerHTML = "defin";
            conjugation.style.height = '28px';
            conjugation.style.overflowY = 'hidden';
            conjugation.style.paddingBottom = '3px';
            conjugation.scrollTop = 0;
            hint.style.visibility = "visible";
            hint.style.opacity = 1;

            document.querySelectorAll('.lds-ring').forEach(item => {
                item.style.setProperty('right', '68px')
            })
        } else {
            searchButton.innerHTML = "conjug";
            conjugation.style.height = '372px';
            conjugation.style.overflowY = 'scroll';
            conjugation.style.paddingBottom = '12px';
            hint.style.opacity = 0;
            hint.style.visibility = "hidden";

            document.querySelectorAll('.lds-ring').forEach(item => {
                item.style.setProperty('right', '80px')
            })
        }
}

function setLang() {
    if (currTransLang == "french-english") {
        currTransLang = "english-french";
        originalLang.innerHTML = "English";
        translatedLang.innerHTML = "Français";
    } else {
        currTransLang = "french-english";
        originalLang.innerHTML = "Français";
        translatedLang.innerHTML = "English";
    }
}

function toggleCollapsible(button) {
    const hiddenContent = button.querySelector(".hidden-example");
    hiddenContent.classList.toggle('open');
    console.log("Bruski");
}

function redirect(word, source) {
    if (source != currTransLang) {
        setLang()
    }
    callAPI(currTransLang, "get-entry", word);
}

function redirectWordReference() {
    let url = "https://www.wordreference.com/fren/" + encodeURIComponent(wordE.innerHTML);
    window.open(url, '_blank').focus();
}

async function callAPI(dictionaryCode, serviceType, serviceWord) {
    spinner.style.visibility = "visible";

    const result = await fetch("https://french-lookup-serverless-function.vercel.app/api/trackUsage", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            'dictType': dictionaryCode,
            'reqType': serviceType,
            'reqWord': serviceWord,
        })
    });

    if (!result.ok) {
        statusBar.innerHTML = `Server error: ${result.status}`
        throw new Error(`Server error: ${result.status}`);
    }

    const data = await result.json();
    console.log('Data received from serverless function: ', data);
    
    spinner.style.visibility = "hidden";
    if (data.format == "get-entry" || data.format == "best-matching") {
        entryE.style.display = "block";
        didyoumeanE.style.display = "none";

        statusBar.innerHTML = "Showing results for '" + data.word + "'..."
        wordE.innerHTML = data.word;
        verbWord.innerHTML = data.word;
        XMLparser(data);
    } else if (data.format == "make-a-search") {

    } else if (data.format == "did-you-mean") {
        entryE.style.display = "none";

        if (data.data.suggestions.length == 0) {
            statusBar.innerHTML = "😵 We can't find that word... "
        } else {
            statusBar.innerHTML = "Did you mean... "
            didyoumeanE.innerHTML = "";
            didyoumeanE.style.display = "flex";
            for (let suggestion of data.data.suggestions) {
                let button = document.createElement('button');
                button.className = "link-button";
                button.innerHTML = suggestion;
                button.addEventListener("click", () => {
                    searchBar.value = suggestion;
                    searchBar.focus()
                });

                didyoumeanE.insertAdjacentElement("beforeend", button);
            }
        }
    }
    // results.innerHTML += data.data.entryContent;
}

// avoids unsafe-inline for the span element
document.addEventListener("click", (event) => {
    const button = event.target.closest(".collapsible");

    if (event.target.matches(".link-button.refer")) {
        redirect(event.target.getAttribute("data-targ"), event.target.getAttribute("data-resour"));
    } else if (button) {
        toggleCollapsible(button);
    }
    console.log(event.target)
});

function XMLparser(data) {
    let isVerb = false;

    const parser = new DOMParser();
    const xmlDoc = parser.parseFromString(data.data.entryContent, "application/xml");

    let parents = Array.from(xmlDoc.querySelectorAll("hom"));
    let parentName = "hom";
    if (parents.length == 0) {
        parents = Array.from(xmlDoc.querySelectorAll("entry"));
        parentName = "entry";
    }
    const definitions = parents.map((parent) => {
        return {
            "senses": Array.from(parent.querySelectorAll("sense"))
                .filter(sense => sense.parentElement.tagName == parentName),
            "scope": Array.from(parent.querySelectorAll("gramGrp pos"))
                .map(node => node.textContent.trim())
                .map((node) => {
                    if (node.split(" ").includes("verb")) {
                        isVerb = true;
                    }
                    return node;
                })
                .map(node => returnAbbreviation(node))
                .join(", "),
        }
    })

    let results = Array.from(definitions)
    .flatMap(
        (definition) => {
                return Array.from(definition["senses"])
                    .map(() => {
                        return {}
                    })
                }
        );
    for (let i = 0; i < definitions.length; i++) {
        let scope = definitions[i]["scope"];
        let pronun = xmlDoc.querySelector("form pron");
        let pronunciation;
        if (pronun) {
            pronunciation = Array.from(pronun.childNodes)
                .filter(node => node.nodeType === Node.TEXT_NODE)
                .map(node => node.textContent.trim())
                .join("");
        }
        
        let colloc;
        let label;
        let translation;
        let phrases;
        
        let xr;
        let target = [];

        let examples;
        for (let j = 0; j < definitions[i]['senses'].length; j++) {
            let sense = definitions[i]['senses'][j];
            let collocElem = sense.querySelector("gramGrp colloc"); // objects or subjects
            if (collocElem !== null) {
                colloc = Array.from(collocElem.childNodes)
                    .map(node => node.textContent.trim())
                    .join("");
            } else {
                colloc = null;
            }

            label = sense.querySelector("lbl");
            if (label && label.parentElement.tagName != "xr") {
                label = Array.from(label.childNodes)
                    .map(node => node.textContent.trim())
                    .join(""); // synonym or figurative or whatever
            } else if (label && label.parentElement.tagName == "xr") {
                label = "";
            }

            translation = Array.from(sense.querySelectorAll("cit[type='translation']"));
            if (translation.length != 0) {
                translation = translation
                    .filter(node => {
                        let ancestor = node.parentElement;
                        while (ancestor) {
                            if (ancestor.tagName === "re" && ancestor.getAttribute("type") === "phr") {
                                return false; // Exclude if <re type="phr"> is found in the ancestry
                            } else if (ancestor.tagName === "cit" && ancestor.getAttribute("type") === "example") {
                                return false;
                            }
                            ancestor = ancestor.parentElement; // Move up the hierarchy
                        }
                        return true; // Include this <cit> if no <re type="phr"> exists in its ancestry
                    })
                translation = translation
                    .map(node => Array.from(node.childNodes)
                    .map(child => child.textContent.trim())
                    .join(""))
                    .join("\n");
            }
            phrases = Array.from(sense.querySelectorAll('re[type="phr"]'));
            if (phrases.length != 0) {
                phrases = phrases
                    .flatMap(node => Array.from(node.childNodes))
                    .filter(node => node.tagName != "span")
                    .map(node => node.textContent.trim())
            }

            xr = sense.querySelector('xr');
            if (xr) {
                target = Array.from(xr.querySelectorAll('ref'))
                    .map(node => {
                        targ = node.getAttribute('target');
                        resour = node.getAttribute('resource')

                        return `<span class="link-button refer" data-targ="${targ}" data-resour="${resour}">${node.textContent.trim()}</span>`
                    })
                    .join(", ");
                xr = Array.from(sense.querySelector('xr').childNodes)
                    .filter(node => node.tagName != "ref" && node.tagName != "span")
                    .map(node => node.textContent.trim())
                    .join("")
                xr = "(" + xr + " " + target + ")";
            }

            examples = Array.from(sense.querySelectorAll("cit[type='example']"));
            if (examples) {
                examples = examples
                    .filter(node => {
                        let ancestor = node.parentElement;
                        while (ancestor) {
                            if (ancestor.tagName === "re" && ancestor.getAttribute("type") === "phr") {
                                return false; // Exclude if <re type="phr"> is found in the ancestry
                            }
                            ancestor = ancestor.parentElement; // Move up the hierarchy
                        }
                        return true; // Include this <cit> if no <re type="phr"> exists in its ancestry
                    })
                examples = examples
                    .flatMap(node => Array.from(node.childNodes))
                    .filter(node => node.tagName != "span")
                    .map(node => node.textContent.trim());
            }
            
            let index = (i == 0) ? j : j + definitions[i-1]['senses'].length
            results[index]["scope"] = scope ? scope : "";
            results[index]["pronunciation"] = pronunciation ? pronunciation : "";
            results[index]["colloc"] = colloc ? colloc : "";
            results[index]["label"] = label ? label : "";
            results[index]["translation"] = translation ? translation : "";
            results[index]["phrases"] = phrases ? phrases : "";
            results[index]["examples"] = examples ? examples : "";
            results[index]["xr"] = xr ? xr : "";
        }
    }
    console.log(results);

    // entryE.getElementsByClassName('collapsible')
    Array.from(entryE.childNodes).forEach(elem => {
        if (elem.nodeType === Node.ELEMENT_NODE) {
            if (elem.classList.contains("collapsible")) {
                entryE.removeChild(elem);
            }
        }
    })

    
    for (let result of results) {
        if (result.pronunciation != "") {
            result.pronunciation = "[" + result.pronunciation + "]"
        }

        let shownExamples = [];
        if (result.examples) {
            if (result.examples[0]) {
                shownExamples.push(`${result.examples[0]}`);
            }
            if (result.examples[1]) {
                shownExamples.push(`\n<span style="font-style: italic;">${result.examples[1]}</span>`);
            }
        }
        
        let hiddenExamples = [];
        if (result.examples) {
            if (result.examples.length >= 3) {
                for (let i = 2; i < result.examples.length; i++) {
                    let example = result.examples[i];
                    if (i % 2 != 0) {
                        example = `<span style="font-style: italic;">${example}</span>`
                    }
                    hiddenExamples.push(example);
                }
            }
            hiddenExamples = hiddenExamples.join("\n");
        } else {
            hiddenExamples = "";
        }

        let formattedPhrases = [];
        if (result.phrases) {
            for (let i = 0; i < result.phrases.length; i++) {
                let phrase = result.phrases[i];
                if (i % 2 != 0) {
                    phrase = `<span style="font-style: italic;">${phrase}</span>`
                } else {
                    phrase = `<span style="font-weight: bold;">${phrase}</span>`
                }
                formattedPhrases.push(phrase);
            }
        }
        
        let otherInfoDisplay = "block";
        if (shownExamples.length == 0 && formattedPhrases.length >= 2) {
            shownExamples = `${formattedPhrases[0]}` + `\n<span style="font-style: italic;">${formattedPhrases[1]}</span>`
            formattedPhrases = formattedPhrases.slice(2)
        } else if (shownExamples.length == 0) {
            otherInfoDisplay = "none";
        } else {
            shownExamples = shownExamples.join("");
        }
        formattedPhrases = formattedPhrases.join("\n");
        if (formattedPhrases) {
            hiddenExamples += "\n" + formattedPhrases;
        }

        let buttonImage;
        let pointer;
        if (hiddenExamples) {
            buttonImage = "icons/chevron-down.svg"
            pointer = "pointer"
        } else {
            buttonImage = "icons/chevron-down-disabled.svg"
            pointer = "default"
        }

        let HTMLblock = `
            <button class="collapsible" style="cursor: ${pointer};">
                <div class="dropdown">
                    <img src=${buttonImage} style="margin:auto; display: inline-block;" alt="dropdown"/>
                </div>
                <div class="textinfo">
                    <div class="important-info">
                        <div class="wordinfo">
                            <a class="scope" target="_blank" tabindex="-1" href="https://www.wordreference.com/english/abbreviationsWRD.aspx?dict=fren&src=HC">${result.scope}</a>
                            <div class="pronunciation">${result.pronunciation}</div>
                        </div>
                        <div class="translation">
                        <div class="translate">${result.translation}</div>
                            <div class="label">${result.label} <span class="colloc">${result.colloc}</span></div>
                            <div>${result.xr}</div>
                        </div>
                    </div>
                    <div class="otherinfo" style="display:${otherInfoDisplay};">
                        <div class="spacer"> </div>
                        <div class="examples">
                            <div class="example">${shownExamples}</div>
                            <div class="hidden-example">${hiddenExamples}</div>
                        </div>
                    </div>
                </div>
            </button>
        `
        entryE.insertAdjacentHTML("beforeend", HTMLblock);
    }

    if (isVerb && currTransLang == "french-english") {
        fetchConjugations(data.word);
        hint.innerHTML = "click to show conjugations";
    } else if (currTransLang != "french-english") {
        hint.innerHTML = "(😵‍💫 Je ne parle pas anglais... )";
    } else {
        hint.innerHTML = "(that isn't a verb... )";
    }
}

async function fetchConjugations(word) {
    spinner.style.visibility == "visible";

    const result = await fetch("https://french-lookup-serverless-function.vercel.app/api/conjugation", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            'word': word,
        })
    });

    if (!result.ok) {
        statusBar.innerHTML = `Server error: ${result.status}`
        throw new Error(`Server error: ${result.status}`);
    }

    const data = await result.json();
    console.log('Data received from serverless function: ', data);

    spinner.style.visibility == "hidden";


    conjugationContent.replaceChildren();
    let order = ["Indicatif", "Conditionnel", "Subjonctif", "Impératif", "Participe"];

    for (let mode of order) {
        let modeE = document.createElement("div");
        modeE.classList.add("conjugation-mode");
        modeE.innerHTML = mode;
        conjugationContent.appendChild(modeE);
        
        mode = mode.toLowerCase();

        let stuffE = document.createElement("div");
        stuffE.style.display = "flex";
        stuffE.style.flexDirection = "row";
        conjugationContent.appendChild(stuffE);

        let column1 = document.createElement("div");
        column1.classList.add("column");
        stuffE.appendChild(column1);

        let column2 = document.createElement("div");
        column2.classList.add("column");
        stuffE.appendChild(column2);

        for (let i = 0; i < data.data[mode].length; i++) {
            let block = document.createElement("div");
            block.classList.add("conjugation-block");
            
            let tense = data.data[mode][i]["tense"];
            let verbs = data.data[mode][i]["conjugations"];

            let tenseE = document.createElement('div');
            tenseE.classList.add("conjugation-tense");
            tenseE.innerHTML = tense;

            let verbEntry = document.createElement('div');
            verbEntry.classList.add("conjugation-entry");

            let verbBlock = ``;
            for (let j = 0; j < verbs.length; j++) {
                // if (j != 0) {
                //     verbBlock += "\n"
                // }
                if (verbs[j]["pronoun"]) {
                    verbBlock += `${verbs[j]["pronoun"]} `
                }
                verbBlock += `<span class="conjugated-verbs">${verbs[j]["verb"]}</span>`
                verbBlock += "\n";
            }
            verbEntry.innerHTML = verbBlock;

            block.appendChild(tenseE);
            block.appendChild(verbEntry);

            if (i % 2 == 0) {
                column1.appendChild(block);
            } else {
                column2.appendChild(block)
            }
        }
    }
}