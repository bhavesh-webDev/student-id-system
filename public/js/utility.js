document.addEventListener("DOMContentLoaded", () => {
  const checkbox = document.getElementById("viewPassword");
  const inputPassword = document.getElementById("password");

  checkbox.addEventListener("click", () => {
    console.log(checkbox);
    console.dir(checkbox);
    const isChecked = checkbox.checked;
    if (isChecked) {
      inputPassword.setAttribute("type", "text");
    } else {
      inputPassword.setAttribute("type", "password");
    }
  });

  //
  const adminRadio = document.querySelector(".admin");
  console.dir(adminRadio);
  adminRadio.addEventListener("click", () => {
    console.dir(adminRadio);
    if (adminRadio.value === "admin") {
      console.log("hello");
    }
  });
});

//used in register and login pages
