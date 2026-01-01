const form = document.getElementById("form")
const btn = document.getElementById("save-btn")
const searchInp = document.getElementById("search")
const contactList = document.getElementById("contactList")
const nameInput = document.getElementById("name")
const phoneInput = document.getElementById("phoneNumber")
const contactIdInput = document.getElementById("contactId")


document.addEventListener("DOMContentLoaded", fetchContacts)
let contacts = []
async function fetchContacts() {
    try {
        const response = await fetch("http://localhost:3000/contacts")
        contacts = await response.json()
        displayContacts(contacts)
    } catch (error) {
        console.error("Error saving contact:", error)
    }
}

function displayContacts(contacts) {
    contactList.innerHTML = ""
    contacts.forEach(contact => {
        const li = document.createElement("li")
        li.innerHTML = `<strong>${contact.name} </strong> - ${contact.phone}`
        const editBtn = document.createElement("button")
        editBtn.textContent = "Edit"
        editBtn.addEventListener("click", () => editContact(contact.id))

        const deleteBtn = document.createElement("button")
        deleteBtn.textContent = "Delete"
        deleteBtn.addEventListener("click", () => deleteContact(contact.id))

        li.appendChild(editBtn)
        li.appendChild(deleteBtn)
        contactList.appendChild(li)
    })
}



function isValidPhone(phone) {
    const phoneRegex = /^\+?\d{10,15}$/
    return phoneRegex.test(phone)
}


form.addEventListener("submit", async (event) => {
    event.preventDefault()

    const name = nameInput.value.trim()
    const phone = phoneInput.value.trim()
    const id = contactIdInput.value

    if (name === "" || phone === "") {
        alert("Fields cannot be blank")
        return
    }

    if (!isValidPhone(phone)) {
        alert("Enter a valid phone number!")
        return
    }

    try {
            if (contacts.some(c => c.phone === phone)) {
                alert("Contact with this phone number already exists!")
                return
            }

            const newContact = { name, phone }

            await fetch("http://localhost:3000/contacts", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(newContact)
            })
        

        form.reset()
        fetchContacts()  // reload contacts after add/update
    } catch (error) {
        console.error("Error saving contact:", error)
    }
})





async function deleteContact(id) {
     if (!confirm("Are you sure you want to delete this contact?")) return
    try {
        await fetch(`http://localhost:3000/contacts/${id}`, {
            method: "DELETE"
        })

        contacts = contacts.filter(contact => contact.id != id)

        displayContacts(contacts)
    } catch (error) {
        console.error("Error deleting contact:", error)
    }
}



function editContact(id) {
    const contact = contacts.find(c => c.id == id)
    if (!contact) return

    nameInput.value = contact.name
    phoneInput.value = contact.phone
    contactIdInput.value = contact.id

    btn.textContent = "Update Contact"
}