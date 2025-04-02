import { $ } from './utils.js';
const socket = io();

let userName = '';
let roomCount = 0;

const BOARD_SIZE = 20;
const board = Array(BOARD_SIZE).fill(null).map(_ => Array(BOARD_SIZE).fill(null));

$('#login-form').addEventListener('submit', (event) => {
    event.preventDefault();
    if (!$('#login-form input').value) return

    userName = $('#login-form input').value;
    $('#login-form').classList.add('hidden');
    $('.room-list').classList.remove('hidden');
    socket.emit('load room data');

});

socket.on('load room data', (rooms) => {
    $('.room-list').replaceChildren($('#make-room-btn'));
    console.log('load room data', rooms);

    for (const room of rooms) {
        renderRoomCard(room.id, room.players);
    }
});

$('#make-room-btn').addEventListener('click', () => {
    if (roomCount !== 0) return;

    const roomID = crypto.randomUUID();
    socket.emit('make room', { roomID, userName });
    renderRoomCard(roomID, [userName]);
    roomCount++;
    socket.emit('load room data');

});

function renderRoomCard(roomID, userNames = []) {
    const div = document.createElement('div');
    div.classList.add('card');
    div.innerHTML = `
        <img src="/img/${Math.floor(Math.random() * 10) + 1}.jpg" width="100" height="100" class="card-img-top" alt="This is an image">
        <div class="card-body">
            <h5 class="card-title">Người chơi:</h5>
            <ul class="list-group">
                ${userNames.map(userName => `<li class="list-group-item text-truncate" style="max-width: 103px;">${userName}</li>`).join('')}
            </ul>
            <button type="button" id="${roomID}" 
                class="btn ${userNames.length < 2 ? 'btn-outline-success' : 'btn-danger'}" 
                ${userNames.length < 2 ? '' : 'disabled'}
            >
                ${userNames.length < 2 ? 'Vào phòng' : 'Phòng đã đầy'}
            </button>
        </div>
    `;
    $('.room-list').appendChild(div);
    // console.log(div);

    document.getElementById(roomID).addEventListener('click', () => {
        console.log({ roomID, userName });
        socket.emit('join room', { roomID, userName });
        socket.emit('load room data');
    });
}

function renderBoard() {

}