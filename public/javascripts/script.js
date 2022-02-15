function getParameterByName(name) {
    name = name.replace(/[\[\]]/g, '\\$&');
    var regex = new RegExp('[?&]' + name + '(=([^&#]*)|&|#|$)'),
        results = regex.exec(window.location.href);
    if (!results) return null;
    if (!results[2]) return '';
    return decodeURIComponent(results[2].replace(/\+/g, ' '));
}
var uname = getParameterByName('username');
var loc = getParameterByName('location');
if (uname && loc) {
    const socket = io('', { reconnectionDelayMax: 10000, query: { "username": uname, "location": loc } });

    socket.on('history', function (data) {
        $('#messages').empty();
        data.map((msg) => {
            var item = document.createElement('li');
            let className = msg.limit_reached ? 'reward' : '';
            let featuredTweet = msg.limit_reached ? `<div class="ribbon base"><span><i>Pinned Tweet!!</i></span></div>` : '';
            var html = `
            <div>
                <div class="card ${className}">
                    ${featuredTweet}
                    <div class="card-body ">
                        <blockquote class="blockquote mb-0">
                        <p>${msg.text}</p>
                        <footer class="blockquote-footer ">@${msg.username} from <cite title="Source Title">${msg.location}</cite></footer>
                        </blockquote>
                    </div>
                    
                </div>
            </div>`
            item.innerHTML = html;
            messages.appendChild(item);
            window.scrollTo(0, document.body.scrollHeight);
        });
    });
    socket.on('new_tweet', function (msg) {
        var item = document.createElement('li');
        let className = msg.limit_reached ? 'reward' : '';
        var html = `
            <div class="card ${className}">
                <div class="card-body">
                    <blockquote class="blockquote mb-0">
                    <p>${msg.text}</p>
                    <footer class="blockquote-footer ">@${msg.username} from <cite title="Source Title">${msg.location}</cite></footer>
                    </blockquote>
                </div>
            </div>`
        item.innerHTML = html;
        // item.innerHTML = `<div class="alert ${className}" role="alert"> ${msg.username}: ${msg.text}</div>`;
        messages.appendChild(item);
        window.scrollTo(0, document.body.scrollHeight);
    });

    var form = document.getElementById('form');
    var input = document.getElementById('input');

    form.addEventListener('submit', function (e) {
        e.preventDefault();
        if (input.value) {
            socket.emit('new_tweet', { text: input.value, username: uname, location: loc });
            input.value = '';
        }
    });
}