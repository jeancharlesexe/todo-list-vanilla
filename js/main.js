let form_task = document.querySelector('#form-task'); // elemento formulario
let input_task = document.querySelector('#input-task'); // elemento input (onde a task vai ser digitada)
let task_list = document.querySelector('#task-list'); // elemento ul (onde as task vai ser inserida)
let btn_hide = document.querySelector('#btn-hide'); // botão de esconder/mostrar tarefas concluídas


let task_counter = 0; // simulando ID, começa por 0

// função para pegar o maior ID das tasks
function getMaxTaskId() {
    let maxId = 0;
    document.querySelectorAll('.task-item input[type="checkbox"]').forEach(checkbox => { // pega todos os checkbox
        let id = parseInt(checkbox.id.split('-')[1]); // splita a classe e pega o id (formato: task-1, task-2 etc..)
        if (id > maxId) {
            maxId = id;
        }
    });
    return maxId;
}

task_counter = getMaxTaskId() + 1; // começar acima do maior id encontrado

// função para adicionar uma nova task
form_task.addEventListener('submit', function(e) {
    e.preventDefault(); // evita o submit prosseguir

    let task_title = input_task.value; // pega o valor do input
    
    if(task_title) {
        let task = createNewTask(task_title); // cria uma task passando o titulo como parametro (retorna um elemento LI)
        task_list.appendChild(task); // adiciona a task na lista (UL)

        saveTasks(); // salva o novo estado das tasks
        updateProgressbar(); // atualiza a barra de progresso
    }

    input_task.value = '';  // limpa o input
});

// ufnção para criar um elemento LI (task)
function createNewTask(task_title) {
    task = document.createElement('li'); // cria um elemento LI
    task.className = 'task-item'; // adiciona a classe task-item

    // adiciona dentro desse elemento os sub-elementos (checkbox, label, botões de editar e excluir)
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
    `;
    task_counter++; // incrementa no contador de task mais uma task criada
 
    return task; // retorna o elemento criado
}


// função para observar clicks na lista de tasks
task_list.addEventListener('click', function(e) {
    //editar
    if(e.target.closest('.btn-edit')){
        let new_title = prompt("Editar tarefa: ", e.target.closest('.task-item').querySelector('label').textContent);  
        
        if(new_title) {
            e.target.closest('.task-item').querySelector('label').textContent = new_title;
            saveTasks();  
            updateProgressbar();
        }
    }

    // excluir
    if(e.target.closest('.btn-delete')) { 
        if(confirm('Tem certeza que deseja excluir esta tarefa?')) {
            e.target.closest('.task-item').remove();
            saveTasks();  
            updateProgressbar();
        }
    }

    // marcar o checkbox
    if(e.target.closest('.task-info')) {
        e.target.closest('.task-item').classList.toggle('task-done');  
        saveTasks();  
        updateProgressbar();
    }

    // sempre salvando o novo estado das task e atualizando a barra de progresso
    // obs: colocado individualmente nos ifs para evitar chamadas por cliques sem necessidade
});

// evento de click no botão de esconder/mostrar tarefas concluídas
btn_hide.addEventListener('click', function() { 
    checked_tasks = document.querySelectorAll('.task-done').forEach(function(task) { // pega todas as tasks concluídas
        if(task.style.display === 'none') { // se estiver oculta, mostra
            btn_hide.textContent = 'Ocultar tarefas concluídas';
            task.style.display = 'flex';
        }else{ // se estiver visível, oculta
            task.style.display = 'none';
            btn_hide.textContent = 'Mostrar tarefas concluídas';
        }
    })

})

// função para atualizar barra de progresso
function updateProgressbar(){
    let total_tasks = 0;
    let checked_tasks = 0;

    total_tasks = document.querySelectorAll('.task-item').length; // pega todas as tasks
    checked_tasks = document.querySelectorAll('.task-item input:checked').length; // pega todas as tasks concluídas

    let percentage = total_tasks === 0 ? 0 : (100/total_tasks) * checked_tasks; //d escobre a porcentagem de tasks concluídas

    // o texto dentro da barra de taref1
    let progress_info = document.querySelector('#progress-info');
    progress_info.textContent = `${checked_tasks}/${total_tasks} concluídos ${percentage.toFixed(1)}%`;

    // barra de progresso em si
    let progressBar = document.querySelector('.progress-content');
    progressBar.style.width = `${percentage}%`; // aumenta a largura do elemento fazendo o efeito de preenchimento

    // arrumando a borda da barra de progresso quando chega no final
    if (percentage === 100) {
        progressBar.style.borderRadius = '23px';
    } else {
        progressBar.style.borderRadius = '23px 0 0 23px';
    }
}

// função para salvar o estado atual das tasks no local storage
function saveTasks() {
    let tasks = []; // lista de tasks

    let taskElements = document.querySelectorAll('.task-item'); // seleciona todas as listas atuais
    for(let i = 0; i < taskElements.length; i++) { // percorre cada uma
        tasks.push({ // e adiciona na lista a estrutura json a seguir
            title: taskElements[i].querySelector('label').textContent,
            done: taskElements[i].querySelector('input[type="checkbox"]').checked
        });
    }

    localStorage.setItem('tasks', JSON.stringify(tasks)); // json feita, joga no local storage
}


// função para carregar as taks salvas no local storage
function loadTasks() {
    let tasks = localStorage.getItem('tasks'); // pega o json salvo
    if (tasks) { // se nao tiver vazio 
        tasks = JSON.parse(tasks);
        tasks.forEach(task => { // percorre cada uma
            let taskElement = createNewTask(task.title); // captura o titulo e cria um elemento LI
            if (task.done) { // se a task estiver concluída ativa o checkbox e muda a classe para done
                taskElement.querySelector('input[type="checkbox"]').checked = true;
                taskElement.classList.add('task-done');
            }
            task_list.appendChild(taskElement); // incrementa a task na lista (UL)
        });

        updateProgressbar(); // atualiza a barra de progresso
    }
}

document.addEventListener('DOMContentLoaded', loadTasks); // quando a página carregar, carrega as tasks salvas
updateProgressbar() // e carrega a barra de progresso