let names = []; 
let winners = [];
let interval;
listener();

function listener() {
    window.addEventListener('load', function() {
        setTimeout(function() {
            showInfo('hide');
        }, 3000);
    });
    document.addEventListener('keydown', function(event){
        if(event.key ==' ') {
            if (document.getElementById('stopBtn').style.display == 'none') {
                startDrawing();
            }
            else {
                stopDrawing();
            }
        }
    });
    window.addEventListener('resize', function() {
        displayWinners();
    });
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

function setNames() {
    const choice = confirm("Would you like to inport candidates from a txt file?\n\nIf you just got a small list, you can just cancle to type the names.");
    if (choice) {
        const fileInput = document.getElementById('fileInput');
        fileInput.addEventListener('change', function(event) {
            const file = event.target.files[0];
            const reader = new FileReader();
            reader.onload = function(event) {
                const contents = event.target.result;
                names = contents.split(/[,|，|\n]/).map(name => name.trim()).filter(name => name !== '');
                names = Array.from(new Set(names));
                if (names.length > 1) {
                    document.getElementById('nameBtn').innerHTML = names.length;
                    document.getElementById('setBtn').style.display = "none";
                    document.getElementById('nameBtn').style.display = "";
                }
                else if (names.length == 1) {
                    alert("You don't need a luck draw if you got only 1 candidate.");
                }
                else {
                    alert("Failed to set candidates from txt, please check the file.");
                }
            };
        reader.readAsText(file);
    });
    fileInput.click();
    }
    else {
        const contents = prompt('Please input candidate names, seperated multiple names with comma. \nDuplicated names would be auto-removed.');
        names = contents.split(/[,|，|\n]/).map(name => name.trim()).filter(name => name !== '');
        names = Array.from(new Set(names));
        if (names.length > 1) {
            document.getElementById('nameBtn').innerHTML = names.length;
            document.getElementById('setBtn').style.display = "none";
            document.getElementById('nameBtn').style.display = "";
        }
        else if (names.length == 1) {
            alert("You don't need a luck draw if you got only 1 candidate.");
        }
        else {
            alert("Failed to detect candidates, please check and try again.");
        }
    }
}   

function showNames() {
    const allNames = names.join('\n');
    alert('Below are candidates for now:\n\n' +allNames);
}

function startDrawing() {
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
    
    showInfo('hide');
    document.getElementById('startBtn').style.display = "none";
    document.getElementById('stopBtn').style.display = "";
    document.getElementById('nameBtn').style.display = "";
    document.getElementById('removeBtn').style.display = "none";
    document.getElementById('removeBtn').disabled = true;

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

function stopDrawing() {
    clearInterval(interval);
    document.getElementById('startBtn').style.display = "";
    document.getElementById('stopBtn').style.display = "none";
    document.getElementById('nameBtn').style.display = "none";
    document.getElementById('removeBtn').style.display = "";
    document.getElementById('removeBtn').disabled = false;
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
    document.getElementById('nameBtn').innerHTML = names.length;
    document.getElementById('nameBtn').style.display = "";
    document.getElementById('removeBtn').style.display = "none";
}

function exportWinners() {
    if (winners.length == 0) {
        alert("There is no winner for this round yet.");
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
        let windowFactor = Math.sqrt((window.innerWidth * window.innerHeight) / (1440 * 800));
        if (winners.length >= 10) {
            let scaleFactor =  Math.pow((10 / winners.length), 0.4);
            winnerBox.style.fontSize = 60 * scaleFactor * windowFactor +'px'; 
            winnerBox.style.margin = 20 * scaleFactor * windowFactor +'px'; 
            winnerBox.style.padding = 10 * scaleFactor * windowFactor +'px'; 
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