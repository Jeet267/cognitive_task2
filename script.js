
const VIDEOS = [
    {
        id: 'RJTCAL1DRro', // L30 Penthouse | Pursuit of a Radical Rhapsody
        title: 'L30 Penthouse | Pursuit of a Radical Rhapsody',
        chapters: [
            { time: 0, title: 'Introduction' },
            { time: 30, title: 'Living Area & Layout' },
            { time: 60, title: 'Kitchen & Dining Spaces' },
            { time: 120, title: 'Master Bedroom Experience' },
            { time: 180, title: 'The Terrace & Panoramic Views' }
        ]
    },
    {
        id: 'jj_aUFX8SV8', // After the Rain | Total Environment
        title: 'After the Rain | Total Environment',
        chapters: [
            { time: 0, title: 'Welcome to After the Rain' },
            { time: 20, title: 'The Green Roofs Concept' },
            { time: 50, title: 'Villa Interiors & Craftsmanship' },
            { time: 90, title: 'Outdoor Spaces & Community' },
            { time: 130, title: 'Sustainability & Design' }
        ]
    },
    {
        id: 'xmmxkmVSiq0', // Exploring Architectural Elegance
        title: 'Exploring Architectural Elegance',
        chapters: [
            { time: 0, title: 'Architectural Vision' },
            { time: 25, title: 'The Living Spaces' },
            { time: 60, title: 'Custom Furnishing Details' },
            { time: 105, title: 'Landscape & Water Bodies' },
            { time: 150, title: 'The Community Experience' }
        ]
    }
];


let currentIndex = 0;

// Initialize Player Section
const track = document.getElementById('carousel-track');
const chaptersList = document.getElementById('chapters-list');
const prevBtn = document.querySelector('.prev-btn');
const nextBtn = document.querySelector('.next-btn');

function initCarousel() {

    VIDEOS.forEach((video) => {
        const item = document.createElement('div');
        item.className = 'carousel-item';

        item.innerHTML = `<iframe id="yt-${video.id}" src="https://www.youtube.com/embed/${video.id}?enablejsapi=1&rel=0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>`;
        track.appendChild(item);
    });

    updateCarousel();
    renderChapters();

    prevBtn.addEventListener('click', () => {
        if (currentIndex > 0) {
            currentIndex--;
            updateCarousel();
            renderChapters();
        }
    });

    nextBtn.addEventListener('click', () => {
        if (currentIndex < VIDEOS.length - 1) {
            currentIndex++;
            updateCarousel();
            renderChapters();
        }
    });
}

function updateCarousel() {
    track.style.transform = `translateX(-${currentIndex * 100}%)`;
    prevBtn.disabled = currentIndex === 0;
    nextBtn.disabled = currentIndex === VIDEOS.length - 1;
}


function formatTime(seconds) {
    const m = Math.floor(seconds / 60);
    const s = Math.floor(seconds % 60);
    return `${m}:${s.toString().padStart(2, '0')}`;
}

function renderChapters() {
    chaptersList.innerHTML = '';
    const activeVideo = VIDEOS[currentIndex];
    
    activeVideo.chapters.forEach(chapter => {
        const btn = document.createElement('button');
        btn.className = 'chapter-btn';
        btn.innerHTML = `
            <span class="chapter-time">${formatTime(chapter.time)}</span>
            <span class="chapter-title">${chapter.title}</span>
        `;
        
        btn.addEventListener('click', () => {

            document.querySelectorAll('.chapter-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            

            seekVideo(activeVideo.id, chapter.time);
        });

        chaptersList.appendChild(btn);
    });
}


function seekVideo(videoId, seconds) {
    const iframe = document.getElementById(`yt-${videoId}`);
    if (iframe && iframe.contentWindow) {

        iframe.contentWindow.postMessage(JSON.stringify({
            event: 'command',
            func: 'seekTo',
            args: [seconds, true]
        }), '*');
        
        iframe.contentWindow.postMessage(JSON.stringify({
            event: 'command',
            func: 'playVideo',
            args: []
        }), '*');
    }
}


const generateBtn = document.getElementById('generate-btn');
const urlInput = document.getElementById('youtube-url');
const resultsArea = document.getElementById('generator-results');
const previewArea = document.getElementById('preview-chapters');
const codeOutput = document.getElementById('code-output');
const copyBtn = document.getElementById('copy-btn');

function extractVideoID(url) {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : null;
}


function generateMockChapters(videoId) {

    return [
        { time: 0, title: "The Hook & Core Premise" },
        { time: 125, title: "Contextual Framework" },
        { time: 340, title: "The Paradigm Shift" },
        { time: 580, title: "Real-world Application" },
        { time: 820, title: "Synthesis & Conclusion" }
    ];
}

generateBtn.addEventListener('click', () => {
    const url = urlInput.value.trim();
    if (!url) {
        alert("Please enter a valid YouTube URL");
        return;
    }

    const videoId = extractVideoID(url);
    if (!videoId) {
        alert("Could not extract Video ID from the URL.");
        return;
    }


    generateBtn.classList.add('generating');
    resultsArea.classList.add('hidden');


    setTimeout(() => {
        generateBtn.classList.remove('generating');
        
        const chapters = generateMockChapters(videoId);
        

        previewArea.innerHTML = '';
        chapters.forEach(ch => {
            const el = document.createElement('div');
            el.className = 'chapter-btn';
            el.innerHTML = `
                <span class="chapter-time">${formatTime(ch.time)}</span>
                <span class="chapter-title">${ch.title}</span>
            `;
            previewArea.appendChild(el);
        });


        const codeString = `// Output based on system prompt: 
// "Treat every video as if it has invisible gravitational pull points..."

export const videoChapters = {
    videoId: "${videoId}",
    chapters: ${JSON.stringify(chapters, null, 4)}
};

export function renderChapters(containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;
    
    videoChapters.chapters.forEach(chapter => {
        // Implement rendering logic here
        console.log(\`Chapter: \${chapter.title} at \${chapter.time}s\`);
    });
}
`;
        codeOutput.textContent = codeString;
        resultsArea.classList.remove('hidden');

    }, 2000); 
});

copyBtn.addEventListener('click', () => {
    navigator.clipboard.writeText(codeOutput.textContent).then(() => {
        const originalText = copyBtn.textContent;
        copyBtn.textContent = 'Copied!';
        setTimeout(() => copyBtn.textContent = originalText, 2000);
    });
});


document.addEventListener('DOMContentLoaded', initCarousel);
