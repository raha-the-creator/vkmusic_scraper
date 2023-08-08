const fs = require('fs');

// Read the filtered_songs.json file
const rawData = fs.readFileSync('filtered_songs.json');
const songs = JSON.parse(rawData);

// Function to generate text content
function generateTextContent(songs) {
    const textContent = [];

    for (const song of songs) {
        const songInfo = `${song.artist} - ${song.song}`;
        textContent.push(songInfo);
    }

    return textContent.join('\n');
}

// Generate text content
const textContent = generateTextContent(songs);

// Write text content to a new file
fs.writeFileSync('filtered_songs.txt', textContent);

console.log('Filtered songs have been saved to filtered_songs.txt');
