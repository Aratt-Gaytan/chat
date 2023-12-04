$(function() {

    const socket = io();

    //Obtener elementos del DOM de la interfaz
    const $messageForm = $('#message-form');
    const $messageBox = $('#message');
    const $chat = $('#chat');

    //Obtener elementos del DOM de NickNameForm
    const $nickForm = $('#nickForm');
    const $nickError = $('#nickError');
    const $nickname = $('#nickname');

    const $users = $('#usernames');

    $nickForm.submit(e =>{
        e.preventDefault();
        socket.emit('new user', $nickname.val(), function(data){
            if(data){
                $('#nickWrap').hide();
                $('#contentWrap').show();
            }else{
                $nickError.html(`
                
                <div class="alert alert-danger">
                Ese usuario ya existe
                </div>

                `);
            }
            $nickname.val('')
        });
    });

    //eventos
    $messageForm.submit( e => {
        e.preventDefault();
        socket.emit('send message', $messageBox.val(), data => {
            $chat.append(`<p class="error">${data}</p>`)
        });
        $messageBox.val('')
    });

    socket.on('new message', function(data) {
        $chat.append('<b>' + data.nick + '</b>: ' + data.msg + '<br/>');
    });

    socket.on('usernames', data => {
        let html = '';
        for(let i = 0; i < data.length; i++) {
            html += `<p><ion-icon name="person-outline"></ion-icon> ${data[i]} </p>`
        }
        $users.html(html);
    });

    socket.on('whisper', data =>{
        $chat.append(`<p class="whisper"><b>${data.nick}</b> ${data.msg}</p>`)
    });

    socket.on('load old msgs', msgs => {
        for (let i = 0; i < msgs.length; i++) {
            displayMsg(msgs[i]);
        }
    });
    
    function displayMsg(data) {
        $chat.append(`<p class="whisper"><b>${data.Nombre}</b>: ${data.mensaje}</p>`);
    }
})