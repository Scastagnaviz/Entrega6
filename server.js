const express = require ('express');
const {Server: IOServer} = require('socket.io');
const {Server: HttpServer} = require('http');

const  PORT = 8080;
const app = express();
const httpServer = new HttpServer(app)
const io = new IOServer (httpServer)

app.use(express.json());
app.use(express.urlencoded({extended:true}))
app.use(express.static('./public'))

const fs = require('fs');  
const messages= [];
app.set('view engine','ejs');

class contenedor{
    constructor(archivo){
        this.cont = 0 ;
        this.arr= [];
        this.archivo = archivo;
    }
    save(obj){
        try{
       this.cont ++ ;
       obj.id = this.cont;
       this.arr.push(obj);
       fs.writeFileSync(this.archivo,JSON.stringify(this.arr))
        }
         catch{
             console.log('error al leer el archivo')
         }
            
    }
    getAll(){
        return this.arr;
    }
    getByiD(id){
        try {
         return  this.arr.find(producto => id == producto.id);
        } catch (error) {
            console.log(error);
            return null;
        }
}
deleteById(id){
    let i  =this.arr.indexOf(this.getByiD(id));
     this.arr.splice(i,1);
       fs.writeFileSync(this.archivo,JSON.stringify(this.arr))
       }
       
editById(id,obj){
           
        try {
        obj.id=id;
       let  indice= this.arr.findIndex(obj=>obj.id==id);
          this.arr[indice]=obj;
           fs.writeFileSync(this.archivo,JSON.stringify(this.arr))
           } catch (error) {
               console.log(error);
               return null;
           }   
    }
}

httpServer.listen(PORT,()=> console.log('SERVER ON'))


let conten = new contenedor('./productos.json');
conten.save({"nombre": 'heladera' ,"precio": 123 ,"url": 'https://cdn3.iconfinder.com/data/icons/solid-amenities-icon-set/64/Refrigerator_2-128.png'});
conten.save({"nombre": 'Microondas' ,"precio": 443 ,"url": 'https://cdn2.iconfinder.com/data/icons/cooking-56/64/16-kitchenware-microwave_oven-electronics-microwave-heating-cooking-128.png'});
conten.save({"nombre": 'Cafetera' ,"precio": 1616 ,"url": 'url3'});
conten.save({"nombre": 'Arrocera' ,"precio": 2204 ,"url": 'url4'});

app.get('/productos',function(req,res){
    let productos = conten.getAll();

    res.render('pages/index',{
        productos : productos,

    });
});

app.get('/form',function(req,res){
    let productos = conten.getAll();
    res.render('pages/form',{
        productos : productos,
    });
  

    io.on('connection',function(socket){
        console.log('Un cliente se ha conectado');
        socket.emit('productos',productos);
    
        socket.on('new-product',data=>{
            productos.push(data);
            io.sockets.emit('productos',productos);
     
        });

        socket.emit('messages',messages);

        socket.on('new-message',data=>{
          
            messages.push(data);
            io.sockets.emit('messages',messages);
            fs.writeFileSync('history.json',JSON.stringify(messages));
         })
})
})


app.post('/productos',function(req,res){
    conten.save(req.body);
    res.redirect('/productos');
})

