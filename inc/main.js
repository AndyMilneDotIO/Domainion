window.onload = function()
{
    // Variables
    let domain = "";
    let tld = "";
    let numWords = 1;
    let wordSpace = "";
    let removeVowels = false;
    const maxDomainLength = 32;
    const tldList = [".com", ".net", ".org", ".io", ".co", ".ai", ".co.uk",".dev", ".me", ".de", ".app", ".in", ".is", ".eu", ".gg", ".to", ".ph", ".nl", ".id", ".inc", ".website", ".xyz", ".club", ".online", ".info", ".store", ".best", ".live", ".us", ".tech", ".pw", ".pro", ".uk", ".tv", ".cx", ".mx", ".fm", ".cc", ".world", ".space", ".vip", ".life", ".shop",".host", ".fun", ".biz", ".icu", ".design", ".art"];
    tldList.sort();

    // Start
    genetateTLDList()
    getTLD();
    getRandomWord();

    function getTLD()
    {
        const tldSelect = document.getElementById("tld");
        if(tldSelect.options[tldSelect.selectedIndex].id == "0")
        {
            tld = tldList[Math.floor(Math.random() * tldList.length)];
        }
        else
        {
            tld = tldSelect.value;
        }
        console.log(tldSelect.options[tldSelect.selectedIndex].id);
    }

    // Click New Domain
    document.getElementById("getNewDomain").onclick = function(e)
    {
        e.preventDefault();
        const status = document.getElementById("status");
        status.style.display = "none";
        getTLD();
        getRandomWord();
    }

    // Click Update Domain
    document.getElementById("checkDomain").onclick = function(e)
    {
        e.preventDefault();
        domain = document.getElementById("newDomain").value;

        // Validate Domain
        if (/^[a-zA-Z0-9][a-zA-Z0-9-]{1,61}[a-zA-Z0-9](?:\.[a-zA-Z]{2,})+$/.test(domain))
        {
            checkDomain(domain, false);
            return;
        }
        const status = document.getElementById("status");
        status.style.display = "block";
        status.innerText = "Please enter a valid domain name";
    }

    // Click Number of Words
    document.querySelectorAll(".words").forEach((button) =>
    {
        button.onclick = function()
        {
            document.querySelectorAll(".words").forEach((buttons) =>
            {
                buttons.classList.remove("active");
            });
            numWords = button.getAttribute("value");
            button.classList.add("active");
        }
    });

    // Click Spacer
    document.querySelectorAll(".space").forEach((button) =>
    {
        button.onclick = function()
        {
            document.querySelectorAll(".space").forEach((buttons) =>
            {
                buttons.classList.remove("active");
            });
            wordSpace = button.getAttribute("value");
            button.classList.add("active");
        }
    });

    // Click Remove Vowels
    document.querySelectorAll(".vowels").forEach((button) =>
    {
        button.onclick = function()
        {
            button.classList.toggle("active");
            if(button.classList.contains("active"))
            {
                button.innerHTML = "&times;";
                removeVowels = true;
            }
            else
            {
                button.innerHTML = "&nbsp;";
                removeVowels = false;
            }
        }
    });

    // Call the RandomWord API
    function getRandomWord()
    {
        const randomWord = new XMLHttpRequest();
        randomWord.open("GET", "https://random-word-api.herokuapp.com/word?lang=en&number=" + numWords);
        randomWord.send();
        randomWord.onload = function()
        {
            domain = "";
            const wordList = JSON.parse(randomWord.responseText);
            wordList.forEach((word, index) =>
            {
                domain += word;
                if(index < wordList.length - 1)
                {
                    domain += wordSpace;
                }
            });
            if(removeVowels)
            {
                domain = domain.replace(/a/g, "");
                domain = domain.replace(/e/g, "");
                domain = domain.replace(/i/g, "y");
                domain = domain.replace(/o/g, "");
                domain = domain.replace(/u/g, "");
            }
            domain += tld;
            checkDomain(domain, true);
        }
    }

    // Copy to Clipboard
    document.getElementById("copyDomain").onclick = function()
    {
        navigator.clipboard.writeText(domain);
    }

    // Call the WHOIS API
    function checkDomain(domain, retry = true)
    {
        showModal();
        domain = domain.substring(0, maxDomainLength);
        document.getElementById("newDomain").focus();

        const domainCheck = new XMLHttpRequest();
        domainCheck.open("GET", "inc/generate.php?domain=" + domain);
        domainCheck.send();
        domainCheck.onreadystatechange = function()
        {
            if(domainCheck.status != 200)
            {
                hideModal();
                const status = document.getElementById("status");
                status.style.display = "block";
                status.innerText = "Something went wrong. Please try again.";
                return;
            }
        }
        domainCheck.onload = function()
        {
            if(domainCheck.responseText == "ERROR")
            {
                hideModal();
                const status = document.getElementById("status");
                status.style.display = "block";
                status.innerText = "Something went wrong. Please try again.";
                return;
            }
            const json = JSON.parse(domainCheck.responseText);
            if(!json.hasOwnProperty('DomainInfo'))
            {
                const status = document.getElementById("status");
                status.style.display = "block";
                status.innerText = "Something went wrong. Please try again.";
                hideModal();
                return;
            }
            if(json['DomainInfo'].domainAvailability != "AVAILABLE")
            {
                if(retry)
                {
                    getTLD();
                    getRandomWord();
                    return;
                }
                const status = document.getElementById("status");
                status.style.display = "block";
                status.innerText = "Sorry, this domain is taken";
                hideModal();
                return;
            }
            hideModal();
            document.getElementById("newDomain").value = domain;
        }
    }

    // Get the TLD List
    function genetateTLDList()
    {
        const tldSelect = document.getElementById("tld");
        tldList.forEach((tld, index) =>
        {
            const tldItem = document.createElement("option");
            tldItem.id = index;
            tldItem.value = tld;
            tldItem.innerText = tld;
            tldSelect.appendChild(tldItem);
        })
    }

    function showModal()
    {
        const oldmodal = document.getElementById("modal");
        if(oldmodal) return;
        const modal = document.createElement("div");
        modal.classList.add("modal");
        modal.id = "modal";
        document.body.appendChild(modal);
        setTimeout(function(){modal.style.opacity = "1";}, 10);
    }

    function hideModal()
    {
        const modal = document.getElementById("modal");
        if(modal)
        {
            modal.style.opacity = "0";
            setTimeout(function(){modal.remove();}, 250);
        }
    }
}