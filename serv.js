const express = require('express');
const cors = require('cors');
const app = express();

app.use(express.json())
app.use(cors());

var tasks = [
    {
        idTd : "fresh-1",
        task : "Keep smiling!!!"
    },{
        idTd : "fresh-2",
        task : "Laugh out loud!!"
    }
]

function findTodo(index){
    for(let i = 0; i < tasks.length; i++){
        if(tasks[i].idTd === index){
            return i;
        }
    }
    return -1;
}


var lastEl = tasks.length - 1;

app.get('/getLastEl', function(req, res) {
    const todo = tasks[lastEl];
    res.json(todo); 
});


app.post('/addTodo',function(req,res){
    const task = req.body.task;
    lastEl += 1;
    tasks.push({
        idTd : "fresh-"+ (lastEl + 1),
        task : task
    });

    res.status(200).send({});
});


app.delete('/deleteTodo', function(req,res){
    const id = req.body.id;
    const index = findTodo(id);
    

    if(index !== -1){
        tasks.splice(index, 1);  
        lastEl = tasks.length - 1;          //reseting the lastEl index
        res.status(202).send({});
    }else{
        res.status(404).send({});
    }

    
});


app.put('/editTodo', function(req,res){
    const supIndex =  req.body.id;
    const newTask = req.body.edited;
    const id = findTodo(supIndex);
    if(id === -1){
        res.status(404).send("tf bhai!!");
    }else{
        tasks[id].task = newTask;
        res.status(202).send("done!!");
    }
})



app.listen(3002, function() {
    console.log('Server is running on port 3002');
});
