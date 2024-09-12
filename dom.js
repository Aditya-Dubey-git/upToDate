
function toggleCheckBox(checkId, textId){
    const checkBox = document.getElementById(checkId);
    const textBox = document.getElementById(textId);

    if(checkBox.checked){
        textBox.classList.add('completed');
    }else{
        textBox.classList.remove('completed');
    }
}



async function addTodo(){
    const inputEl = document.getElementById('inputField');
    const task = inputEl.value;
    inputEl.value = '';
    
    const response = await fetch('http://localhost:3002/addTodo',{
        method : 'POST',
        headers : {
            'content-type' : 'application/json',
        },
        body : JSON.stringify({task})
    });

    if(response.status === 200){
        renderInsert();
    }else{
        alert("Server Issue");
    }
}

async function editTodo(freshTxId){
    const index = freshTxId.split('-')[1];
    const spanEl = document.getElementById(freshTxId);
    const editBtn = document.getElementById("editBtn-" + index );

    if(spanEl.contentEditable === "false" || spanEl.contentEditable === "inherit"){
        spanEl.contentEditable = true;
        spanEl.focus();

        editBtn.classList.add('editClicked');
        editBtn.innerHTML = "Done";

        const chkBx = document.getElementById("freshIn-" + index);
        if(chkBx.checked){
            spanEl.classList.remove('completed');
            chkBx.checked = false;

        }

    }else{
        editBtn.classList.remove('editClicked');  //reseting the button
        editBtn.innerHTML = "Edit";

        spanEl.contentEditable = false;         //reseting the contetnEditable

        const editedTodo = spanEl.innerHTML;        //retreving the new todo

        const response = await fetch('http://localhost:3002/editTodo',{   //PUT fetch api
            method : 'PUT',
            headers : {
                'Content-Type' : 'application/json' 
            },
            body : JSON.stringify({
                'id' : index,
                'edited' : editedTodo
            })
        });

        if(response.status === 202){
            alert('Done');
        }
    }
}


async function deleteTodo(taskId){
    const task = document.getElementById(taskId);
    const list = document.getElementById('todoCont');

    if(task && list){
        list.removeChild(task);
    }
    const response = await fetch('http://localhost:3002/deleteTodo',{
        method : 'DELETE',
        headers : {
            'Content-Type' : 'application/json'
        },
        body : JSON.stringify({
            'id' : taskId
        })
    })

    if(response.status !== 202){
        alert('Server issue')
    }
}




async function renderInsert(){
    const response = await fetch('http://localhost:3002/getLastEl',{
        method : 'GET',
        headers :{}
    });

    const {idTd, task} = await response.json();    //note the variable must match the key of the json
    const index = idTd.split('-')[1];

    //1 input, 1 span , 2 button

    const chkBx = document.createElement('input');
    const spanEl = document.createElement('span');
    const editBtn = document.createElement('button');
    const deleteBtn = document.createElement('button');

    const contDiv = document.createElement('div');
    const div1 = document.createElement('div');
    const div2 = document.createElement('div');

    contDiv.classList.add('todoEl');
    contDiv.id = 'fresh-' + index;

        
    //checkbox
    chkBx.type = 'checkbox';
    chkBx.id = 'freshIn-' + index;
    chkBx.checked = false;
    chkBx.onclick = function(){
        toggleCheckBox( "freshIn-" + index, "freshTx-" + index);
    }


    //span
    spanEl.classList.add('text');
    spanEl.id = "freshTx-" + index;
    spanEl.innerHTML = task;
    spanEl.contentEditable = false;


    //pushing checkbox and span in div1
    div1.appendChild(chkBx);
    div1.appendChild(spanEl);


    //edit button
    editBtn.classList.add('buttons', 'edit');
    editBtn.id = "editBtn-" + index;
    editBtn.onclick = function(){
        editTodo('freshTx-' + index);
    }
    editBtn.innerHTML = "Edit";


    //dlete
    deleteBtn.classList.add('buttons', 'delete');
    deleteBtn.onclick = function(){
        deleteTodo('fresh-' + index);
    };
    deleteBtn.innerHTML = "Delete";


    //pusing delete and edit in div2
    div2.appendChild(editBtn);
    div2.appendChild(deleteBtn);

    //pushing div1 and div2 into container div
    
    contDiv.appendChild(div1);
    contDiv.appendChild(div2);

    //pushing cont div to the main html body
    const containerBody = document.getElementById('todoCont');
    containerBody.appendChild(contDiv);

}