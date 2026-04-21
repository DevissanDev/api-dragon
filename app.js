const API_URL = "https://dragonball-api.com/api/characters";
const LIMIT = 12;

const charactersContainer = document.getElementById("characters");
const statusElement = document.getElementById("status");
const prevButton = document.getElementById("prev-btn");
const nextButton = document.getElementById("next-btn");
const pageInfo = document.getElementById("page-info");

let currentPage = 1;
let totalPages = 1;

function setStatus(message) {
	statusElement.textContent = message;
	statusElement.style.display = message ? "block" : "none";
}

function createCharacterCard(character) {
	const card = document.createElement("article");
	card.className = "card";

	const hasGender = Boolean(character.gender);
	const extraLabel = hasGender ? "Género" : "Afiliación";
	const extraValue = character.gender || character.affiliation || "No disponible";

	card.innerHTML = `
		<img src="${character.image}" alt="${character.name}">
		<div class="card-content">
			<h2>${character.name || "Sin nombre"}</h2>
			<p><strong>Raza:</strong> ${character.race || "No disponible"}</p>
			<p><strong>${extraLabel}:</strong> ${extraValue}</p>
		</div>
	`;

	return card;
}

function renderCharacters(characters) {
	charactersContainer.innerHTML = "";

	characters.forEach((character) => {
		const card = createCharacterCard(character);
		charactersContainer.appendChild(card);
	});
}

function updatePagination() {
	pageInfo.textContent = `Página ${currentPage} de ${totalPages}`;
	prevButton.disabled = currentPage <= 1;
	nextButton.disabled = currentPage >= totalPages;
}

async function fetchCharacters(page = 1) {
	try {
		setStatus("Cargando...");
		prevButton.disabled = true;
		nextButton.disabled = true;

		const response = await fetch(`${API_URL}?page=${page}&limit=${LIMIT}`);

		if (!response.ok) {
			throw new Error("Error al consultar la API");
		}

		const data = await response.json();
		const characters = Array.isArray(data) ? data : data.items || [];
		const meta = data.meta || {};

		currentPage = Number(meta.currentPage) || page;
		totalPages = Number(meta.totalPages) || 1;

		renderCharacters(characters);
		updatePagination();
		setStatus("");
	} catch (error) {
		charactersContainer.innerHTML = "";
		setStatus("Error al cargar los personajes.");
		pageInfo.textContent = "";
	}
}

prevButton.addEventListener("click", () => {
	if (currentPage > 1) {
		fetchCharacters(currentPage - 1);
	}
});

nextButton.addEventListener("click", () => {
	if (currentPage < totalPages) {
		fetchCharacters(currentPage + 1);
	}
});

fetchCharacters();
