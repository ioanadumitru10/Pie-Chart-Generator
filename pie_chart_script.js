document.addEventListener("DOMContentLoaded", () => {
    const generateBtn = document.getElementById("generate-btn");
    const resetBtn = document.getElementById("reset-btn");
    const addBtn = document.getElementById("add-btn");
    const dataContainer = document.getElementById("data-container");
    const displayTitle = document.getElementById("display-title");
    const errorMessage = document.getElementById("error-message");
    const canvas = document.getElementById("pie-chart");
    const ctx = canvas.getContext("2d");
    const legend = document.getElementById("legend");
    const downloadBtn = document.getElementById("download-btn");
    const formatButtons = document.querySelectorAll(".format-btn");

    let selectedFormat = "png"; 

    function speakText(text) {
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = "en-US"; 
    speechSynthesis.speak(utterance);
    }
    
    formatButtons.forEach(btn => btn.classList.remove("active", "pressed"));

    function drawChart() {
        const rows = document.querySelectorAll(".data-row");
        let data = [];
        let total = 0;

        rows.forEach(row => {
            const label = row.querySelector(".label-input").value.trim();
            const value = parseFloat(row.querySelector(".value-input").value);
            const color = row.querySelector(".color-input").value;
            if (label && value > 0) {
                data.push({ label, value, color });
                total += value;
            }
        });

        if (data.length === 0 || total <= 0) {
            errorMessage.style.display = "block";
            return;
        } else {
            errorMessage.style.display = "none";
        }

        ctx.clearRect(0, 0, canvas.width, canvas.height);

        const centerX = canvas.width / 2;
        const centerY = canvas.height / 2;
        const radius = Math.min(centerX, centerY);

        ctx.save();
        ctx.beginPath();
        ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
        ctx.closePath();
        ctx.clip();

        let startAngle = -Math.PI / 2;

        data.forEach(item => {
            const sliceAngle = (item.value / total) * 2 * Math.PI;
            ctx.beginPath();
            ctx.moveTo(centerX, centerY);
            ctx.arc(centerX, centerY, radius, startAngle, startAngle + sliceAngle);
            ctx.closePath();
            ctx.fillStyle = item.color;
            ctx.fill();
            ctx.strokeStyle = "#ffffff";
            ctx.lineWidth = 2;
            ctx.stroke();
            startAngle += sliceAngle;
        });
        ctx.restore();

        const chartTitle = document.getElementById("chart-title").value;
        displayTitle.textContent = chartTitle || "Pie Chart";
        displayTitle.addEventListener("click", () => {
         speakText(displayTitle.textContent);
        });

        legend.innerHTML = "";
        data.forEach(item => {
            const percent = ((item.value / total) * 100).toFixed(1);
            const legendItem = document.createElement("div");
            legendItem.classList.add("legend-item");
            legendItem.innerHTML = `
                <div class="legend-color" style="background-color:${item.color}"></div>
                <span>${item.label}: ${percent}%</span>
            `;
            legend.appendChild(legendItem);
            legendItem.addEventListener("click", () => {
            speakText(`${item.label}, ${percent} percent`);
            });
        });
    }

    generateBtn.addEventListener("click", () => { 
        const overlay = document.getElementById("loading-overlay"); 
        overlay.style.display = "flex"; // show animation 
        setTimeout(() => { overlay.style.display = "none"; // hide animation 
        drawChart(); // generate chart 
        }, 1500); // 1.5 seconds 
    });

    resetBtn.addEventListener("click", () => {
   
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    legend.innerHTML = "";

    displayTitle.textContent = "Sample Pie Chart";
    document.getElementById("chart-title").value = "";

    dataContainer.innerHTML = ""; 

    const defaults = [
        { label: "Category A", value: 25, color: "#ff6384" },
        { label: "Category B", value: 25, color: "#36a2eb" },
        { label: "Category C", value: 25, color: "#ffce56" },
        { label: "Category D", value: 25, color: "#4bc0c0" }
    ];

    defaults.forEach(item => {
        const row = document.createElement("div");
        row.classList.add("data-row");
        row.innerHTML = `
            <input type="text" class="label-input" value="${item.label}">
            <input type="number" class="value-input" value="${item.value}">
            <input type="color" class="color-input" value="${item.color}">
            <button class="remove-btn">×</button>
        `;
        dataContainer.appendChild(row);
        row.querySelector(".remove-btn").addEventListener("click", () => row.remove());
    });

    drawChart();
});

    addBtn.addEventListener("click", () => {
        const row = document.createElement("div");
        row.classList.add("data-row");
        row.innerHTML = `
            <input type="text" class="label-input" placeholder="Label">
            <input type="number" class="value-input" placeholder="Value">
            <input type="color" class="color-input" value="#${Math.floor(Math.random()*16777215).toString(16)}">
            <button class="remove-btn">×</button>
        `;
        dataContainer.appendChild(row);
        row.querySelector(".remove-btn").addEventListener("click", () => row.remove());
    });

    document.querySelectorAll(".remove-btn").forEach(btn => {
        btn.addEventListener("click", e => e.target.parentElement.remove());
    });

    formatButtons.forEach(btn => {
        btn.addEventListener("click", () => {
            formatButtons.forEach(b => b.classList.remove("active", "pressed"));
            btn.classList.add("active", "pressed");
            selectedFormat = btn.dataset.format;
        });
    });

    downloadBtn.addEventListener("click", () => {
        const rows = document.querySelectorAll(".data-row");
        let data = [];
        let total = 0;

        rows.forEach(row => {
            const label = row.querySelector(".label-input").value.trim();
            const value = parseFloat(row.querySelector(".value-input").value);
            const color = row.querySelector(".color-input").value;
            if (label && value > 0) {
                data.push({ label, value, color });
                total += value;
            }
        });

        if (data.length === 0) return;

        const baseHeight = 600;
        const extraRows = Math.max(0, data.length - 8);
        const extraHeight = extraRows * 30;
        const exportHeight = baseHeight + extraHeight;

        const exportCanvas = document.createElement("canvas");
        exportCanvas.width = 1100;
        exportCanvas.height = exportHeight;
        const ectx = exportCanvas.getContext("2d");

        ectx.fillStyle = "#ffffff";
        ectx.fillRect(0, 0, exportCanvas.width, exportCanvas.height);

        const title = document.getElementById("chart-title").value || "Pie Chart";
        ectx.font = "bold 22px Arial";
        ectx.fillStyle = "#000";
        ectx.textAlign = "center";
        ectx.fillText(title, exportCanvas.width / 2, 50);

        const cx = 320, cy = 300, r = 200;
        let start = -Math.PI / 2;
        data.forEach(item => {
            const slice = (item.value / total) * 2 * Math.PI;
            ectx.beginPath();
            ectx.moveTo(cx, cy);
            ectx.arc(cx, cy, r, start, start + slice);
            ectx.closePath();
            ectx.fillStyle = item.color;
            ectx.fill();
            ectx.strokeStyle = "#ffffff";
            ectx.lineWidth = 2;
            ectx.stroke();
            start += slice;
        });

        ectx.beginPath();
        ectx.arc(cx, cy, r, 0, Math.PI * 2);
        ectx.lineWidth = 3;
        ectx.strokeStyle = "#333";
        ectx.stroke();

        let lx = 600, ly = 150;
        ectx.textAlign = "left";
        ectx.font = "bold 16px Arial";
        ectx.fillStyle = "#000";
        ectx.fillText("CATEGORY", lx, ly);
        ectx.fillText("COLOR", lx + 160, ly);
        ectx.fillText("PERCENTAGE", lx + 280, ly);

        ly += 25;
        ectx.font = "16px Arial";
        data.forEach(item => {
            const percent = ((item.value / total) * 100).toFixed(1) + "%";
            ectx.fillStyle = "#000";
            ectx.fillText(item.label, lx, ly + 5);
            ectx.fillStyle = item.color;
            ectx.fillRect(lx + 170, ly - 12, 20, 20);
            ectx.strokeStyle = "#333";
            ectx.strokeRect(lx + 170, ly - 12, 20, 20);
            ectx.fillStyle = "#000";
            ectx.fillText(percent, lx + 280, ly + 5);
            ly += 30;
        });

        if (selectedFormat === "pdf") {
            const { jsPDF } = window.jspdf;
            const img = exportCanvas.toDataURL("image/png");
            const pdf = new jsPDF({ orientation: "landscape", unit: "pt", format: "a4" });
            const pageW = pdf.internal.pageSize.getWidth();
            const pageH = pdf.internal.pageSize.getHeight();
            const scale = Math.min(pageW / exportCanvas.width, pageH / exportCanvas.height) * 0.9;
            const w = exportCanvas.width * scale;
            const h = exportCanvas.height * scale;
            const x = (pageW - w) / 2;
            const y = (pageH - h) / 2;
            pdf.addImage(img, "PNG", x, y, w, h);
            pdf.save("pie-chart.pdf");
        } else {
            const mime = selectedFormat === "jpeg" ? "image/jpeg" : "image/png";
            const link = document.createElement("a");
            link.href = exportCanvas.toDataURL(mime, 1.0);
            link.download = `pie-chart.${selectedFormat}`;
            link.click();
        }
    });

    drawChart();
});
