const myForm  = document.querySelector('#taskForm') 
const titleInput = document.querySelector('#title')
const descInput = document.querySelector('#description')
const statusInput = document.querySelector('#status-input')
const priorityInput = document.querySelector('#priority-input')
const submitBtn = document.querySelector('.submit-btn')
const tbody = document.querySelector(".tbody")
const searchInput = document.querySelector('#Search')

let isEditingId = null;
let taskList = JSON.parse(localStorage.getItem('data')) ?? []
showData(taskList)
//Storage utility Function
const saveToLocalStorage=(list)=>{
  localStorage.setItem('data',JSON.stringify(list))
}
//Delete Function
const handleDelete= (id)=>{
  const res = confirm(`Do You To Delete Selected Task with ${id}?`)
  if(res!='true') return
  taskList = taskList.filter((item)=> item.id!==id)
  showData(taskList)
  saveToLocalStorage(taskList)
}

const clearForm=()=>{
  titleInput.value = ""
  descInput.value = ""
  statusInput.value="pending"
  priorityInput.value = "normal"
}
//handle Check
const handleCheck=(e,tr,id)=>{
  tr.style.backgroundColor =   e.target.checked ? '#50C878' : ''
  const statusCell = tr.querySelector('.status-cell')
  statusCell.innerHTML = e.target.checked ? 'completed' : 'pending'
  taskList = taskList.map((item)=>{
      if(item.id==id){
        return {...item , status : e.target.checked ? 'completed' :'pending' }
      }
      return item;
  })
  saveToLocalStorage(taskList)
}
//edit Function
const handleEdit = (id,title,description) =>{
  isEditingId = id;

  titleInput.value = title
  descInput.value = description
  submitBtn.innerHTML = 'Save'
}
searchInput.addEventListener('input',(e)=>{ 
  let query = e.target.value
  console.log(query)
  let filteredList = taskList.filter((item)=> item.title.toLocaleLowerCase().includes(query.toLocaleLowerCase()))
  showData(filteredList)
})
//Form Submit
myForm.addEventListener('submit',(e)=>{
  e.preventDefault()
  let newEntry = {}
  let formData = new FormData(myForm);
  for (const [key,value] of formData)
  {
    newEntry[key] = value;
  }
  if(isEditingId)
  {
    taskList = taskList.map((item)=>{
      if(item.id === isEditingId)
      {
        return {...newEntry,id:isEditingId};
      }
      return item
    })
    submitBtn.innerHTML = 'Submit'
    showData(taskList)
    isEditingId = null;
    saveToLocalStorage(taskList)
    clearForm()
    return
  } 
  newEntry = {...newEntry , id: taskList.length+1}
  taskList.push(newEntry)
  
  showData(taskList)
  saveToLocalStorage(taskList)
  clearForm()
})

function showData(data){
  tbody.innerHTML = ""
  //For Empty Data Functionality
  if(data.length===0){
    const messageDiv = document.createElement('div');
    messageDiv.innerHTML = `<h2>No Data Found......<h2/>`
    messageDiv.classList.add('message')
    tbody.append(messageDiv)
  }
  data.map(({id,title,description,status,priority,isCheck})=>{
    const tr = document.createElement('tr')
    tr.style.backgroundColor = status=='completed'? '#50C878' :''
    const content =`<td>${id}</td>
            <td>${title}</td>
            <td>${description}</td>
            <td class='status-cell'>${status}</td>
            <td><div class="priority ${priority=='high' ? 'red-priority': priority=='low'? 'green-priority' : ''}">${priority}</div></td>
            <td>
              <div class='icons'>
              <i class="fas fa-edit edit-icon"></i>
              <i class="fa fa-trash delete-icon " aria-hidden="true data-${id}"></i>
              <input type='checkbox' ${status!='completed'?'checked' : " "}checked  class="status check-icon" > </input>        
              </div>
            </td>`  
            tr.innerHTML = content;
            tbody.appendChild(tr)

            const editIcon = tr.querySelector('.edit-icon')
            editIcon.addEventListener('click',()=>handleEdit(id,title,description))

            const deleteIcon = tr.querySelector('.delete-icon') 
            deleteIcon.addEventListener('click',()=>handleDelete(id))   
            
            const checkInput = tr.querySelector('.check-icon')
            checkInput.addEventListener('click',(e)=>handleCheck(e,tr,id))
})
}
