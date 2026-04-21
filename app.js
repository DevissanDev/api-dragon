const API_URL = "https://dragonball-api.com/api/characters?limit=24";

const charactersContainer = document.getElementById("characters");
const statusElement = document.getElementById("status");

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

async function fetchCharacters() {
	try {
		setStatus("Cargando...");

		const response = await fetch(API_URL);

		if (!response.ok) {
			throw new Error("Error al consultar la API");
		}

		const data = await response.json();
		const characters = Array.isArray(data) ? data : data.items || [];

		renderCharacters(characters);
		setStatus("");
	} catch (error) {
		charactersContainer.innerHTML = "";
		setStatus("Error al cargar los personajes.");
	}
}

fetchCharacters();
