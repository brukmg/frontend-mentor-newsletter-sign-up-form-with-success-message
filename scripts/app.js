// Getting form card elements by their id
const formCard = document.getElementById("form-card");
const form = document.getElementById("form");
const errorMsg = document.getElementById("email-error");
const input = document.getElementById("email");

// Getting success card elements by their id
const successCard = document.getElementById("success-card");
const dismissBtn = document.getElementById("dismiss");
const successMsg = document.getElementById("success-msg");

// a variable that holds if email is valid or not  
let valid = false;

// a variable that holds if input is touched or not, So that we can start validating user input   
let touched = false;

// a variable that holds if the success card is showing or not. It will be used to decide display property if true.
let succeed = false;

// a variable holds the device screen width. It will be used to decide display property of success card based on screen size
let screenWidth  = window.screen.width;

// listening screen size change, so we can adjust success card display property flex or grid
window.addEventListener('resize', () => {
  screenWidth  = window.screen.width;
  if (succeed) { // checking if success card is visible on screen
    successCard.setAttribute("style", `display: ${screenWidth <= 640 ? 'grid' : 'flex'}`); //adjusting display property based on device screen width
  }
});

// listening user typing event to validate every time user input is changed
input.addEventListener("input", (e) => {
    if (touched) { //validate if only input element is touched before
        validate(e.target.value);
    }
});

// listening edit complete event (unfocus input) to know user touched the input for the first time and trig validate as well.
input.addEventListener("change", (e) => {
    validate(e.target.value); 
    touched = true; //marking touch status true, so we can validate while user is typing.
});

// trigging dismiss success card button
dismissBtn.onclick = () => {
  formCard.setAttribute("style", "display: flex");
  successCard.setAttribute("style", "display: none");
  succeed = false; //insuring success card is not visible anymore for the above logics
}

// listening form submission
form.addEventListener("submit", handleSubmit);

// a callback function that handles submission
function handleSubmit(e) {
  e.preventDefault(); // disabling default behavior of submit to get rid of page reload
  const formData = new FormData(e.target);
  const { email } = Object.fromEntries(formData);
  // concatenating user's email address with success message
  const message = `A confirmation email has been sent to <b>${email}</b>. Please open it and click the button inside to confirm your subscription.`
  validate(email);
  touched = true;
  if (valid) {
    successMsg.innerHTML = message;
    formCard.setAttribute("style", "display: none");
    successCard.setAttribute("style", `display: ${screenWidth <= 640 ? 'grid' : 'flex'}`);
    succeed = true;  //insuring success card is visible for the above logics
    form.reset(); // resetting the form
  }
}


// a function that handles input/email validation
const validate = (email) => {
  const regex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
  if (!email) {
    handleElementState("Please enter your email address", false);
    valid = false;
  } else if (!email.match(regex)) {
    handleElementState("Please enter valid email address", false);
    valid = false;
  } else {
    valid = true;
    handleElementState("", true);
  }
}

// a function that handles element state based on email validation
const handleElementState = (msg, reset) => {
  if (reset) { // if the input/email is valid, the error state and error message should not be shown
    errorMsg.innerHTML = "";
    errorMsg.setAttribute("style", "display: none");
    input.classList.remove("error-state");
    return;
  }
  // otherwise error state and error message should be shown
  errorMsg.innerHTML = msg;
  errorMsg.setAttribute("style", "display: block");
  input.classList.add("error-state");
};
