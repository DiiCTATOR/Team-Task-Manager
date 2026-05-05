(async () => {
  const res = await fetch('http://localhost:5000/api/auth/register', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name: "Test", email: "test2@example.com", password: "pwd", role: "Admin" })
  });
  console.log(res.status, await res.text());
})();
