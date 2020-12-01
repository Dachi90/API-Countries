const d = document,
  $main = d.getElementById("main"),
  $btn = d.querySelector(".dark-mode-btn"),
  $body = d.querySelector("body"),
  $iconTheme = d.querySelector(".fas");
console.log($iconTheme);

d.addEventListener("click", (e) => {
  if (e.target === $btn) {
    $body.classList.toggle("dark-theme");
    if ($body.className === "dark-theme") {
      $iconTheme.classList.remove("fa-moon");
      $iconTheme.classList.add("fa-sun");
    } else {
      $iconTheme.classList.remove("fa-sun");
      $iconTheme.classList.add("fa-moon");
    }
  }
});

d.addEventListener("DOMContentLoaded", printFlags(), formSearch(), regionFilter());

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
  let html = "";
  json.forEach((el) => {
    html += `
    <article class="card">
    <img src="${el.flag}" alt="flag" class="img-fluid">
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

  $main.innerHTML = html;
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
    console.log(search);
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
