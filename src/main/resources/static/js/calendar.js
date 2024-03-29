
document.addEventListener('DOMContentLoaded', (event) => {


    const calendar = document.querySelector(".calendar"),
        date = document.querySelector(".date"),
        daysContainer = document.querySelector(".days"),
        prev = document.querySelector(".prev"),
        next = document.querySelector(".next"),
        todayBtn = document.querySelector(".today-btn"),
        gotoBtn = document.querySelector(".goto-btn"),
        dateInput = document.querySelector(".date-input"),
        eventDay = document.querySelector(".event-day"),
        eventDate = document.querySelector(".event-date"),
        eventsContainer = document.querySelector(".events"),
        addEventBtn = document.querySelector(".add-event"),
        addEventWrapper = document.querySelector(".add-event-wrapper "),
        addEventCloseBtn = document.querySelector(".close "),
        addEventTitle = document.querySelector(".event-name "),
        addEventFrom = document.querySelector(".event-time-from "),
        addEventTo = document.querySelector(".event-time-to "),
        addEventSubmit = document.querySelector(".add-event-btn");

    let today = new Date();
    let activeDay;
    let month = today.getMonth();
    let year = today.getFullYear();

    function convertTo24Hour(time) {
        var hours = parseInt(time.substr(0, 2));
        if(time.indexOf('AM') != -1 && hours == 12) {
            time = time.replace('12', '0');
        }
        if(time.indexOf('PM')  != -1 && hours < 12) {
            time = time.replace(hours, (hours + 12));
        }
        return time.replace(/(AM|PM)/, '');
    }


    const months = [
        "Janeiro",
        "Fevereiro",
        "Março",
        "Abril",
        "Maio",
        "Junho",
        "Julho",
        "August",
        "September",
        "October",
        "November",
        "December",
    ];


    let importedEventsArr = [];
    let eventsArr = [];
    function getEvents() {

        fetch('http://localhost:8080/eventos')
            .then(response => response.json())
            .then(data => {
                importedEventsArr.push(...data);

                convertEvents(importedEventsArr, eventsArr);
                initCalendar();
            })
            .catch(error => {
                console.error('Erro:', error);
            });
    }

    function convertEvents(importedEventsArr, eventsArr) {
        // Cria um objeto vazio para armazenar os novos eventos
        let newEvents = {};

        importedEventsArr.forEach(event => {
            // Converte a data do evento antigo em um objeto Date
            let dateParts = event.date.split('-');
            let year = parseInt(dateParts[0]);
            let month = parseInt(dateParts[1]);
            let day = parseInt(dateParts[2]);

            let startParts = event.start.split(':');
            let startHourMinute = startParts[0] + ':' + startParts[1];

            let finishParts = event.finish.split(':');
            let finishHourMinute = finishParts[0] + ':' + finishParts[1];

            // Concatena os horários de início e término
            let time = startHourMinute + ' - ' + finishHourMinute;


            // Cria a chave do novo evento baseado no ano, mês e dia
            let key = `${year}-${month}-${day}`;

            // Se a chave já existir no novo objeto de eventos, apenas adiciona o novo evento ao array existente
            if (newEvents[key]) {
                newEvents[key].events.push({ title: event.name, time: time });
            }
            // Se a chave não existir, cria um novo objeto de evento e o adiciona ao novo objeto de eventos
            else {
                newEvents[key] = {
                    day: day,
                    month: month,
                    year: year,
                    events: [
                        {
                            title: event.name,
                            time: time
                        }
                    ]
                };
            }

        });

        // Converte o objeto de novos eventos em um array de objetos
        let newEventsArr = Object.values(newEvents);

        // Adiciona os novos eventos ao eventsArr
        eventsArr.push(...newEventsArr);

        return eventsArr;
    }

    getEvents();


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
            //check if event is present on that day
            let event = false;
            eventsArr.forEach((eventObj) => {
                if (
                    eventObj.day === i &&
                    eventObj.month === month + 1 &&
                    eventObj.year === year &&
                    eventObj.events.length > 0
                ) {
                    console.log(eventObj.day,eventObj.month,eventObj.year);
                    event = true;
                }
            });
            if (
                i === new Date().getDate() &&
                year === new Date().getFullYear() &&
                month === new Date().getMonth()
            ) {
                activeDay = i;
                getActiveDay(i);
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
                    //add active to clicked day after month is changed
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
        console.log("here");
        const dateArr = dateInput.value.split("/");
        if (dateArr.length === 2) {
            if (dateArr[0] > 0 && dateArr[0] < 13 && dateArr[1].length === 4) {
                month = dateArr[0] - 1;
                year = dateArr[1];
                initCalendar();
                return;
            }
        }
        alert("Data Inválida");
    }

//function get active day name and date and update eventday eventdate
    function getActiveDay(date) {
        const day = new Date(year, month, date);
        const dayName = day.toString().split(" ")[0];
        eventDay.innerHTML = dayName;
        eventDate.innerHTML = date + " " + months[month] + " " + year;
    }

//function update events when a day is active
    function updateEvents(date) {
            let events = "";
            eventsArr.forEach((event) => {
                if (
                    date === event.day &&
                    month + 1 === event.month &&
                    year === event.year
                ) {
                    console.log(date, month,year)
                    event.events.forEach((event) => {
                        events += `<div class="event">
            <div class="title">
              <i class="fas fa-circle"></i>
              <h3 class="event-title">${event.title}</h3>
            </div>
            <div class="event-time">
              <span class="event-time">${event.time}</span>
            </div>
        </div>`;
                    });
                }
            });
            if (events === "") {
                events = `<div class="no-event">
            <h3>Sem Eventos</h3>
        </div>`;
            }
            eventsContainer.innerHTML = events;
            saveEvents();
    }
    updateEvents(activeDay);


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


//allow only time in eventtime from and to
    addEventFrom.addEventListener("input", (e) => {
        addEventFrom.value = addEventFrom.value.replace(/[^0-9:]/g, "");
        if (addEventFrom.value.length === 2) {
            addEventFrom.value += ":";
        }
        if (addEventFrom.value.length > 5) {
            addEventFrom.value = addEventFrom.value.slice(0, 5);
        }
    });

    addEventTo.addEventListener("input", (e) => {
        addEventTo.value = addEventTo.value.replace(/[^0-9:]/g, "");
        if (addEventTo.value.length === 2) {
            addEventTo.value += ":";
        }
        if (addEventTo.value.length > 5) {
            addEventTo.value = addEventTo.value.slice(0, 5);
        }
    });

//function to add event to eventsArr
    addEventSubmit.addEventListener("click", () => {
        const eventTitle = addEventTitle.value;
        const eventTimeFrom = addEventFrom.value;
        const eventTimeTo = addEventTo.value;
        if (eventTitle === "" || eventTimeFrom === "" || eventTimeTo === "") {
            alert("Preencha todos os campos");
            return;
        }

        //check correct time format 24 hour
        const timeFromArr = eventTimeFrom.split(":");
        const timeToArr = eventTimeTo.split(":");
        if (
            timeFromArr.length !== 2 ||
            timeToArr.length !== 2 ||
            timeFromArr[0] > 23 ||
            timeFromArr[1] > 59 ||
            timeToArr[0] > 23 ||
            timeToArr[1] > 59
        ) {
            alert("Formato Inválido");
            return;
        }

        const timeFrom = convertTo24Hour(convertTime(eventTimeFrom));
        const timeTo = convertTo24Hour(convertTime(eventTimeTo));

        //check if event is already added
        let eventExist = false;
        eventsArr.forEach((event) => {
            if (
                event.day === activeDay &&
                event.month === month + 1 &&
                event.year === year
            ) {
                event.events.forEach((event) => {
                    if (event.title === eventTitle) {
                        eventExist = true;
                    }
                });
            }
        });
        if (eventExist) {
            alert("Evento já adicionado");
            return;
        }
        const newEvent = {
            title: eventTitle,
            time: timeFrom + " - " + timeTo,
        };

        let eventAdded = false;
        if (eventsArr.length > 0) {
            eventsArr.forEach((item) => {
                if (
                    item.day === activeDay &&
                    item.month === month + 1 &&
                    item.year === year
                ) {
                    item.events.push(newEvent);
                    eventAdded = true;
                }
            });
        }

        if (!eventAdded) {
            eventsArr.push({
                day: activeDay,
                month: month + 1,
                year: year,
                events: [newEvent],
            });
        }

        const formattedDate = moment(year + "-" + (month + 1) + "-" + activeDay, "YYYY-M-D").format("YYYY-MM-DD");

        const evento = {
            name: eventTitle,
            date: formattedDate,
            start: timeFrom,
            finish: timeTo
        };


        // Faz uma chamada AJAX para enviar o evento para o backend
        const xhr = new XMLHttpRequest();
        xhr.open("POST", "/adicionar-evento", true);
        xhr.setRequestHeader("Content-Type", "application/json");
        xhr.onreadystatechange = function () {
            if (xhr.readyState === XMLHttpRequest.DONE) {
                if (xhr.status === 200) {
                    // Se a resposta do backend for bem sucedida exibe uma mensagem de sucesso
                    alert("Evento adicionado com sucesso!");

                    // Atualize a exibição do calendário, se necessário
                    initCalendar();
                } else {
                    // Se ocorrer algum erro no backend, exibe uma mensagem de erro adequada
                    alert("Erro ao adicionar evento");
                }
            }
        };
        xhr.send(JSON.stringify(evento));

        updateEvents(activeDay);

        saveEvents();
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

//function to delete event when clicked on event
    eventsContainer.addEventListener("click", (e) => {
        if (e.target.classList.contains("event")) {
            if (confirm("Tem certeza que deseja eliminar este evento?")) {
                const eventTitle = e.target.children[0].children[1].innerHTML;
                eventsArr.forEach((event) => {
                    if (
                        event.day === activeDay &&
                        event.month === month + 1 &&
                        event.year === year
                    ) {
                        event.events.forEach((item, index) => {
                            if (item.title === eventTitle) {
                                const formattedDate = `${event.year}-${event.month.toString().padStart(2, '0')}-${event.day.toString().padStart(2, '0')}`;
                                const evento = {
                                    name: eventTitle,
                                    date: formattedDate,
                                    start: item.time.split(" - ")[0],
                                    finish: item.time.split(" - ")[1]
                                };

                                // Faz uma chamada AJAX para enviar o evento para o backend
                                const xhr = new XMLHttpRequest();
                                xhr.open("POST", "/remover-evento", true);
                                xhr.setRequestHeader("Content-Type", "application/json");
                                xhr.onreadystatechange = function () {
                                    if (xhr.readyState === XMLHttpRequest.DONE) {
                                        if (xhr.status === 200) {
                                            // Se a resposta do backend for bem sucedida exibe uma mensagem de sucesso
                                            alert("Evento removido com sucesso!");
                                        } else {
                                            // Se ocorrer algum erro no backend, exibe uma mensagem de erro adequada
                                            alert("Erro ao remover evento");
                                        }
                                    }
                                };
                                xhr.send(JSON.stringify(evento));

                                console.log(evento);
                                event.events.splice(index, 1);
                            }
                        });
                        //if no events left in a day then remove that day from eventsArr
                        if (event.events.length === 0) {
                            eventsArr.splice(eventsArr.indexOf(event), 1);
                            //remove event class from day
                            const activeDayEl = document.querySelector(".day.active");
                            if (activeDayEl.classList.contains("event")) {
                                activeDayEl.classList.remove("event");
                            }
                        }
                    }
                });
                updateEvents(activeDay);
            }
        }
    });

//function to save events in local storage

    function saveEvents() {
        localStorage.setItem("events", JSON.stringify(eventsArr));
    }

//function to get events from local storage
    /*function getEvents() {
        //check if events are already saved in local storage then return event else nothing
        if (localStorage.getItem("events") === null) {
            return;
        }
        eventsArr.push(...JSON.parse(localStorage.getItem("events")));
    }*/





    function convertTime(time) {
        //convert time to 24 hour format
        let timeArr = time.split(":");
        let timeHour = timeArr[0];
        let timeMin = timeArr[1];
        let timeFormat = timeHour >= 12 ? "PM" : "AM";
        timeHour = timeHour % 12 || 12;
        time = timeHour + ":" + timeMin + " " + timeFormat;
        return time;
    }

    function convertToGroupedEvents(events) {
        const groupedEvents = {};

        events.forEach((event) => {
            const { name, start, finish, date } = event;
            const eventDate = new Date(date);

            const day = eventDate.getDate();
            const month = eventDate.getMonth() + 1;
            const year = eventDate.getFullYear();

            const formattedEvent = { title: name, time: `${start} - ${finish}` };

            const eventKey = `${day}-${month}-${year}`;
            if (!groupedEvents[eventKey]) {
                groupedEvents[eventKey] = {
                    day,
                    month,
                    year,
                    events: [formattedEvent],
                };
            } else {
                groupedEvents[eventKey].events.push(formattedEvent);
            }
        });

        return Object.values(groupedEvents);
    }




});