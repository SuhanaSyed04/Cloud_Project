const foodForm = document.getElementById("foodForm");
const foodList = document.getElementById("foodList");
const foodSection = document.getElementById("foodSection");
const requestModal = document.getElementById("requestModal");
const requestForm = document.getElementById("requestForm");
const closeModal = document.getElementById("closeModal");
let selectedFoodId = null;

// Fetch and display available food posts
async function fetchFoodPosts() {
  const res = await fetch("/api/posts");
  const foodPosts = await res.json();

  if (foodPosts.length > 0) {
    foodSection.style.display = "block"; // Show available foods section
  } else {
    foodSection.style.display = "none"; // Hide available foods section
  }

  foodList.innerHTML = foodPosts
    .map(
      (post) => `
      <li>
        <strong>${post.name}</strong> (${post.location}):
        <p>${post.description}</p>
        <button onclick="openRequestModal('${post.id}')">Request Food</button>
      </li>
    `
    )
    .join("");
}

// Open request modal
function openRequestModal(foodId) {
  selectedFoodId = foodId;
  requestModal.style.display = "block";
}


// Close request modal
closeModal.addEventListener("click", () => {
  requestModal.style.display = "none";
  requestForm.reset();
  selectedFoodId = null;
});

// Handle food posting
foodForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  const name = document.getElementById("name").value;
  const location = document.getElementById("location").value;
  const description = document.getElementById("description").value;

  const res = await fetch("/api/posts", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name, location, description }),
  });

  if (res.ok) {
    alert("Food post added successfully!");
    foodForm.reset();
    fetchFoodPosts();
  } else {
    const data = await res.json();
    alert(data.message);
  }
});

// Handle food requests
requestForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  const name = document.getElementById("requesterName").value;
  const location = document.getElementById("requesterLocation").value;

  const res = await fetch("/api/requests", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name, location, foodId: selectedFoodId }),
  });

  if (res.ok) {
    alert("Food request submitted successfully!");
    requestModal.style.display = "none";
    fetchFoodPosts(); // Refresh the list
  } else {
    const data = await res.json();
    alert(data.message);
  }
});

// Initial fetch
fetchFoodPosts();
