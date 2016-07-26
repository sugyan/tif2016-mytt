import 'whatwg-fetch';

fetch('/api/timetable.json').then((response) => {
    return response.json();
}).then((json) => {
    json.forEach((e) => {
        window.console.log(JSON.stringify(e));
    });
}).catch((err) => {
    window.console.error(err);
});
