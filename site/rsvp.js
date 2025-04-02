const xhr = new XMLHttpRequest();
xhr.open("GET", "/get_all_rsvps");
xhr.setRequestHeader("Content-Type", "application/json");
xhr.send();
xhr.onload = () => {
  if (xhr.status === 200) {
    const rsvps = JSON.parse(xhr.responseText);
    const rsvpList = document.getElementById("rsvpList");
    // Clear existing rows
    while (rsvpList.firstChild) {
      rsvpList.removeChild(rsvpList.firstChild);
    }
    // Create rows for each RSVP
    rsvps.forEach((rsvp) => {
      const tr = document.createElement("tr");
      const firstNameTd = document.createElement("td");
      const lastNameTd = document.createElement("td");
      const rsvpResponseTd = document.createElement("td");
      const guestsTd = document.createElement("td");
      firstNameTd.textContent = rsvp.first_name;
      lastNameTd.textContent = rsvp.last_name;
      rsvpResponseTd.textContent = rsvp.rsvp_response ? "Yes" : "No";
      guestsTd.textContent = rsvp.number_of_guests;
      tr.appendChild(firstNameTd);
      tr.appendChild(lastNameTd);
      tr.appendChild(rsvpResponseTd);
      tr.appendChild(guestsTd);
      rsvpList.appendChild(tr);
    });

    const totalYesGuests = rsvps.filter((rsvp) => rsvp.rsvp_response === true);
    const totalGuests = rsvps.reduce(
      (acc, rsvp) => acc + rsvp.number_of_guests,
      totalYesGuests.length
    );
    document.getElementById(
      "total"
    ).textContent = `Total Guests: ${totalGuests}`;
  } else {
    alert("Failed to fetch RSVPs");
  }
};
