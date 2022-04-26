const socket =io.connect();

/*/socket.on('productos',data=>{
    console.log(data);
})/*/

function renderProduct(data){
    const html = data.map((elem,index)=> {
        return (`<tr>
        <td> ${elem.nombre} </td>
        <td> ${elem.precio}</td>
        <td> <img src="${elem.url}" alt="noImg"></td>
        </tr>`)
    });
    document.getElementById('productos').innerHTML = html;
    }

    socket.on('productos',data=> {
        
        renderProduct(data);     
        });

    function addProducto(e){
        const producto = {
            nombre : document.getElementById('nombre').value,
            precio: document.getElementById('precio').value
        };
        socket.emit('new-product',producto);
        return false;
    }





    function renderMsj(data){
        const html = data.map((elem,index)=> {
            return ('<div><strong style="color:blue;" >' + elem.author +'</strong>: <em style="color:#7D6608" >[ ' + elem.date + ']</em><i style="color:#087D18">'+ elem.text +'</i></div>')
        }).join(" ");
        document.getElementById('messages').innerHTML = html;
        }
    
        socket.on('messages',data=>
            {renderMsj(data);     
            });
    
        function addMessage(e){
         
            const mensaje = {
                author : document.getElementById('username').value,
                date : new Date().toDateString(),
                text: document.getElementById('texto').value
            };
            socket.emit('new-message',mensaje);
            return false;
        }