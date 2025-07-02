const input = document.getElementById('imageUrlInput');
const btn = document.getElementById('analyzeBtn');
const imgPreview = document.getElementById('imagePreview');
const imgPreviewContainer = document.getElementById('imagePreviewContainer');
const resultContainer = document.getElementById('resultContainer');

input.addEventListener('input', () => {
    const url = input.value.trim();
    if (url) {
        imgPreview.src = url;
        imgPreviewContainer.style.display = 'block';
    } else {
        imgPreviewContainer.style.display = 'none';
        imgPreview.src = '';
    }
    resultContainer.innerHTML = '';
});

btn.addEventListener('click', async () => {
    const url = input.value.trim();
    if (!url) {
        resultContainer.innerHTML = '<span style="color:red">Por favor, ingresa un enlace de imagen válido.</span>';
        return;
    }
    resultContainer.innerHTML = 'Analizando...';
    try {
        const apiUrl = `https://spoonacular-recipe-food-nutrition-v1.p.rapidapi.com/food/images/analyze?imageUrl=${encodeURIComponent(url)}`;
        const options = {
            method: 'GET',
            headers: {
                'x-rapidapi-key': 'AQUI SU LLAVE GRATUITA',
                'x-rapidapi-host': 'spoonacular-recipe-food-nutrition-v1.p.rapidapi.com'
            }
        };
        const response = await fetch(apiUrl, options);
        if (!response.ok) throw new Error('No se pudo analizar la imagen.');
        const data = await response.json();
        renderResult(data);
    } catch (err) {
        resultContainer.innerHTML = `<span style='color:red'>Error: ${err.message}</span>`;
    }
});

function renderResult(data) {
    if (!data.category || !data.nutrition) {
        resultContainer.innerHTML = '<span style="color:red">No se pudo obtener información de la imagen.</span>';
        return;
    }
    let html = `<h2>Resultado</h2>`;
    html += `<p><b>Plato:</b> ${data.category.name.replace('_', ' ')}<br>`;
    html += `<b>Probabilidad:</b> ${(data.category.probability * 100).toFixed(1)}%</p>`;
    html += `<h3>Perfil nutricional promedio</h3>`;
    html += `<div class='nutrition-bar'><div class='bar bar-calories' style='width:${Math.min(100, data.nutrition.calories.value / 8)}%'></div><span class='nutrition-value'>${data.nutrition.calories.value} kcal</span></div>`;
    html += `<div class='nutrition-bar'><div class='bar bar-fat' style='width:${Math.min(100, data.nutrition.fat.value * 3)}%'></div><span class='nutrition-value'>${data.nutrition.fat.value}g grasa</span></div>`;
    html += `<div class='nutrition-bar'><div class='bar bar-protein' style='width:${Math.min(100, data.nutrition.protein.value * 3)}%'></div><span class='nutrition-value'>${data.nutrition.protein.value}g proteína</span></div>`;
    html += `<div class='nutrition-bar'><div class='bar bar-carbs' style='width:${Math.min(100, data.nutrition.carbs.value * 3)}%'></div><span class='nutrition-value'>${data.nutrition.carbs.value}g carbohidratos</span></div>`;
    if (data.recipes && data.recipes.length > 0) {
        html += `<h3>Recetas sugeridas</h3><ul>`;
        data.recipes.forEach(r => {
            html += `<li><a href='${r.url}' target='_blank'>${r.title}</a></li>`;
        });
        html += `</ul>`;
    }
    resultContainer.innerHTML = html;
} 