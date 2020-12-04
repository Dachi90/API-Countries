const d = document,
  $main = d.getElementById("main"),
  $body = d.querySelector("body"),
  $iconTheme = d.querySelector(".fas");

d.addEventListener("click", (e) => {
  toggleTheme(e);
  cardSelected(e);
  btnBack(e);
});

d.addEventListener("DOMContentLoaded", printFlags(), formSearch(), regionFilter());

function toggleTheme(e) {
  if (e.target.matches(".dark-mode-btn > *")) {
    $body.classList.toggle("dark-theme");
    if ($body.className === "dark-theme") {
      $iconTheme.classList.remove("fa-moon");
      $iconTheme.classList.add("fa-sun");
    } else {
      $iconTheme.classList.remove("fa-sun");
      $iconTheme.classList.add("fa-moon");
    }
  }
}

function btnBack(e) {
  if (e.target.matches(".btn-back") || e.target.matches(".btn-back > *")) {
    printFlags();
  }
}

function cardSelected(e) {
  if (e.target.matches(".card-content h3") || e.target.matches(".btn-border-countrie")) {
    //console.log(e.target.textContent);
    let html = "";
    getData({
      url: `https://restcountries.eu/rest/v2/name/${e.target.textContent}?fullText=true`,
      cbSuccess: async (json) => {
        //console.log(json);
        html = `
        <section class="one-card">
        <button class="btn-back"><i class="fas fa-long-arrow-alt-left"></i> <b>Home</b> </button>    
        <article class="one-card-content">
      
        <div class="img">
          <img src="${json[0].flag}" alt="">
        </div>
        
        <div class="name">
          <h3>${json[0].name}</h3>
        </div>
        
        <div class="content1">
          <p><b>Native name:</b> ${json[0].nativeName}</p>
          <p><b>Population:</b> ${json[0].population}</p>
          <p><b>Region:</b> ${json[0].region}</p>
          <p><b>Sub-region:</b> ${json[0].subregion}</p>
          <p><b>Capital:</b> ${json[0].capital}</p>
          </div>
          <div class="content2">
          <p><b>Top Level Domain:</b> ${json[0].topLevelDomain}</p>
          <p><b>Currencie:</b> ${json[0].currencies[0].name}</p>
          <p><b>Language:</b> ${languages(json[0].languages)}</p>
        </div>
        <div class="content3">
          <p><b>Border countries:</b> ${await borderCountriesButtons(json[0].borders)}</p>
        </div>
        
      </article>
      </section>
        `;
        $main.innerHTML = html;
      },
    });
  }
}

function languages(languages) {
  //console.log(languages[0].name);
  let $languages = "";
  languages.forEach((lang) => {
    $languages += `${lang.name}, `;
  });
  let $lang = $languages.slice(0, -2);
  //console.log($lang);

  return $lang;
}

async function borderCountriesButtons(countries) {
  //console.log(countries);
  let $borderCountries = "";
  for (let i = 0; i < countries.length; i++) {
    //console.log(countries[i]);
    await getData({
      url: `https://restcountries.eu/rest/v2/alpha/${countries[i]}`,
      cbSuccess: (countrie) => {
        $borderCountries += `
        <button class="btn-border-countrie">${countrie.name}</button>
        `;
      },
    });
  }
  //console.log($borderCountries);
  return $borderCountries;
}

async function getData(props) {
  let { url, cbSuccess } = props;

  await fetch(url)
    .then((res) => (res.ok ? res.json() : Promise.reject(res)))
    .then((json) => cbSuccess(json))
    .catch((err) => {
      let message = err.statusText || "Ocurrió un erro al acceder a la API";

      $main.innerHTML = `
      
      <div class="error">
        <p> Error ${err.status}: ${message}</p>
      </div>
      `;

      console.log(err);
    });
}

function printData(json) {
  let $section = d.createElement("section");
  $section.classList.add("all-flags");
  $main.innerHTML = "";

  let html = "";
  json.forEach((el) => {
    html += `
    <article class="card">
    <div class="card-img">
    <img src="${el.flag}" alt="flag" class="img-fluid">
    </div>
    <div class="card-content">
      <h3>${el.name}</h3>
      <p>
        <b>Population: </b>${el.population}
      </p>
      <p>
        <b>Region: </b>${el.region}
      </p>
      <p>
        <b>Capital: </b>${el.capital}
      </p>
    </div>
    
  </article>
    `;
  });

  $section.innerHTML = html;
  $main.appendChild($section);
}

async function printFlags() {
  await getData({
    url: "https://restcountries.eu/rest/v2/all",
    cbSuccess: (json) => {
      printData(json);
    },
  });
}

function formSearch() {
  d.addEventListener("keyup", async (e) => {
    let input = d.getElementById("search").value;
    //console.log(input);
    let search = `https://restcountries.eu/rest/v2/name/${input}`;
    //console.log(search);
    if (e.target.matches("#search") && input != "") {
      await getData({
        url: search,
        cbSuccess: (json) => {
          printData(json);
        },
      });
    } else {
      printFlags();
    }
  });
}

function regionFilter() {
  d.addEventListener("change", (e) => {
    if (e.target.matches(".filter")) {
      let region = d.querySelector(".filter").value;
      console.log(region);
      let regionQuery = `https://restcountries.eu/rest/v2/region/${region}`;
      console.log(regionQuery);
      if (region === "Alls") {
        printFlags();
      } else {
        getData({
          url: regionQuery,
          cbSuccess: (json) => {
            printData(json);
          },
        });
      }
    }
  });
}
