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
console.error("Error fetching contacts:", error)
    }
}

function displayContacts(contacts) {
    contactList.innerHTML = ""
    contacts.forEach(contact => {
        const li = document.createElement("li")
        const strong = document.createElement("strong")
strong.textContent = contact.name
li.append(strong, ` - ${contact.phone}`)

        const editBtn = document.createElement("button")
        editBtn.textContent = "Edit"
        editBtn.className = "edit-btn"

        editBtn.addEventListener("click", () => editContact(contact.id))
        const deleteBtn = document.createElement("button")
        deleteBtn.textContent = "Delete"
        deleteBtn.addEventListener("click", () => deleteContact(contact.id))
deleteBtn.className = "delete-btn"

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
  const isEdit = Boolean(id)   

  if (!name || !phone) {
    showToast("Fields cannot be blank","error")
    resetButton(isEdit)
    return
  }

  if (!isValidPhone(phone)) {
showToast("Contact with this phone number already exists", "error")
    resetButton(isEdit)
    return
  }

  try {
    if (isEdit) {
      if (contacts.some(c => c.phone === phone && c.id !== id)) {
        showToast("Another contact with this phone number already exists","error")
        resetButton(isEdit)

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
        showToast("Contact with this phone number already exists","error")
          resetButton(isEdit)

        return
      }

      await fetch("http://localhost:3000/contacts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, phone })
      })
    }

    form.reset()
    fetchContacts()
    showToast(isEdit ? "Contact updated" : "Contact saved", "success")


  } catch (error) {
    console.error("Error saving contact:", error)
  } finally {
    resetButton(isEdit)
  }
})





async function deleteContact(id) {
     if (!confirm("Are you sure you want to delete this contact?")) return
    try {
        await fetch(`http://localhost:3000/contacts/${id}`, {
            method: "DELETE"
        })

        contacts = contacts.filter(contact => contact.id !== id)

        displayContacts(contacts)
        showToast("Contact deleted", "success")

    } catch (error) {
        console.error("Error deleting contact:", error)
    }
}



function editContact(id) {
    const contact = contacts.find(c => c.id === id)
    if (!contact) return

    nameInput.value = contact.name
    phoneInput.value = contact.phone
    contactIdInput.value = contact.id

    btn.textContent = "Update Contact"
}

function resetButton(isEdit) {
  btn.disabled = false
  btn.textContent = isEdit ? "Update Contact" : "Save Contact"
}

function showToast(message, type = "info",duration) {
  const container = document.getElementById("toast-container")
  const toast = document.createElement("div")

  toast.className = `toast ${type}`
  toast.textContent = message

  container.appendChild(toast)

  setTimeout(() => {
    toast.remove()
  }, 3000)
}



searchInp.addEventListener("input", () => {
const query = searchInp.value.trim().toLowerCase()
    const filtered = contacts.filter(c =>
        c.name.toLowerCase().includes(query) ||
        c.phone.includes(query)
    )
    displayContacts(filtered)
})
