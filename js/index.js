const form = document.getElementById("form")
const btn = document.getElementById("save-btn")
const searchInp = document.getElementById("search")
const contactList = document.getElementById("contactList")
const nameInput = document.getElementById("name")
const phoneInput = document.getElementById("phoneNumber")
const contactIdInput = document.getElementById("contactId")

let contact = JSON.parse(localStorage.getItem("my")) || []


document.addEventListener("DOMContentLoaded", () => {
  if (contact.length > 0) {
    displayContacts(contact)
  } else {
    fetchContacts()
  }
})



async function fetchContacts() {
  try {
    const response = await fetch("./contact.json")
    const data = await response.json()

    contact = data.contacts
    localStorage.setItem("my", JSON.stringify(contact))
    displayContacts(contact);

  } catch (error) {
    console.error("Error fetching contacts:", error)
  }
}


function displayContacts(list) {
  contactList.innerHTML = ""

  list.forEach(c => {
    const li = document.createElement("li")
    const strong = document.createElement("strong")

    strong.textContent = c.name
    li.append(strong, ` - ${c.phone}`)

    const editBtn = document.createElement("button")
    editBtn.textContent = "Edit"
    editBtn.className = "edit-btn"
    editBtn.addEventListener("click", () => editContact(c.id))

    const deleteBtn = document.createElement("button")
    deleteBtn.textContent = "Delete"
    deleteBtn.className = "delete-btn"
    deleteBtn.addEventListener("click", () => deleteContact(c.id))

    li.appendChild(editBtn)
    li.appendChild(deleteBtn)
    contactList.appendChild(li)
  })
}


function isValidPhone(phone) {
  return /^\+?\d{10,15}$/.test(phone)
}


form.addEventListener("submit", (e) => {
  e.preventDefault()

  btn.disabled = true
  btn.textContent = "Saving..."

  const name = nameInput.value.trim()
  const phone = phoneInput.value.trim()
  const id = contactIdInput.value
  const isEdit = id

  if (!name || !phone) {
    showToast("Fields cannot be blank", "error")
    resetButton(isEdit)
    return
  }

  if (!isValidPhone(phone)) {
    showToast("Invalid phone number", "error")
    resetButton(isEdit)
    return
  }

  if (isEdit) {
    if (contact.some(c => c.phone === phone && c.id !== id)) {
      showToast("Another contact with this phone number already exists", "error")
      resetButton(isEdit)
      return
    }

    const c = contact.find(c => c.id === id)
    c.name = name
    c.phone = phone
    showToast("Contact updated", "success")

  } else {
    if (contact.some(c => c.phone === phone)) {
      showToast("Contact with this phone number already exists", "error")
      resetButton(isEdit)
      return
    }

    contact.push({
      id: Date.now().toString(),
      name,
      phone
    })

    showToast("Contact saved", "success")
  }

  localStorage.setItem("my", JSON.stringify(contact))

  form.reset()
  contactIdInput.value = ""
  displayContacts(contact)
  resetButton(false)
})


function deleteContact(id) {
  if (!confirm("Are you sure you want to delete this contact?")) return

  contact = contact.filter(c => c.id !== id)

  localStorage.setItem("my", JSON.stringify(contact))

  displayContacts(contact)
  showToast("Contact deleted", "success")
}


function editContact(id) {
  const c = contact.find(c => c.id === id)
  if (!c) return

  nameInput.value = c.name
  phoneInput.value = c.phone
  contactIdInput.value = c.id
  btn.textContent = "Update Contact"
}


searchInp.addEventListener("input", () => {
  const query = searchInp.value.trim().toLowerCase()

  const filtered = contact.filter(c =>
    c.name.toLowerCase().includes(query) ||
    c.phone.toLowerCase().includes(query)
  )

  displayContacts(filtered)
})



function resetButton(isEdit) {
  btn.disabled = false
  btn.textContent = isEdit ? "Update Contact" : "Save Contact"
}

function showToast(message, type = "info") {
  const container = document.getElementById("toast-container")
  const toast = document.createElement("div")

  toast.className = `toast ${type}`
  toast.textContent = message
  container.appendChild(toast)

  setTimeout(() => toast.remove(), 3000)
}
