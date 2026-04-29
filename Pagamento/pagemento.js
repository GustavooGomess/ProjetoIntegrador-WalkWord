const steps = document.querySelectorAll(".step");
const progressFill = document.querySelector(".progress-fill");

steps.forEach((step, index) => {
  step.addEventListener("click", () => {
    // remove active de todos
    steps.forEach(s => s.classList.remove("active"));

    // adiciona active no clicado
    step.classList.add("active");

    // calcula a porcentagem da barra
    const percent = ((index + 1) / steps.length) * 100;

    // atualiza a barra
    progressFill.style.width = percent + "%";
  });
});

$(document).ready(function(){
  $('#cep').mask('00000-000');
});