// Hardcoded Videos and Chapters for the Carousel
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

// Carousel State
let currentIndex = 0;

// Initialize Player Section
const track = document.getElementById('carousel-track');
const chaptersList = document.getElementById('chapters-list');
const prevBtn = document.querySelector('.prev-btn');
const nextBtn = document.querySelector('.next-btn');

function initCarousel() {
    // Inject iframes
    VIDEOS.forEach((video) => {
        const item = document.createElement('div');
        item.className = 'carousel-item';
        // Note: enablejsapi=1 is required to listen to postMessage commands
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

// Convert seconds to MM:SS
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
            // Remove active class from others
            document.querySelectorAll('.chapter-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            
            // Post message to the active iframe
            seekVideo(activeVideo.id, chapter.time);
        });

        chaptersList.appendChild(btn);
    });
}

// The core trick: Using postMessage to interact with YouTube iframe without external scripts
function seekVideo(videoId, seconds) {
    const iframe = document.getElementById(`yt-${videoId}`);
    if (iframe && iframe.contentWindow) {
        // We must send a stringified JSON object conforming to YT API spec
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

// --- AI Chapter Generator Simulation ---
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

// Mock AI output based on URL
function generateMockChapters(videoId) {
    // Generate structurally plausible chapters
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

    // UI Loading state
    generateBtn.classList.add('generating');
    resultsArea.classList.add('hidden');

    // Simulate AI processing delay (e.g. Claude thinking based on prompt)
    setTimeout(() => {
        generateBtn.classList.remove('generating');
        
        const chapters = generateMockChapters(videoId);
        
        // 1. Render Visual Preview
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

        // 2. Generate chapters.js export
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

    }, 2000); // 2 second mock delay
});

copyBtn.addEventListener('click', () => {
    navigator.clipboard.writeText(codeOutput.textContent).then(() => {
        const originalText = copyBtn.textContent;
        copyBtn.textContent = 'Copied!';
        setTimeout(() => copyBtn.textContent = originalText, 2000);
    });
});

// Init
document.addEventListener('DOMContentLoaded', initCarousel);
