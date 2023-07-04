document.querySelector("#btnSearch").addEventListener("click", () => {
    let text = document.querySelector("#txtSearch").value;
    document.querySelector("#details").style.opacity = 0;
    getCountry(text);
});

document.querySelector("#txtSearch").addEventListener("keypress", () => {
    if(event.key == "Enter") {
        document.querySelector("#btnSearch").click();
    }
});

document.querySelector("#btnLocation").addEventListener("click", () => {
    if(navigator.geolocation){
        navigator.geolocation.getCurrentPosition(onSuccess, onError);
    }
});

function onError(err) {
    console.log(err);
}

async function onSuccess(position) {
    let lat = position.coords.latitude; //latitude: enlem
    let lng = position.coords.longitude; //longitude: boylam
    

    const api_key = "deba71c8c54040c289a384d244e5b62a";
    const url = `https://api.opencagedata.com/geocode/v1/json?q=${lat}+${lng}&key=${api_key}`;

    const response = await fetch(url);
    const data = await response.json();

    const country = data.results[0].components.country;

    document.querySelector("#txtSearch").value = country;
    document.querySelector("#btnSearch").click();
}


async function getCountry(country) {
    try {
        const response = await fetch('https://restcountries.com/v3.1/name/' + country);
        if(!response.ok) 
            throw new Error("ülke bulunamadı"); 
        const data = await response.json();
        renderCountry(data[0]);

        const countries = data[0].borders;
        if(!countries)
            throw new Error("komşu ülke bulunamadı");
            
        const response2 = await fetch('https://restcountries.com/v3.1/alpha?codes=' + countries.toString());
        const neighbors = await response2.json();

        renderNeighbors(neighbors);
    }
    catch(err) {
        renderError(err);
    }
};

function renderCountry(data) {
    document.querySelector("#country-details").innerHTML = "";
    document.querySelector("#neighbors").innerHTML = "";

    let html = `
            <div class="col-12 col-md-4 mb-3 mb-md-0">
                <img src="${data.flags.png}" alt="" class="img-fluid">
            </div>
            <div class="col-12 col-md-8">
                <h3 class="card-title">${data.name.common}</h3>
                <hr>
                <div class="row">
                    <div class="col-4">Population: </div>
                    <div class="col-8">${(data.population / 1000000).toFixed(1)} Milyon</div>
                </div>
                <div class="row">
                    <div class="col-4">Language: </div>
                    <div class="col-8">${Object.values(data.languages)}</div>
                </div>
                <div class="row">
                    <div class="col-4">Capital: </div>
                    <div class="col-8">${data.capital[0]}</div>
                </div>
                <div class="row">
                    <div class="col-4">Currency: </div>
                    <div class="col-8">${Object.values(data.currencies)[0].name} (${Object.values(data.currencies)[0].symbol})</div>
                </div>
            </div>
    `;
    document.querySelector("#details").style.opacity = 1;
    document.querySelector("#country-details").innerHTML = html;
};


function renderNeighbors(data) {
    let html = "";
    for(let country of data) {
        html += `
            <div class="img-height col-6 col-sm-4 col-lg-2 mt-2">
                <div class="card">
                    <img onclick="getNeighborName('${country.name.common}')" style="cursor: pointer" src="${country.flags.png}" class="card-img-top">
                    <div class="card-body">
                        <h6 onclick="getNeighborName('${country.name.common}')" style="cursor: pointer" class="card-title">${country.name.common}</h6>
                    </div>
                </div>
            </div>
        `;
    }
    
    document.querySelector("#neighbors").innerHTML = html;
};

function renderError(err) {
    const html = `
        <div class="alert alert-danger">
            ${err.message}
        </div>
    `;
    setTimeout(function() {
        document.querySelector("#errors").innerHTML = "";
    }, 3000);
    document.querySelector("#errors").innerHTML = html;
}

function getNeighborName(name) {
    document.querySelector("#txtSearch").value = name;
    document.querySelector("#btnSearch").click();
};