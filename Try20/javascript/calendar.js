function outputtingDate(date) {
  return `${date.getFullYear()}–${date.getMonth() + 1}–${date.getDate()}`;
}
let eventsArr = [];
window.onload = () => {
  if(localStorage.getItem("email") != null){
    console.log(localStorage.getItem("email"));
    document.querySelector(".loginBtn").classList.add("d-none");
  }
  else{
    document.querySelector(".menuIsLogin").classList.add("d-none");
    document.querySelector(".noLoginBtn").classList.add("d-none");
  }
  fetch(`https://localhost:44322/api/User/get-notes-by-email?email=${localStorage.getItem("email")}`)
    .then((response) => response.json())
    .then((data) => {
      data.forEach((item) => {
        eventsArr.push({
          id: item.id,
          title: item.title,
          dateCreation: new Date(
            `${item.dateCreation?.substring(0, item.dateCreation.indexOf("T"))}`
          ),
          endDate: new Date(
            `${item.endDate?.substring(0, item.endDate.indexOf("T"))}`
          ),
          description: item.description,
          status: item.status,
          user: item.user,
        });
        document.querySelector(".currentUser").value = localStorage.getItem("email");
      });
      initCalendar();
    });
};
document.querySelector("#logOut").addEventListener("click", () =>{
  localStorage.clear();
})
const calendar = document.querySelector(".calendar"),
  date = document.querySelector(".date"),
  daysContainer = document.querySelector(".days"),
  prev = document.querySelector(".prev"),
  next = document.querySelector(".next"),
  todayBtn = document.querySelector(".today-btn"),
  gotoBtn = document.querySelector(".goto-btn"),
  dateInput = document.querySelector(".date-input"),
  eventDate = document.querySelector(".event-date"),
  eventsContainer = document.querySelector(".events"),
  addEventBtn = document.querySelector(".add-event"),
  addEventWrapper = document.querySelector(".add-event-wrapper "),
  addEventCloseBtn = document.querySelector(".close "),
  addEventTitle = document.querySelector(".event-name "),
  addEventDesc = document.querySelector(".event-desc"),
  addEventFrom = document.querySelector(".event-time-from "),
  addEventTo = document.querySelector(".event-time-to "),
  addEventSubmit = document.querySelector(".add-event-btn ");
function setStatus() {
  console.log("event");
}

let today = new Date();
let activeDay;
let month = today.getMonth();
let year = today.getFullYear();

const months = [
  "Січень",
  "Лютий",
  "Березень",
  "Квітень",
  "Травень",
  "Червень",
  "Липень",
  "Серпень",
  "Вересень",
  "Жовтень",
  "Листопад",
  "Грудень",
];

//function to add days in days with class day and prev-date next-date on previous month and next month days and active on today
function initCalendar() {
  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);
  const prevLastDay = new Date(year, month, 0);
  const prevDays = prevLastDay.getDate();
  const lastDate = lastDay.getDate();
  const day = firstDay.getDay();
  const nextDays = 7 - lastDay.getDay() - 1;

  date.innerHTML = months[month] + " " + year;

  let days = "";

  for (let x = day; x > 0; x--) {
    days += `<div class="day prev-date">${prevDays - x + 1}</div>`;
  }

  for (let i = 1; i <= lastDate; i++) {
    let event = false;
    eventsArr.forEach((item) => {
      if (
        item.dateCreation.getDate() === i &&
        item.dateCreation.getMonth() === month &&
        item.dateCreation.getFullYear() === year
      ) {
        event = true;
        console.log(event);
      }
    });
    if (
      i === new Date().getDate() &&
      year === new Date().getFullYear() &&
      month === new Date().getMonth()
    ) {
      getActiveDay(i);
      updateEvents(i);
      activeDay = i;
      updateEvents(i);
      if (event) {
        days += `<div class="day today active event">${i}</div>`;
      } else {
        days += `<div class="day today active">${i}</div>`;
      }
    } else {
      if (event) {
        days += `<div class="day event">${i}</div>`;
      } else {
        days += `<div class="day ">${i}</div>`;
      }
    }
  }
  for (let j = 1; j <= nextDays; j++) {
    days += `<div class="day next-date">${j}</div>`;
  }
  daysContainer.innerHTML = days;
  addListner();
}

//function to add month and year on prev and next button
function prevMonth() {
  month--;
  if (month < 0) {
    month = 11;
    year--;
  }
  initCalendar();
}

function nextMonth() {
  month++;
  if (month > 11) {
    month = 0;
    year++;
  }
  initCalendar();
}

prev.addEventListener("click", prevMonth);
next.addEventListener("click", nextMonth);

initCalendar();

//function to add active on day
function addListner() {
  const days = document.querySelectorAll(".day");
  days.forEach((day) => {
    day.addEventListener("click", (e) => {
      getActiveDay(e.target.innerHTML);
      updateEvents(Number(e.target.innerHTML));
      activeDay = Number(e.target.innerHTML);
      //remove active
      days.forEach((day) => {
        day.classList.remove("active");
      });
      //if clicked prev-date or next-date switch to that month
      if (e.target.classList.contains("prev-date")) {
        prevMonth();
        //add active to clicked day afte month is change
        setTimeout(() => {
          //add active where no prev-date or next-date
          const days = document.querySelectorAll(".day");
          days.forEach((day) => {
            if (
              !day.classList.contains("prev-date") &&
              day.innerHTML === e.target.innerHTML
            ) {
              day.classList.add("active");
            }
          });
        }, 100);
      } else if (e.target.classList.contains("next-date")) {
        nextMonth();
        //add active to clicked day afte month is changed
        setTimeout(() => {
          const days = document.querySelectorAll(".day");
          days.forEach((day) => {
            if (
              !day.classList.contains("next-date") &&
              day.innerHTML === e.target.innerHTML
            ) {
              day.classList.add("active");
            }
          });
        }, 100);
      } else {
        e.target.classList.add("active");
      }
    });
  });
}

todayBtn.addEventListener("click", () => {
  today = new Date();
  month = today.getMonth();
  year = today.getFullYear();
  initCalendar();
});

dateInput.addEventListener("input", (e) => {
  dateInput.value = dateInput.value.replace(/[^0-9/]/g, "");
  if (dateInput.value.length === 2) {
    dateInput.value += "/";
  }
  if (dateInput.value.length > 7) {
    dateInput.value = dateInput.value.slice(0, 7);
  }
  if (e.inputType === "deleteContentBackward") {
    if (dateInput.value.length === 3) {
      dateInput.value = dateInput.value.slice(0, 2);
    }
  }
});

gotoBtn.addEventListener("click", gotoDate);

function gotoDate() {
  const dateArr = dateInput.value.split("/");
  if (dateArr.length === 2) {
    if (dateArr[0] > 0 && dateArr[0] < 13 && dateArr[1].length === 4) {
      month = dateArr[0] - 1;
      year = dateArr[1];
      initCalendar();

      return;
    }
  }
  alert("Invalid Date");
}

//function get active day day name and date and update eventday eventdate
function getActiveDay(date) {
  const day = new Date(year, month, date);
  const dayName = day.toString().split(" ")[0];

  eventDate.innerHTML = date + " " + months[month] + " " + year;
  let currentDate = document.querySelector(".currentDate");
  let currentUser = document.querySelector(".currentUser");
  currentUser.value = localStorage.getItem("email");
  currentDate.value = `${year}-${month + 1}-${date}`;
  console.log(currentDate.value);
}

//function update events when a day is active
function updateEvents(date) {
  let events = "";
  eventsContainer.innerHTML = "";
  eventsArr.forEach((event) => {
    console.log(event.dateCreation.getMonth());
    if (
      date === event.dateCreation.getDate() &&
      month === event.dateCreation.getMonth() &&
      year === event.dateCreation.getFullYear()
    ) {
      let row = document.createElement("div");
      row.className = "event d-flex pt-3 m-1 justify-content-around  ";
      let divBody = document.createElement("div");
      divBody.className = "col-8 align-items-center";
      let circle = document.createElement("i");
      circle.className = "fas fa-circle ";
      let titleEv = document.createElement("p");
      titleEv.className = "event-title m-0";
      if (event.status) {
        titleEv.style.textDecoration = "line-through";
      }
      titleEv.innerHTML = event.title;
      let descEv = document.createElement("h3");
      descEv.className = "desc-ev";
      descEv.innerHTML = event.description;
      let timeEv = document.createElement("span");
      timeEv.className = "event-time";
      timeEv.innerHTML = outputtingDate(event.dateCreation);
      let bodySpan = document.createElement("span");
      bodySpan.className = "d-flex flex-column align-items-start";
      bodySpan.append(titleEv);
      bodySpan.append(descEv);
      bodySpan.append(timeEv);
      divBody.append(bodySpan);
      let doneDiv = document.createElement("div");
      doneDiv.className = "col-2 done-text";
      doneDiv.innerHTML = " ✓ ";
      if(event.status.toString() == "true"){
        doneDiv.style.visibility = "hidden";
      }
      doneDiv.addEventListener("click", (e) => {
        fetch(`https://localhost:44322/api/User/set-status?id=${event.id}`, {
          method: "POST",
        }).then((response) => {
          if (response.status == 200) {
            titleEv.style.textDecoration = "line-through";
          }
        });
      });
      row.append(circle);
      row.append(divBody);
      row.append(doneDiv);
      eventsContainer.append(row);
    }
  });
  if (eventsContainer.children.length === 0) {
    eventsContainer.innerHTML = `<div class="no-event">
            <h3>Немає подій</h3>
        </div>`;
  }
}

//function to add event
addEventBtn.addEventListener("click", () => {
  addEventWrapper.classList.toggle("active");
});

addEventCloseBtn.addEventListener("click", () => {
  addEventWrapper.classList.remove("active");
});

document.addEventListener("click", (e) => {
  if (e.target !== addEventBtn && !addEventWrapper.contains(e.target)) {
    addEventWrapper.classList.remove("active");
  }
});

//allow 50 chars in eventtitle
addEventTitle.addEventListener("input", (e) => {
  addEventTitle.value = addEventTitle.value.slice(0, 60);
});

//function to add event to eventsArr
addEventSubmit.addEventListener("click", () => {
  const eventTitle = addEventTitle.value;
  const eventDesc = addEventDesc.value;
  if (eventTitle === "" || eventDesc === "") {
    alert("Будь ласка заповніть всі поля");
    return;
  }

  const newEvent = {
    title: eventTitle,
    dateCreation: timeFrom,
    endDate: timeTo,
    description: eventDesc,
    status: false,
    user: "sashaosadets@gmail.com",
  };
  console.log(newEvent);


  let eventAdded = false;
  if (eventsArr.length > 0) {
    eventsArr.forEach((item) => {
      if (
        item.dateCreation.getDate() === activeDay &&
        item.dateCreation.getMonth() === month + 1 &&
        item.dateCreation.getFullYear() === year
      ) {
        item.events.push(newEvent);
        eventAdded = true;
      }
    });
  }

  if (!eventAdded) {
    eventsArr.push(newEvent);
  }

  console.log(eventsArr);
  addEventWrapper.classList.remove("active");
  addEventTitle.value = "";
  addEventFrom.value = "";
  addEventTo.value = "";
  updateEvents(activeDay);
  //select active day and add event class if not added
  const activeDayEl = document.querySelector(".day.active");
  if (!activeDayEl.classList.contains("event")) {
    activeDayEl.classList.add("event");
  }
});
