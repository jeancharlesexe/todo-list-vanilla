let form_task = document.querySelector('#form-task');
let input_task = document.querySelector('#input-task');
let task_list = document.querySelector('#task-list');

let task_counter = 1;



form_task.addEventListener('submit', function(e) {
    e.preventDefault();

    let task_title = input_task.value;
    
    if(task_title) {

        let task = createNewTask(task_title);

        task_list.appendChild(task);

        updateProgressbar();
    }

    input_task.value = '';  
});

function createNewTask(task_title) {
    task = document.createElement('li');
    task.className = 'task-item';

    task.innerHTML = `
        <div class="task-info">
            <input type="checkbox" id="task-${task_counter}">
            <label for="task-${task_counter}">${task_title}</label>
        </div>
        <div class="task-settings">
            <button class="btn-edit">
                <img src="https://img.icons8.com/?size=30&id=AWPFmbr0eZkC&format=png&color=000000" alt="Editar">
            </button>
            <button class="btn-delete">
                <img src="https://img.icons8.com/?size=30&id=exEuV0xMCMYC&format=png&color=000000"  alt="Excluir">
            </button>
        </div>
    `

    task_counter++;

    return task;
}


task_list.addEventListener('click', function(e) { // se houver algum click na lista
    if(e.target.closest('.btn-edit')){
        
        let new_title = prompt("Editar tarefa: ", e.target.closest('.task-item').querySelector('label').textContent); 
    
        if(new_title) {
            e.target.closest('.task-item').querySelector('label').textContent = new_title;
        }
    }

    if(e.target.closest('.btn-delete')) { 
        if(confirm('Tem certeza que deseja excluir esta tarefa?')) {
            e.target.closest('.task-item').remove();
        }
    }

    if(e.target.closest('.task-info')) {
        e.target.closest('.task-item').classList.toggle('task-done');   
    }

    updateProgressbar();

});

function updateProgressbar(){
    let total_tasks = 0;
    let checked_tasks = 0;

    total_tasks = document.querySelectorAll('.task-item').length;
    checked_tasks = document.querySelectorAll('.task-item input:checked').length;


    let progress_info = document.querySelector('#progress-info');
    progress_info.textContent = `${checked_tasks}/${total_tasks} concluídos ${total_tasks === 0 ? 0 : ((100/total_tasks) * checked_tasks).toFixed(1)}%`;
}

updateProgressbar()