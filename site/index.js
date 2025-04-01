const guestsElement = document.getElementById("guests");
const rsvpYes = document.getElementById("rsvpYes");
if (rsvpYes.checked) {
  guestsElement.removeAttribute("disabled");
} else {
  guestsElement.setAttribute("disabled", true);
}

const enableGuestEntry = () => {
  guestsElement.removeAttribute("disabled");
};

const disableGuestEntry = () => {
  guestsElement.setAttribute("disabled", true);
  guestsElement.value = "0";
};

const submitRsvp = () => {
  const firstName = document.getElementById("firstName").value.trim();
  if (!firstName) {
    alert("Please enter your first name");
    return;
  }
  const lastName = document.getElementById("lastName").value.trim();
  if (!lastName) {
    alert("Please enter your last name");
    return;
  }
  const rsvpElements = document.getElementsByName("rsvp");
  if (!rsvpElements.item(0).checked && !rsvpElements.item(1).checked) {
    alert("Please select if you will attend");
    return;
  }
  const checkedRsvpElement = Array.from(rsvpElements).find(
    (element) => element.checked
  );
  const rsvp = checkedRsvpElement.value === "yes" ? true : false;

  const guests = document.getElementById("guests").value.trim();
  if (!guests || isNaN(guests) || guests < 0) {
    alert("Please enter the number of guests");
    return;
  }

  // trigger an http request to the server
  const xhr = new XMLHttpRequest();
  xhr.open("POST", "/rsvps");
  xhr.setRequestHeader("Content-Type", "application/json");
  xhr.send(
    JSON.stringify({
      first_name: firstName,
      last_name: lastName,
      rsvp_response: rsvp,
      number_of_guests: guests,
    })
  );
  xhr.onload = () => {
    if (xhr.status === 409) {
      const response = JSON.parse(xhr.responseText)[0];
      const id = response.id;
      askForRsvpChange(id, firstName, lastName, rsvp, guests);
      return;
    }
    if (xhr.status === 201) {
      alert("RSVP submitted successfully");
    } else {
      alert("Failed to submit RSVP");
    }
  };
};

const askForRsvpChange = (id, firstName, lastName, rsvp, guests) => {
  const changeRsvp = confirm("Would you like to change your RSVP?");
  if (changeRsvp) {
    const xhr = new XMLHttpRequest();
    xhr.open("PUT", `/rsvps/${id}`);
    xhr.setRequestHeader("Content-Type", "application/json");
    xhr.send(
      JSON.stringify({
        first_name: firstName,
        last_name: lastName,
        rsvp_response: rsvp,
        number_of_guests: guests,
      })
    );
    xhr.onload = () => {
      if (xhr.status === 200) {
        alert("RSVP updated successfully");
      } else {
        alert("Failed to update RSVP");
      }
    };
  }
};
