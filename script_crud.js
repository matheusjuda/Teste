const taskListContainer = document.querySelector('.app__section-task-list')

const formTask = document.querySelector('.app__form-add-task')
const toggleFormTaskBtn = document.querySelector('.app__button--add-task')
const formLabel = document.querySelector('.app__form-label')

const cancelFormTaskBtn = document.querySelector('.app__form-footer__button--cancel')

const textarea = document.querySelector('.app__form-textarea')

const btnCancelar = document.querySelector('.app__form-footer__button--cancel')
const btnDeletar = document.querySelector('.app__form-footer__button--delete')

const btnDeletarConcluidas = document.querySelector('#btn-remover-concluidas')
const btnDeletarTodas = document.querySelector('#btn-remover-todas')

const localStorageTarefas = localStorage.getItem('tarefas')
let tarefas = localStorageTarefas ? JSON.parse(localStorageTarefas) : [] // se já estiver alguma tarefa no localStorage (guarga irformação apenas em string) o metodo JSON.parse vai trasnformar o texto string em um objeto tarefas.

//Constante que receberá como valor o caminho completo de uma imagem SVG. Se a tarefa estiver concluída, o ícone do check fica verde.
const taskIconSvg = `
<svg class="app__section-task-icon-status" width="24" height="24" viewBox="0 0 24 24"
    fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="12" cy="12" r="12" fill="#FFF" />
    <path
        d="M9 16.1719L19.5938 5.57812L21 6.98438L9 18.9844L3.42188 13.4062L4.82812 12L9 16.1719Z"
        fill="#01080E" />
</svg>
`

let tarefaSelecionada = null
let itemTarefaSelecionada = null

let tarefaEmEdicao = null
let paragraphEmEdicao = null

const removerTarefas = (somenteConcluidas) => {
    const seletor = somenteConcluidas ? '.app__section-task-list-item-complete' : '.app__section-task-list-item'
    document.querySelectorAll(seletor).forEach((element) => {
        element.remove();
    });

    tarefas = somenteConcluidas ? tarefas.filter(t => !t.concluida) : []
    updateLocalStorage()
}

const selecionaTarefa = (tarefa, elemento) => {  // Mostra se a tarefa foi selecionada
    if (tarefa.concluida) { //Se a tarefa for concluida não pode ser selecionada
        return
    }

    document.querySelectorAll('.app__section-task-list-item-active').forEach(function (button) {
        button.classList.remove('app__section-task-list-item-active')
    })

    if (tarefaSelecionada == tarefa) {
        itemTarefaSelecionada = null
        tarefaSelecionada = null
        return
    }

    tarefaSelecionada = tarefa
    itemTarefaSelecionada = elemento
    elemento.classList.add('app__section-task-list-item-active')
}

const limparForm = () => {
    tarefaEmEdicao = null
    paragraphEmEdicao = null
    textarea.value = '' // atribuindo o valo ' ' ao texto
    formTask.classList.add('hidden') // fromulario sendo fechado
}

const selecionaTarefaParaEditar = (tarefa, elemento) => {
    if(tarefaEmEdicao == tarefa) { // limpando o campo quando apertar para editar
        limparForm()
        return
    }

    formLabel.textContent='Editando tarefa' //Mudando o titulo do form
    tarefaEmEdicao=tarefa
    paragraphEmEdicao=elemento
    textarea.value = tarefa.descricao
    formTask.classList.remove('hidden')
}

function createTask(tarefa) { //Criando tag li  (uma tarefa)
    const li = document.createElement('li')  //item lista
    li.classList.add('app__section-task-list-item') // criando uma classe para o li (estilizar)

    const svgIcon = document.createElement('svg') //item img svg
    svgIcon.innerHTML = taskIconSvg //svg já foi importado, só escrevendo ele no html

    const paragraph = document.createElement('p') // item parafrafo
    paragraph.classList.add('app__section-task-list-item-description')

    paragraph.textContent = tarefa.descricao //adicionando ao paragrafo  tarefa (descrição)

    const button = document.createElement('button') // iniciando o botão

    button.classList.add('app__button-edit')
    const editIcon = document.createElement('img') //criando elemento imagem no html
    editIcon.setAttribute('src', '/imagens/edit.png')

    button.appendChild(editIcon)

    button.addEventListener('click', (event) =>{ // se o botão de edição for clicado
        event.stopPropagation()
        selecionaTarefaParaEditar(tarefa, paragraph)
    })

    li.onclick = () => { //Se a tarefa receber um click chama a função selecionaTarefa
        selecionaTarefa(tarefa, li)
    }

    svgIcon.addEventListener('click', (event) => { //Quando houver um click no icone de tarefa feita faça a função
        if (tarefa == tarefaSelecionada) {
            event.stopPropagation() //evitando que proprague para outro elemento
            button.setAttribute('disabled', true)
            li.classList.add('app__section-task-list-item-complete') //Criando uma classe para ser estilizado na hora de clicar no item
            tarefaSelecionada.concluida = true
            updateLocalStorage()
        }
    })

    if(tarefa.concluida){ //se a tarefa foi concluida
        button.setAttribute('disabled', true) //o botão seja inabilitado e passe o parametro true
        li.classList.add('app__section-task-list-item-complete')
    }

    li.appendChild(svgIcon) //pegando os elementos gerados (filho) e jogando dentro da tarefa (pai)
    li.appendChild(paragraph)
    li.appendChild(button)
    
    return li
}

//usando o forEach para acessar/percorrer cada objeto do array. task é um parametro fake q apenas falo oq fazer com os objetos do array
tarefas.forEach(task => {
    const taskItem = createTask(task) // chamo a função criandoTarefa e como parametro usamos o item do array (criando um li no objeto)
    taskListContainer.appendChild(taskItem) // escrevo no html o valor que estiver no itemTarefas (LI)
})

cancelFormTaskBtn.addEventListener('click', () => { // evento click para o botão cancelar.
    formTask.classList.add('hidden') //formulario sendo escondido/fechado
})

btnCancelar.addEventListener('click', limparForm) //evento para quando apertar botão cancelar, limpar o formulario

toggleFormTaskBtn.addEventListener('click', () => {//adicionando um evento click ao botão, a arrow function indica oque vai fazer nesse event
    formLabel.textContent = 'Adicionando tarefa' //Modificando o texto no html
    formTask.classList.toggle('hidden') //alterando a visibilidade do formulário.
})

btnDeletar.addEventListener('click', () => { //Evento botão deletar
    if (tarefaSelecionada) {
        const index = tarefas.indexOf(tarefaSelecionada);// Achando a posição correta da tarefa na lista
        if (index !== -1) { //confirmação
            tarefas.splice(index, 1); //Removendo a tarefa
        }
        
        itemTarefaSelecionada.remove() //Remevendo a tarefa do html
        tarefas.filter(t => t != tarefaSelecionada) //Criando um novo array sem a tarefa removida
        itemTarefaSelecionada = null
        tarefaSelecionada = null
    }

    updateLocalStorage() //Removendo do localstorage
    limparForm()
})

const updateLocalStorage = () => { //atualiza o localStorage 
    localStorage.setItem('tarefas', JSON.stringify(tarefas)) //passando a informação pro localStorage. transformando o objeto tarefa em string
}

//adicionando um form task para executar um evento de submit, porque vamos enviar uma informação. recebendo o evento por uma arrow function
formTask.addEventListener('submit', (evento) => {
    evento.preventDefault() //preventdefault, para ser um evento padrão
    if(tarefaEmEdicao) {
        tarefaEmEdicao.descricao = textarea.value
        paragraphEmEdicao.textContent = textarea.value
    } else {
    const task = { //recriando o array tarefas 
        descricao: textarea.value, //com a desrição contendo o titulo da tarefa
        concluida: false //Como padrão ela ser falsa
    }
    tarefas.push(task) //enviar essa texto que recebemos através do evento do submit para o array tarefas
    const taskItem = createTask(task) // chamando a função para criar uma tarefa
    taskListContainer.appendChild(taskItem) //escrevendo no html as informações geradas
}
    updateLocalStorage()
    limparForm()
})

btnDeletarConcluidas.addEventListener('click', () => removerTarefas(true))
btnDeletarTodas.addEventListener('click', () => removerTarefas(false))

// Quando selecionamos a tarefa e começamos o cronometro dps que o cronometro acaba a tarefa é finalizada (concluida)
document.addEventListener("TarefaFinalizada", function (e) { 
    if (tarefaSelecionada) {
        tarefaSelecionada.concluida = true
        itemTarefaSelecionada.classList.add('app__section-task-list-item-complete')
        itemTarefaSelecionada.querySelector('button').setAttribute('disabled', true)
        updateLocalStorage()
    }
});