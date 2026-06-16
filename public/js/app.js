document.addEventListener('submit', (event) => {
  const button = event.target.querySelector('button[type="submit"], button:not([type])');
  if (button && !button.dataset.keepEnabled) {
    button.disabled = true;
    button.dataset.originalText = button.textContent;
    button.textContent = 'Please wait...';
  }
});

const frequencyMonths = {
  monthly: 1,
  quarterly: 3,
  half_yearly: 6,
  yearly: 12,
  custom: 1
};

function dateOnly(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

function addMonths(dateValue, months) {
  const [year, month, day] = dateValue.split('-').map(Number);
  const targetMonthIndex = month - 1 + months;
  const targetYear = year + Math.floor(targetMonthIndex / 12);
  const targetMonth = (targetMonthIndex % 12) + 1;
  const lastDay = new Date(targetYear, targetMonth, 0).getDate();
  const date = new Date(targetYear, targetMonth - 1, Math.min(day, lastDay));

  return dateOnly(date);
}

const frequencyInput = document.querySelector('[name="donation_frequency"]');
const reminderDateInput = document.querySelector('[name="next_reminder_date"]');

if (frequencyInput && reminderDateInput) {
  let baseReminderDate = null;

  function applyNextReminderDate() {
    const months = frequencyMonths[frequencyInput.value] || 1;
    if (baseReminderDate) {
      reminderDateInput.value = addMonths(baseReminderDate, months);
    }
  }

  reminderDateInput.addEventListener('change', () => {
    if (reminderDateInput.value) {
      baseReminderDate = reminderDateInput.value;
      applyNextReminderDate();
    }
  });

  frequencyInput.addEventListener('change', applyNextReminderDate);
}
