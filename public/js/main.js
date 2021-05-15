const state = document.querySelector('#state');
const distict = document.querySelector('#distict');
const form = document.querySelector('#form');

(function init() {
    fetchState();
})()


function fetchState() {
    fetch('https://cdn-api.co-vin.in/api/v2/admin/location/states')
        .then(res => res.json())
        .then(data => renderOptions(data, state, {
            id: 'state_id',
            name: 'state_name',
            main: 'states'
        }))
        .catch(err => {
            console.log(err);
        })
}

function getDate(date) {
    var arr = date.split("-");
    return arr.reverse().join("-");
}


state.addEventListener('change', (e) => {
    var id = e.target.value;
    fetch(`https://cdn-api.co-vin.in/api/v2/admin/location/districts/${id}`)
        .then(res => res.json())
        .then(data => renderOptions(data, distict, {
            id: 'district_id',
            name: 'district_name',
            main: 'districts'
        }))
        .catch(err => {
            console.log(err);
        })
});

function getDataObj() {
    var formData = new FormData(form);
    var obj = {};
    for (var key of formData.keys()) {
        obj[key] = formData.get(key);
    }
    return obj;
}


form.addEventListener('submit', function (e) {
    e.preventDefault();
    var data = getDataObj();
    var { distict, date } = data;
    date = getDate(date);

    fetch(`https://cdn-api.co-vin.in/api/v2/appointment/sessions/public/findByDistrict?district_id=${distict}&date=${date}`)
        .then(res => res.json())
        .then(data => render(null, data))
        .catch(err => {
            render(err);
        })
});





function renderOptions(obj, selectRef, mapper) {
    var optionList = obj[mapper['main']].map(data => {
        var option = document.createElement('option');
        option.value = data[mapper['id']];
        option.textContent = data[mapper['name']];
        return option;
    });

    selectRef.append(...optionList);
}

function freeUp() {
    var tbody = document.querySelector("#table > tbody");
    if (tbody) {
        tbody.remove();
    }

    var noDatadDiv = document.querySelector("#table .no-data");
    if (noDatadDiv) {
        noDatadDiv.remove();
    }

    var errorDiv = document.querySelector("#table .error");
    if (errorDiv) {
        errorDiv.remove();
    }
}

function renderError() {
    freeUp();
    var div = document.createElement("div");
    div.className = "error";
    div.innerHTML = "Something Went wrong";
    table.appendChild(div);
}

function renderNodata() {
    freeUp();

    var div = document.createElement("div");
    div.className = "no-data";
    div.innerHTML = "No data";
    table.appendChild(div);
}

function renderData({ sessions }) {
    freeUp();

    var mapper = [
        "name",
        "address",
        "from",
        "to",
        "slots",
        "vaccine",
        "min_age_limit",
        "fee_type",
    ];

    var tbody = document.createElement("tbody");
    sessions.forEach((obj) => {
        var tr = document.createElement("tr");
        mapper.forEach((key) => {
            var td = document.createElement("td");
            td.textContent = obj[key];
            tr.appendChild(td);
        });
        tbody.appendChild(tr);
    });
    table.appendChild(tbody);
}

function render(err, data) {
    if (err) return renderError();
    if (data.sessions.length == 0) return renderNodata();

    renderData(data);
}