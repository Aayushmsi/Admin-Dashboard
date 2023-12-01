let userData = [];
let selectedRows = [];

async function fetchUserData() {
    try {
        const response = await fetch('https://geektrust.s3-ap-southeast-1.amazonaws.com/adminui-problem/members.json');
        if (!response.ok) {
            throw new Error('Failed to fetch user data');
        }

        userData = await response.json();
        renderUserList();
    } catch (error) {
        console.error(error);
    }
}

function renderUserList(page = 1) {
    const userListBody = document.getElementById("userListBody");
    userListBody.innerHTML = "";

    const startIndex = (page - 1) * 10;
    const endIndex = startIndex + 10;
    const displayedUsers = userData.slice(startIndex, endIndex);

    displayedUsers.forEach(user => {
        const row = document.createElement("tr");

        const selectCell = document.createElement("td");
        const selectCheckbox = document.createElement("input");
        selectCheckbox.type = "checkbox";
        selectCheckbox.checked = selectedRows.includes(user.id);
        selectCheckbox.addEventListener("change", () => selectRow(user.id));
        selectCell.appendChild(selectCheckbox);
        row.appendChild(selectCell);

        const idCell = document.createElement("td");
        idCell.textContent = user.id;
        row.appendChild(idCell);

        const nameCell = document.createElement("td");
        nameCell.textContent = user.name;
        row.appendChild(nameCell);

        const actionsCell = document.createElement("td");
        const editButton = createActionButton("Edit", () => editRow(user.id));
        const deleteButton = createActionButton("Delete", () => deleteRow(user.id));
        actionsCell.appendChild(editButton);
        actionsCell.appendChild(deleteButton);
        row.appendChild(actionsCell);

        userListBody.appendChild(row);
    });

    updatePagination(page);
}

function createActionButton(text, onClick) {
    const button = document.createElement("button");
    button.textContent = text;
    button.addEventListener("click", onClick);
    return button;
}

function updatePagination(currentPage) {
    const paginationContainer = document.querySelector(".pagination");
    paginationContainer.innerHTML = "";

    const itemsPerPage = 10;

    // Apply search/filter if any

    const filteredUsers = applySearchFilter();

    const totalFilteredPages = Math.ceil(filteredUsers.length / itemsPerPage);

    const firstPageButton = createPaginationButton("First", 1);
    const prevPageButton = createPaginationButton("Previous", currentPage - 1);
    paginationContainer.appendChild(firstPageButton);
    paginationContainer.appendChild(prevPageButton);

    for (let i = 1; i <= totalFilteredPages; i++) {
        const pageButton = createPaginationButton(String(i), i);
        paginationContainer.appendChild(pageButton);
    }

    const nextPageButton = createPaginationButton("Next", currentPage + 1);
    const lastPageButton = createPaginationButton("Last", totalFilteredPages);
    paginationContainer.appendChild(nextPageButton);
    paginationContainer.appendChild(lastPageButton);

    // Ensure currentPage does not go beyond the last page
    if (currentPage > totalFilteredPages) {
        renderUserList(totalFilteredPages);
    }
}

function applySearchFilter() {
    const searchInput = document.getElementById("searchInput").value.toLowerCase().trim();

    // Use filter to get matching users based on search input
    const filteredUsers = userData.filter(user => {
        return user.name.toLowerCase().includes(searchInput) ||
               user.email.toLowerCase().includes(searchInput) ||
               user.role.toLowerCase().includes(searchInput);
    });

    return filteredUsers;
}

function createPaginationButton(text, page) {
    const button = document.createElement("button");
    button.textContent = text;
    button.addEventListener("click", () => goToPage(page));
    return button;
}

function goToPage(page) {
    if (page >= 1 && page <= Math.ceil(userData.length / 10)) {
        renderUserList(page);
    }
}

function selectRow(userId) {
    const selectedRowIndex = selectedRows.indexOf(userId);

    if (selectedRowIndex === -1) {
        selectedRows.push(userId);
    } else {
        selectedRows.splice(selectedRowIndex, 1);
    }

    renderUserList();
}

function deleteRow(userId) {
    // Simulated API call to delete a user
    // In a real scenario, this would be an asynchronous API request
    userData = userData.filter(user => user.id !== userId);
    selectedRows = selectedRows.filter(selectedId => selectedId !== userId);
    renderUserList();
}

function deleteSelected() {
    // Simulated API call to delete selected users
    // In a real scenario, this would be an asynchronous API request
    userData = userData.filter(user => !selectedRows.includes(user.id));
    selectedRows = [];
    renderUserList();
}

function editRow(userId) {
    const userIndex = userData.findIndex(user => user.id === userId);

    if (userIndex !== -1) {
        const newName = prompt("Enter new name:", userData[userIndex].name);
        if (newName !== null) {
            userData[userIndex].name = newName;
            renderUserList();
        }
    }
}

// Initial fetch of user data
fetchUserData();

