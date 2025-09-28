document.addEventListener('DOMContentLoaded', function() {
    loadData();
    loadResults();

    const saveBtn = document.getElementById('saveBtn');
    saveBtn.addEventListener('click', saveData);

    const refreshBtn = document.getElementById('refreshBtn');
    refreshBtn.addEventListener('click', loadResults);

    // Preview images
    for (let i = 1; i <= 4; i++) {
        const fileInput = document.getElementById(`img${i}`);
        const preview = document.getElementById(`preview${i}`);
        fileInput.addEventListener('change', function(e) {
            const file = e.target.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = function(e) {
                    preview.src = e.target.result;
                };
                reader.readAsDataURL(file);
            }
        });
    }
});

function loadData() {
    const defaultData = {
        1: { name: 'Paslon 1', img: '', desc: 'Kandidat 1A & 1B' },
        2: { name: 'Paslon 2', img: '', desc: 'Kandidat 2A & 2B' },
        3: { name: 'Paslon 3', img: '', desc: 'Kandidat 3A & 3B' },
        4: { name: 'Paslon 4', img: '', desc: 'Kandidat 4A & 4B' }
    };

    const data = JSON.parse(localStorage.getItem('paslonData')) || defaultData;

    for (let i = 1; i <= 4; i++) {
        document.getElementById(`name${i}`).value = data[i].name;
        document.getElementById(`desc${i}`).value = data[i].desc;
        document.getElementById(`preview${i}`).src = data[i].img;
    }
}

function saveData() {
    const data = {};
    for (let i = 1; i <= 4; i++) {
        const name = document.getElementById(`name${i}`).value;
        const desc = document.getElementById(`desc${i}`).value;
        const img = document.getElementById(`preview${i}`).src;
        data[i] = { name, desc, img };
    }
    localStorage.setItem('paslonData', JSON.stringify(data));
    alert('Data disimpan!');
}

function loadResults() {
    const votes = JSON.parse(localStorage.getItem('votes')) || {1: 0, 2: 0, 3: 0, 4: 0};
    const total = Object.values(votes).reduce((a, b) => a + b, 0);
    const percentages = {};
    for (let i = 1; i <= 4; i++) {
        percentages[i] = total > 0 ? (votes[i] / total * 100).toFixed(1) : 0;
    }

    drawBarChart(votes, percentages);

    const countsDiv = document.getElementById('voteCounts');
    countsDiv.innerHTML = '';
    for (let i = 1; i <= 4; i++) {
        countsDiv.innerHTML += `<p>Paslon ${i}: ${votes[i]} votes (${percentages[i]}%)</p>`;
    }
}

function drawBarChart(votes, percentages) {
    const canvas = document.getElementById('pieChart');
    const ctx = canvas.getContext('2d');
    const width = canvas.width;
    const height = canvas.height;

    const colors = ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0'];
    const barWidth = 60;
    const maxHeight = height - 100;
    const maxVotes = Math.max(...Object.values(votes));

    ctx.clearRect(0, 0, width, height);

    for (let i = 1; i <= 4; i++) {
        const barHeight = maxVotes > 0 ? (votes[i] / maxVotes) * maxHeight : 0;
        const x = 50 + (i - 1) * (barWidth + 20);
        const y = height - 50 - barHeight;

        // Draw bar
        ctx.fillStyle = colors[i-1];
        ctx.fillRect(x, y, barWidth, barHeight);

        // Draw border
        ctx.strokeStyle = '#000';
        ctx.lineWidth = 2;
        ctx.strokeRect(x, y, barWidth, barHeight);

        // Draw percentage on top
        ctx.fillStyle = '#000';
        ctx.font = 'bold 14px Arial';
        ctx.textAlign = 'center';
        ctx.fillText(`${percentages[i]}%`, x + barWidth / 2, y - 10);

        // Draw label
        ctx.fillText(`Paslon ${i}`, x + barWidth / 2, height - 20);
    }

    // Draw axes
    ctx.strokeStyle = '#000';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(40, 50);
    ctx.lineTo(40, height - 50);
    ctx.lineTo(width - 40, height - 50);
    ctx.stroke();

    // Y-axis label
    ctx.fillStyle = '#000';
    ctx.font = '12px Arial';
    ctx.textAlign = 'center';
    ctx.save();
    ctx.translate(20, height / 2);
    ctx.rotate(-Math.PI / 2);
    ctx.fillText('Votes', 0, 0);
    ctx.restore();
}
