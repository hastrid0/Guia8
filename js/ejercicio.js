let cargarDatos = () => {
    fetch("https://dataserverdaw.herokuapp.com/escritores/xml")
      .then((response) => response.text())
      .then((data) => {
        const parser = new DOMParser();
        const xml = parser.parseFromString(data, "application/xml");
  
        let escritores = xml.getElementsByTagName("escritor");
  
        for (let escritor of escritores) {
          let id = escritor.querySelector("id").textContent;
          let nombre = escritor.querySelector("nombre").textContent;
  
          let plantilla = `<option value="${id}">${nombre}</option>`;
  
          document.querySelector("select").innerHTML += plantilla;
        }
  
        document.querySelector("select").addEventListener("change", (ev) => {
          document.querySelector("#frases").innerHTML = "";
        });
  
        cargarFrases(escritores);
      });
  };
  
  let cargarFrases = (escritores) => {
    document.querySelector("select").addEventListener("change", (ev) => {
      // Para borrar las frases anteriores cada que se selecciona un nuevo autor
      document.querySelector("#frases").innerHTML = "";
      fetch("https://dataserverdaw.herokuapp.com/escritores/frases")
        .then((response) => response.json())
        .then((data) => {
          Array.from(escritores)
            .filter(
              (escritor) =>
                ev.target.value == escritor.querySelector("id").textContent
            )
            .forEach((escritor) => {
              data.frases
                .filter((frase) => frase.id_autor == ev.target.value)
                .forEach((frase) => {
                  const fraseHTML = `
                      <div class="col-lg-3">
                        <div class="test-inner">
                          <div class="test-author-thumb d-flex">
                            <div class="test-author-info">
                            <h4>${
                              escritor.querySelector("nombre").textContent
                            }</h4>
                            </div>
                          </div>
                          <span>${frase.texto}</span>
                          <i class="fa fa-quote-right"></i>
                        </div>
                      </div>`;
  
                  document.querySelector("#frases").innerHTML += fraseHTML;
                });
            });
        });
    });
  };
  
  window.addEventListener("DOMContentLoaded", (event) => {
    cargarDatos();
    alert("...DOM Cargado");
  });