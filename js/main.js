$(document).ready(function() {
  const months = [
    "Januari", "Februari", "Mars", "April", "Maj", "Juni",
    "Juli", "Augusti", "September", "Oktober", "November", "December"
  ];

  const daysOfWeekSwedish = [
    "Sön", "Mån", "Tis", "Ons", "Tor", "Fre", "Lör"
  ];

  let currentMonth;
  let currentYear;

  function updateCalendar() {
    const daysContainer = $("#days");
    const monthYearHeader = $("#month-year");
    daysContainer.empty();

    const currentDate = new Date();
    const firstDayOfMonth = new Date(currentYear, currentMonth, 1);
    const lastDayOfMonth = new Date(currentYear, currentMonth + 1, 0);

    monthYearHeader.text(`${months[currentMonth]} ${currentYear}`);

    for (let i = 1; i <= lastDayOfMonth.getDate(); i++) {
      const date = new Date(currentYear, currentMonth, i);
      const dateString = date.toISOString().split('T')[0];

      let notification = localStorage.getItem(dateString);
      const isCurrentDate = date.toDateString() === currentDate.toDateString();

      const dayOfWeek = daysOfWeekSwedish[date.getDay()];

      if (notification !== null) {
        daysContainer.append(`
          <tr class="day ${isCurrentDate ? 'is-current' : ''}" data-date="${dateString}">
            <td class="is-narrow">${i}</td>
            <td>${dayOfWeek} <span class="tag is-dark is-pulled-right">${notification}</span></td>
          </tr>
        `);
      } else {
        daysContainer.append(`
          <tr class="day ${isCurrentDate ? 'is-current' : ''}" data-date="${dateString}">
            <td class="is-narrow">${i}</td>
            <td>${dayOfWeek}</td>
          </tr>
        `);
      }
    }

    // Red color for sundays
    $("td:contains('Sön')").css("color", "#F70B17").prev('td').css("color", "#F70B17");

    // Scroll to todays date
    $('html, body').animate({
      scrollTop: $('.is-current').prev('tr').offset().top
    }, 'slow');
  }

  function loadCurrentDate() {
    const currentDate = new Date();
    currentMonth = currentDate.getMonth();
    currentYear = currentDate.getFullYear();
    updateCalendar();
  }

  function prevMonth() {
    if (currentMonth === 0) {
      currentMonth = 11;
      currentYear--;
    } else {
      currentMonth--;
    }
    updateCalendar();
  }

  function nextMonth() {
    if (currentMonth === 11) {
      currentMonth = 0;
      currentYear++;
    } else {
      currentMonth++;
    }
    updateCalendar();
  }

  // Event handler for clicking on a note
  $(document).on('click', '.day .tag', function(event) {
    event.stopPropagation();
    const date = $(this).parent().parent().data('date');
    const notification = $(this).text();

    // Show a confirmation dialog
    const shouldRemove = window.confirm(`Vill du ta bort denna händelse?\n\n${notification}`);
    if (shouldRemove) {
      localStorage.removeItem(date);
      updateCalendar();
    }
  });

  $(document).on('click', '.day', function() {
    const date = $(this).data('date');
    const notification = prompt("Lägg till en händelse för detta datum:");
    if (notification !== null) {
      localStorage.setItem(date, notification);
      updateCalendar();
    }
  });

  $("#prev-btn").on('click', prevMonth);
  $("#next-btn").on('click', nextMonth);

  // Initialize the calendar
  loadCurrentDate();
});
