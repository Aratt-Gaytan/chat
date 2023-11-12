$(function () {
    const socket = io();
    var nick = '';
    const messageForm = $('#message-form');
    const messageBox = $('#message');
    const chat = $('#chat');

    const nickForm = $("#nick-form");
    const nickError = $("#nick-error");
    const nickName = $("#nick-name");

    const userNames = $("#usernames");
    const contenido = userNames.text();
    const comp = [];

    messageForm.submit( e => {
        e.preventDefault();
        socket.emit('enviar mensaje', messageBox.val());
        messageBox.val('');
    });

    socket.on('nuevo mensaje', function(datos){
        
        let color =  "#f4f4f4";

        if(nick == datos.username){
            color = "#9ff4c5";
        }

        chat.append(`<div class="msg-area mb-2 d-flex" style="background-color: ${color}"><b>${datos.username} :</b><p class="msg">${datos.msg}</p></div>`)
    });

        nickForm.submit(e =>{
            e.preventDefault();
            socket.emit('nuevo usuario', nickName.val(), datos =>{
                if(datos){
                    nick = nickName.val();
                    $('#nick-wrap').hide();
                    $('#content-wrap').show();
                }else{
                    
                    nickError.html('<div class="alert alert-danger">El usuario ya existe</div>' );
                }

                nickName.val('');
            });
        });

    socket.on('nombre usuario', datos => {

        let actual = '';
        let nombre = '';
        let html = '';
        let color = '';
        let fontWeight;

        console.log('este es actual: ',nickName.val());

        for (let x = 0; x < datos.length; x++) {
            nombre = (datos[x]);
            // console.log(nombre);
            comp.push(nombre);
        }
        for (let i = 0; i < datos.length; i++) {
            actual = datos[i];
            if (nick == datos[i]) {
                color = "#027f43";
                fontWeight = "bold";
            } else {
                color = "#000";
                fontWeight = "normal";
            }
                for(j = 0; j < comp.length; j++){
                    if(comp[j] == datos[i]){
                    }       
                }
                    html += `<p style="color: ${color}; font-weight: ${fontWeight}">${datos[i]}</p>`; 
        }
    
        userNames.html(html);
    });
})