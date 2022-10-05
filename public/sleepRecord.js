async function buildSleepRecordsTable(sleepRecordsTable, sleepRecordsTableHeader, token, message) {
    try {
        response = await fetch('/api/v1/sleepRecords', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        })
        data = await response.json()
        
        var children = [jobsTableHeader]
        if (response.status === 200) {
            if (data.count === 0) {
                sleepRecordsTable.replaceChildren(...children) 
                return 0
            } else {
                for (let i=0;i<data.sleepRecords.length;i++) {
                    let editButton = `<td><button type="button" class="editButton" data-id=${data.sleepRecords[i]._id}>edit</button></td>`
                    let deleteButton = `<td><button type="button" class="deleteButton" data-id=${data.sleepRecords[i]._id}>delete</button></td>`
                    let rowHTML = `<td>${data.sleepRecords[i].date}</td><td>${data.sleepRecords[i].time}</td><td>${data.sleepRecords[i].result}</td>${editButton}${deleteButton}`
                    let rowEntry = document.createElement('tr')
                    rowEntry.innerHTML = rowHTML
                    children.push(rowEntry)
                }
                sleepRecordsTable.replaceChildren(...children)
            }
            return data.count
        } else {
            message.textContent = data.msg
            return 0
        }
    } catch (err) {
        //message.textContent = 'A communication error occurred.'
        return 0
    }
}

document.addEventListener('DOMContentLoaded', () => {
    const signoff = document.getElementById('signoff')
    const message = document.getElementById('message')
    const loginRegister = document.getElementById('login-register')
    const login = document.getElementById('login')
    const register = document.getElementById('register')
    const loginDiv = document.getElementById('login-div')
    const email = document.getElementById('email')
    const password = document.getElementById('password')
    const loginButton = document.getElementById('login-button')
    const loginCancel = document.getElementById('login-cancel')
    const registerDiv = document.getElementById('register-div')
    const name = document.getElementById('name')
    const email1 = document.getElementById('email1')
    const password1 = document.getElementById('password1')
    const password2 = document.getElementById('password2')
    const registerButton = document.getElementById('register-button')
    const registerCancel = document.getElementById('register-cancel')
    const sleepRecords = document.getElementById('sleepRecords')
    const sleepRecordsTable = document.getElementById('sleepRecords-table')
    const sleepRecordsTableHeader = document.getElementById('sleepRecords-table-header')
    const addSleepRecord = document.getElementById('add-sleepRecord')
    const editSleepRecord = document.getElementById('edit-sleepRecord')
    const date = document.getElementById('date')
    const time = document.getElementById('time')
    const result = document.getElementById('result')
    const addingSleepRecord = document.getElementById('adding-sleepRecord')
    const sleepRecordsMessage = document.getElementById('sleepRecords-message')
    const editCancel = document.getElementById('edit-cancel')
   

let showing = loginRegister
    let token = null
    document.addEventListener('startDisplay', async (e) =>{
        showing = loginRegister
        token = localStorage.getItem('token')
        if (token) { 
            signoff.style.display = "block"
            const count = await buildSleepRecordsTable(sleepRecordsTable, sleepRecordsTableHeader, token, message)
            if (count > 0) {
                sleepRecordsMessage.textContent=''
                sleepRecordsTable.style.display = "block"
            } else {
                sleepRecordsMessage.textContent = "There are no records to display for this user."
                sleepRecordsTable.style.display = 'none'
            }
            sleepRecords.style.display = "block"
            showing = sleepRecords
        } else {
            loginRegister.style.display = "block"
        }
    })

    var thisEvent = new Event('startDisplay')
    document.dispatchEvent(thisEvent)
    var suspendInput = false

document.addEventListener('click', async (e) => {
    if (suspendInput) {
        return 
    }
    if (e.target.nodeName === 'BUTTON') {
        message.textContent = ''
    }
    if (e.target === signoff) {
        localStorage.removeItem('token')
        token = null
        showing.style.display = "none"
        loginRegister.style.display = "block"
        showing = loginRegister
        sleepRecordsTable.replaceChildren(sleepRecordsTableHeader) 
        message.textContent = "You are signed off."
    } else if (e.target === login) {
        showing.style.display = "none"
        loginDiv.style.display = "block"
        showing = loginDiv
    } else if (e.target === register) {
        showing.style.display = "none"
        registerDiv.style.display = "block"
        showing = registerDiv
    } else if (e.target === loginCancel || e.target == registerCancel) {
        showing.style.display = "none"
        loginRegister.style.display = "block"
        showing = loginRegister
        email.value = ''
        password.value = ''
        name.value = ''
        email1.value = ''
        password1.value = ''
        password2.value = ''
    } else if (e.target === loginButton) {
        suspendInput = true
        try {
            response = await fetch('/api/v1/auth/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email: email.value, password: password.value })
            })
            data = await response.json()
            if (response.status === 200) {
                message.textContent = `Login successful.  Welcome ${data.user.name}`
                token = data.token
                localStorage.setItem('token', token)
                showing.style.display="none"
                thisEvent = new Event('startDisplay')
                email.value=''
                password.value=''
                document.dispatchEvent(thisEvent)
            } else {
                message.textContent = data.msg
            }
        } catch (err) {
          
            message.textContent = "A communications error occurred."
        }
        suspendInput = false;
    } else if (e.target === registerButton) {
        if (password1.value != password2.value) {
            message.textContent='The passwords entered do not match.'
        } else {
            suspendInput = true
            try {
                response = await fetch('/api/v1/auth/register', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ name: name.value, email: email1.value, password: password1.value })
                })
                data = await response.json()
                if (response.status === 201) {
                    message.textContent = `Registration successful.  Welcome ${data.user.name}`
                    token = data.token
                    localStorage.setItem('token', token)
                    showing.style.display="none"
                    thisEvent = new Event('startDisplay')
                    document.dispatchEvent(thisEvent)
                    name.value = ''
                    email1.value = ''
                    password1.value = ''
                    password2.value = ''
                } else {
                    message.textContent = data.msg
                }
            } catch (err) {
            
                message.textContent = "A communications error occurred."
            } 
            suspendInput=false
        } 
    } 
    else if (e.target === addSleepRecord) {
        showing.style.display = "none"
        editSleepRecord.style.display = 'block'
        showing = editSleepRecord
        delete editSleepRecord.dataset.id
        date.value = ''
        time.value = ''
        result.value = ''
        addingSleepRecord.textContent = 'Add'
    } else if (e.target === editCancel) {
        showing.style.display = 'none'
        date.value = ''
        time.value = ''
        result.value = ''
        thisEvent = new Event('startDisplay')
        document.dispatchEvent(thisEvent)
    } else if (e.target === addingSleepRecord) {
       
        if (!editSleepRecord.dataset.id) {
            suspendInput = true
            try {
                response = await fetch('/api/v1/sleepRecords', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    },
                    body: JSON.stringify( {
                        date: date.value,
                        time: time.value,
                        result: result.value
                    })
                })
                
                data = await response.json()
                
                if (response.status === 201) { 
                    message.textContent = 'The sleep entry was added.'
                    showing.style.display='none'
                    thisEvent = new Event('startDisplay')
                    document.dispatchEvent(thisEvent)
                    date.value = ''
                    time.value = ''
                    result.value = ''
                } else { 
                    message.textContent = data.msg 
                }
            } catch (err) {
                message.textContent = 'A communication error occurred.'
            }
            suspendInput = false
        } else { 
            suspendInput = true
            try {
                const sleepRecordID = editSleepRecord.dataset.id
                response = await fetch(`/api/v1/sleepRecords/${sleepRecordID}`, {
                    method: 'PATCH',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    },
                    body: JSON.stringify( {
                        date: date.value,
                        time: time.value,
                        result: result.value
                    })
                })
                data = await response.json()
                if (response.status === 200) {
                    message.textContent = 'The record was updated.'
                    showing.style.display = 'none'
                    date.value = ''
                    time.value = ''
                    result.value = 'good'
                    thisEvent = new Event('startDisplay')
                    document.dispatchEvent(thisEvent)
                } else {
                    message.textContent = data.msg
                }
            } catch(err) {    
                message.textContent = 'A communication error occurred.'
            }
        } 
        suspendInput = false 
    } 
    else if (e.target.classList.contains('editButton')) {
        editSleepRecord.dataset.id=e.target.dataset.id
        suspendInput = true
        try {
            response = await fetch(`/api/v1/sleepRecords/${e.target.dataset.id}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            })
            data = await response.json()
            if (response.status === 200) {
                date.value = data.sleepRecord.date
                time.value = data.sleepRecord.time
                result.value = data.sleepRecord.result
                showing.style.display = 'none'
                showing = editSleepRecord
                showing.style.display = 'block'
                addingSleepRecord.textContent = 'update'
                message.textContent = ''
            } else { 
                message.textContent = 'The sleep record was not found'
                thisEvent = new Event('startDisplay')
                document.dispatchEvent(thisEvent)
            }
        } catch (err) {
            message.textContent = 'A communications error has occurred.'
        }
        suspendInput = false
    } 

    else if (e.target.classList.contains('deleteButton')) {
        editSleepRecord.dataset.id=e.target.dataset.id
        suspendInput = true
        try {
            response = await fetch(`/api/v1/sleepRecords/${e.target.dataset.id}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            })
            data = await response.json()

            if (response.status === 200) {
            
                message.textContent = 'The sleep record was deleted.'
                showing.style.display="none"
                thisEvent = new Event('startDisplay')
                document.dispatchEvent(thisEvent)
            } 
            else { 
                message.textContent = 'The sleep record was not found.'
                thisEvent = new Event('startDisplay')
                document.dispatchEvent(thisEvent)
            }
        } catch (err) {
            message.textContent = 'A communications error has occurred.'
        }
        suspendInput = false
    } 

  })
})