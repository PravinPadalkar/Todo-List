const tbody = document.querySelector(".tbody")
const myForm  = document.querySelector('#taskForm') 
const titleInput = document.querySelector('#title')
const descInput = document.querySelector('#description')
const submitBtn = document.querySelector('.submit-btn')
const searchInput = document.querySelector('#Search')
let isEditingId = null;
let taskList = [
  {
    id: 1,
    title: 'xyz',
    description: "fddfdf",
    status : 'Pending',
    priority : 'high'
  },
  {
    id: 2,
    title: 'abcd',
    description: "fddfdf",
    status : 'Pending',
    priority : 'normal'
  },
  {
    id: 3,
    title: 'abc',
    description: "fddfdf",
    status : 'Pending',
    priority : 'low'
  },
];

showData(taskList)

//Delete Function
const handleDelete= (id)=>{
  console.log(id)
  taskList = taskList.filter((item)=> item.id!==id)
  showData(taskList)
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
    return
  } 
  newEntry = {...newEntry , id: taskList.length+1}
  taskList.push(newEntry)
  
  showData(taskList)
})

function showData(data){
  tbody.innerHTML = ""
  //For Empty Data Functionality
  // if(data.length===0){
  //   tbody.innerHTML
  // }
  data.map(({id,title,description,status,priority})=>{
    const tr = document.createElement('tr')
    const content =`<td>${id}</td>
            <td>${title}</td>
            <td>${description}</td>
            <td>${status}</td>
            <td><div class="priority ${priority=='high' ? 'red-priority': priority=='low'? 'green-priority' : ''}">${priority}</div></td>
            <td>
              <div class='icons'>
              <i class="fas fa-edit edit-icon"></i>
                <i class="fa fa-trash delete-icon " aria-hidden="true data-${id}"></i>
              </div>
            </td>`  
            tr.innerHTML = content;
            tbody.appendChild(tr)

            const editIcon = tr.querySelector('.edit-icon')
            editIcon.addEventListener('click',()=>handleEdit(id,title,description))

            const deleteIcon = tr.querySelector('.delete-icon') 
            deleteIcon.addEventListener('click',()=>handleDelete(id))       
})
}
