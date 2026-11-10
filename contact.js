'use strict';
document.getElementById('contact-form').addEventListener('submit', event => {
  event.preventDefault();
  const name = document.getElementById('name').value.trim();
  const email = document.getElementById('email').value.trim();
  const message = document.getElementById('message').value.trim();
  const subject = encodeURIComponent(`TravelBloom inquiry from ${name}`);
  const body = encodeURIComponent(`Name: ${name}\nEmail: ${email}\n\n${message}`);
  const status = document.getElementById('contact-status');
  status.textContent = 'Your email draft is ready. This course demo does not send messages. ';
  const link = document.createElement('a');
  link.href = `mailto:hello@travelbloom.example?subject=${subject}&body=${body}`;
  link.textContent = 'Open email draft';
  status.append(link);
});
