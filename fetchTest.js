// send fetch request to /createLog it takes jwt



async function test() {
    const logData = {
        url: 'https://example.com', // Current page URL
        censorStatus: 'Censored',      // Whether the page was censored or not
    };
    
    const res = await fetch('http://127.0.0.1:5050/api/v1/log/createLog', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY3NzAwMmJlOWQ3OWNiM2QzMWQ2NzVlMiIsImlhdCI6MTczNTQwOTU2OSwiZXhwIjoxNzM1NDEwMTczfQ.m7b6KU7FuUG16ySleoaj0kiGaWlmgErvXmtjmD_q-u8`, // Include the token in the request header
        },
        body: JSON.stringify(logData),
    })
    console.log(res);
    
}
test()