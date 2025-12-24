function gcSelect(id) {
    return document.getElementById(id);
}

function gcGetTrimmedValue(input) {
    if (!input) {
        return "";
    }
    return input.value.trim();
}

function gcIsSafeText(text) {
    if (!text) {
        return true;
    }
    if (text.indexOf("<") !== -1 || text.indexOf(">") !== -1) {
        return false;
    }
    return true;
}

// Dito natin kinoconvert yung start date galing input.
function gcFormatDateForApi(date) {
    if (!date) {
        return null;
    }
    var value = date.value;
    if (!value) {
        return null;
    }
    return value + "T00:00:00Z";
}

// Ito naman yung pang end date sa range, para alam ni api hanggang saan maghahanap ng events like kung gang december 28 lang na event bawal na 29 onwarrds.
function gcFormatEndDateForApi(date) {
    if (!date) {
        return null;
    }
    var value = date.value;
    if (!value) {
        return null;
    }
    return value + "T23:59:59Z";
}

// Dito natin pinagsasama yung date at time para sa exact na oras ng event start at end.
function gcBuildDateTimeValue(dateValue, timeValue) {
    if (!dateValue || !timeValue) {
        return null;
    }
    return dateValue + "T" + timeValue + ":00Z";
}

// dito naman is yung gumagawa ng url/link para sa fetchimng ng events, dito naka-set lahat ng parameters na need ni api.
function gcBuildEventsUrl(options) {
    var baseUrl = "https://www.googleapis.com/calendar/v3/calendars/";
    var calendarIdEncoded = encodeURIComponent(options.calendarId);
    var url = baseUrl + calendarIdEncoded + "/events?";
    var params = [];
    var nowIso = new Date().toISOString();
    var timeMin = options.timeMin || nowIso;
    var timeMax = options.timeMax || "";
    params.push("orderBy=startTime");
    params.push("singleEvents=true");
    params.push("maxResults=30");
    params.push("timeMin=" + encodeURIComponent(timeMin));
    if (timeMax) {
        params.push("timeMax=" + encodeURIComponent(timeMax));
    }
    if (options.query) {
        params.push("q=" + encodeURIComponent(options.query));
    }
    params.push("key=" + encodeURIComponent(gcApiKey));
    url += params.join("&");
    return url;
}

function gcSetButtonLoading(isLoading) {
    var button = gcSelect("gc-load-button");
    if (!button) {
        return;
    }
    var spinner = button.querySelector(".gc-button-spinner");
    if (isLoading) {
        button.disabled = true;
        button.classList.add("gc-button-loading");
        if (spinner) {
            spinner.style.display = "inline-block";
        }
    } else {
        button.disabled = false;
        button.classList.remove("gc-button-loading");
        if (spinner) {
            spinner.style.display = "none";
        }
    }
}

function gcSetCreateButtonLoading(isLoading) {
    var button = gcSelect("gc-create-button");
    if (!button) {
        return;
    }
    var spinner = button.querySelector(".gc-button-spinner");
    if (isLoading) {
        button.disabled = true;
        button.classList.add("gc-button-loading");
        if (spinner) {
            spinner.style.display = "inline-block";
        }
    } else {
        button.disabled = false;
        button.classList.remove("gc-button-loading");
        if (spinner) {
            spinner.style.display = "none";
        }
    }
}

function gcSetLoadingVisible(isVisible) {
    var loading = gcSelect("gc-loading-message");
    if (!loading) {
        return;
    }
    if (isVisible) {
        loading.classList.add("gc-loading-visible");
    } else {
        loading.classList.remove("gc-loading-visible");
    }
}

function gcShowError(message) {
    var container = gcSelect("gc-error-container");
    if (!container) {
        return;
    }
    container.textContent = message || "";
}

function gcClearError() {
    gcShowError("");
}

function gcShowCreateMessage(message, isSuccess) {
    var box = gcSelect("gc-create-message");
    if (!box) {
        return;
    }
    box.textContent = message || "";
    box.classList.remove("gc-create-message-success");
    box.classList.remove("gc-create-message-error");
    if (!message) {
        return;
    }
    if (isSuccess) {
        box.classList.add("gc-create-message-success");
    } else {
        box.classList.add("gc-create-message-error");
    }
}

function gcCreateElement(tag, className, text) {
    var el = document.createElement(tag);
    if (className) {
        el.className = className;
    }
    if (text) {
        el.textContent = text;
    }
    return el;
}

function gcRenderEmptyState(message) {
    var container = gcSelect("gc-results-container");
    if (!container) {
        return;
    }
    container.innerHTML = "";
    var text = message || "No events found for your request.";
    var div = gcCreateElement("div", "gc-empty-state", text);
    container.appendChild(div);
}

function gcFormatDateTimeRange(start, end) {
    var startDate = start ? new Date(start) : null;
    var endDate = end ? new Date(end) : null;
    if (!startDate) {
        return "Time not available";
    }
    var optionsDate = { year: "numeric", month: "short", day: "numeric" };
    var optionsTime = { hour: "2-digit", minute: "2-digit" };
    var datePart = startDate.toLocaleDateString(undefined, optionsDate);
    if (!endDate) {
        var timeOnly = startDate.toLocaleTimeString(undefined, optionsTime);
        return datePart + " • " + timeOnly;
    }
    var sameDay = startDate.toDateString() === endDate.toDateString();
    var startTime = startDate.toLocaleTimeString(undefined, optionsTime);
    var endTime = endDate.toLocaleTimeString(undefined, optionsTime);
    if (sameDay) {
        return datePart + " • " + startTime + " - " + endTime;
    }
    var endDatePart = endDate.toLocaleDateString(undefined, optionsDate);
    return datePart + " " + startTime + " - " + endDatePart + " " + endTime;
}

function gcRenderEvents(events) {
    var container = gcSelect("gc-results-container");
    if (!container) {
        return;
    }
    container.innerHTML = "";
    if (!events || events.length === 0) {
        gcRenderEmptyState();
        return;
    }
    for (var i = 0; i < events.length; i++) {
        var event = events[i];
        var card = gcCreateElement("article", "gc-event-card");
        var titleText = event.summary || "Untitled event";
        var title = gcCreateElement("h2", "gc-event-title", titleText);
        card.appendChild(title);
        var start = event.start && (event.start.dateTime || event.start.date);
        var end = event.end && (event.end.dateTime || event.end.date);
        var timeText = gcFormatDateTimeRange(start, end);
        var time = gcCreateElement("div", "gc-event-time", timeText);
        card.appendChild(time);
        if (event.location) {
            var location = gcCreateElement("div", "gc-event-location", event.location);
            card.appendChild(location);
        }
        if (event.description) {
            var descText = event.description;
            if (descText.length > 160) {
                descText = descText.slice(0, 157) + "...";
            }
            var description = gcCreateElement("p", "gc-event-description", descText);
            card.appendChild(description);
        }
        container.appendChild(card);
    }
}

function gcValidateInputs(calendarId, searchText) {
    if (!calendarId) {
        return "Please enter a calendar ID.";
    }
    if (!gcIsSafeText(calendarId) || !gcIsSafeText(searchText)) {
        return "Input contains invalid characters.";
    }
    return "";
}

function gcValidateCreateInputs(calendarId, title, dateValue, startTime, endTime, accessToken) {
    if (!calendarId) {
        return "Please enter a calendar ID.";
    }
    if (!title) {
        return "Please enter an event title.";
    }
    if (!dateValue) {
        return "Please choose an event date.";
    }
    if (!startTime || !endTime) {
        return "Please enter start and end time.";
    }
    if (!accessToken) {
        return "Please enter an access token.";
    }
    if (!gcIsSafeText(calendarId) || !gcIsSafeText(title)) {
        return "Input contains invalid characters.";
    }
    return "";
}

function gcClearCreateForm() {
    var calendarInput = gcSelect("gc-create-calendar-id");
    var titleInput = gcSelect("gc-event-title");
    var dateInput = gcSelect("gc-event-date");
    var startInput = gcSelect("gc-event-start-time");
    var endInput = gcSelect("gc-event-end-time");
    var descriptionInput = gcSelect("gc-event-description");
    if (calendarInput) {
        calendarInput.value = "";
    }
    if (titleInput) {
        titleInput.value = "";
    }
    if (dateInput) {
        dateInput.value = "";
    }
    if (startInput) {
        startInput.value = "";
    }
    if (endInput) {
        endInput.value = "";
    }
    if (descriptionInput) {
        descriptionInput.value = "";
    }
}

// Ito yung function para maload natin yung mga  events, dito yung fetching galing sa google calendar.
async function gcFetchEvents() {
    var calendarInput = gcSelect("gc-calendar-id");
    var searchInput = gcSelect("gc-search-text");
    var startInput = gcSelect("gc-start-date");
    var endInput = gcSelect("gc-end-date");
    var calendarId = gcGetTrimmedValue(calendarInput);
    var searchText = gcGetTrimmedValue(searchInput);
    var error = gcValidateInputs(calendarId, searchText);
    if (error) {
        gcRenderEmptyState("");
        gcShowError(error);
        return;
    }
    gcClearError();
    gcSetButtonLoading(true);
    gcSetLoadingVisible(true);
    var timeMin = gcFormatDateForApi(startInput);
    var timeMax = gcFormatEndDateForApi(endInput);
    var options = {
        calendarId: calendarId,
        query: searchText,
        timeMin: timeMin,
        timeMax: timeMax
    };
    var url = gcBuildEventsUrl(options);
    try {
        var response = await fetch(url);
        if (!response.ok) {
            if (response.status === 401 || response.status === 403) {
                gcRenderEmptyState("");
                gcShowError("Authentication or permission error. Please check your API key and calendar sharing settings.");
                return;
            }
            if (response.status === 404) {
                gcRenderEmptyState("");
                gcShowError("Calendar not found. Please check the calendar ID.");
                return;
            }
            if (response.status === 429) {
                gcRenderEmptyState("");
                gcShowError("Too many requests. Please try again in a moment.");
                return;
            }
            gcRenderEmptyState("");
            gcShowError("Request failed with status " + response.status + ".");
            return;
        }
        var data = await response.json();
        var items = data.items || [];
        if (!items.length) {
            gcRenderEmptyState("No events found for your request.");
            gcShowError("");
            return;
        }
        gcRenderEvents(items);
        gcShowError("");
    } catch (e) {
        gcRenderEmptyState("");
        gcShowError("Unable to reach the Google Calendar API. Please check your internet connection.");
    } finally {
        gcSetButtonLoading(false);
        gcSetLoadingVisible(false);
    }
}

// dto naman yung  function sa paggawa ng new event sa calendar gamit yung form tsaka access token.
async function gcCreateEvent() {
    var calendarInput = gcSelect("gc-create-calendar-id");
    var titleInput = gcSelect("gc-event-title");
    var dateInput = gcSelect("gc-event-date");
    var startInput = gcSelect("gc-event-start-time");
    var endInput = gcSelect("gc-event-end-time");
    var descriptionInput = gcSelect("gc-event-description");
    var accessTokenInput = gcSelect("gc-access-token");
    var calendarId = gcGetTrimmedValue(calendarInput);
    var title = gcGetTrimmedValue(titleInput);
    var dateValue = dateInput ? dateInput.value : "";
    var startTime = startInput ? startInput.value : "";
    var endTime = endInput ? endInput.value : "";
    var description = gcGetTrimmedValue(descriptionInput);
    var accessToken = gcGetTrimmedValue(accessTokenInput);
    var error = gcValidateCreateInputs(calendarId, title, dateValue, startTime, endTime, accessToken);
    if (error) {
        gcShowCreateMessage(error, false);
        return;
    }
    var startDateTime = gcBuildDateTimeValue(dateValue, startTime);
    var endDateTime = gcBuildDateTimeValue(dateValue, endTime);
    if (!startDateTime || !endDateTime) {
        gcShowCreateMessage("Please enter a valid date and time.", false);
        return;
    }
    gcShowCreateMessage("", false);
    gcSetCreateButtonLoading(true);
    var baseUrl = "https://www.googleapis.com/calendar/v3/calendars/";
    var calendarIdEncoded = encodeURIComponent(calendarId);
    var url = baseUrl + calendarIdEncoded + "/events?key=" + encodeURIComponent(gcApiKey);
    var body = {
        summary: title,
        description: description || "",
        start: {
            dateTime: startDateTime,
            timeZone: "UTC"
        },
        end: {
            dateTime: endDateTime,
            timeZone: "UTC"
        }
    };
    try {
        var response = await fetch(url, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + accessToken
            },
            body: JSON.stringify(body)
        });
        if (!response.ok) {
            if (response.status === 401 || response.status === 403) {
                gcShowCreateMessage("Authentication error. Please check your access token and permissions.", false);
                return;
            }
            if (response.status === 404) {
                gcShowCreateMessage("Calendar not found. Please check the calendar ID.", false);
                return;
            }
            if (response.status === 429) {
                gcShowCreateMessage("Too many requests. Please try again in a moment.", false);
                return;
            }
            gcShowCreateMessage("Request failed with status " + response.status + ".", false);
            return;
        }
        var data = await response.json();
        if (data && data.id) {
            gcShowCreateMessage("Event created successfully.", true);
            gcClearCreateForm();
        } else {
            gcShowCreateMessage("Event created, but response could not be read.", true);
            gcClearCreateForm();
        }
    } catch (e) {
        gcShowCreateMessage("Unable to reach the Google Calendar API. Please check your internet connection.", false);
    } finally {
        gcSetCreateButtonLoading(false);
    }
}

// dito yung mga buttons para gumana sila tsaka alligned kung ano kinlick mo if fetch ba or create.
function gcAttachEvents() {
    var button = gcSelect("gc-load-button");
    if (button) {
        button.addEventListener("click", function () {
            gcFetchEvents();
        });
    }
    var searchInput = gcSelect("gc-search-text");
    if (searchInput) {
        searchInput.addEventListener("keydown", function (event) {
            if (event.key === "Enter") {
                event.preventDefault();
                gcFetchEvents();
            }
        });
    }
    var createButton = gcSelect("gc-create-button");
    if (createButton) {
        createButton.addEventListener("click", function () {
            gcCreateEvent();
        });
    }
}

// dito yung parang starting point ng js lang.
function gcInit() {
    gcRenderEmptyState("Enter a calendar ID and choose your filters, then load events.");
    gcAttachEvents();
}

if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", function () {
        gcInit();
    });
} else {
    gcInit();
}


