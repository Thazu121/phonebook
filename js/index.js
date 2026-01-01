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
form.addEventListener("submit", async (e) => {
    e.preventDefault()

    btn.disabled = true
    btn.textContent = "Saving..."

    const name = nameInput.value.trim()
    const phone = phoneInput.value.trim()
    const id = contactIdInput.value

    if (!name || !phone) {
        alert("Fields cannot be blank")
        btn.disabled = false
        btn.textContent = id ? "Update Contact" : "Save Contact"
        return
    }

    if (!isValidPhone(phone)) {
        alert("Enter a valid phone number")
        btn.disabled = false
        btn.textContent = id ? "Update Contact" : "Save Contact"
        return
    }

    try {
        if (id) {
            if (contacts.some(c => c.phone === phone && c.id != id)) {
                alert("Another contact with this phone number already exists")
                return
            }

            await fetch(`http://localhost:3000/contacts/${id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ name, phone })
            })

            contactIdInput.value = ""

        } else {
            if (contacts.some(c => c.phone === phone)) {
                alert("Contact with this phone number already exists")
                return
            }

            await fetch("http://localhost:3000/contacts", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ name, phone })
            })
        }

        form.reset()
        await fetchContacts()

    } catch (error) {
        console.error("Error saving contact:", error)

    } finally {
        btn.disabled = false
        btn.textContent = contactIdInput.value ? "Update Contact" : "Save Contact"
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

searchInp.addEventListener("input", () => {
    const query = searchInp.value.toLowerCase()
    const filtered = contacts.filter(c =>
        c.name.toLowerCase().includes(query) ||
        c.phone.includes(query)
    )
    displayContacts(filtered)
})
