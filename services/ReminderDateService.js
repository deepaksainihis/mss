const frequencyMonths = {
  monthly: 1,
  quarterly: 3,
  half_yearly: 6,
  yearly: 12,
  custom: 1
};

function toDateOnly(date) {
  if (typeof date === 'string') {
    return date.slice(0, 10);
  }
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

function parseDateOnly(dateValue) {
  const [year, month, day] = toDateOnly(dateValue).split('-').map(Number);
  return { year, month, day };
}

function lastDayOfMonth(year, month) {
  return new Date(year, month, 0).getDate();
}

function addFrequency(dateValue, frequency, anchorDay = null) {
  const { year, month, day } = parseDateOnly(dateValue);
  const targetDay = anchorDay || day;
  const months = frequencyMonths[frequency] || 1;
  const targetMonthIndex = month - 1 + months;
  const targetYear = year + Math.floor(targetMonthIndex / 12);
  const targetMonth = (targetMonthIndex % 12) + 1;
  const safeDay = Math.min(targetDay, lastDayOfMonth(targetYear, targetMonth));
  const date = new Date(targetYear, targetMonth - 1, safeDay);

  return toDateOnly(date);
}

function nextAfterDate(dateValue, frequency, afterDate = new Date()) {
  const anchorDay = parseDateOnly(dateValue).day;
  let nextDate = addFrequency(dateValue, frequency, anchorDay);
  const after = toDateOnly(afterDate);

  while (nextDate <= after) {
    nextDate = addFrequency(nextDate, frequency, anchorDay);
  }

  return nextDate;
}

function subtractDays(dateValue, days) {
  const { year, month, day } = parseDateOnly(dateValue);
  const date = new Date(year, month - 1, day);
  date.setDate(date.getDate() - Number(days || 0));
  return toDateOnly(date);
}

function isNotificationDue(donationDate, daysBefore = 3, today = new Date()) {
  if (!donationDate) return false;
  return subtractDays(donationDate, daysBefore) <= toDateOnly(today);
}

module.exports = {
  addFrequency,
  nextAfterDate,
  subtractDays,
  isNotificationDue
};
