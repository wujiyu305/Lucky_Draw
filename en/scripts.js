let names = []; 
let winners = [];
let running = 0;
let interval;
listener();

function listener() {
    document.addEventListener('keydown', function(event){
        if(event.key ==' '){startDrawing();} 
    });
    window.addEventListener('resize', function() {
        displayWinners();
    });
    window.addEventListener('load', function() {
        setTimeout(function() {
            showInfo('hide');
        }, 3000);
    });
}

function toggleButtonAvailability(buttonId) {
    if (document.getElementById(buttonId).disabled == true) {
        document.getElementById(buttonId).disabled = false;
    }
    else {
        document.getElementById(buttonId).disabled = true;
    }
}

function showInfo(showorhide) {
    const info = document.getElementById('info');
    if (showorhide == 'show'){
        info.style.transform = 'scale(1)';
        return
    }
    if (showorhide == 'hide'){
        info.style.transform = 'scale(0)';
        return
    }
    info.style.transform = info.style.transform == 'scale(1)' ? 'scale(0)' : 'scale(1)';
}

function typetNames() {
    const contents = prompt('Please input candidate names, seperated multiple names with comma. \nDuplicated names would be auto-removed.');
    names = contents.split(/[,|，]/).map(name => name.trim()).filter(name => name !== '');
        if (names.length > 0) {
            names = Array.from(new Set(names));
            document.getElementById('numAll').innerHTML = "/" + names.length;
        } else {
            alert("Failed to detect candidates, please check and try again.");
        }
}
function importNames() {
    const fileInput = document.getElementById('fileInput');
    fileInput.addEventListener('change', function(event) {
        const file = event.target.files[0];
        const reader = new FileReader();
        
        reader.onload = function(event) {
            const contents = event.target.result;
            names = contents.split(/[,|，|\n]/).map(name => name.trim()).filter(name => name !== '');
            if (names.length > 0) {
                names = Array.from(new Set(names));
                document.getElementById('numAll').innerHTML = "/" + names.length;
            } else {
                alert("Failed to import, please check the txt file.");
            }
        };
        
        reader.readAsText(file);
    });
    
    fileInput.click();
}   

function startDrawing() {
    if (running == 0){
        const numInput = document.getElementById('numInput');
        const numWinners = parseInt(numInput.value);

        if (numWinners != numInput.value){
            alert('Please make sure to enter only integers for the number of winners.');
            showInfo('show');
            return;
        }
        
        if (names.length == 0) {
            alert("Candidate list is still empty.");
            showInfo('show');
            return;
        }
        
        if (numWinners >= names.length) {
            alert('Winners should be less than candidates.');
            showInfo('show');
            return;
        }
        
        if (numWinners <= 0) {
            alert('Please allow at least 1 winner');
            showInfo('show');
            return;
        }
        
        running = 1;
        showInfo('hide');
        toggleButtonAvailability('typeBtn');
        toggleButtonAvailability('importBtn');
        toggleButtonAvailability('removeBtn');
        document.getElementById('startBtn').innerHTML = "Stop";

        interval = setInterval(function() {
            winners = [];
            
            while (winners.length < numWinners) {
                const randomIndex = Math.floor(Math.random() * names.length);
                const winner = names[randomIndex];
                
                if (!winners.includes(winner)) {
                    winners.push(winner);
                }
            }
            
            displayWinners();
        }, 150);
    }
    else{
        stopDrawing();
    }
}

function stopDrawing() {
    running = 0;
    clearInterval(interval);
    toggleButtonAvailability('typeBtn');
    toggleButtonAvailability('importBtn');
    toggleButtonAvailability('removeBtn');
    document.getElementById('startBtn').innerHTML = "Start";
}

function removeWinners() {
    exportWinners();
    for (eachWinner of winners) {
        let index = names.indexOf(eachWinner);
        if (index !== -1) {
            names.splice(index, 1);
        }
    }
    winners = [];
    displayWinners();
    document.getElementById('numAll').innerHTML = "/" + names.length;
}

function exportWinners() {
    if (winners.length == 0) {
        alert("There is no winner yet.");
        return;
    }

    const currentDate = new Date();
    const timestamp = currentDate.getFullYear() + '-' +
    ('0' + (currentDate.getMonth() + 1)).slice(-2) + '-' +
    ('0' + currentDate.getDate()).slice(-2) + '-' +
    ('0' + currentDate.getHours()).slice(-2) +
    ('0' + currentDate.getMinutes()).slice(-2) +
    ('0' + currentDate.getSeconds()).slice(-2);
    
    const winnersContent = winners.join('\n');
    const leftPoolContent = names.filter(name => !winners.includes(name)).join('\n');
    const combinedContent = '********** Winners for this round **********\n\n' + winnersContent + '\n\n****************************' +'\n\n\n\n\n\n\n\n\n********** Names that has not be a winner yet **********\n\n' + leftPoolContent;

    const filename = timestamp + '.txt';
    const element = document.createElement('a');
    element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(combinedContent));
    element.setAttribute('download', filename);
    element.style.display = 'none';
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
}


 function displayWinners() {
    const winnersDiv = document.getElementById('winners');
    winnersDiv.innerHTML = '';

    for (eachWinner of winners) {
        const winnerBox = document.createElement('div');
        winnerBox.classList.add('winnerBox');
        let windowFactor = Math.sqrt((window.innerWidth * window.innerHeight) / (1280 * 800));
        if (winners.length >= 10) {
            let scaleFactor =  Math.sqrt(10 / winners.length);
            winnerBox.style.fontSize = 60 * scaleFactor * windowFactor +'px'; 
            winnerBox.style.margin = 20 * scaleFactor * windowFactor +'px'; 
            winnerBox.style.minWidth = 280 * scaleFactor * windowFactor +'px'; 
            winnerBox.style.borderRadius = 20 * Math.sqrt(scaleFactor) * windowFactor +'px'; 
        }
        else if (winners.length >= 5) {
            winnerBox.style.fontSize = 64 * windowFactor +'px'; 
            winnerBox.style.margin = 20 * windowFactor +'px'; 
            winnerBox.style.minWidth = 320 * windowFactor +'px'; 
            winnerBox.style.borderRadius = 20 * Math.sqrt(windowFactor) +'px'; 
        }
        else if (winners.length >= 3) {
            winnerBox.style.fontSize = 62 * windowFactor +'px'; 
            winnerBox.style.margin = 20 * windowFactor +'px'; 
            winnerBox.style.minWidth = 360 * windowFactor +'px'; 
            winnerBox.style.borderRadius = 20 * Math.sqrt(windowFactor) +'px'; 
        }
        else {
            winnerBox.style.fontSize = 72 * windowFactor +'px'; 
            winnerBox.style.margin = 25 * windowFactor +'px'; 
            winnerBox.style.minWidth = 450 * windowFactor +'px'; 
            winnerBox.style.borderRadius = 25 * Math.sqrt(windowFactor) +'px';
        }
        winnerBox.textContent = eachWinner;
        winnersDiv.appendChild(winnerBox);
    }
}