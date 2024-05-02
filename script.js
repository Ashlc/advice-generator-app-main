const adviceContainer = document.querySelector("#advice");
const adviceId = document.querySelector("#advice-id");
const shuffleButton = document.querySelector("#shuffle");
const dice = document.querySelector("#dice");
const toastToggle = document.querySelector("#toggle-toast");
const toggleText = document.querySelector("#toggle-text");
const toastStack = document.querySelector("#toast-stack");
const api = "https://api.adviceslip.com/advice";

let advice = "";
let toastEnabled = true;

if(localStorage.getItem("toastEnabled") === null) {
  console.log("toastEnabled is null");
  localStorage.setItem("toastEnabled", true);
} else if(localStorage.getItem("toastEnabled") === "false") {
  console.log("toastEnabled is false");
  toastEnabled = false;
  toastToggle.checked = false;
  toggleText.innerHTML = "Enable Toasts";
} else if(localStorage.getItem("toastEnabled") === "true") {
  console.log("toastEnabled is true");
  toastEnabled = true;
  toastToggle.checked = true;
  toggleText.innerHTML = "Disable Toasts";
}

toastToggle.addEventListener("click", () => {
  toastEnabled = !toastEnabled;
  toggleText.innerHTML = toastEnabled ? "Disable Toasts" : "Enable Toasts";
  localStorage.setItem("toastEnabled", toastEnabled);
});

// Functions

class Toast {
  constructor(title, message) {
    this.title = title;
    this.message = message;
  }

  show() {
    const toast = document.createElement("div");
    const toastMessage = document.createElement("p");
    const toastTitle = document.createElement("p");
    toastTitle.innerHTML = this.title;
    toastTitle.classList.add("toast-title");
    toastMessage.innerHTML = this.message;
    toast.appendChild(toastTitle);
    toast.appendChild(toastMessage);
    toast.classList.add("toast");
    toastStack.appendChild(toast);
    toast.classList.add("toast-show");
    setTimeout(() => {
      toast.classList.remove("toast-show");
      toast.classList.add("toast-hide");
      setTimeout(() => {
        toast.remove();
      }, 300);
    }, 3000);
  }
}

const handleShuffle = () => {
  dice.classList.toggle("spin");
  getAdvice();
  setTimeout(() => {
    dice.classList.toggle("spin");
  }, 500);
};

const getAdvice = async () => {
  try {
    const response = await fetch(api);
    const data = await response.json();
    console.log(data);
    adviceId.innerHTML = "#" + data.slip.id;
    adviceContainer.innerHTML = '"' + data.slip.advice + '"';
    if (advice === data.slip.advice) {
      if (toastEnabled)
        new Toast(
          "Cooldown",
          "Getting the same advice usually means the API is on cooldown."
        ).show();
      return;
    }
    advice = data.slip.advice;
  } catch (error) {
    adviceContainer.innerHTML = `Oh... I guess I'm out of advices. Try again later!`;
    if (toastEnabled)
      new Toast("Error", "An error occurred while fetching advice.").show();
  }
};

// Fetch advice on page load
window.onload = getAdvice;